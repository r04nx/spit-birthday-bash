# 🎂 SPIT Birthday Email System - Complete Summary

## Overview

An automated birthday email system that sends personalized birthday wishes to SPIT faculty and students at 1:00 AM daily.

## System Components

### 1. **Birthday Data** (`public/birthdays.txt`)
- Plain text file containing birthday information
- Format:
  ```
  [
  Name: John Doe
  Birthday: 12 November 2025
  Department: Computer Engineering
  Designation: Student - Final Year
  Email: john.doe@example.com
  Image: https://example.com/image.jpg
  ]
  ```

### 2. **Email Template** (`email/index.html`)
- SPIT-branded HTML email template
- Features:
  - Orange gradient color scheme (#FF6B35, #F7931E)
  - Personalized greeting with `{{NAME}}` placeholder
  - Warm birthday message from SPIT family
  - Call-to-action button linking to SPIT website
  - Complete SPIT contact information and address
  - Mobile-responsive design

### 3. **Python Email Sender** (`birthday_email_sender.py`)
- Main automation script
- Features:
  - Runs continuously in background
  - Checks birthdays daily at 1:00 AM
  - Parses `birthdays.txt` file
  - Matches today's date with birthdays
  - Downloads and embeds images as base64
  - Sends personalized emails via Gmail SMTP
  - Detailed logging and error handling

### 4. **Test Suite** (`test_birthday_sender.py`)
- Comprehensive testing script
- Tests:
  - File parsing
  - Birthday matching logic
  - HTML generation
  - Email configuration
  - Manual email sending

### 5. **Documentation**
- `EMAIL_SENDER_README.md` - Complete setup guide
- `BIRTHDAY_SYSTEM_SUMMARY.md` - This file
- `.env.example` - Configuration template

### 6. **Helper Scripts**
- `start_birthday_sender.sh` - Quick start script
- `requirements.txt` - Python dependencies

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Gmail
1. Enable 2-Step Verification in your Google Account
2. Generate an App Password
3. Edit `birthday_email_sender.py`:
   ```python
   SENDER_EMAIL = "your-email@gmail.com"
   SENDER_PASSWORD = "your-app-password"
   ```

### 3. Add Email Addresses
Update `public/birthdays.txt` to include email addresses for each person.

### 4. Test the System
```bash
python test_birthday_sender.py
```

### 5. Start the Service
```bash
./start_birthday_sender.sh
```

Or run directly:
```bash
python birthday_email_sender.py
```

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Birthday Email System                     │
└─────────────────────────────────────────────────────────────┘

1. Script runs continuously in background
   └─> Checks time every 60 seconds

2. At 1:00 AM daily:
   ├─> Reads public/birthdays.txt
   ├─> Parses all birthday entries
   └─> Gets today's date (DD Month)

3. For each birthday match:
   ├─> Loads email/index.html template
   ├─> Replaces {{NAME}} with person's name
   ├─> Downloads person's image from URL
   ├─> Converts image to base64
   ├─> Embeds image in HTML
   └─> Builds complete email

4. Send email via Gmail SMTP:
   ├─> Subject: "🎉 Happy Birthday [Name]! 🎂 - SPIT Family"
   ├─> From: SPIT Birthday Team
   ├─> To: Person's email address
   └─> Body: Personalized HTML with embedded image

5. Log results:
   ├─> Success: "✅ Birthday email sent successfully!"
   └─> Failure: "❌ Error sending email: [details]"
```

## Email Features

### Subject Line
```
🎉 Happy Birthday [FirstName]! 🎂 - SPIT Family
```

### Email Content
- **Header**: "Happy Birthday!" in elegant script font
- **Subheader**: "From the SPIT Family"
- **Personalized Greeting**: "Dear [Full Name],"
- **Message**: Warm birthday wishes from SPIT community
- **CTA Button**: "🎉 Celebrate with Us 🎉" → links to spit.ac.in
- **Person's Image**: Embedded as base64 (no external loading)
- **Footer**: 
  - Contact: support@spit.ac.in
  - Website: www.spit.ac.in
  - Full SPIT address
  - Copyright notice

### Design
- Warm gradient background (#FFF5E6 to #FFE8CC)
- SPIT orange accent color (#FF6B35)
- Modern, clean layout
- Mobile-responsive
- Professional typography

## File Structure

```
spit-birthday-bash/
├── public/
│   └── birthdays.txt              # Birthday data
├── email/
│   └── index.html                 # Email template
├── birthday_email_sender.py       # Main script
├── test_birthday_sender.py        # Test suite
├── start_birthday_sender.sh       # Quick start script
├── requirements.txt               # Python dependencies
├── EMAIL_SENDER_README.md         # Setup guide
├── BIRTHDAY_SYSTEM_SUMMARY.md     # This file
└── .env.example                   # Config template
```

## Configuration Options

### Email Settings (in `birthday_email_sender.py`)
```python
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "your-email@gmail.com"
SENDER_PASSWORD = "your-app-password"
SENDER_NAME = "SPIT Birthday Team"
```

### Schedule Time
Default: 1:00 AM daily
```python
schedule.every().day.at("01:00").do(check_and_send_birthdays)
```

To change:
```python
schedule.every().day.at("09:00").do(check_and_send_birthdays)  # 9 AM
```

## Production Deployment

### Option 1: Systemd Service (Recommended for Linux)
```bash
sudo nano /etc/systemd/system/birthday-sender.service
```

```ini
[Unit]
Description=SPIT Birthday Email Sender
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/rohan/spit-birthday-bash
ExecStart=/usr/bin/python3 birthday_email_sender.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable birthday-sender
sudo systemctl start birthday-sender
```

### Option 2: Docker Container
Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "birthday_email_sender.py"]
```

Run:
```bash
docker build -t birthday-sender .
docker run -d --name birthday-sender birthday-sender
```

### Option 3: Screen/Tmux
```bash
screen -S birthday-sender
python birthday_email_sender.py
# Ctrl+A, D to detach
```

## Monitoring

### Check Logs
```bash
# If running with systemd
sudo journalctl -u birthday-sender -f

# If running with nohup
tail -f birthday_sender.log

# If running in screen
screen -r birthday-sender
```

### Status Check
```bash
# Systemd
sudo systemctl status birthday-sender

# Process
ps aux | grep birthday_email_sender
```

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Use App Password, not regular password
   - Enable 2-Step Verification first

2. **"No module named 'schedule'"**
   ```bash
   pip install schedule requests
   ```

3. **"No birthdays found"**
   - Check date format in birthdays.txt: "DD Month YYYY"
   - Verify file encoding is UTF-8

4. **"Email not sent"**
   - Check email address is present in birthday entry
   - Verify Gmail credentials
   - Check internet connection

5. **Images not loading**
   - Images are embedded as base64
   - Check image URL is accessible
   - Script will use placeholder if download fails

## Security Best Practices

1. **Never commit passwords to Git**
   ```bash
   echo "birthday_email_sender.py" >> .gitignore  # If it contains passwords
   ```

2. **Use environment variables**
   ```python
   import os
   SENDER_EMAIL = os.getenv('GMAIL_EMAIL')
   SENDER_PASSWORD = os.getenv('GMAIL_APP_PASSWORD')
   ```

3. **Restrict file permissions**
   ```bash
   chmod 600 birthday_email_sender.py
   ```

4. **Use dedicated email account**
   - Create a separate Gmail for sending
   - Don't use personal account

## Maintenance

### Adding New Birthdays
1. Edit `public/birthdays.txt`
2. Add new entry with email address
3. No restart needed - file is read at 1 AM

### Updating Email Template
1. Edit `email/index.html`
2. Test with `test_birthday_sender.py`
3. No restart needed

### Changing Schedule
1. Edit `birthday_email_sender.py`
2. Modify the schedule line
3. Restart the service

## Support

- **Email**: support@spit.ac.in
- **Website**: www.spit.ac.in
- **Documentation**: See EMAIL_SENDER_README.md

## License

© 2025 SPIT. All rights reserved.

---

**Last Updated**: November 3, 2025
**Version**: 1.0.0
**Author**: SPIT Development Team
