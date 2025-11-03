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
from email.mime.image import MIMEImage
from datetime import datetime
from pathlib import Path
import time
import schedule
from email import encoders

# Gmail SMTP Configuration (Hardcoded)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "your-email@gmail.com"  # Replace with your Gmail
SENDER_PASSWORD = "ppaasswwoorrdd"  # Replace with your Gmail App Password
SENDER_NAME = "SPIT Birthday"

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


def download_and_encode_image(url, person_name=""):
    """Download an image from URL and encode it as base64"""
    try:
        # Add headers to avoid 403 errors
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/'
        }
        
        response = requests.get(url, timeout=15, headers=headers, allow_redirects=True)
        response.raise_for_status()
        
        # Determine image type from URL or content-type
        content_type = response.headers.get('content-type', 'image/png')
        if 'jpeg' in content_type or 'jpg' in content_type:
            mime_type = 'image/jpeg'
        elif 'png' in content_type:
            mime_type = 'image/png'
        elif 'gif' in content_type:
            mime_type = 'image/gif'
        elif 'svg' in content_type:
            mime_type = 'image/svg+xml'
        elif 'webp' in content_type:
            mime_type = 'image/webp'
        else:
            mime_type = 'image/png'
        
        # Encode to base64
        encoded = base64.b64encode(response.content).decode('utf-8')
        print(f"✅ Successfully downloaded and encoded image ({len(response.content)} bytes)")
        return f"data:{mime_type};base64,{encoded}"
    except Exception as e:
        print(f"⚠️  Error downloading image from {url}: {e}")
        print(f"   Falling back to default avatar for {person_name}")
        
        # Try to get a default avatar from DiceBear API
        try:
            avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={person_name}"
            avatar_response = requests.get(avatar_url, timeout=10)
            avatar_response.raise_for_status()
            
            # Encode SVG to base64
            encoded = base64.b64encode(avatar_response.content).decode('utf-8')
            print(f"✅ Using default avatar from DiceBear")
            return f"data:image/svg+xml;base64,{encoded}"
        except Exception as avatar_error:
            print(f"⚠️  Could not fetch default avatar: {avatar_error}")
            # Return a simple 1x1 transparent PNG as last resort
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="


def build_email_html(person, use_cid=False):
    """Build the complete HTML email with embedded images"""
    print(f"\n📧 Building email HTML for {person['name']}...")
    
    # Read the email template
    with open(EMAIL_TEMPLATE_FILE, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Replace the {{NAME}} placeholder with actual name
    first_name = person['name'].split()[0]
    html_content = html_content.replace('{{NAME}}', first_name)
    print(f"   ✓ Replaced {{{{NAME}}}} with {first_name}")
    
    # If using CID (Content-ID) for inline images, replace the URL
    if use_cid:
        html_content = html_content.replace(
            'src="https://i.ibb.co/pvGKyRvf/image-1.png"',
            'src="cid:birthday_image"'
        )
        print(f"   ✓ Using inline image attachment (CID)")
    else:
        print(f"   ✓ Using hosted image URL")
    
    print(f"   ✓ Email HTML compiled successfully ({len(html_content)} characters)")
    return html_content


def send_birthday_email(person):
    """Send a birthday email to the person"""
    if not person.get('email'):
        print(f"⚠️  No email address for {person['name']}, skipping...")
        return False
    
    try:
        print(f"\n{'='*60}")
        print(f"📨 Sending Birthday Email")
        print(f"{'='*60}")
        print(f"   To: {person['name']} <{person['email']}>")
        
        # Create message with related content for inline images
        msg = MIMEMultipart('related')
        first_name = person['name'].split()[0]
        msg['Subject'] = f"🎉 Happy Birthday {first_name}! 🎂 - SPIT Family"
        msg['From'] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
        msg['To'] = person['email']
        
        print(f"   Subject: {msg['Subject']}")
        
        # Create alternative part for HTML
        msg_alternative = MIMEMultipart('alternative')
        msg.attach(msg_alternative)
        
        # Build HTML content with CID reference
        html_content = build_email_html(person, use_cid=True)
        
        # Attach HTML content
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg_alternative.attach(html_part)
        
        # Download and attach the image inline
        print(f"   📥 Downloading image for inline attachment...")
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            img_response = requests.get('https://i.ibb.co/pvGKyRvf/image-1.png', 
                                       timeout=10, headers=headers)
            img_response.raise_for_status()
            
            # Create image attachment
            image = MIMEImage(img_response.content)
            image.add_header('Content-ID', '<birthday_image>')
            image.add_header('Content-Disposition', 'inline', filename='birthday.png')
            msg.attach(image)
            print(f"   ✓ Image attached inline ({len(img_response.content)} bytes)")
        except Exception as img_error:
            print(f"   ⚠️  Could not attach image: {img_error}")
            print(f"   Falling back to hosted URL")
            # Rebuild HTML without CID if image download fails
            html_content = build_email_html(person, use_cid=False)
            msg_alternative.detach(html_part)
            html_part = MIMEText(html_content, 'html', 'utf-8')
            msg_alternative.attach(html_part)
        
        print(f"\n   📡 Connecting to SMTP server {SMTP_SERVER}:{SMTP_PORT}...")
        # Connect to Gmail SMTP server
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        
        # Login
        print(f"   🔐 Logging in as {SENDER_EMAIL}...")
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        
        # Send email
        print(f"   📤 Sending email...")
        server.send_message(msg)
        server.quit()
        
        print(f"\n{'='*60}")
        print(f"✅ Birthday email sent successfully to {person['name']}!")
        print(f"{'='*60}\n")
        return True
        
    except Exception as e:
        print(f"\n{'='*60}")
        print(f"❌ Error sending email to {person['name']}: {e}")
        print(f"{'='*60}\n")
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
