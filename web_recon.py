import socket
import dns.resolver
import whois
import requests
import concurrent.futures
import subprocess
import json
from datetime import datetime
import ssl
import OpenSSL
import sys
from typing import List, Dict


class DomainIntelligence:
    def __init__(self, domain: str):
        self.domain = domain
        self.results = {
            "direct_ips": [],
            "dns_records": {},
            "whois_info": {},
            "ssl_info": {},
            "subdomains": [],
            "reverse_dns": [],
            "historic_ips": [],
            "cdn_info": {},
            "infrastructure": {},
            "beneficiary_ips": []
        }

    def get_direct_ips(self) -> List[str]:
        """Получение прямых IP адресов"""
        try:
            ips = socket.gethostbyname_ex(self.domain)[2]
            self.results["direct_ips"] = ips
            return ips
        except Exception as e:
            print(f"Ошибка при получении прямых IP: {e}")
            return []

    def get_dns_records(self):
        """Получение всех типов DNS записей"""
        record_types = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA', 'CNAME', 'PTR']

        for record_type in record_types:
            try:
                answers = dns.resolver.resolve(self.domain, record_type)
                self.results["dns_records"][record_type] = [str(rdata) for rdata in answers]
            except Exception:
                continue

    def get_whois_info(self):
        """Получение WHOIS информации"""
        try:
            w = whois.whois(self.domain)
            self.results["whois_info"] = {
                "registrar": w.registrar,
                "creation_date": str(w.creation_date) if w.creation_date else None,
                "expiration_date": str(w.expiration_date) if w.expiration_date else None,
                "name_servers": w.name_servers if w.name_servers else None,
                "status": w.status if hasattr(w, 'status') else None,
                "emails": w.emails if hasattr(w, 'emails') else None,
                "registrant": w.registrant if hasattr(w, 'registrant') else None,
                "admin_email": w.admin_email if hasattr(w, 'admin_email') else None,
                "tech_email": w.tech_email if hasattr(w, 'tech_email') else None
            }
        except Exception as e:
            print(f"Ошибка при получении WHOIS: {e}")
            self.results["whois_info"] = {"error": str(e)}

    def get_ssl_info(self):
        """Получение информации о SSL сертификате"""
        try:
            context = ssl.create_default_context()
            with socket.create_connection((self.domain, 443)) as sock:
                with context.wrap_socket(sock, server_hostname=self.domain) as ssock:
                    cert = ssock.getpeercert()
                    self.results["ssl_info"] = {
                        "subject": dict(x[0] for x in cert['subject']),
                        "issuer": dict(x[0] for x in cert['issuer']),
                        "version": cert['version'],
                        "serialNumber": cert['serialNumber'],
                        "notBefore": cert['notBefore'],
                        "notAfter": cert['notAfter'],
                        "subjectAltName": cert.get('subjectAltName', [])
                    }
        except Exception as e:
            print(f"Ошибка при получении SSL информации: {e}")
            self.results["ssl_info"] = {"error": str(e)}

    def find_subdomains(self):
        """Поиск поддоменов через брутфорс"""
        common_subdomains = ['www', 'mail', 'ftp', 'localhost', 'webmail', 'smtp', 'pop', 'ns1', 'webdisk',
                             'ns2', 'cpanel', 'whm', 'autodiscover', 'autoconfig', 'm', 'imap', 'test',
                             'ns', 'blog', 'pop3', 'dev', 'www2', 'admin', 'forum', 'news', 'vpn', 'ns3',
                             'mail2', 'new', 'mysql', 'old', 'lists', 'support', 'mobile', 'mx', 'static',
                             'docs', 'beta', 'shop', 'sql', 'secure', 'demo', 'cp', 'calendar', 'wiki',
                             'web', 'media', 'email', 'images', 'img', 'www1', 'intranet']

        def check_subdomain(subdomain):
            try:
                host = f"{subdomain}.{self.domain}"
                socket.gethostbyname(host)
                return host
            except:
                return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            results = list(executor.map(check_subdomain, common_subdomains))
            self.results["subdomains"] = [r for r in results if r]

    def reverse_ip_lookup(self):
        """Обратный поиск по IP"""
        for ip in self.results["direct_ips"]:
            try:
                hostname = socket.gethostbyaddr(ip)[0]
                self.results["reverse_dns"].append({"ip": ip, "hostname": hostname})
            except:
                continue

    def check_cdn(self):
        """Проверка на использование CDN"""
        cdn_providers = {
            "Cloudflare": ["cloudflare", "cloudflare.com"],
            "Akamai": ["akamai", "akamaiedge.net"],
            "CloudFront": ["cloudfront.net"],
            "Fastly": ["fastly"],
            "MaxCDN": ["maxcdn"],
            "Google": ["googleusercontent.com", "googlesyndication"],
            "Amazon": ["amazonaws.com", "amazon.com"],
            "Microsoft": ["msedge.net", "azure.com"],
            "StackPath": ["stackpath"],
            "Sucuri": ["sucuri"]
        }

        for provider, signatures in cdn_providers.items():
            for record_type, records in self.results["dns_records"].items():
                for record in records:
                    for signature in signatures:
                        if signature in str(record).lower():
                            self.results["cdn_info"][provider] = True
                            break

    def trace_route(self):
        """Трассировка маршрута"""
        try:
            if sys.platform.startswith('win'):
                command = ['tracert', self.domain]
                result = subprocess.run(command, capture_output=True, encoding='cp866')
            else:
                command = ['traceroute', self.domain]
                result = subprocess.run(command, capture_output=True, encoding='utf-8')
            self.results["infrastructure"]["trace_route"] = result.stdout
            self.analyze_trace_route()
        except Exception as e:
            print(f"Ошибка при трассировке: {e}")
            self.results["infrastructure"]["trace_route"] = str(e)

    def analyze_trace_route(self):
        """Анализ трассировки маршрута для определения бенефициарных IP"""
        beneficiary_ips = set()
        trace_data = self.results["infrastructure"].get("trace_route", "")

        # Парсим строки трассировки
        for line in trace_data.split('\n'):
            # Ищем IP адреса в строке
            if '[' in line and ']' in line:
                try:
                    ip = line.split('[')[1].split(']')[0]
                    if not ip.startswith('192.168.') and not ip.startswith('10.') and not ip.startswith('172.'):
                        beneficiary_ips.add(ip)
                except:
                    continue

        self.results["beneficiary_ips"] = list(beneficiary_ips)

    def summarize_findings(self):
        """Обобщение всех найденных IP и определение конечных IP"""
        all_ips = set()

        # Собираем все найденные IP
        all_ips.update(self.results["direct_ips"])
        all_ips.update(self.results.get("beneficiary_ips", []))

        # Добавляем IP из DNS записей
        for records in self.results["dns_records"].values():
            for record in records:
                if isinstance(record, str) and any(c.isdigit() for c in record):
                    try:
                        ip = record.split()[-1]
                        if all(part.isdigit() and 0 <= int(part) <= 255 for part in ip.split('.')):
                            all_ips.add(ip)
                    except:
                        continue

        return list(all_ips)

    def sanitize_for_json(self, obj):
        """Подготовка данных для JSON"""
        if isinstance(obj, bytes):
            return obj.decode('utf-8', errors='replace')
        elif isinstance(obj, dict):
            return {self.sanitize_for_json(key): self.sanitize_for_json(value)
                    for key, value in obj.items()}
        elif isinstance(obj, list):
            return [self.sanitize_for_json(element) for element in obj]
        elif isinstance(obj, tuple):
            return tuple(self.sanitize_for_json(element) for element in obj)
        elif isinstance(obj, set):
            return {self.sanitize_for_json(element) for element in obj}
        return obj

    def run_full_scan(self):
        """Запуск полного сканирования"""
        scan_methods = [
            (self.get_direct_ips, "Получение прямых IP"),
            (self.get_dns_records, "Получение DNS записей"),
            (self.get_whois_info, "Получение WHOIS информации"),
            (self.get_ssl_info, "Проверка SSL"),
            (self.find_subdomains, "Поиск поддоменов"),
            (self.reverse_ip_lookup, "Обратный DNS поиск"),
            (self.check_cdn, "Проверка CDN"),
            (self.trace_route, "Трассировка маршрута")
        ]

        print(f"\n[*] Начало сканирования домена {self.domain}")

        for method, description in scan_methods:
            try:
                print(f"[+] {description}...")
                method()
            except Exception as e:
                print(f"[-] Ошибка при {description.lower()}: {e}")

        self.results = self.sanitize_for_json(self.results)
        return self.results


