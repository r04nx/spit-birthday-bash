#!/bin/bash

################################################################################
# SPIT Birthday Bash - Status Check Script
# Check the status of all services
################################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# PID files
FRONTEND_PID="$SCRIPT_DIR/.frontend.pid"
EMAIL_SENDER_PID="$SCRIPT_DIR/.email_sender.pid"

# Log files
FRONTEND_LOG="$SCRIPT_DIR/frontend.log"
EMAIL_SENDER_LOG="$SCRIPT_DIR/email_sender.log"
SETUP_LOG="$SCRIPT_DIR/setup.log"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        📊 SPIT Birthday Bash - Service Status 📊              ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

RUNNING_COUNT=0

# Check Frontend
echo -e "${BLUE}Frontend Service:${NC}"
if [ -f "$FRONTEND_PID" ]; then
    FPID=$(cat "$FRONTEND_PID")
    if kill -0 "$FPID" 2>/dev/null; then
        echo -e "  Status:   ${GREEN}● Running${NC}"
        echo -e "  PID:      $FPID"
        
        # Get process info
        CPU=$(ps -p "$FPID" -o %cpu= 2>/dev/null | xargs)
        MEM=$(ps -p "$FPID" -o %mem= 2>/dev/null | xargs)
        UPTIME=$(ps -p "$FPID" -o etime= 2>/dev/null | xargs)
        
        echo -e "  CPU:      ${CPU}%"
        echo -e "  Memory:   ${MEM}%"
        echo -e "  Uptime:   $UPTIME"
        
        # Check if port is listening
        if command -v lsof &> /dev/null; then
            PORT=$(lsof -ti:4173 2>/dev/null)
            if [ -n "$PORT" ]; then
                echo -e "  Port:     ${GREEN}4173 (listening)${NC}"
            fi
        fi
        
        RUNNING_COUNT=$((RUNNING_COUNT + 1))
    else
        echo -e "  Status:   ${RED}● Stopped${NC} (PID file exists but process not running)"
    fi
else
    echo -e "  Status:   ${RED}● Stopped${NC}"
fi

if [ -f "$FRONTEND_LOG" ]; then
    LOG_SIZE=$(du -h "$FRONTEND_LOG" | cut -f1)
    LOG_LINES=$(wc -l < "$FRONTEND_LOG")
    echo -e "  Log:      $FRONTEND_LOG (${LOG_SIZE}, ${LOG_LINES} lines)"
    
    # Show last error if any
    LAST_ERROR=$(grep -i "error" "$FRONTEND_LOG" | tail -1)
    if [ -n "$LAST_ERROR" ]; then
        echo -e "  ${YELLOW}Last Error: ${LAST_ERROR:0:60}...${NC}"
    fi
fi

echo ""

# Check Email Sender
echo -e "${BLUE}Email Sender Service:${NC}"
if [ -f "$EMAIL_SENDER_PID" ]; then
    EPID=$(cat "$EMAIL_SENDER_PID")
    if kill -0 "$EPID" 2>/dev/null; then
        echo -e "  Status:   ${GREEN}● Running${NC}"
        echo -e "  PID:      $EPID"
        
        # Get process info
        CPU=$(ps -p "$EPID" -o %cpu= 2>/dev/null | xargs)
        MEM=$(ps -p "$EPID" -o %mem= 2>/dev/null | xargs)
        UPTIME=$(ps -p "$EPID" -o etime= 2>/dev/null | xargs)
        
        echo -e "  CPU:      ${CPU}%"
        echo -e "  Memory:   ${MEM}%"
        echo -e "  Uptime:   $UPTIME"
        
        RUNNING_COUNT=$((RUNNING_COUNT + 1))
    else
        echo -e "  Status:   ${RED}● Stopped${NC} (PID file exists but process not running)"
    fi
else
    echo -e "  Status:   ${RED}● Stopped${NC}"
fi

if [ -f "$EMAIL_SENDER_LOG" ]; then
    LOG_SIZE=$(du -h "$EMAIL_SENDER_LOG" | cut -f1)
    LOG_LINES=$(wc -l < "$EMAIL_SENDER_LOG")
    echo -e "  Log:      $EMAIL_SENDER_LOG (${LOG_SIZE}, ${LOG_LINES} lines)"
    
    # Show last activity
    LAST_LINE=$(tail -1 "$EMAIL_SENDER_LOG" 2>/dev/null)
    if [ -n "$LAST_LINE" ]; then
        echo -e "  Last Log: ${LAST_LINE:0:60}..."
    fi
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $RUNNING_COUNT -eq 2 ]; then
    echo -e "${GREEN}✓ All services are running${NC} ($RUNNING_COUNT/2)"
elif [ $RUNNING_COUNT -eq 1 ]; then
    echo -e "${YELLOW}⚠ Some services are running${NC} ($RUNNING_COUNT/2)"
else
    echo -e "${RED}✗ No services are running${NC} ($RUNNING_COUNT/2)"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "💡 Quick Commands:"
echo "  Start services:   ./start.sh"
echo "  Stop services:    ./stop.sh"
echo "  View logs:        tail -f frontend.log"
echo "                    tail -f email_sender.log"
echo ""

# Check if accessible
if [ $RUNNING_COUNT -gt 0 ]; then
    echo "🌐 Access Points:"
    if command -v curl &> /dev/null; then
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:4173 2>/dev/null | grep -q "200\|301\|302"; then
            echo -e "  Local:    ${GREEN}http://localhost:4173${NC} ✓"
        else
            echo -e "  Local:    ${YELLOW}http://localhost:4173${NC} (not responding)"
        fi
    else
        echo "  Local:    http://localhost:4173"
    fi
    
    if command -v hostname &> /dev/null; then
        NETWORK_IP=$(hostname -I | awk '{print $1}')
        echo "  Network:  http://$NETWORK_IP:4173"
    fi
    echo ""
fi
