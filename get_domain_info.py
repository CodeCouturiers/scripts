from dataclasses import dataclass
from typing import Dict, Any
import whois
import socket
from ipwhois import IPWhois
import pycountry

@dataclass
class DomainData:
    name: str
    registrar: str
    creation_date: str
    expiry_date: str
    organization: str

@dataclass
class JurisdictionData:
    country: str
    state: str
    registrant_country: str

@dataclass
class IpData:
    address: str
    organization: str
    country: str

class DataFormatter:
    @staticmethod
    def format_date(date) -> str:
        if not date:
            return 'Not specified'
        if isinstance(date, list):
            date = date[0]
        return date.strftime("%d.%m.%Y %H:%M:%S")

    @staticmethod
    def format_country(code: str) -> str:
        if not code:
            return 'Not specified'
        try:
            return pycountry.countries.get(alpha_2=code.upper()).name
        except:
            return code

    @staticmethod
    def format_state(code: str) -> str:
        if not code:
            return 'Not specified'
        try:
            return pycountry.subdivisions.get(code=f'US-{code}').name
        except:
            return code

class DataFetcher:
    def __init__(self, domain: str):
        self.domain = domain
        self.formatter = DataFormatter()

    def fetch_whois_data(self) -> whois.WhoisEntry:
        return whois.whois(self.domain)

    def fetch_ip_data(self) -> tuple[str, dict]:
        ip_address = socket.gethostbyname(self.domain)
        return ip_address, IPWhois(ip_address).lookup_rdap()

class DomainInfoBuilder:
    def __init__(self, domain: str):
        self.domain = domain
        self.fetcher = DataFetcher(domain)
        self.formatter = DataFormatter()

    def build(self) -> Dict[str, Any]:
        try:
            whois_info = self.fetcher.fetch_whois_data()
            ip_address, ip_info = self.fetcher.fetch_ip_data()

            return {
                "domain": self._build_domain_data(whois_info),
                "jurisdiction": self._build_jurisdiction_data(whois_info),
                "ip": self._build_ip_data(ip_address, ip_info)
            }
        except Exception as e:
            print(f"Error: {str(e)}")
            return {}

    def _build_domain_data(self, whois_info) -> DomainData:
        return DomainData(
            name=self.domain,
            registrar=whois_info.registrar,
            creation_date=self.formatter.format_date(whois_info.creation_date),
            expiry_date=self.formatter.format_date(whois_info.expiration_date),
            organization=getattr(whois_info, 'org', 'Not specified')
        )

    def _build_jurisdiction_data(self, whois_info) -> JurisdictionData:
        return JurisdictionData(
            country=self.formatter.format_country(getattr(whois_info, 'country', '')),
            state=self.formatter.format_state(getattr(whois_info, 'state', '')),
            registrant_country=self.formatter.format_country(getattr(whois_info, 'registrant_country', ''))
        )

    def _build_ip_data(self, ip_address: str, ip_info: Dict) -> IpData:
        return IpData(
            address=ip_address,
            organization=ip_info.get('network', {}).get('name', 'Not specified'),
            country=self.formatter.format_country(ip_info.get('network', {}).get('country', ''))
        )

class DomainInfoPrinter:
    @staticmethod
    def print(info: Dict[str, Any]):
        if not info:
            return

        sections = [
            ("DOMAIN INFORMATION", [
                ("Domain name", info['domain'].name),
                ("Domain registrar", info['domain'].registrar),
                ("Creation date", info['domain'].creation_date),
                ("Expiration date", info['domain'].expiry_date),
                ("Organization", info['domain'].organization)
            ]),
            ("LEGAL INFORMATION", [
                ("Registration country", info['jurisdiction'].country),
                ("Registration state", info['jurisdiction'].state),
                ("Registrant country", info['jurisdiction'].registrant_country)
            ]),
            ("TECHNICAL INFORMATION", [
                ("Server IP", info['ip'].address),
                ("Hosting provider", info['ip'].organization),
                ("Server location", info['ip'].country)
            ])
        ]

        for title, items in sections:
            print(f"\n=== {title} ===")
            for label, value in items:
                print(f"{label}: {value}")

def main():
    domain = input("Enter domain name for analysis: ")
    info = DomainInfoBuilder(domain).build()
    DomainInfoPrinter.print(info)

if __name__ == "__main__":
    main()
