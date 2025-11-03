#!/usr/bin/env python3
"""
Test script for Birthday Email Sender
Run this to test the email sending functionality without waiting for 1 AM
"""

import sys
from pathlib import Path

# Add the parent directory to the path
sys.path.insert(0, str(Path(__file__).parent))

from birthday_email_sender import (
    parse_birthdays_file,
    get_todays_birthdays,
    build_email_html,
    send_birthday_email,
    SENDER_EMAIL,
    SENDER_PASSWORD
)


def test_parse_birthdays():
    """Test parsing the birthdays file"""
    print("\n" + "="*60)
    print("TEST 1: Parsing birthdays.txt")
    print("="*60)
    
    try:
        people = parse_birthdays_file()
        print(f"✅ Successfully parsed {len(people)} entries")
        
        for i, person in enumerate(people[:3], 1):  # Show first 3
            print(f"\n{i}. {person.get('name', 'N/A')}")
            print(f"   Birthday: {person.get('birthday', 'N/A')}")
            print(f"   Department: {person.get('department', 'N/A')}")
            print(f"   Email: {person.get('email', 'Not set')}")
        
        if len(people) > 3:
            print(f"\n   ... and {len(people) - 3} more")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_todays_birthdays():
    """Test getting today's birthdays"""
    print("\n" + "="*60)
    print("TEST 2: Checking today's birthdays")
    print("="*60)
    
    try:
        from datetime import datetime
        today = datetime.now().strftime("%d %B %Y")
        print(f"Today's date: {today}")
        
        birthdays = get_todays_birthdays()
        
        if birthdays:
            print(f"\n✅ Found {len(birthdays)} birthday(s) today:")
            for person in birthdays:
                print(f"   - {person['name']} ({person.get('email', 'No email')})")
        else:
            print("\nℹ️  No birthdays today")
            print("\nTo test email sending, you can:")
            print("1. Temporarily change a birthday in birthdays.txt to today's date")
            print("2. Or use the manual test below")
        
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_html_generation():
    """Test HTML email generation"""
    print("\n" + "="*60)
    print("TEST 3: Testing HTML email generation")
    print("="*60)
    
    try:
        people = parse_birthdays_file()
        if not people:
            print("❌ No people found in birthdays.txt")
            return False
        
        test_person = people[0]
        print(f"Generating HTML for: {test_person['name']}")
        
        html = build_email_html(test_person)
        
        if '{{NAME}}' in html:
            print("❌ Name placeholder not replaced!")
            return False
        
        # Check if first name is in HTML (since we only use first name)
        first_name = test_person['name'].split()[0]
        if first_name in html:
            print(f"✅ HTML generated successfully")
            print(f"   Name replaced: {first_name}")
            print(f"   HTML length: {len(html)} characters")
            
            # Save to file for inspection
            output_file = Path(__file__).parent / "test_email_output.html"
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"   Saved to: {output_file}")
            print(f"   Open this file in a browser to preview the email")
            
            return True
        else:
            print("❌ Name not found in generated HTML")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_email_config():
    """Test email configuration"""
    print("\n" + "="*60)
    print("TEST 4: Checking email configuration")
    print("="*60)
    
    if SENDER_EMAIL == "your-email@gmail.com":
        print("❌ Email not configured!")
        print("   Please update SENDER_EMAIL in birthday_email_sender.py")
        return False
    
    if SENDER_PASSWORD == "your-app-password":
        print("❌ Password not configured!")
        print("   Please update SENDER_PASSWORD in birthday_email_sender.py")
        return False
    
    print(f"✅ Email configured: {SENDER_EMAIL}")
    print(f"✅ Password configured: {'*' * len(SENDER_PASSWORD)}")
    
    return True


def test_send_email_manual():
    """Manually test sending an email"""
    print("\n" + "="*60)
    print("TEST 5: Manual email sending test")
    print("="*60)
    
    people = parse_birthdays_file()
    people_with_email = [p for p in people if p.get('email')]
    
    if not people_with_email:
        print("❌ No people with email addresses found!")
        print("   Add email addresses to birthdays.txt to test")
        return False
    
    print(f"\nFound {len(people_with_email)} people with email addresses:")
    for i, person in enumerate(people_with_email, 1):
        print(f"{i}. {person['name']} - {person['email']}")
    
    print("\n⚠️  WARNING: This will send a real email!")
    choice = input("\nEnter number to send test email (or 'skip' to skip): ").strip()
    
    if choice.lower() == 'skip':
        print("Skipped manual email test")
        return True
    
    try:
        index = int(choice) - 1
        if 0 <= index < len(people_with_email):
            person = people_with_email[index]
            print(f"\nSending test email to {person['name']} ({person['email']})...")
            
            success = send_birthday_email(person)
            
            if success:
                print("\n✅ Test email sent successfully!")
                print(f"   Check {person['email']} inbox")
                return True
            else:
                print("\n❌ Failed to send test email")
                return False
        else:
            print("Invalid selection")
            return False
    except ValueError:
        print("Invalid input")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    print("\n" + "🎂" * 30)
    print("BIRTHDAY EMAIL SENDER - TEST SUITE")
    print("🎂" * 30)
    
    tests = [
        ("Parse Birthdays File", test_parse_birthdays),
        ("Check Today's Birthdays", test_todays_birthdays),
        ("Generate HTML Email", test_html_generation),
        ("Email Configuration", test_email_config),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\n❌ Test crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print(f"\nPassed: {passed}/{total}")
    
    # Ask about manual email test
    if passed == total:
        print("\n" + "="*60)
        print("All automated tests passed! 🎉")
        print("="*60)
        
        test_send_email_manual()
    
    print("\n" + "🎂" * 30)
    print("Tests completed!")
    print("🎂" * 30 + "\n")


if __name__ == "__main__":
    main()
