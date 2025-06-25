# NetVision Deployment Guide

## Quick Deployment Options

### Option 1: Docker Hub (Recommended)
```bash
# Pull and run from Docker Hub
docker run -d -p 9898:5000 --name netvision liosmar/netvision:latest
```

### Option 2: Docker Compose
```bash
# Download compose file
curl -O https://raw.githubusercontent.com/Liosmar/netvision/main/docker-compose.yml

# Generate secure secret
export SESSION_SECRET=$(openssl rand -base64 32)

# Deploy
docker-compose up -d
```

### Option 3: From Source
```bash
# Download and extract
wget https://github.com/Liosmar/netvision/releases/download/v1.3/netvision-beta-1.3-complete.zip
unzip netvision-beta-1.3-complete.zip
cd netvision

# Build and run
docker build -t netvision:local .
docker run -d -p 9898:5000 netvision:local
```

## Docker Installation

Use the automated installer:
```bash
curl -sSL https://raw.githubusercontent.com/Liosmar/netvision/main/install-docker.sh | bash
```

Or install manually following the guide in README.md.

## Production Security

Generate secure session secret:
```bash
export SESSION_SECRET=$(openssl rand -base64 32)
```

Run with security constraints:
```bash
docker run -d -p 9898:5000 \
  --user 1000:1000 \
  --read-only \
  --tmpfs /tmp \
  -e SESSION_SECRET="$SESSION_SECRET" \
  liosmar/netvision:latest
```

## Verification

Access NetVision at `http://localhost:9898` and verify:
- Logo displays correctly and is clickable
- Mobile responsiveness works
- Scanning functionality operates
- Theme toggle functions properly

## Support

For issues, visit: https://github.com/Liosmar/netvision/issues