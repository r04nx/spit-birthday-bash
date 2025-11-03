#!/usr/bin/env python3
"""
Birthday Email Sender
Checks birthdays.txt daily and sends personalized birthday emails at 1 AM
"""

import os
import smtplib
import base64
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from pathlib import Path
import time
import schedule

# Gmail SMTP Configuration (Hardcoded)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "your-email@gmail.com"  # Replace with your Gmail
SENDER_PASSWORD = "your-app-password"  # Replace with your Gmail App Password
SENDER_NAME = "SPIT Birthday Team"

# Paths
BASE_DIR = Path(__file__).parent
BIRTHDAYS_FILE = BASE_DIR / "public" / "birthdays.txt"
EMAIL_TEMPLATE_FILE = BASE_DIR / "email" / "index.html"


def parse_birthdays_file():
    """Parse the birthdays.txt file and return a list of people"""
    people = []
    
    with open(BIRTHDAYS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by brackets to get individual entries
    entries = content.split('[')
    
    for entry in entries:
        if not entry.strip() or entry.strip().startswith('#'):
            continue
            
        person = {}
        lines = entry.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith(']'):
                continue
                
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip().lower()
                value = value.strip()
                
                if 'name' in key:
                    person['name'] = value
                elif 'birthday' in key:
                    person['birthday'] = value
                elif 'department' in key:
                    person['department'] = value
                elif 'designation' in key:
                    person['designation'] = value
                elif 'email' in key:
                    person['email'] = value
                elif 'image' in key:
                    person['image'] = value
        
        if person.get('name') and person.get('birthday'):
            people.append(person)
    
    return people


def get_todays_birthdays():
    """Get list of people whose birthday is today"""
    today = datetime.now()
    today_str = today.strftime("%d %B").lstrip("0")  # e.g., "3 November"
    
    all_people = parse_birthdays_file()
    todays_birthdays = []
    
    for person in all_people:
        birthday = person.get('birthday', '')
        # Extract day and month from birthday string
        try:
            # Parse the birthday (format: "12 November 2025")
            parts = birthday.split()
            if len(parts) >= 2:
                day = parts[0]
                month = parts[1]
                birthday_str = f"{day} {month}".lstrip("0")
                
                if birthday_str == today_str:
                    todays_birthdays.append(person)
        except Exception as e:
            print(f"Error parsing birthday for {person.get('name')}: {e}")
            continue
    
    return todays_birthdays


def download_and_encode_image(url):
    """Download an image from URL and encode it as base64"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # Determine image type from URL or content-type
        content_type = response.headers.get('content-type', 'image/png')
        if 'jpeg' in content_type or 'jpg' in content_type:
            mime_type = 'image/jpeg'
        elif 'png' in content_type:
            mime_type = 'image/png'
        elif 'gif' in content_type:
            mime_type = 'image/gif'
        else:
            mime_type = 'image/png'
        
        # Encode to base64
        encoded = base64.b64encode(response.content).decode('utf-8')
        return f"data:{mime_type};base64,{encoded}"
    except Exception as e:
        print(f"Error downloading image from {url}: {e}")
        # Return a placeholder data URI
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="


def build_email_html(person):
    """Build the complete HTML email with embedded images"""
    # Read the email template
    with open(EMAIL_TEMPLATE_FILE, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Replace the {{NAME}} placeholder with actual name
    html_content = html_content.replace('{{NAME}}', person['name'])
    
    # Download and encode the person's image if available
    if person.get('image'):
        person_image_base64 = download_and_encode_image(person['image'])
        # Replace the image source in the main birthday image section
        html_content = html_content.replace('src="images/image-1.png"', f'src="{person_image_base64}"')
    
    # Note: Social media icons and other images are already removed or can be handled similarly
    # For now, we'll leave them as relative paths since we removed social media
    
    return html_content


def send_birthday_email(person):
    """Send a birthday email to the person"""
    if not person.get('email'):
        print(f"No email address for {person['name']}, skipping...")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"🎉 Happy Birthday {person['name'].split()[0]}! 🎂 - SPIT Family"
        msg['From'] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
        msg['To'] = person['email']
        
        # Build HTML content with embedded images
        html_content = build_email_html(person)
        
        # Attach HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Connect to Gmail SMTP server
        print(f"Connecting to SMTP server...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        
        # Login
        print(f"Logging in...")
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        
        # Send email
        print(f"Sending birthday email to {person['name']} ({person['email']})...")
        server.send_message(msg)
        server.quit()
        
        print(f"✅ Birthday email sent successfully to {person['name']}!")
        return True
        
    except Exception as e:
        print(f"❌ Error sending email to {person['name']}: {e}")
        return False


def check_and_send_birthdays():
    """Main function to check birthdays and send emails"""
    print(f"\n{'='*60}")
    print(f"Birthday Check - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")
    
    try:
        todays_birthdays = get_todays_birthdays()
        
        if not todays_birthdays:
            print("No birthdays today.")
            return
        
        print(f"Found {len(todays_birthdays)} birthday(s) today:")
        for person in todays_birthdays:
            print(f"  - {person['name']} ({person.get('department', 'N/A')})")
        
        print("\nSending birthday emails...")
        
        success_count = 0
        for person in todays_birthdays:
            if send_birthday_email(person):
                success_count += 1
                time.sleep(2)  # Small delay between emails
        
        print(f"\n✅ Sent {success_count}/{len(todays_birthdays)} birthday emails successfully!")
        
    except Exception as e:
        print(f"❌ Error in birthday check: {e}")
    
    print(f"{'='*60}\n")


def run_scheduler():
    """Run the scheduler to check birthdays daily at 1 AM"""
    print("🎂 Birthday Email Sender Started!")
    print(f"Scheduled to run daily at 1:00 AM")
    print(f"Monitoring file: {BIRTHDAYS_FILE}")
    print(f"Using email template: {EMAIL_TEMPLATE_FILE}")
    print(f"Sender: {SENDER_EMAIL}")
    print(f"\nPress Ctrl+C to stop...\n")
    
    # Schedule the job to run daily at 1:00 AM
    schedule.every().day.at("01:00").do(check_and_send_birthdays)
    
    # Optional: Run once immediately for testing
    # check_and_send_birthdays()
    
    # Keep the script running
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute


if __name__ == "__main__":
    # Check if required files exist
    if not BIRTHDAYS_FILE.exists():
        print(f"❌ Error: {BIRTHDAYS_FILE} not found!")
        exit(1)
    
    if not EMAIL_TEMPLATE_FILE.exists():
        print(f"❌ Error: {EMAIL_TEMPLATE_FILE} not found!")
        exit(1)
    
    # Run the scheduler
    try:
        run_scheduler()
    except KeyboardInterrupt:
        print("\n\n👋 Birthday Email Sender stopped by user.")
