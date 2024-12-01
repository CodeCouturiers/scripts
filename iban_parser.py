class IBANParser:
    def __init__(self):
        self.country_lengths = {
            'UA': 29, 'DE': 22, 'GB': 22, 'FR': 27, 'IT': 27, 'ES': 24,
            'PL': 28, 'NL': 18, 'BE': 16, 'CH': 21, 'AT': 20, 'SE': 24
        }

    def validate_and_parse(self, iban):
        iban = ''.join(iban.split()).upper()

        if len(iban) < 4:
            raise ValueError("IBAN is too short")

        country_code = iban[:2]
        check_digits = iban[2:4]
        bban = iban[4:]

        if country_code not in self.country_lengths:
            raise ValueError(f"Unknown country code: {country_code}")

        expected_length = self.country_lengths[country_code]
        if len(iban) != expected_length:
            raise ValueError(f"Invalid length for {country_code}")

        details = self._extract_country_specific_details(country_code, bban)

        return {
            'country_code': country_code,
            'check_digits': check_digits,
            'bban': bban,
            **details
        }

    @staticmethod
    def _extract_country_specific_details(country_code, bban):
        details = {}

        rules = {
            'UA': {
                'bank_code': (0, 6),
                'account_number': (6, None)
            },
            'DE': {
                'bank_code': (0, 8),
                'account_number': (8, None)
            },
            'GB': {
                'bank_code': (0, 4),
                'sort_code': (4, 10),
                'account_number': (10, None)
            },
            'FR': {
                'bank_code': (0, 5),
                'branch_code': (5, 10),
                'account_number': (10, None)
            },
            'IT': {
                'bank_code': (0, 5),
                'branch_code': (5, 10),
                'account_number': (10, None)
            },
            'ES': {
                'bank_code': (0, 4),
                'branch_code': (4, 8),
                'account_number': (8, None)
            },
            'PL': {
                'bank_code': (0, 8),
                'account_number': (8, None)
            },
            'NL': {
                'bank_code': (0, 4),
                'account_number': (4, None)
            },
            'BE': {
                'bank_code': (0, 3),
                'account_number': (3, None)
            },
            'CH': {
                'bank_code': (0, 5),
                'account_number': (5, None)
            },
            'AT': {
                'bank_code': (0, 5),
                'account_number': (5, None)
            },
            'SE': {
                'bank_code': (0, 3),
                'account_number': (3, None)
            }
        }

        if country_code in rules:
            for key, (start, end) in rules[country_code].items():
                details[key] = bban[start:end]

        return details


def main():
    parser = IBANParser()

    test_ibans = {
        'Ukraine': 'UA033220010000021205336120769',
        'Germany': 'DE89370400440532013000',
        'UK': 'GB29NWBK60161331926819',
        'France': 'FR1420041010050500013M02606',
        'Italy': 'IT60X0542811101000000123456',
        'Spain': 'ES9121000418450200051332',
        'Poland': 'PL61109010140000071219812874',
        'Netherlands': 'NL91ABNA0417164300',
        'Belgium': 'BE68539007547034',
        'Switzerland': 'CH9300762011623852957',
        'Austria': 'AT611904300234573201',
        'Sweden': 'SE4550000000058398257466'
    }

    for country, iban in test_ibans.items():
        try:
            result = parser.validate_and_parse(iban)
            print(f"\n=== {country} IBAN Analysis ===")
            for key, value in result.items():
                print(f"{key}: {value}")
        except ValueError as e:
            print(f"Error parsing {country} IBAN: {str(e)}")


if __name__ == "__main__":
    main()
