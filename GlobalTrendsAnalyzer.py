# requirements.txt
# Для работы с Google Trends
# pytrends==4.9.0
# Для работы с данными
# pandas==2.1.4
# Для работы с временными зонами
# pytz==2023.3.post1
# Для работы с Telegram
# pyTelegramBotAPI==4.14.1
# Для планировщика задач
# schedule==1.2.1
# Если вы используете Jupyter Notebook (опционально)
# jupyter==1.0.0
# ipykernel==6.29.0
# Для обработки предупреждений и кодировки
# urllib3==2.1.0


# pip install pytrends==4.9.0
# pip install pandas==2.1.4
# pip install pytz==2023.3.post1
# pip install pyTelegramBotAPI==4.14.1
# pip install schedule==1.2.1
# pip install urllib3==2.1.0

from pytrends.request import TrendReq
import pandas as pd
import time
from datetime import datetime
import warnings
import schedule
import telebot
import pytz
import urllib.parse

warnings.filterwarnings('ignore')

# Конфигурация
TELEGRAM_BOT_TOKEN = ''  # Замените на ваш токен
TELEGRAM_CHAT_ID = ''  # Замените на ID вашего чата/канала
KYIV_TZ = pytz.timezone('Europe/Kiev')
START_TIME = "23:50"  # Время запуска по Киеву