def print_results(results: Dict, scanner: DomainIntelligence):
    """Красивый вывод результатов"""
    print("\n" + "=" * 50)
    print("РЕЗУЛЬТАТЫ СКАНИРОВАНИЯ")
    print("=" * 50)

    if results.get("direct_ips"):
        print("\n[IP Адреса]")
        for ip in results["direct_ips"]:
            print(f"- {ip}")

    if results.get("dns_records"):
        print("\n[DNS Записи]")
        for record_type, records in results["dns_records"].items():
            print(f"\n{record_type} записи:")
            for record in records:
                print(f"- {record}")

    if results.get("whois_info"):
        print("\n[WHOIS Информация]")
        for key, value in results["whois_info"].items():
            if value:
                print(f"{key}: {value}")

    if results.get("ssl_info"):
        print("\n[SSL Информация]")
        for key, value in results["ssl_info"].items():
            print(f"{key}: {value}")

    if results.get("subdomains"):
        print("\n[Поддомены]")
        for subdomain in results["subdomains"]:
            print(f"- {subdomain}")

    if results.get("reverse_dns"):
        print("\n[Обратный DNS]")
        for entry in results["reverse_dns"]:
            print(f"- {entry['ip']} -> {entry['hostname']}")

    if results.get("cdn_info"):
        print("\n[CDN Информация]")
        for cdn, used in results["cdn_info"].items():
            print(f"- {cdn}: {'Используется' if used else 'Не используется'}")

    if results.get("infrastructure", {}).get("trace_route"):
        print("\n[Трассировка маршрута]")
        print(results["infrastructure"]["trace_route"])

    if results.get("beneficiary_ips"):
        print("\n[Бенефициарные IP из трассировки]")
        for ip in results["beneficiary_ips"]:
            print(f"- {ip}")

    print("\n[ИТОГОВЫЙ АНАЛИЗ]")
    print("Обнаруженные конечные IP-адреса:")
    final_ips = scanner.summarize_findings()
    for ip in final_ips:
        print(f"- {ip}")

    # Определяем CDN и хостинг провайдеров
    cdn_detected = [cdn for cdn, used in results.get("cdn_info", {}).items() if used]
    if cdn_detected:
        print("\nИспользуемые CDN:")
        for cdn in cdn_detected:
            print(f"- {cdn}")

    print("\nВЫВОД:")
    print(f"Домен {scanner.domain} использует {len(final_ips)} уникальных IP-адресов.")
    if cdn_detected:
        print(f"Сайт работает через CDN: {', '.join(cdn_detected)}")


def save_results(domain: str, results: Dict):
    """Сохранение результатов в файл"""
    filename = f"{domain}_scan_results.json"
    try:
        with open(filename, "w", encoding='utf-8') as f:
            json.dump(results, f, indent=4, ensure_ascii=False)
        print(f"\nРезультаты сохранены в файл: {filename}")
    except Exception as e:
        print(f"Ошибка при сохранении результатов: {e}")


def main():
    try:
        domain = input("Введите домен для анализа: ").strip()
        if not domain:
            raise ValueError("Домен не может быть пустым")

        scanner = DomainIntelligence(domain)
        results = scanner.run_full_scan()
        print_results(results, scanner)
        save_results(domain, results)

    except KeyboardInterrupt:
        print("\nСканирование прервано пользователем")
    except Exception as e:
        print(f"Критическая ошибка: {e}")


if __name__ == "__main__":
    main()
