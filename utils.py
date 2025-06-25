import ipaddress
import re

def validate_ip(ip_string):
    """Validate IP address format"""
    try:
        ipaddress.ip_address(ip_string)
        return True
    except ValueError:
        return False

def validate_port_range(port_range):
    """Validate and parse port or port range string"""
    ports = []
    
    for part in port_range.split(','):
        part = part.strip()
        
        if '-' in part:
            # Handle range like "80-443"
            try:
                start, end = map(int, part.split('-'))
                if not (1 <= start <= 65535) or not (1 <= end <= 65535):
                    raise ValueError("Ports must be between 1 and 65535")
                if start > end:
                    raise ValueError("Invalid range: start port greater than end port")
                ports.extend(range(start, end + 1))
            except ValueError as e:
                if "invalid literal" in str(e):
                    raise ValueError(f"Invalid port range format: {part}")
                raise e
        else:
            # Handle single port
            try:
                port = int(part)
                if not (1 <= port <= 65535):
                    raise ValueError("Ports must be between 1 and 65535")
                ports.append(port)
            except ValueError:
                raise ValueError(f"Invalid port: {part}")
    
    if not ports:
        raise ValueError("No valid ports specified")
    
    return sorted(list(set(ports)))

def format_scan_time(seconds):
    """Format scan time in human readable format"""
    if seconds < 1:
        return f"{seconds:.2f}s"
    elif seconds < 60:
        return f"{seconds:.1f}s"
    else:
        minutes = int(seconds // 60)
        secs = seconds % 60
        return f"{minutes}m {secs:.1f}s"