from pytrends.request import TrendReq
import pandas as pd
import time
from datetime import datetime
import warnings

warnings.filterwarnings('ignore')


class GlobalTrendsAnalyzer:
    def __init__(self, hl='en-US', tz=0):
        self.pytrends = TrendReq(hl=hl, tz=tz)

        # Структура регионов и городов
        self.regions = {
            'СНГ и Восточная Европа': {
                'russia': {
                    'cities': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg',
                               'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Ufa',
                               'Rostov-on-Don', 'Krasnoyarsk', 'Voronezh', 'Perm', 'Volgograd'],
                    'name': 'Россия'
                },
                'ukraine': {
                    'cities': ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Lviv',
                               'Zaporizhzhia', 'Vinnytsia', 'Khmelnytskyi', 'Chernivtsi'],
                    'name': 'Украина'
                },
                'belarus': {
                    'cities': ['Minsk', 'Gomel', 'Grodno', 'Brest', 'Vitebsk'],
                    'name': 'Беларусь'
                },
                'kazakhstan': {
                    'cities': ['Almaty', 'Nur-Sultan', 'Shymkent', 'Karaganda', 'Aktobe'],
                    'name': 'Казахстан'
                },
                'uzbekistan': {
                    'cities': ['Tashkent', 'Namangan', 'Samarkand', 'Andijan'],
                    'name': 'Узбекистан'
                },
                'azerbaijan': {
                    'cities': ['Baku', 'Ganja', 'Sumgait'],
                    'name': 'Азербайджан'
                },
                'georgia': {
                    'cities': ['Tbilisi', 'Batumi', 'Kutaisi'],
                    'name': 'Грузия'
                },
                'armenia': {
                    'cities': ['Yerevan', 'Gyumri', 'Vanadzor'],
                    'name': 'Армения'
                },
                'moldova': {
                    'cities': ['Chisinau', 'Balti', 'Orhei'],
                    'name': 'Молдова'
                },
                'kyrgyzstan': {
                    'cities': ['Bishkek', 'Osh', 'Jalal-Abad'],
                    'name': 'Киргизия'
                },
                'tajikistan': {
                    'cities': ['Dushanbe', 'Khujand'],
                    'name': 'Таджикистан'
                },
                'turkmenistan': {
                    'cities': ['Ashgabat', 'Türkmenabat'],
                    'name': 'Туркменистан'
                }
            },
            'Северная Америка': {
                'united_states': {
                    'cities': ['New York', 'Boston', 'Atlanta', 'Washington', 'Austin',
                               'Chicago', 'Denver', 'San Francisco', 'Seattle', 'Los Angeles',
                               'San Jose', 'Portland'],
                    'name': 'США'
                },
                'canada': {
                    'cities': ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
                    'name': 'Канада'
                }
            },
            'Азия и Океания': {
                'australia': {'cities': ['Sydney', 'Melbourne', 'Brisbane'], 'name': 'Австралия'},
                'japan': {'cities': ['Tokyo', 'Osaka', 'Kyoto'], 'name': 'Япония'},
                'south_korea': {'cities': ['Seoul', 'Busan'], 'name': 'Южная Корея'},
                'singapore': {'cities': ['Singapore'], 'name': 'Сингапур'},
                'india': {'cities': ['Bangalore', 'New Delhi', 'Mumbai'], 'name': 'Индия'}
            }
        }

        # Расширенные ключевые слова для фильтрации IT-трендов, включая локализованные термины
        self.it_keywords = {
            # Общие технологические термины на разных языках
            'tech', 'technology', 'технологии', 'технології', 'texnologiya',
            'digital', 'цифровой', 'цифровий', 'raqamli',
            'smart', 'смарт', 'розумний',

            # Разработка и программирование
            'app', 'application', 'приложение', 'додаток', 'ilova',
            'software', 'софт', 'программа', 'програма',
            'development', 'разработка', 'розробка',
            'programming', 'программирование', 'програмування',

            # Платформы и сервисы
            'platform', 'платформа', 'платформа',
            'service', 'сервис', 'сервіс',
            'cloud', 'облако', 'хмара',

            # Новые технологии
            'ai', 'artificial intelligence', 'искусственный интеллект', 'штучний інтелект',
            'machine learning', 'машинное обучение', 'машинне навчання',
            'blockchain', 'блокчейн', 'криптовалюта', 'крипто',
            'virtual reality', 'виртуальная реальность', 'віртуальна реальність',

            # Мобильные технологии
            'mobile', 'мобильный', 'мобільний',
            'android', 'ios', 'app store', 'play market',

            # Бизнес и стартапы
            'startup', 'стартап', 'стартап',
            'fintech', 'финтех', 'фінтех',
            'subscription', 'подписка', 'підписка',

            # IT-инфраструктура
            'hosting', 'хостинг', 'хостинг',
            'server', 'сервер', 'сервер',
            'database', 'база данных', 'база даних'
        }

    def get_trending_searches(self):
        """
        Получение трендовых поисковых запросов со всех регионов
        """
        all_trends = {}

        for region_name, countries in self.regions.items():
            print(f"\nПолучение трендов для региона: {region_name}")
            region_trends = {}

            for country_code, country_data in countries.items():
                try:
                    country_name = country_data['name']
                    print(f"  Страна: {country_name}")

                    # Пробуем разные варианты кодов стран
                    trend_variants = [country_code]
                    if '_' in country_code:
                        trend_variants.append(country_code.replace('_', ' '))

                    for variant in trend_variants:
                        try:
                            trends = self.pytrends.trending_searches(pn=variant)
                            if isinstance(trends, pd.DataFrame):
                                trends = trends.values.flatten().tolist()

                            region_trends[country_name] = {
                                'trends': trends,
                                'cities': country_data['cities']
                            }
                            print(f"    ✓ Получено {len(trends)} трендов")
                            break
                        except Exception as e:
                            continue

                    time.sleep(2)  # Увеличенная пауза между запросами
                except Exception as e:
                    print(f"  ⚠️ Не удалось получить данные для {country_code}: {str(e)}")
                    continue

            all_trends[region_name] = region_trends

        return all_trends

    def is_it_related(self, term):
        """Проверка, относится ли термин к IT-тематике"""
        if not isinstance(term, str):
            term = str(term)
        term = term.lower()
        return any(keyword in term for keyword in self.it_keywords)

    def analyze_trends(self):
        """Анализ трендов по всем регионам"""
        results = {
            'trends_by_region': {},
            'it_trends': {},
            'summary': {
                'total_trends': 0,
                'it_related_trends': 0,
                'regions_analyzed': 0,
                'countries_analyzed': 0,
                'analysis_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
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


def print_results(results):
    """Форматированный вывод результатов анализа"""
    print("\n" + "=" * 70)
    print("ГЛОБАЛЬНЫЙ АНАЛИЗ IT-ТРЕНДОВ")
    print("=" * 70)
    print(f"Дата анализа: {results['summary']['analysis_date']}")
    print(f"Проанализировано регионов: {results['summary']['regions_analyzed']}")
    print(f"Проанализировано стран: {results['summary']['countries_analyzed']}")
    print(f"Всего трендов: {results['summary']['total_trends']}")
    print(f"IT-related трендов: {results['summary']['it_related_trends']}")

    # Вывод трендов по регионам
    for region_name, region_data in results['trends_by_region'].items():
        print(f"\n{'=' * 30} {region_name} {'=' * 30}")

        for country_name, trends in region_data.items():
            print(f"\n📍 {country_name}")
            print("-" * 50)

            for i, trend in enumerate(trends[:20], 1):
                is_it = "🖥️ " if any(kw in str(trend).lower() for kw in ["app", "tech", "soft", "web", "ai"]) else "  "
                print(f"{i:2d}. {is_it}{trend}")

    # Вывод только IT-трендов
    print("\n" + "=" * 70)
    print("IT-ТРЕНДЫ ПО РЕГИОНАМ")
    print("=" * 70)

    for region_name, region_it_trends in results['it_trends'].items():
        has_trends = any(trends for trends in region_it_trends.values())
        if has_trends:
            print(f"\n{region_name}:")
            for country_name, trends in region_it_trends.items():
                if trends:
                    print(f"\n{country_name}:")
                    for i, trend in enumerate(trends, 1):
                        print(f"{i}. {trend}")


def main():
    analyzer = GlobalTrendsAnalyzer()
    results = analyzer.analyze_trends()
    print_results(results)


if __name__ == "__main__":
    main()
