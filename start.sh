#!/bin/bash

################################################################################
# SPIT Birthday Bash - Production Start Script
# This script sets up and runs both frontend and backend services
################################################################################

set -e  # Exit on error (will be handled by our error function)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Log files
FRONTEND_LOG="$SCRIPT_DIR/frontend.log"
EMAIL_SENDER_LOG="$SCRIPT_DIR/email_sender.log"
SETUP_LOG="$SCRIPT_DIR/setup.log"

# PID files for process management
FRONTEND_PID="$SCRIPT_DIR/.frontend.pid"
EMAIL_SENDER_PID="$SCRIPT_DIR/.email_sender.pid"

################################################################################
# Helper Functions
################################################################################

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$SETUP_LOG"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "$SETUP_LOG"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1" >> "$SETUP_LOG"
}

log_info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1" >> "$SETUP_LOG"
}

error_exit() {
    log_error "$1"
    cleanup_on_error
    exit 1
}

cleanup_on_error() {
    log_warning "Cleaning up due to error..."
    # Kill any processes we started
    if [ -f "$FRONTEND_PID" ]; then
        kill $(cat "$FRONTEND_PID") 2>/dev/null || true
        rm -f "$FRONTEND_PID"
    fi
    if [ -f "$EMAIL_SENDER_PID" ]; then
        kill $(cat "$EMAIL_SENDER_PID") 2>/dev/null || true
        rm -f "$EMAIL_SENDER_PID"
    fi
}

check_command() {
    if command -v "$1" &> /dev/null; then
        log "✓ $1 is installed"
        return 0
    else
        log_warning "✗ $1 is not installed"
        return 1
    fi
}

################################################################################
# Cleanup Handler
################################################################################

cleanup() {
    log_info "Shutting down services..."
    
    if [ -f "$FRONTEND_PID" ]; then
        FPID=$(cat "$FRONTEND_PID")
        if kill -0 "$FPID" 2>/dev/null; then
            log "Stopping frontend (PID: $FPID)..."
            kill "$FPID" 2>/dev/null || true
            sleep 2
            kill -9 "$FPID" 2>/dev/null || true
        fi
        rm -f "$FRONTEND_PID"
    fi
    
    if [ -f "$EMAIL_SENDER_PID" ]; then
        EPID=$(cat "$EMAIL_SENDER_PID")
        if kill -0 "$EPID" 2>/dev/null; then
            log "Stopping email sender (PID: $EPID)..."
            kill "$EPID" 2>/dev/null || true
            sleep 2
            kill -9 "$EPID" 2>/dev/null || true
        fi
        rm -f "$EMAIL_SENDER_PID"
    fi
    
    log "Services stopped. Goodbye!"
    exit 0
}

trap cleanup SIGINT SIGTERM

################################################################################
# Banner
################################################################################

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        🎂 SPIT Birthday Bash - Production Startup 🎂          ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Initialize log files
> "$SETUP_LOG"
> "$FRONTEND_LOG"
> "$EMAIL_SENDER_LOG"

log "Starting setup process..."
log "Working directory: $SCRIPT_DIR"
log "Logs will be saved to:"
log "  - Setup: $SETUP_LOG"
log "  - Frontend: $FRONTEND_LOG"
log "  - Email Sender: $EMAIL_SENDER_LOG"
echo ""

################################################################################
# System Check
################################################################################

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "STEP 1: System Requirements Check"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for required commands
MISSING_DEPS=()

if ! check_command "node"; then
    MISSING_DEPS+=("node")
fi

if ! check_command "python3"; then
    MISSING_DEPS+=("python3")
fi

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    log_error "Missing required dependencies: ${MISSING_DEPS[*]}"
    log_info "Please install the missing dependencies and try again."
    exit 1
fi

echo ""

################################################################################
# Node.js & NPM Setup
################################################################################

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "STEP 2: Node.js & Package Manager Setup"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

NODE_VERSION=$(node --version 2>/dev/null || echo "not installed")
log "Node.js version: $NODE_VERSION"

NPM_VERSION=$(npm --version 2>/dev/null || echo "not installed")
log "npm version: $NPM_VERSION"

# Install pnpm if not present
if ! check_command "pnpm"; then
    log "Installing pnpm..."
    if npm install -g pnpm >> "$SETUP_LOG" 2>&1; then
        log "✓ pnpm installed successfully"
    else
        log_warning "Failed to install pnpm globally, trying with --force..."
        npm install -g pnpm --force >> "$SETUP_LOG" 2>&1 || {
            log_error "Failed to install pnpm"
            log_info "Falling back to npm for package management"
            USE_NPM=true
        }
    fi
