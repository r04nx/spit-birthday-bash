# Birthday Email Sender - Setup Guide

This Python script automatically checks for birthdays daily and sends personalized birthday emails at 1:00 AM.

## Features

- ✅ Automatically checks `birthdays.txt` daily at 1:00 AM
- ✅ Sends personalized birthday emails with recipient's name
- ✅ Uses the custom SPIT-branded HTML email template
- ✅ Embeds images as base64 (no external dependencies)
- ✅ Only sends emails to people whose birthday is today
- ✅ Uses Gmail SMTP server

## Prerequisites

1. **Python 3.7+** installed on your system
2. **Gmail account** with App Password enabled
3. **Email addresses** added to the birthday entries in `birthdays.txt`

## Setup Instructions

### Step 1: Install Python Dependencies

```bash
pip install -r requirements.txt
```

Or install manually:
```bash
pip install schedule requests
```

### Step 2: Enable Gmail App Password

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### Step 3: Configure the Script

Edit `birthday_email_sender.py` and update these lines:

```python
SENDER_EMAIL = "your-email@gmail.com"  # Replace with your Gmail
SENDER_PASSWORD = "your-app-password"  # Replace with your Gmail App Password
```

### Step 4: Add Email Addresses to Birthday Entries

Update `public/birthdays.txt` to include email addresses:

```
[
Name: Amit Kumar Patel
Birthday: 12 November 2025
Department: Information Technology
Designation: Student - Final Year
Email: amit.patel@example.com
Image: https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop
]
```

## Running the Script

### Option 1: Run Manually (for testing)

```bash
python birthday_email_sender.py
```

To test immediately, uncomment this line in the script:
```python
# check_and_send_birthdays()  # Remove the # to run immediately
```

### Option 2: Run as a Background Service (Linux/Mac)

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/birthday-sender.service
```

Add this content:
```ini
[Unit]
Description=Birthday Email Sender
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/rohan/spit-birthday-bash
ExecStart=/usr/bin/python3 /home/rohan/spit-birthday-bash/birthday_email_sender.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable birthday-sender
sudo systemctl start birthday-sender
sudo systemctl status birthday-sender
```

### Option 3: Run with nohup (Simple background process)

```bash
nohup python birthday_email_sender.py > birthday_sender.log 2>&1 &
```

### Option 4: Run with Screen (Persistent session)

```bash
screen -S birthday-sender
python birthday_email_sender.py
# Press Ctrl+A then D to detach
# Reattach with: screen -r birthday-sender
```

## How It Works

1. **Daily Check**: The script runs continuously and checks the time every minute
2. **1:00 AM Trigger**: At 1:00 AM daily, it reads `birthdays.txt`
3. **Date Matching**: Compares today's date (day + month) with birthday entries
4. **Email Building**: 
   - Loads the HTML template from `email/index.html`
   - Replaces `{{NAME}}` with the person's actual name
   - Downloads the person's image and encodes it as base64
   - Embeds the image directly in the HTML
5. **Email Sending**: Sends the personalized email via Gmail SMTP

## Email Subject Format

```
🎉 Happy Birthday [FirstName]! 🎂 - SPIT Family
```

Example: `🎉 Happy Birthday Amit! 🎂 - SPIT Family`

## Troubleshooting

### "Authentication failed" error
- Make sure you're using an **App Password**, not your regular Gmail password
- Enable 2-Step Verification first
- Check that the email and password are correct

### "No module named 'schedule'" error
```bash
pip install schedule requests
```

### Emails not sending
- Check that email addresses are added to birthday entries
- Verify the birthday date format matches: "DD Month YYYY"
- Check the logs for error messages

### Test the script
Temporarily change the schedule time to test:
```python
schedule.every().day.at("14:30").do(check_and_send_birthdays)  # Test at 2:30 PM
```

Or uncomment the immediate run line:
```python
check_and_send_birthdays()  # Runs immediately on start
```

## Logs

The script prints detailed logs:
- Connection status
- Birthdays found
- Email sending status
- Success/failure messages

To save logs to a file:
```bash
python birthday_email_sender.py > birthday_sender.log 2>&1
```

## Security Notes

⚠️ **Important**: 
- Never commit your Gmail password to version control
- Use environment variables for production:
  ```python
  import os
  SENDER_EMAIL = os.getenv('GMAIL_EMAIL')
  SENDER_PASSWORD = os.getenv('GMAIL_APP_PASSWORD')
  ```
- Keep your App Password secure
- Consider using a dedicated Gmail account for sending

## Stopping the Script

- If running in foreground: Press `Ctrl+C`
- If running as systemd service: `sudo systemctl stop birthday-sender`
- If running with nohup: `pkill -f birthday_email_sender.py`
- If running in screen: `screen -r birthday-sender` then `Ctrl+C`

## Support

For issues or questions, contact: support@spit.ac.in
