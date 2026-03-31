# Voice Module Fix Guide

##  ✅ Issues Fixed

### 1. **Backend Transcription - Lazy Gemini Initialization**
- **Issue**: Gemini model not initializing properly when API key is invalid
- **Fix**: Added `_ensure_initialized()` check in `transcribe_audio()` method
- **Location**: `backend/services/gemini_service.py:398`

### 2. **Improved Error Handling**
- **Added**: Better error logging for rate limiting, API key issues, timeouts
- **Enhancement**: Exponential backoff retry with longer waits (2s, 4s)
- **Benefit**: Better resilience to Gemini API quota issues

### 3. **Microphone Permission Handling (Frontend)**
- **Added**: Better error classification for microphone access failures
- **Distinguishes**: 
  - NotAllowedError → Browser permission needed
  - NotFoundError → No microphone found
  - SecurityError → Security/HTTPS issue
- **Location**: `frontend/src/hooks/useSpeech.ts`

### 4. **Speech Recognition Error Logging**
- **Added**: Detailed console logging for debugging speech issues
- **Logs Include**:
  - When listening starts in which language
  - Text captured with character count
  - Language fallback attempts
  - All error states

---

## 🔧 How Voice Works

### Frontend Flow:
1. **MicButton** → User clicks mic button
2. **useSpeechToText** → Web Speech API captures audio
3. **onSilence callback** → Transcript sent to backend API
4. **sendMessage** → Text processed and sent to AI

### Backend Flow:
1. **POST /ai/speech-to-text** → Receives audio file
2. **transcribe_audio()** → Calls Gemini API with audio
3. **Returns transcript** → Frontend displays & processes

---

## 🐛 Troubleshooting

### Issue: Microphone not being detected
**Solution**:
1. Check browser permissions: Settings → Privacy & Security → Microphone
2. Ensure HTTPS (required for microphone access)
3. Check system audio settings
4. Try different browser (Chrome/Edge/Firefox/Safari)

**Frontend Error Indicator**: Alert saying "No microphone found"

### Issue: Voice input not being captured
**Solution**:
1. Click mic button to start listening
2. Wait for "Listening..." state
3. Speak clearly after the listening indication
4. Pause to end sentence
5. System will automatically process

**Debug**: Check browser console for `[Speech]` logs

### Issue: Transcription empty or failing
**Symptoms**: Backend returns empty transcription
**Causes**:
1. **Gemini API key invalid** → Returns: API key issue detected
2. **Rate limited** → Automatically retries with exponential backoff
3. **Audio too short/silent** → Capture longer audio
4. **Unsupported format** → Try WAV or MP3

**Fix**: 
- For production: Add real Gemini API key to `.env`
- For development: Use browser's native Web Speech API (works offline)

---

## 📝 Testing Voice Module

### Manual Test Steps:
1. Open http://localhost:5173 (Frontend)
2. Click microphone button (bottom-right)
3. Say "English" to change language
4. Speak a complaint description
5. Wait for AI response and TTS playback

### Check Console for Logs:
```javascript
// Filter in browser console
console: [Speech] ...
```

### Backend Logs:
```bash
# Terminal running backend
tail -f backend.log | grep -i "speech\|transcri"
```

---

## 🚀 Key Improvements

| Component | Before | After |
|-----------|--------|-------|
| **Error Handling** | Generic errors | Detailed categorization |
| **Retry Logic** | Fixed 1s wait | Exponential backoff (2s, 4s) |
| **Logging** | Minimal | Comprehensive [Speech] tags |
| **Microphone Permission** | Silent failures | Clear error alerts |
| **API Key Issues** | Crashes | Graceful handling |
| **Initialization** | Eager (crashes early) | Lazy (safe) |

---

## 🔄 Fallbacks

### When Gemini Unavailable:
- **Ollama**: Not used for audio (text-only model)
- **Browser Web Speech API**: Still works for transcription
- **Manual Entry**: User can type instead

### When Microphone Fails:
- User can type text input instead
- Text-to-speech output still works
- All complaint features available

---

## 📡 API Endpoints

```
POST /ai/speech-to-text
├── Input: audio/video file
├── Processing: Gemini API transcription
└── Output: {"transcript": "..."}
```

---

## ⚙️ Configuration

### .env Requirements:
```
GEMINI_API_KEY=your_actual_key_here  # For production
DATABASE_URL=sqlite:///./cyberguard.db
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Browser Requirements:
- HTTPS (required for microphone access)
- Web Speech API support:
  - ✅ Chrome ✅ Edge ✅ Firefox ✅ Safari
  - ❌ Opera (partial) ❌ IE (no)

---

## 📞 Support

**Voice not working?**
1. Check browser console: `F12` → Console tab
2. Look for errors starting with `[Speech]`
3. Check microphone permission in browser settings
4. Try different browser
5. Check network tab for `/ai/speech-to-text` request

**Files Modified**:
- `backend/services/gemini_service.py`
- `frontend/src/hooks/useSpeech.ts`
- `.env` (configuration)

*Last Updated: March 31, 2026*