else
    PNPM_VERSION=$(pnpm --version)
    log "✓ pnpm version: $PNPM_VERSION"
fi

echo ""

################################################################################
# Frontend Setup
################################################################################

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "STEP 3: Frontend Setup & Build"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    error_exit "package.json not found! Are you in the correct directory?"
fi

# Install dependencies
log "Installing frontend dependencies..."
if [ "$USE_NPM" = true ]; then
    if npm install >> "$SETUP_LOG" 2>&1; then
        log "✓ Frontend dependencies installed (npm)"
    else
        error_exit "Failed to install frontend dependencies with npm"
    fi
else
    if pnpm install >> "$SETUP_LOG" 2>&1; then
        log "✓ Frontend dependencies installed (pnpm)"
    else
        log_warning "pnpm install failed, falling back to npm..."
        if npm install >> "$SETUP_LOG" 2>&1; then
            log "✓ Frontend dependencies installed (npm)"
            USE_NPM=true
        else
            error_exit "Failed to install frontend dependencies"
        fi
    fi
fi

# Build frontend
log "Building frontend for production..."
if [ "$USE_NPM" = true ]; then
    if npm run build >> "$SETUP_LOG" 2>&1; then
        log "✓ Frontend built successfully"
    else
        error_exit "Frontend build failed. Check $SETUP_LOG for details."
    fi
else
    if pnpm build >> "$SETUP_LOG" 2>&1; then
        log "✓ Frontend built successfully"
    else
        log_warning "pnpm build failed, trying with npm..."
        if npm run build >> "$SETUP_LOG" 2>&1; then
            log "✓ Frontend built successfully"
        else
            error_exit "Frontend build failed. Check $SETUP_LOG for details."
        fi
    fi
fi

# Check if build directory exists
if [ ! -d "dist" ] && [ ! -d "build" ]; then
    error_exit "Build directory not found! Build may have failed."
fi

echo ""

################################################################################
# Python Setup
################################################################################

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "STEP 4: Python Environment Setup"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PYTHON_VERSION=$(python3 --version 2>/dev/null || echo "not installed")
log "Python version: $PYTHON_VERSION"

# Check if venv module is available
if ! python3 -m venv --help &> /dev/null; then
    log_warning "python3-venv not found, attempting to install..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update >> "$SETUP_LOG" 2>&1
        sudo apt-get install -y python3-venv >> "$SETUP_LOG" 2>&1 || {
            log_error "Failed to install python3-venv"
            log_info "Please install python3-venv manually: sudo apt-get install python3-venv"
            exit 1
        }
    else
        log_error "Cannot install python3-venv automatically on this system"
        log_info "Please install python3-venv manually"
        exit 1
    fi
fi

# Create virtual environment if it doesn't exist
VENV_DIR="$SCRIPT_DIR/venv"
if [ ! -d "$VENV_DIR" ]; then
    log "Creating Python virtual environment..."
    if python3 -m venv "$VENV_DIR" >> "$SETUP_LOG" 2>&1; then
        log "✓ Virtual environment created"
    else
        error_exit "Failed to create virtual environment"
    fi
else
    log "✓ Virtual environment already exists"
fi

# Activate virtual environment
log "Activating virtual environment..."
source "$VENV_DIR/bin/activate" || error_exit "Failed to activate virtual environment"
log "✓ Virtual environment activated"

# Upgrade pip
log "Upgrading pip..."
pip install --upgrade pip >> "$SETUP_LOG" 2>&1 || log_warning "Failed to upgrade pip"

# Install Python dependencies
if [ -f "requirements.txt" ]; then
    log "Installing Python dependencies..."
    if pip install -r requirements.txt >> "$SETUP_LOG" 2>&1; then
        log "✓ Python dependencies installed"
    else
        error_exit "Failed to install Python dependencies"
    fi
else
    log_warning "requirements.txt not found, skipping Python dependencies"
fi

echo ""

################################################################################
# Configuration Check
################################################################################

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "STEP 5: Configuration Validation"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if email sender is configured
if [ -f "birthday_email_sender.py" ]; then
    if grep -q "your-email@gmail.com" birthday_email_sender.py; then
        log_warning "Email sender not configured!"
        log_warning "Please update SENDER_EMAIL and SENDER_PASSWORD in birthday_email_sender.py"
        log_info "Email sender will start but won't send emails until configured"
    else
        log "✓ Email sender appears to be configured"
    fi
else
    log_warning "birthday_email_sender.py not found"
fi

# Check if birthdays.txt exists
if [ -f "public/birthdays.txt" ]; then
    BIRTHDAY_COUNT=$(grep -c "Name:" public/birthdays.txt || echo "0")
    log "✓ Found $BIRTHDAY_COUNT birthday entries"
