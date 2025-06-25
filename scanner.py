import socket
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

class PortScanner:
    def __init__(self, max_threads=50):
        self.max_threads = max_threads

    def scan_port(self, target, port, timeout=1):
        """Scan a single port"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(timeout)
            result = sock.connect_ex((target, port))
            sock.close()
            
            status = 'OPEN' if result == 0 else 'CLOSED'
            service = self.detect_service(port)
            
            return {
                'target': target,
                'port': port,
                'status': status,
                'service': service,
                'protocol': self.detect_protocol(port)
            }
        except Exception:
            return {
                'target': target,
                'port': port,
                'status': 'FILTERED',
                'service': 'Unknown',
                'protocol': 'TCP'
            }

    def detect_service(self, port):
        """Detect common services by port number"""
        services = {
            21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS',
            67: 'DHCP', 68: 'DHCP', 80: 'HTTP', 110: 'POP3', 143: 'IMAP',
            443: 'HTTPS', 993: 'IMAPS', 995: 'POP3S', 1433: 'MSSQL',
            3306: 'MySQL', 3389: 'RDP', 5432: 'PostgreSQL', 8080: 'HTTP-Alt'
        }
        return services.get(port, 'Unknown')

    def detect_protocol(self, port):
        """Detect protocol (TCP/UDP) by port"""
        udp_ports = {53, 67, 68, 69, 123, 161, 162, 514, 1194}
        return 'UDP' if port in udp_ports else 'TCP'

    def scan_ports(self, target, ports, timeout=1):
        """Scan multiple ports using threading"""
        results = []
        
        with ThreadPoolExecutor(max_workers=self.max_threads) as executor:
            future_to_port = {
                executor.submit(self.scan_port, target, port, timeout): port 
                for port in ports
            }
            
            for future in as_completed(future_to_port):
                try:
                    result = future.result()
                    results.append(result)
                except Exception:
                    port = future_to_port[future]
                    results.append({
                        'target': target,
                        'port': port,
                        'status': 'ERROR',
                        'service': 'Unknown',
                        'protocol': 'TCP'
                    })
        
        # Sort results by port number
        return sorted(results, key=lambda x: x['port'])