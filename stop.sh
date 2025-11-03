#!/bin/bash

################################################################################
# SPIT Birthday Bash - Stop Script
# Gracefully stops all running services
################################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# PID files
FRONTEND_PID="$SCRIPT_DIR/.frontend.pid"
EMAIL_SENDER_PID="$SCRIPT_DIR/.email_sender.pid"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        🛑 SPIT Birthday Bash - Stopping Services 🛑           ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

STOPPED_COUNT=0

# Stop Frontend
if [ -f "$FRONTEND_PID" ]; then
    FPID=$(cat "$FRONTEND_PID")
    if kill -0 "$FPID" 2>/dev/null; then
        log "Stopping frontend (PID: $FPID)..."
        kill "$FPID" 2>/dev/null
        sleep 2
        
        # Force kill if still running
        if kill -0 "$FPID" 2>/dev/null; then
            log_warning "Frontend didn't stop gracefully, forcing..."
            kill -9 "$FPID" 2>/dev/null
        fi
        
        log "✓ Frontend stopped"
        STOPPED_COUNT=$((STOPPED_COUNT + 1))
    else
        log_warning "Frontend process not running"
    fi
    rm -f "$FRONTEND_PID"
else
    log_warning "Frontend PID file not found"
fi

# Stop Email Sender
if [ -f "$EMAIL_SENDER_PID" ]; then
    EPID=$(cat "$EMAIL_SENDER_PID")
    if kill -0 "$EPID" 2>/dev/null; then
        log "Stopping email sender (PID: $EPID)..."
        kill "$EPID" 2>/dev/null
        sleep 2
        
        # Force kill if still running
        if kill -0 "$EPID" 2>/dev/null; then
            log_warning "Email sender didn't stop gracefully, forcing..."
            kill -9 "$EPID" 2>/dev/null
        fi
        
        log "✓ Email sender stopped"
        STOPPED_COUNT=$((STOPPED_COUNT + 1))
    else
        log_warning "Email sender process not running"
    fi
    rm -f "$EMAIL_SENDER_PID"
else
    log_warning "Email sender PID file not found"
fi

# Also try to kill any remaining processes by name
log "Checking for any remaining processes..."

# Kill any remaining node processes running preview
PREVIEW_PIDS=$(pgrep -f "preview" 2>/dev/null || true)
if [ -n "$PREVIEW_PIDS" ]; then
    log_warning "Found remaining preview processes, stopping..."
    echo "$PREVIEW_PIDS" | xargs kill 2>/dev/null || true
fi

# Kill any remaining python birthday sender processes
SENDER_PIDS=$(pgrep -f "birthday_email_sender.py" 2>/dev/null || true)
if [ -n "$SENDER_PIDS" ]; then
    log_warning "Found remaining email sender processes, stopping..."
    echo "$SENDER_PIDS" | xargs kill 2>/dev/null || true
fi

echo ""
if [ $STOPPED_COUNT -gt 0 ]; then
    log "✅ Stopped $STOPPED_COUNT service(s) successfully"
else
    log_warning "No services were running"
fi

echo ""
log "All services stopped. Goodbye! 👋"
echo ""