else
    log_warning "public/birthdays.txt not found"
fi

echo ""

################################################################################
# Start Services
################################################################################

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "STEP 6: Starting Services"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start Frontend
log "Starting frontend production server..."
if [ "$USE_NPM" = true ]; then
    nohup npm run preview >> "$FRONTEND_LOG" 2>&1 &
else
    nohup pnpm preview >> "$FRONTEND_LOG" 2>&1 &
fi
FRONTEND_PID_NUM=$!
echo $FRONTEND_PID_NUM > "$FRONTEND_PID"

# Wait a moment and check if frontend started
sleep 3
if kill -0 $FRONTEND_PID_NUM 2>/dev/null; then
    log "✓ Frontend started (PID: $FRONTEND_PID_NUM)"
    log "  Log file: $FRONTEND_LOG"
else
    log_error "Frontend failed to start"
    cat "$FRONTEND_LOG"
    error_exit "Frontend startup failed"
fi

# Start Email Sender
if [ -f "birthday_email_sender.py" ]; then
    log "Starting birthday email sender..."
    nohup python birthday_email_sender.py >> "$EMAIL_SENDER_LOG" 2>&1 &
    EMAIL_SENDER_PID_NUM=$!
    echo $EMAIL_SENDER_PID_NUM > "$EMAIL_SENDER_PID"
    
    # Wait a moment and check if email sender started
    sleep 2
    if kill -0 $EMAIL_SENDER_PID_NUM 2>/dev/null; then
        log "✓ Email sender started (PID: $EMAIL_SENDER_PID_NUM)"
        log "  Log file: $EMAIL_SENDER_LOG"
    else
        log_error "Email sender failed to start"
        cat "$EMAIL_SENDER_LOG"
        log_warning "Continuing without email sender..."
    fi
else
    log_warning "birthday_email_sender.py not found, skipping email sender"
fi

echo ""

################################################################################
# Success Summary
################################################################################

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "✅ SPIT Birthday Bash Started Successfully!"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📊 Service Status:"
echo "  Frontend:      Running (PID: $FRONTEND_PID_NUM)"
if [ -f "$EMAIL_SENDER_PID" ]; then
    echo "  Email Sender:  Running (PID: $EMAIL_SENDER_PID_NUM)"
fi
echo ""
echo "📝 Log Files:"
echo "  Frontend:      $FRONTEND_LOG"
echo "  Email Sender:  $EMAIL_SENDER_LOG"
echo "  Setup:         $SETUP_LOG"
echo ""
echo "🌐 Access the application:"
echo "  Local:         http://localhost:4173"
echo "  Network:       http://$(hostname -I | awk '{print $1}'):4173"
echo ""
echo "📋 Useful Commands:"
echo "  View frontend logs:     tail -f $FRONTEND_LOG"
echo "  View email sender logs: tail -f $EMAIL_SENDER_LOG"
echo "  Stop services:          Press Ctrl+C"
echo ""
echo "⚠️  Press Ctrl+C to stop all services"
echo ""

################################################################################
# Monitor Services
################################################################################

log "Monitoring services... (Press Ctrl+C to stop)"

# Keep script running and monitor processes
while true; do
    sleep 10
    
    # Check frontend
    if [ -f "$FRONTEND_PID" ]; then
        FPID=$(cat "$FRONTEND_PID")
        if ! kill -0 "$FPID" 2>/dev/null; then
            log_error "Frontend process died! Check $FRONTEND_LOG"
            log_info "Attempting to restart frontend..."
            
            if [ "$USE_NPM" = true ]; then
                nohup npm run preview >> "$FRONTEND_LOG" 2>&1 &
            else
                nohup pnpm preview >> "$FRONTEND_LOG" 2>&1 &
            fi
            echo $! > "$FRONTEND_PID"
            log "Frontend restarted (PID: $(cat $FRONTEND_PID))"
        fi
    fi
    
    # Check email sender
    if [ -f "$EMAIL_SENDER_PID" ]; then
        EPID=$(cat "$EMAIL_SENDER_PID")
        if ! kill -0 "$EPID" 2>/dev/null; then
            log_error "Email sender process died! Check $EMAIL_SENDER_LOG"
            log_info "Attempting to restart email sender..."
            
            nohup python birthday_email_sender.py >> "$EMAIL_SENDER_LOG" 2>&1 &
            echo $! > "$EMAIL_SENDER_PID"
            log "Email sender restarted (PID: $(cat $EMAIL_SENDER_PID))"
        fi
    fi
done
