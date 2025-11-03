# 🚀 SPIT Birthday Bash - Deployment Guide

Complete guide for deploying and managing the SPIT Birthday Bash application in production.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Scripts Overview](#scripts-overview)
- [Detailed Setup](#detailed-setup)
- [Service Management](#service-management)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

---

## 🎯 Quick Start

### One-Command Deployment

```bash
./start.sh
```

This single command will:
1. ✅ Check system requirements
2. ✅ Install npm and pnpm
3. ✅ Install frontend dependencies
4. ✅ Build frontend for production
5. ✅ Set up Python virtual environment
6. ✅ Install Python dependencies
7. ✅ Start both frontend and email sender
8. ✅ Monitor services with auto-restart

### Stop Services

```bash
./stop.sh
```

### Check Status

```bash
./status.sh
```

---

## 📜 Scripts Overview

### `start.sh` - Main Deployment Script

**Purpose**: Complete setup and deployment of both frontend and backend services.

**Features**:
- ✅ Fault-tolerant with error handling
- ✅ Automatic dependency installation
- ✅ Separate log files for each service
- ✅ Process monitoring with auto-restart
- ✅ Graceful shutdown on Ctrl+C
- ✅ Colored output for easy reading

**Logs Created**:
- `frontend.log` - Frontend server logs
- `email_sender.log` - Email sender logs
- `setup.log` - Installation and setup logs

**Process Files**:
- `.frontend.pid` - Frontend process ID
- `.email_sender.pid` - Email sender process ID

### `stop.sh` - Service Shutdown Script

**Purpose**: Gracefully stop all running services.

**Features**:
- Graceful shutdown with SIGTERM
- Force kill if process doesn't stop
- Cleanup of PID files
- Kills any remaining processes by name

### `status.sh` - Service Status Script

**Purpose**: Check the status of all services.

**Shows**:
- Service running status
- Process ID (PID)
- CPU and memory usage
- Uptime
- Log file information
- Last errors or activity
- Access URLs

---

## 🔧 Detailed Setup

### Prerequisites

**Required**:
- Linux/Unix system (Ubuntu, Debian, CentOS, etc.)
- `node` and `npm` (will be checked by script)
- `python3` (will be checked by script)
- Internet connection (for downloading dependencies)

**Optional**:
- `pnpm` (will be installed automatically)
- `python3-venv` (will be installed if missing on Debian/Ubuntu)

### First-Time Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd /path/to/spit-birthday-bash
   ```

2. **Make scripts executable** (if not already):
   ```bash
   chmod +x start.sh stop.sh status.sh
   ```

3. **Configure email sender**:
   Edit `birthday_email_sender.py`:
   ```python
   SENDER_EMAIL = "your-email@gmail.com"
   SENDER_PASSWORD = "your-app-password"
   ```

4. **Add email addresses to birthdays**:
   Edit `public/birthdays.txt` and add email addresses:
   ```
   [
   Name: John Doe
   Birthday: 12 November 2025
   Department: Computer Engineering
   Designation: Student
   Email: john.doe@example.com
   Image: https://example.com/image.jpg
   ]
   ```

5. **Start the application**:
   ```bash
   ./start.sh
   ```

---

## 🎮 Service Management

### Starting Services

```bash
./start.sh
```

**What happens**:
1. System requirements check
2. Node.js and pnpm setup
3. Frontend dependency installation
4. Frontend production build
5. Python virtual environment setup
6. Python dependency installation
7. Frontend server starts on port 4173
8. Email sender starts (checks birthdays at 1 AM)
9. Continuous monitoring with auto-restart

**Output**:
```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║        🎂 SPIT Birthday Bash - Production Startup 🎂          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

[2025-11-03 18:00:00] Starting setup process...
[2025-11-03 18:00:01] ✓ node is installed
[2025-11-03 18:00:02] ✓ python3 is installed
...
✅ SPIT Birthday Bash Started Successfully!
```

### Stopping Services

```bash
./stop.sh
```

**What happens**:
1. Reads PID files
2. Sends SIGTERM to processes
3. Waits 2 seconds for graceful shutdown
4. Force kills if still running
5. Cleans up PID files
6. Kills any remaining processes by name

**Output**:
```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║        🛑 SPIT Birthday Bash - Stopping Services 🛑           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

[2025-11-03 18:30:00] Stopping frontend (PID: 12345)...
[2025-11-03 18:30:02] ✓ Frontend stopped
[2025-11-03 18:30:02] Stopping email sender (PID: 12346)...
[2025-11-03 18:30:04] ✓ Email sender stopped

✅ Stopped 2 service(s) successfully
```

### Checking Status

```bash
./status.sh
```

**Shows**:
- Service status (running/stopped)
- Process information (PID, CPU, memory, uptime)
- Log file information
- Recent errors or activity
- Access URLs

**Example Output**:
```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║        📊 SPIT Birthday Bash - Service Status 📊              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

Frontend Service:
  Status:   ● Running
  PID:      12345
  CPU:      2.3%
  Memory:   1.5%
  Uptime:   00:15:30
  Port:     4173 (listening)
  Log:      frontend.log (1.2M, 1523 lines)

Email Sender Service:
  Status:   ● Running
  PID:      12346
  CPU:      0.1%
  Memory:   0.8%
  Uptime:   00:15:28
  Log:      email_sender.log (45K, 234 lines)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ All services are running (2/2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📊 Monitoring

### View Logs in Real-Time

**Frontend logs**:
```bash
tail -f frontend.log
```

**Email sender logs**:
```bash
tail -f email_sender.log
```

**Setup logs**:
```bash
tail -f setup.log
```

**All logs together**:
```bash
tail -f frontend.log email_sender.log
```

### Log Rotation

To prevent log files from growing too large:

```bash
# Create logrotate config
sudo nano /etc/logrotate.d/spit-birthday-bash
```

Add:
```
/home/rohan/spit-birthday-bash/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    missingok
    copytruncate
}
```

### Auto-Restart Feature

The `start.sh` script includes automatic restart functionality:

- Checks services every 10 seconds
- Automatically restarts if a service crashes
- Logs restart events
- Continues monitoring until manually stopped

---

## 🔍 Troubleshooting

### Common Issues

#### 1. "node: command not found"

**Solution**: Install Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

#### 2. "python3: command not found"

**Solution**: Install Python 3
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y python3 python3-pip python3-venv

# CentOS/RHEL
sudo yum install -y python3 python3-pip
```

#### 3. "Failed to install pnpm"

**Solution**: The script will fall back to npm automatically. Or install manually:
```bash
npm install -g pnpm
```

#### 4. "Frontend build failed"

**Check**:
```bash
cat setup.log | grep -A 10 "Building frontend"
```

**Common causes**:
- Missing dependencies
- Syntax errors in code
- Out of memory

**Solution**:
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

#### 5. "Port 4173 already in use"

**Solution**: Kill the process using the port
```bash
lsof -ti:4173 | xargs kill -9
```

Or change the port in `package.json`:
```json
{
  "scripts": {
    "preview": "vite preview --port 5173"
  }
}
```

#### 6. "Email sender not sending emails"

**Check**:
1. Email configuration in `birthday_email_sender.py`
2. Gmail App Password is correct
3. Email addresses in `birthdays.txt`
4. Check logs: `tail -f email_sender.log`

#### 7. Services keep restarting

**Check logs**:
```bash
tail -f frontend.log email_sender.log
```

**Common causes**:
- Configuration errors
- Missing dependencies
- Port conflicts

### Debug Mode

To see more detailed output:

```bash
# Run frontend manually
npm run preview

# Run email sender manually
source venv/bin/activate
python birthday_email_sender.py
```

---

## 🏭 Production Deployment

### Option 1: Systemd Service (Recommended)

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/spit-birthday-bash.service
```

Add:
```ini
[Unit]
Description=SPIT Birthday Bash Application
After=network.target

[Service]
Type=forking
User=rohan
WorkingDirectory=/home/rohan/spit-birthday-bash
ExecStart=/home/rohan/spit-birthday-bash/start.sh
ExecStop=/home/rohan/spit-birthday-bash/stop.sh
Restart=always
RestartSec=10
StandardOutput=append:/home/rohan/spit-birthday-bash/service.log
StandardError=append:/home/rohan/spit-birthday-bash/service.log

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable spit-birthday-bash
sudo systemctl start spit-birthday-bash
sudo systemctl status spit-birthday-bash
```

### Option 2: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18 AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.9-slim
WORKDIR /app

# Install Node.js for running the preview server
RUN apt-get update && apt-get install -y nodejs npm && rm -rf /var/lib/apt/lists/*

# Copy built frontend
COPY --from=frontend-builder /app/dist ./dist
COPY --from=frontend-builder /app/package*.json ./

# Install frontend dependencies for preview
RUN npm install

# Copy Python files
COPY requirements.txt .
COPY birthday_email_sender.py .
COPY public ./public
COPY email ./email

# Install Python dependencies
RUN pip install -r requirements.txt

# Expose port
EXPOSE 4173

# Start script
COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]
```

Build and run:
```bash
docker build -t spit-birthday-bash .
docker run -d -p 4173:4173 --name spit-birthday-bash spit-birthday-bash
```

### Option 3: PM2 Process Manager

Install PM2:
```bash
npm install -g pm2
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'spit-frontend',
      script: 'npm',
      args: 'run preview',
      cwd: '/home/rohan/spit-birthday-bash',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'spit-email-sender',
      script: 'venv/bin/python',
      args: 'birthday_email_sender.py',
      cwd: '/home/rohan/spit-birthday-bash'
    }
  ]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Reverse Proxy with Nginx

```nginx
server {
    listen 80;
    server_name birthday.spit.ac.in;

    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📝 Maintenance

### Regular Tasks

**Daily**:
- Check service status: `./status.sh`
- Review logs for errors

**Weekly**:
- Check disk space: `df -h`
- Review log file sizes
- Verify email sender is working

**Monthly**:
- Update dependencies
- Review and archive old logs
- Test backup and restore procedures

### Updating the Application

```bash
# Stop services
./stop.sh

# Pull latest changes
git pull

# Restart services (will rebuild automatically)
./start.sh
```

### Backup

```bash
# Backup data and configuration
tar -czf backup-$(date +%Y%m%d).tar.gz \
  public/birthdays.txt \
  email/index.html \
  birthday_email_sender.py \
  *.log

# Backup to remote server
scp backup-*.tar.gz user@backup-server:/backups/
```

---

## 🆘 Support

- **Email**: support@spit.ac.in
- **Documentation**: See all README files in the project
- **Logs**: Check `*.log` files for detailed information

---

## 📄 License

© 2025 SPIT. All rights reserved.

---

**Last Updated**: November 3, 2025  
**Version**: 1.0.0
