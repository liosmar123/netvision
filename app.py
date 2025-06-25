import os
import json
import time
import socket
import urllib.request
from datetime import datetime

from flask import Flask, render_template, request, jsonify

from scanner import PortScanner
from utils import validate_ip, validate_port_range, format_scan_time

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# Application configuration
APP_NAME = "NetVision"
APP_VERSION = "Beta 1.3"

def get_public_ip():
    """Get public IP address with fallback to local IP"""
    try:
        services = [
            'https://api.ipify.org?format=json',
            'https://httpbin.org/ip'
        ]
        
        for service in services:
            try:
                with urllib.request.urlopen(service, timeout=3) as response:
                    data = json.loads(response.read().decode())
                    return data.get('ip') or data.get('origin')
            except:
                continue
        
        return get_local_ip()
    except:
        return get_local_ip()

def get_local_ip():
    """Get local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html', 
                         app_name=APP_NAME,
                         app_version=APP_VERSION)

@app.route('/api/public-ip')
def api_public_ip():
    """Get public IP endpoint"""
    return jsonify({'ip': get_public_ip()})

@app.route('/api/local-ip')
def api_local_ip():
    """Get local IP endpoint"""
    return jsonify({'ip': get_local_ip()})


@app.route('/scan', methods=['POST'])
def scan():
    """Handle port scanning"""
    try:
        target = request.form.get('target', '').strip()
        port_range = request.form.get('port_range', '').strip()
        timeout = int(request.form.get('timeout', 1))
        
        if not target or not port_range:
            return render_template('index.html', 
                                 error="Target and port or port range are required", 
                                 app_name=APP_NAME,
                                 app_version=APP_VERSION)
        
        # Resolve hostname to IP if needed
        if not validate_ip(target):
            try:
                target = socket.gethostbyname(target)
            except socket.gaierror:
                return render_template('index.html', 
                                     error="Invalid target", 
                                     app_name=APP_NAME,
                                     app_version=APP_VERSION)
        
        # Parse ports
        try:
            ports = validate_port_range(port_range)
        except ValueError as e:
            return render_template('index.html', 
                                 error=str(e), 
                                 app_name=APP_NAME,
                                 app_version=APP_VERSION)
        
        # Scan ports
        scanner = PortScanner()
        start_time = time.time()
        results = scanner.scan_ports(target, ports, timeout)
        duration = time.time() - start_time
        
        # Filter results: show closed ports only for small scans (≤5 ports)
        open_ports = [r for r in results if r['status'] == 'OPEN']
        filtered_results = results if len(results) <= 5 else open_ports
        
        scan_info = {
            'target': target,
            'total_ports_scanned': len(results),
            'total_open_ports': len(open_ports),
            'scan_duration': duration,
            'scan_time': format_scan_time(duration)
        }
        
        return render_template('index.html',
                             scan_results=filtered_results,
                             scan_info=scan_info,
                             show_results=True,
                             target_ip=request.form.get('target', '').strip(),
                             app_name=APP_NAME,
                             app_version=APP_VERSION)
        
    except Exception as e:
        return render_template('index.html', 
                             error=f"Scan failed: {str(e)}", 
                             app_name=APP_NAME,
                             app_version=APP_VERSION)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)