class GlobalTrendsAnalyzer:
    def __init__(self, hl='en-US', tz=0):
        self.pytrends = TrendReq(hl=hl, tz=tz)

        # Ключевые слова для IT-трендов
        self.it_keywords = {
            # Общие технологические термины
            'tech', 'technology', 'технологии', 'технології', 'digital',
            'smart', 'app', 'application', 'software', 'dev', 'development',
            'code', 'coding', 'programming', 'AI', 'ML', 'bot', 'robot',
            'startup', 'browser', 'cyber', 'digital', 'electronic', 'gadget',
            'hardware', 'hosting', 'interface', 'internet', 'mobile', 'network',
            'online', 'platform', 'program', 'security', 'server', 'system',
            'update', 'virtual', 'web', 'website', 'wireless',

            # Компании и платформы
            'google', 'apple', 'microsoft', 'amazon', 'meta', 'twitter',
            'linkedin', 'tiktok', 'instagram', 'telegram', 'whatsapp',
            'android', 'ios', 'windows', 'linux', 'ubuntu', 'chrome',
            'firefox', 'safari', 'edge',

            # Новые технологии
            'blockchain', 'crypto', 'bitcoin', 'ethereum', 'nft',
            'artificial intelligence', 'machine learning', 'deepfake',
            'virtual reality', 'augmented reality', 'metaverse',
            'cloud computing', 'quantum computing', '5g', '6g',

            # Локализованные термины
            'приложение', 'программа', 'разработка', 'программирование',
            'искусственный интеллект', 'виртуальная реальность',
            'облачные технологии', 'кибербезопасность', 'криптовалюта',
            'блокчейн', 'мобильный', 'смартфон', 'компьютер',
            'додаток', 'програма', 'розробка', 'штучний інтелект',
            'хмарні технології', 'кібербезпека', 'криптовалюта'
        }

        # Альтернативные коды стран
        self.country_codes = {
            'US': ['united_states', 'america'],
            'GB': ['united_kingdom', 'uk'],
            'RU': ['russia', 'russian_federation'],
            'UA': ['ukraine'],
            'BY': ['belarus'],
            'KZ': ['kazakhstan'],
            'DE': ['germany', 'deutschland'],
            'FR': ['france'],
            'IT': ['italy', 'italia'],
            'ES': ['spain', 'espana'],
            'CA': ['canada'],
            'AU': ['australia'],
            'JP': ['japan'],
            'KR': ['south_korea', 'korea'],
            'SG': ['singapore'],
            'IN': ['india']
        }

        # Структура регионов
        self.regions = {
            'СНГ и Восточная Европа': {
                'RU': {'cities': ['Moscow', 'Saint Petersburg'], 'name': 'Россия'},
                'UA': {'cities': ['Kyiv', 'Kharkiv'], 'name': 'Украина'},
                'BY': {'cities': ['Minsk', 'Gomel'], 'name': 'Беларусь'},
                'KZ': {'cities': ['Almaty', 'Astana'], 'name': 'Казахстан'}
            },
            'Западная Европа': {
                'GB': {'cities': ['London', 'Manchester'], 'name': 'Великобритания'},
                'DE': {'cities': ['Berlin', 'Munich'], 'name': 'Германия'},
                'FR': {'cities': ['Paris', 'Marseille'], 'name': 'Франция'},
                'IT': {'cities': ['Rome', 'Milan'], 'name': 'Италия'},
                'ES': {'cities': ['Madrid', 'Barcelona'], 'name': 'Испания'}
            },
            'Северная Америка': {
                'US': {'cities': ['New York', 'Los Angeles'], 'name': 'США'},
                'CA': {'cities': ['Toronto', 'Vancouver'], 'name': 'Канада'}
            },
            'Азия и Океания': {
                'AU': {'cities': ['Sydney', 'Melbourne'], 'name': 'Австралия'},
                'JP': {'cities': ['Tokyo', 'Osaka'], 'name': 'Япония'},
                'KR': {'cities': ['Seoul', 'Busan'], 'name': 'Южная Корея'},
                'SG': {'cities': ['Singapore'], 'name': 'Сингапур'},
                'IN': {'cities': ['Mumbai', 'Delhi'], 'name': 'Индия'}
            }
        }

    def get_trending_searches(self):
        """Получение трендовых поисковых запросов со всех регионов"""
        all_trends = {}

        for region_name, countries in self.regions.items():
            print(f"\n🌍 Получение трендов для региона: {region_name}")
            region_trends = {}

            for country_code, country_data in countries.items():
                country_name = country_data['name']
                print(f"  📍 Страна: {country_name} ({country_code})")

                # Получаем список альтернативных кодов
                alt_codes = self.country_codes.get(country_code, [])
                all_codes = [country_code] + alt_codes

                success = False
                for code in all_codes:
                    try:
                        print(f"    🔄 Пробуем код страны: {code}")
                        trends = self.pytrends.trending_searches(pn=code)

                        if isinstance(trends, pd.DataFrame) and not trends.empty:
                            trends_list = trends.values.flatten().tolist()
                            region_trends[country_name] = {
                                'trends': trends_list,
                                'cities': country_data['cities']
                            }
                            print(f"    ✅ Получено {len(trends_list)} трендов")
                            success = True
                            break

                    except Exception as e:
                        print(f"    ⚠️ Код {code} не сработал: {str(e)}")

                if not success:
                    print(f"    ❌ Не удалось получить тренды для {country_name}")

                # Пауза между запросами
                time.sleep(2)

            all_trends[region_name] = region_trends

        return all_trends

    def is_it_related(self, term):
        """Проверка, относится ли термин к IT-тематике"""
        if not isinstance(term, str):
            return False
        term = term.lower()
        return any(keyword.lower() in term.lower() for keyword in self.it_keywords)

    def analyze_trends(self):
        """Анализ трендов по всем регионам"""
        try:
            results = {
                'trends_by_region': {},
                'it_trends': {},
                'summary': {
                    'total_trends': 0,
                    'it_related_trends': 0,
                    'regions_analyzed': 0,
                    'countries_analyzed': 0,
                    'analysis_date': datetime.now(KYIV_TZ).strftime('%Y-%m-%d %H:%M:%S')
                }
            }

            # Получаем и анализируем тренды
            trends_data = self.get_trending_searches()
            total_trends = 0
            it_trends_set = set()
            countries_analyzed = 0

            for region_name, region_data in trends_data.items():
                results['trends_by_region'][region_name] = {}
                results['it_trends'][region_name] = {}

                for country_name, country_data in region_data.items():
                    if 'trends' in country_data:
                        trends = country_data['trends']
                        total_trends += len(trends)
                        countries_analyzed += 1

                        # Находим IT-тренды
                        country_it_trends = [trend for trend in trends if self.is_it_related(trend)]

                        # Сохраняем все тренды и IT-тренды
                        results['trends_by_region'][region_name][country_name] = trends
                        results['it_trends'][region_name][country_name] = country_it_trends

                        # Добавляем в общий сет IT-трендов
                        it_trends_set.update(country_it_trends)

            # Обновляем сводку
            results['summary'].update({
                'total_trends': total_trends,
                'it_related_trends': len(it_trends_set),
                'regions_analyzed': len(trends_data),
                'countries_analyzed': countries_analyzed
            })

            return results

        except Exception as e:
            print(f"❌ Ошибка при анализе трендов: {str(e)}")
            return None

    def format_telegram_message(self, results):
        """Форматирование результатов для отправки в Telegram с учетом разделения на части"""
        message_parts = []

        # Заголовок
        message_parts.append("🌍 *ГЛОБАЛЬНЫЙ АНАЛИЗ IT-ТРЕНДОВ*\n")
        message_parts.append(f"📅 Дата: {results['summary']['analysis_date']}")
        message_parts.append(f"🌐 Регионов: {results['summary']['regions_analyzed']}")
        message_parts.append(f"🏳️ Стран: {results['summary']['countries_analyzed']}")
        message_parts.append(f"📊 Всего трендов: {results['summary']['total_trends']}")
        message_parts.append(f"💻 IT-трендов: {results['summary']['it_related_trends']}\n")

        # Тренды по регионам
        for region_name, region_data in results['trends_by_region'].items():
            message_parts.append(f"\n🗺 *{region_name}*\n")

            for country_name, trends in region_data.items():
                message_parts.append(f"\n📍 *{country_name}*")

                for i, trend in enumerate(trends[:10], 1):
                    try:
                        trend_text = str(trend)
                        # Экранируем специальные символы Markdown
                        trend_text = trend_text.replace('*', '\\*').replace('_', '\\_').replace('`', '\\`')
                        trend_text = trend_text.replace('[', '\\[').replace(']', '\\]')
                        trend_text = trend_text.replace('(', '\\(').replace(')', '\\)')

                        is_it = "💻" if self.is_it_related(trend) else "🔍"
                        google_link = f"https://www.google.com/search?q={urllib.parse.quote(trend_text)}"
                        message_parts.append(f"{i}. {is_it} [{trend_text}]({google_link})")
                    except Exception as e:
                        message_parts.append(f"{i}. {is_it} {trend}")

        # Разделяем сообщение на части с учетом лимита
        return split_message_into_parts(message_parts)


