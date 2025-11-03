#!/bin/bash
# Quick start script for Birthday Email Sender

echo "🎂 Starting Birthday Email Sender..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed!"
    echo "Please install Python 3.7 or higher"
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if dependencies are installed
echo ""
echo "Checking dependencies..."

if ! python3 -c "import schedule" 2>/dev/null; then
    echo "⚠️  Missing dependencies. Installing..."
    pip3 install -r requirements.txt
else
    echo "✅ Dependencies installed"
fi

# Check if configuration is set
echo ""
echo "Checking configuration..."

if grep -q "your-email@gmail.com" birthday_email_sender.py; then
    echo "⚠️  WARNING: Email not configured!"
    echo "Please edit birthday_email_sender.py and update:"
    echo "  - SENDER_EMAIL"
    echo "  - SENDER_PASSWORD"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run the script
echo ""
echo "Starting Birthday Email Sender..."
echo "Press Ctrl+C to stop"
echo ""

python3 birthday_email_sender.py
