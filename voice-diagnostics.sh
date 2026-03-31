#!/bin/bash
# Voice Module Diagnostics Script
# Usage: bash voice-diagnos tics.sh

echo "🎤 VOICE MODULE DIAGNOSTICS"
echo "=================================="
echo ""

# Check 1: Backend running
echo "1. Checking Backend Service..."
if curl -s http://localhost:8000/ > /dev/null; then
    echo "   ✅ Backend is running on port 8000"
else
    echo "   ❌ Backend NOT running. Start with: cd backend && uvicorn main:app --reload"
fi

# Check 2: Frontend running
echo ""
echo "2. Checking Frontend Service..."
if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 5173"
else
    echo "   ❌ Frontend NOT running. Start with: cd frontend && npm run dev"
fi

# Check 3: Gemini service
echo ""
echo "3. Checking Gemini Service Initialization..."
python3 << 'EOF'
import sys
sys.path.insert(0, 'backend')
try:
    from services.gemini_service import gemini_service
    if gemini_service.model:
        print("   ✅ Gemini model initialized")
    else:
        print("   ⚠️  Gemini model not initialized (lazy load enabled)")
except Exception as e:
    print(f"   ❌ Gemini service error: {e}")
EOF

# Check 4: Ollama running
echo ""
echo "4. Checking Ollama Service..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "   ✅ Ollama is running on port 11434"
    MODELS=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "   ✅ Available model: $MODELS"
else
    echo "   ⚠️  Ollama NOT running. (Optional - only needed without Gemini API key)"
fi

# Check 5: Environment config
echo ""
echo "5. Checking Environment Configuration..."
if [ -f ".env" ]; then
    GEMINI_KEY=$(grep "GEMINI_API_KEY" .env | cut -d'=' -f2)
    if [ "$GEMINI_KEY" != "test_dummy_api_key_for_local_development" ]; then
        echo "   ✅ Gemini API key configured"
    else
        echo "   ⚠️  Using dummy Gemini API key (set real key for production)"
    fi
else
    echo "   ❌ .env file not found"
fi

# Check 6: File structure
echo ""
echo "6. Checking File Structure..."
FILES=(
    "frontend/src/hooks/useSpeech.ts"
    "backend/services/gemini_service.py"
    "backend/routes/ai.py"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file MISSING"
    fi
done

# Check 7: Backend logs
echo ""
echo "7. Recent Backend Errors..."
if [ -f "backend.log" ]; then
    grep -i "error\|exception" backend.log 2>/dev/null | tail -3 | sed 's/^/   /'|| echo "   ℹ️  No recent errors"
else
    echo "   ℹ️  No backend.log file"
fi

echo ""
echo "=================================="
echo "✅ DIAGNOSTICS COMPLETE"
echo ""
echo "Next Steps:"
echo "1. Ensure both Backend and Frontend are running"
echo "2. Open http://localhost:5173 in your browser"
echo "3. Check browser console (F12) for [Speech] logs"
echo "4. Try speaking after clicking mic button"
echo ""