def send_telegram_message(bot_token, chat_id, message_parts):
    """Отправка сообщения в Telegram с учетом разделения на части"""
    try:
        bot = telebot.TeleBot(bot_token)
        success = True

        for part in message_parts:
            try:
                bot.send_message(
                    chat_id=chat_id,
                    text=part,
                    parse_mode='Markdown',
                    disable_web_page_preview=True
                )
                time.sleep(1)  # Небольшая задержка между отправкой частей
            except Exception as e:
                print(f"Ошибка при отправке части сообщения: {e}")
                success = False

        return success
    except Exception as e:
        print(f"Ошибка при инициализации бота Telegram: {e}")
        return False


def job():
    """Задача для выполнения по расписанию"""
    start_time = datetime.now(KYIV_TZ)
    print(f"\n🔄 Запуск анализа трендов: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")

    try:
        # Создаем анализатор и получаем результаты
        analyzer = GlobalTrendsAnalyzer()
        results = analyzer.analyze_trends()

        # Форматируем сообщение для Telegram
        message_parts = analyzer.format_telegram_message(results)

        # Отправляем сообщение
        if send_telegram_message(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, message_parts):
            print("✅ Результаты успешно отправлены в Telegram")
        else:
            print("❌ Ошибка при отправке результатов в Telegram")

        # Выводим информацию о времени выполнения
        end_time = datetime.now(KYIV_TZ)
        execution_time = (end_time - start_time).total_seconds()
        print(f"⏱️ Время выполнения: {execution_time:.2f} секунд")
        print(format_time_until_next_run())

    except Exception as e:
        print(f"❌ Ошибка при выполнении задачи: {e}")
        # В случае ошибки также выводим время
        end_time = datetime.now(KYIV_TZ)
        execution_time = (end_time - start_time).total_seconds()
        print(f"⏱️ Время до ошибки: {execution_time:.2f} секунд")

