# 🌐 NetVision - Network Port Scanner

A powerful and elegant web-based network port scanner built with Python Flask. NetVision provides fast, reliable port scanning with a modern, responsive interface optimized for both desktop and mobile devices.

![NetVision](https://img.shields.io/badge/NetVision-Beta%201.3-blue)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/flask-2.0+-green.svg)
![Docker](https://img.shields.io/badge/docker-supported-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- **🚀 Fast Multi-threaded Scanning** - Concurrent port scanning for optimal performance
- **🎯 Smart Service Detection** - Automatically identifies common services running on open ports
- **📱 Mobile-Responsive Design** - Beautiful interface that works perfectly on all devices with adaptive layouts
- **🌙 Dark/Light Theme Toggle** - User-friendly theme switching with preference persistence
- **🔍 Advanced Filtering** - Intelligent result filtering for large port ranges
- **🎨 Modern UI/UX** - Clean, intuitive interface built with Tailwind CSS and hexagonal network-themed branding
- **⚡ Real-time Progress** - Live scanning progress with elegant radar-style animations
- **📋 Clipboard Integration** - Easy IP address pasting functionality with smart helper buttons
- **🐳 Docker Ready** - Simple containerized deployment with multi-platform support
- **🔒 Security Focused** - Safe and responsible network scanning practices
- **🎯 Clickable Logo** - Interactive branding that returns to homepage
- **📊 Dual Result Views** - Card layout for mobile, table view for desktop

## 🚀 Quick Start

### Using Docker (Recommended)

#### Option 1: Docker Run
```bash
# Pull and run the latest version
docker run -d -p 9898:5000 --name netvision liosmar/netvision:latest

# Access NetVision at http://localhost:9898
```

#### Option 2: Docker Compose
Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  netvision:
    image: liosmar/netvision:latest
    container_name: netvision
    ports:
      - "9898:5000"
    restart: unless-stopped
    environment:
      - SESSION_SECRET=your-secure-secret-key-here
```

Then run:
```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f netvision

# Stop the service
docker-compose down
```

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/Liosmar/netvision.git
cd netvision

# Install Python dependencies
pip install -r requirements.txt

# Set environment variable
export SESSION_SECRET="your-development-secret-key"

# Run the application
python main.py
```

Access NetVision at `http://localhost:5000` (manual) or `http://localhost:9898` (Docker)

## 🐳 Docker Installation Guide

### Prerequisites
Ensure Docker and Docker Compose are installed on your system:

#### Ubuntu/Debian
```bash
# Update package index
sudo apt update

# Install Docker
sudo apt install docker.io docker-compose

# Add user to docker group
sudo usermod -aG docker $USER

# Restart session or run
newgrp docker
```

#### CentOS/RHEL/Fedora
```bash
# Install Docker
sudo dnf install docker docker-compose

# Start and enable Docker service  
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
```

#### Windows/macOS
Download and install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)

### Deployment Options

#### Production Deployment
```bash
# Create production directory
mkdir netvision-prod && cd netvision-prod

# Download docker-compose.yml
curl -O https://raw.githubusercontent.com/Liosmar/netvision/main/docker-compose.yml

# Generate secure secret key
export SESSION_SECRET=$(openssl rand -base64 32)

# Start in production mode
docker-compose up -d

# Verify deployment
docker-compose ps
docker-compose logs netvision
```

#### Development Deployment
```bash
# Clone repository for development
git clone https://github.com/Liosmar/netvision.git
cd netvision

# Build local image
docker build -t netvision:dev .

# Run development container
docker run -d -p 9898:5000 --name netvision-dev netvision:dev
```

## 📖 Usage Guide

### Basic Scanning
1. **Enter Target IP**: Input the IP address you want to scan (supports IPv4)
2. **Specify Ports**: Enter your port configuration using flexible formats
3. **Configure Options**: Adjust timeout and select from preset port collections  
4. **Start Scan**: Click "Start Scan" and monitor real-time progress
5. **Review Results**: View detailed results with service identification and protocol info

### Port Input Formats
- **Single port**: `80`
- **Multiple ports**: `80,443,22,21`
- **Port range**: `1-1000`
- **Mixed format**: `80,443,1000-2000,3389`

### Helper Functions
- **📋 Paste Button**: Automatically paste IP from clipboard
- **🌐 Public IP**: Fetch your current public IP address
- **🏠 Local IP**: Use your local network IP address

### Advanced Options
- **Timeout Configuration**: 1-10 seconds per port (default: 1 second)
- **Preset Port Sets**:
  - Common Ports: `80,443,22,21,25,53,110,143,993,995,3389`
  - Web Ports: `80,443`
  - Remote Access: `21,22,23`
  - Range Scan: `1-1000`

## 🎨 Interface Features

### Responsive Design
- **Desktop Experience**: Full-featured table view with comprehensive port information
- **Mobile Experience**: Card-based layout optimized for touch interaction
- **Tablet Experience**: Adaptive layout that scales between desktop and mobile views

### Visual Elements
- **Hexagonal Network Logo**: Modern branding representing network topology
- **Radar Scanning Animation**: Real-time progress visualization during scans
- **Smart Result Filtering**: Automatically shows only open ports for large scans
- **Theme Persistence**: Your theme choice is remembered across sessions

### User Experience Enhancements
- **Clickable Logo**: Returns to homepage from any state
- **Loading States**: Visual feedback for all asynchronous operations
- **Error Handling**: Clear, actionable error messages
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Technical Architecture

### Backend Components
- **Flask Application**: RESTful web server with session management
- **Multi-threaded Scanner**: Concurrent port scanning engine (up to 50 threads)
- **Service Detection**: Protocol and service identification system
- **IP Validation**: Comprehensive input validation and sanitization

### Frontend Stack
- **Tailwind CSS**: Utility-first styling with responsive design
- **Vanilla JavaScript**: Lightweight client-side interactions
- **SVG Graphics**: Scalable icons and animations
- **CSS Grid/Flexbox**: Modern layout techniques

### Performance Optimizations
- **Adaptive Threading**: Thread count scales with port range size
- **Smart Timeouts**: Configurable connection timeouts (1-10 seconds)
- **Result Caching**: Session-based result storage
- **Efficient Rendering**: Progressive result display

## 🔧 Development Setup

### Local Development
```bash
# Clone and setup
git clone https://github.com/Liosmar/netvision.git
cd netvision

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Set development environment
export SESSION_SECRET="dev-secret-key"
export FLASK_ENV="development"

# Run development server
python main.py
```

### Docker Development
```bash
# Build development image
docker build -t netvision:dev .

# Run with volume mounting for live reload
docker run -d -p 9898:5000 \
  -v $(pwd):/app \
  --name netvision-dev \
  netvision:dev
```

### Building for Production
```bash
# Build production image
docker build -t netvision:latest .

# Tag for registry
docker tag netvision:latest liosmar/netvision:latest

# Push to Docker Hub
docker push liosmar/netvision:latest

# Multi-platform build
docker buildx build --platform linux/amd64,linux/arm64 \
  -t liosmar/netvision:latest --push .
```

## 🔐 Security Best Practices

### Responsible Usage
- NetVision is designed for legitimate network administration and security testing
- Always ensure you have proper authorization before scanning networks
- Use only on networks you own or have explicit permission to test
- Respect rate limits and avoid aggressive scanning that could impact services

### Security Features
- **Input Validation**: Comprehensive IP address and port validation
- **Session Security**: Secure session management with configurable secrets
- **Rate Limiting**: Built-in delays to prevent overwhelming target systems
- **Error Handling**: Secure error messages that don't expose system information

### Production Security
```bash
# Generate secure session secret
export SESSION_SECRET=$(openssl rand -base64 32)

# Run with restricted permissions
docker run -d -p 9898:5000 \
  --user 1000:1000 \
  --read-only \
  --tmpfs /tmp \
  -e SESSION_SECRET="$SESSION_SECRET" \
  liosmar/netvision:latest
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Guidelines
- Follow PEP 8 style guidelines for Python code
- Use meaningful commit messages and PR descriptions
- Add tests for new features and bug fixes
- Ensure mobile responsiveness for UI changes
- Update documentation for significant changes

### Code Style
- **Python**: Black formatter with 88-character line limit
- **JavaScript**: Prettier with 2-space indentation
- **HTML/CSS**: Consistent indentation and semantic markup

## 📊 Version History

### Beta 1.3 (Latest)
- ✨ New hexagonal network-themed logo and branding
- 🖱️ Clickable logo with homepage navigation
- 📱 Enhanced mobile responsiveness across all sections
- 🔄 Improved button layouts with mobile-optimized stacking
- 📋 Mobile-friendly card layout for scan results
- ⚡ Optimized loading overlay and text sizing for mobile devices

### Beta 1.0
- 🚀 Initial release with core port scanning functionality
- 🎨 Modern UI with Tailwind CSS
- 🌙 Dark/light theme toggle
- 📱 Basic mobile responsiveness
- 🐳 Docker containerization

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Liosmar** - [GitHub Profile](https://github.com/Liosmar)

## 🙏 Acknowledgments

- Flask community for the excellent web framework
- Tailwind CSS for the beautiful styling system  
- Python community for robust networking libraries
- Docker community for containerization best practices

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

[📥 Download Latest Release](https://github.com/Liosmar/netvision/releases) · [🐳 Docker Hub](https://hub.docker.com/r/liosmar/netvision) · [🐛 Report Bug](https://github.com/Liosmar/netvision/issues) · [💡 Request Feature](https://github.com/Liosmar/netvision/issues)

</div>