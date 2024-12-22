import whois
import threading
from queue import Queue
from concurrent.futures import ThreadPoolExecutor
import time
import sys
from datetime import datetime


class DomainChecker:
    def __init__(self, max_threads=10):
        self.max_threads = max_threads
        self.results = {'available': [], 'taken': []}
        self.lock = threading.Lock()
        self.total_domains = 0
        self.checked_domains = 0

    def check_domain_availability(self, domain):
        try:
            domain_info = whois.whois(domain)
            return domain_info.domain_name is None
        except Exception:
            return True

    def check_domain_worker(self, domain):
        is_available = self.check_domain_availability(domain)

        with self.lock:
            if is_available:
                self.results['available'].append(domain)
                status = "AVAILABLE ✓"
            else:
                self.results['taken'].append(domain)
                status = "TAKEN ✗"

            self.checked_domains += 1
            progress = (self.checked_domains / self.total_domains) * 100

            print(f"[{progress:3.1f}%] Checking {domain}... {status}")
            sys.stdout.flush()

    def bulk_check_domains(self, domains):
        self.total_domains = len(domains)
        self.checked_domains = 0

        print(f"\nStarting domain availability check with {self.max_threads} threads...\n")

        start_time = time.time()

        with ThreadPoolExecutor(max_workers=self.max_threads) as executor:
            executor.map(self.check_domain_worker, domains)

        end_time = time.time()
        duration = end_time - start_time

        return duration


def read_domains_from_file(filename):
    try:
        with open(filename, 'r') as file:
            domains = [line.strip() for line in file if line.strip()]
        return domains
    except FileNotFoundError:
        print(f"Error: {filename} not found!")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)


def save_results(results, duration):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f'domain_results_{timestamp}.txt'

    with open(filename, 'w') as f:
        f.write(f"Domain Check Results - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Check Duration: {duration:.2f} seconds\n\n")

        f.write("=== AVAILABLE DOMAINS ===\n")
        for domain in sorted(results['available']):
            f.write(f"{domain}\n")

        f.write("\n=== TAKEN DOMAINS ===\n")
        for domain in sorted(results['taken']):
            f.write(f"{domain}\n")

        # Write summary
        f.write(f"\n=== SUMMARY ===\n")
        f.write(f"Total domains checked: {len(results['available']) + len(results['taken'])}\n")
        f.write(f"Available domains: {len(results['available'])}\n")
        f.write(f"Taken domains: {len(results['taken'])}\n")

    return filename


def main():
    print("Multithreaded Bulk Domain Availability Checker")

    # Read domains from file
    domains = read_domains_from_file('domains.txt')

    if not domains:
        print("No domains found in domains.txt. Exiting...")
        return

    print(f"\nLoaded {len(domains)} domains from domains.txt")

    # Create checker instance and run checks
    checker = DomainChecker(max_threads=10)  # Adjust number of threads as needed
    duration = checker.bulk_check_domains(domains)

    # Print results summary
    print("\n=== RESULTS SUMMARY ===")
    print(f"Total domains checked: {len(domains)}")
    print(f"Available domains: {len(checker.results['available'])}")
    print(f"Taken domains: {len(checker.results['taken'])}")
    print(f"Time taken: {duration:.2f} seconds")

    # Save results to file
    results_file = save_results(checker.results, duration)
    print(f"\nDetailed results have been saved to {results_file}")


if __name__ == "__main__":
    main()
