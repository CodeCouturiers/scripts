#pip install aiohttp aiofiles tqdm llama-cpp-python psutil
import psutil
import requests
import os

from llama_cpp import Llama
from tqdm import tqdm


def get_model_size(url):
    """Определяет размер файла модели через запрос к API Hugging Face"""
    repo = "DavidAU/L3.2-Rogue-Creative-Instruct-Uncensored-Abliterated-7B-GGUF"
    filename = "L3.2-Rogue-Creative-Instruct-Uncensored-Abliterated-7B-D_AU-Q4_k_m.gguf"
    api_url = f"https://huggingface.co/api/models/{repo}/tree/main"

    try:
        response = requests.get(api_url)
        response.raise_for_status()

        # Ищем размер файла в ответе API
        for item in response.json():
            if item.get('path') == filename:
                return item.get('size')
    except Exception as e:
        print(f"Не удалось получить размер модели через API: {str(e)}")

    # Альтернативный метод через GET запрос
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()
        size = int(response.headers.get('content-length', 0))
        if size > 0:
            return size
    except Exception as e:
        print(f"Не удалось получить размер модели через HEAD запрос: {str(e)}")

    return None


def download_model():
    if not os.path.exists('models'):
        os.makedirs('models')

    url = "https://huggingface.co/DavidAU/L3.2-Rogue-Creative-Instruct-Uncensored-Abliterated-7B-GGUF/resolve/main/L3.2-Rogue-Creative-Instruct-Uncensored-Abliterated-7B-D_AU-Q4_k_m.gguf"
    filename = os.path.join('models', 'rogue_q4_k_m.gguf')

    # Получаем ожидаемый размер файла
    expected_size = get_model_size(url)
    if expected_size is None:
        raise Exception("Не удалось определить размер модели")

    print(f"Ожидаемый размер модели: {expected_size / (1024 * 1024 * 1024):.2f} GB")

    if os.path.exists(filename):
        actual_size = os.path.getsize(filename)
        if actual_size == expected_size:
            print(f"Модель уже загружена: {filename}")
            return filename
        else:
            print(f"Найден неполный файл модели ({actual_size / (1024 * 1024 * 1024):.2f} GB), перезагрузка...")
            os.remove(filename)

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    print("Начало загрузки модели...")
    try:
        with requests.get(url, headers=headers, stream=True) as r:
            r.raise_for_status()
            total_size = int(r.headers.get('content-length', expected_size))

            with open(filename, 'wb') as f:
                with tqdm(total=total_size, unit='iB', unit_scale=True, unit_divisor=1024) as pbar:
                    for data in r.iter_content(chunk_size=8192):
                        size = f.write(data)
                        pbar.update(size)

        actual_size = os.path.getsize(filename)
        if actual_size != expected_size:
            raise Exception(
                f"Ошибка загрузки: неверный размер файла ({actual_size / (1024 * 1024 * 1024):.2f} GB != {expected_size / (1024 * 1024 * 1024):.2f} GB)")

        return filename

    except Exception as e:
        if os.path.exists(filename):
            os.remove(filename)
        raise Exception(f"Ошибка при загрузке модели: {str(e)}")

def get_optimal_threads():
    """Определяет оптимальное количество потоков для CPU"""
    cpu_count = psutil.cpu_count(logical=False)  # Физические ядра
    if cpu_count is None:
        cpu_count = psutil.cpu_count(logical=True)  # Логические ядра
    return max(1, cpu_count - 1)  # Оставляем одно ядро для системы


def init_model(model_path):
    """Инициализация модели с оптимальными параметрами"""
    n_threads = get_optimal_threads()

    # Определяем доступную память
    mem = psutil.virtual_memory()
    total_mem_gb = mem.total / (1024 ** 3)

    # Настраиваем размер контекста в зависимости от памяти
    if total_mem_gb >= 32:
        n_ctx = 8192
    elif total_mem_gb >= 16:
        n_ctx = 4096
    else:
        n_ctx = 2048

    print(f"\nИнициализация модели с параметрами:")
    print(f"Количество потоков: {n_threads}")
    print(f"Размер контекста: {n_ctx}")
    print(f"Доступная память: {total_mem_gb:.1f} GB")

    return Llama(
        model_path=model_path,
        n_ctx=n_ctx,
        n_threads=n_threads,
        n_batch=512,  # Размер батча для оптимизации
        verbose=False
    )


def generate_response(model, prompt, max_tokens=2048, temperature=0.7):
    """Генерация ответа с обработкой ошибок и прогресс-баром"""
    # Формируем контекст
    context = f"""<|start_header_id|>system<|end_header_id|>
You are a helpful AI assistant.
<|eot_id|>
<|start_header_id|>user<|end_header_id|>
{prompt}
<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
"""

    try:
        # Создаем прогресс-бар для генерации
        with tqdm(total=max_tokens, desc="Генерация", unit=" токены") as pbar:
            output = model.create_completion(
                context,
                max_tokens=max_tokens,
                temperature=temperature,
                top_p=0.9,
                top_k=40,
                repeat_penalty=1.1,
                stop=["<|eot_id|>"],
                echo=False,
                stream=True
            )

            # Собираем ответ по токенам
            response = ""
            for chunk in output:
                if chunk and 'choices' in chunk and chunk['choices']:
                    text = chunk['choices'][0].get('text', '')
                    response += text
                    pbar.update(1)

        return response.strip()

    except Exception as e:
        print(f"\nОшибка при генерации: {str(e)}")
        return None


def main():
    try:
        # Загружаем модель
        print("Проверка/загрузка модели...")
        model_path = download_model()

        # Инициализируем модель
        model = init_model(model_path)

        print("\nМодель готова к работе!")
        print("Введите 'exit' для выхода")
        print("Введите 'params' для настройки параметров генерации")

        # Параметры по умолчанию
        params = {
            'temperature': 0.7,
            'max_tokens': 2048
        }

        while True:
            try:
                prompt = input("\nВведите промпт: ").strip()

                if not prompt:
                    continue

                if prompt.lower() == 'exit':
                    break

                if prompt.lower() == 'params':
                    print("\nТекущие параметры:")
                    print(f"temperature: {params['temperature']}")
                    print(f"max_tokens: {params['max_tokens']}")

                    temp = input("Новая temperature (0.1-2.0) или Enter для пропуска: ")
                    if temp:
                        params['temperature'] = float(temp)

                    tokens = input("Новый max_tokens (100-8192) или Enter для пропуска: ")
                    if tokens:
                        params['max_tokens'] = int(tokens)
                    continue

                # Генерируем ответ
                response = generate_response(
                    model,
                    prompt,
                    max_tokens=params['max_tokens'],
                    temperature=params['temperature']
                )

                if response:
                    print("\nОтвет:")
                    print(response)

            except KeyboardInterrupt:
                print("\nПрерывание генерации...")
                continue

            except Exception as e:
                print(f"\nОшибка: {str(e)}")
                continue

    except Exception as e:
        print(f"Критическая ошибка: {str(e)}")

    finally:
        print("\nЗавершение работы...")


if __name__ == "__main__":
    main()
