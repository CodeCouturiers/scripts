import os
from collections import Counter


def get_file_extensions(directory):
    # Список для хранения расширений файлов
    extensions = []

    # Рекурсивно проходим по всем файлам в указанной директории
    for root, dirs, files in os.walk(directory):
        for file in files:
            # Извлекаем расширение файла
            ext = os.path.splitext(file)[1].lower()  # Приводим к нижнему регистру
            if ext:  # Добавляем только если расширение существует
                extensions.append(ext)

    # Считаем количество каждого расширения
    extension_count = Counter(extensions)

    # Сортируем по количеству и выводим
    sorted_extension_count = sorted(extension_count.items(), key=lambda x: x[1], reverse=True)

    return sorted_extension_count


# Пример использования
directory = input("Введите путь к папке: ")
sorted_extensions = get_file_extensions(directory)

print("Список расширений файлов, отсортированный по количеству:")
for ext, count in sorted_extensions:
    print(f"{ext}: {count}")