def split_message_into_parts(message_parts, max_length=4096):
    """
    Разделяет массив строк на части, не превышающие max_length символов,
    с учетом целостности разделов и сохранением форматирования
    """
    current_part = []
    current_length = 0
    final_parts = []

    for part in message_parts:
        # Добавляем перенос строки к длине части
        part_length = len(part) + 1  # +1 для \n

        # Если текущая часть + новая строка превышают лимит
        if current_length + part_length > max_length and current_part:
            # Сохраняем текущую часть
            final_parts.append('\n'.join(current_part))
            current_part = []
            current_length = 0

        # Если отдельная строка больше максимальной длины
        if part_length > max_length:
            # Если текущая часть не пуста, сохраняем её
            if current_part:
                final_parts.append('\n'.join(current_part))
                current_part = []
                current_length = 0

            # Разбиваем длинную строку
            words = part.split()
            current_line = []
            current_line_length = 0

            for word in words:
                word_length = len(word) + 1  # +1 для пробела
                if current_line_length + word_length <= max_length:
                    current_line.append(word)
                    current_line_length += word_length
                else:
                    if current_line:
                        final_parts.append(' '.join(current_line))
                    current_line = [word]
                    current_line_length = len(word)

            if current_line:
                current_part = [' '.join(current_line)]
                current_length = len(current_part[0])
        else:
            current_part.append(part)
            current_length += part_length

    # Добавляем последнюю часть, если она есть
    if current_part:
        final_parts.append('\n'.join(current_part))

    return final_parts


def main():
    """
    Основная функция для запуска бота с проверкой каждые 30 минут
    """
    # Запускаем первый раз сразу при старте программы
    print("🤖 Бот запущен. Первый запуск...")
    job()

    # Настраиваем расписание на каждые 30 минут
    schedule.every(30).minutes.do(job)

    print("📅 Расписание установлено: проверка каждые 30 минут")

    # Бесконечный цикл для проверки расписания
    while True:
        try:
            schedule.run_pending()

            # Обновляем информацию о следующем запуске
            next_run = schedule.next_run()
            if next_run:
                next_run_kyiv = next_run.astimezone(KYIV_TZ)
                current_time = datetime.now(KYIV_TZ)  # Получаем текущее время с timezone
                time_until = (next_run_kyiv - current_time).total_seconds() / 60
                print(f"⏳ До следующего запуска: {int(time_until)} минут")

            # Спим 60 секунд перед следующей проверкой
            time.sleep(60)

        except Exception as e:
            print(f"❌ Ошибка в главном цикле: {e}")
            # Ждем 5 минут перед повторной попыткой в случае ошибки
            time.sleep(300)
            continue

def format_time_until_next_run():
    """Форматирует время до следующего запуска"""
    next_run = schedule.next_run()
    if next_run:
        # Конвертируем время следующего запуска в UTC, затем в Киевское время
        if not next_run.tzinfo:
            next_run = pytz.UTC.localize(next_run)
        next_run_kyiv = next_run.astimezone(KYIV_TZ)
        current_time = datetime.now(KYIV_TZ)
        minutes_until = int((next_run_kyiv - current_time).total_seconds() / 60)
        return f"⏳ До следующего запуска: {minutes_until} минут (в {next_run_kyiv.strftime('%H:%M:%S')} по Киеву)"
    return "⏳ Время следующего запуска не определено"

if __name__ == "__main__":
    try:
        # Убедимся, что timezone определена
        KYIV_TZ = pytz.timezone('Europe/Kiev')
        main()
    except KeyboardInterrupt:
        print("\n👋 Бот остановлен пользователем")
    except Exception as e:
        print(f"\n❌ Критическая ошибка: {e}")
