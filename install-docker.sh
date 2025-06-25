#!/bin/bash
# NetVision Docker Installation Script
# Supports Ubuntu, Debian, CentOS, RHEL, Fedora

set -e

echo "🌐 NetVision Docker Installation Script"
echo "========================================"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root. Please run as a regular user."
   exit 1
fi

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VERSION=$VERSION_ID
else
    echo "❌ Cannot detect OS. Please install Docker manually."
    exit 1
fi

echo "📋 Detected OS: $OS $VERSION"

# Function to install Docker on Ubuntu/Debian
install_docker_ubuntu() {
    echo "📦 Installing Docker on Ubuntu/Debian..."
    
    # Update package index
    sudo apt update
    
    # Install prerequisites
    sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/$OS/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/$OS $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Update package index again
    sudo apt update
    
    # Install Docker Engine
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Install Docker Compose (standalone)
    sudo apt install -y docker-compose
}

# Function to install Docker on CentOS/RHEL/Fedora
install_docker_rhel() {
    echo "📦 Installing Docker on $OS..."
    
    # Install required packages
    sudo dnf install -y dnf-plugins-core
    
    # Add Docker repository
    sudo dnf config-manager --add-repo https://download.docker.com/linux/$OS/docker-ce.repo
    
    # Install Docker Engine
    sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Install Docker Compose (standalone)
    sudo dnf install -y docker-compose
}

# Install Docker based on OS
case $OS in
    ubuntu|debian)
        install_docker_ubuntu
        ;;
    centos|rhel|fedora)
        install_docker_rhel
        ;;
    *)
        echo "❌ Unsupported OS: $OS"
        echo "Please install Docker manually from https://docs.docker.com/engine/install/"
        exit 1
        ;;
esac

# Start and enable Docker service
echo "🚀 Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
echo "👤 Adding user to docker group..."
sudo usermod -aG docker $USER

# Test Docker installation
echo "🧪 Testing Docker installation..."
if sudo docker run hello-world > /dev/null 2>&1; then
    echo "✅ Docker installed successfully!"
else
    echo "❌ Docker installation failed. Please check the logs."
    exit 1
fi

echo ""
echo "🎉 Docker installation completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Log out and log back in (or run 'newgrp docker')"
echo "2. Download NetVision: curl -O https://raw.githubusercontent.com/Liosmar/netvision/main/docker-compose.yml"
echo "3. Start NetVision: docker-compose up -d"
echo "4. Access at: http://localhost:9898"
echo ""
echo "🔒 Security tip: Generate a secure session secret:"
echo "export SESSION_SECRET=\$(openssl rand -base64 32)"