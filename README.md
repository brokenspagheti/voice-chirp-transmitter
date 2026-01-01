# 🎵 Voice & Text Transmitter

Transmit text and **EXACT voice audio** through sound waves!

## 🚀 Live Demo

**[Try it here!](https://brokenspagheti.github.io/voice-chirp-transmitter/)**

## ✨ Key Features

### 📡 Transmitter
- **📝 Text Mode**: Encode text as audio frequencies (like CHIRP)
- **🎤 Voice Mode**: Play your EXACT recorded audio through speakers
- **📊 Real-time Visualization**: See waveforms during transmission
- **Progress Tracking**: Monitor transmission status

### 👂 Receiver
- **📝 Text Decoding**: Decode frequency-encoded text messages
- **🎤 Voice Recording**: Capture the EXACT audio played through speakers
- **🔊 Perfect Playback**: Play back the exact voice you recorded
- **Smart Detection**: Automatically detects text vs voice transmissions

### 🎯 How It Works

**Text Transmission:**
1. Text → Frequency encoding (each character = unique frequency)
2. Play tones through speakers
3. Receiver decodes frequencies back to text

**Voice Transmission (EXACT AUDIO):**
1. Record 2 seconds of voice
2. Play voice marker (4000-5000 Hz)
3. **Play the EXACT recorded audio through speakers**
4. Play end signature
5. Receiver records everything it hears
6. Playback the EXACT audio captured

## 🎯 Usage Guide

### Transmit Text
1. Type your message
2. Click "📡 Transmit Text"
3. Text encoded as frequencies and played

### Transmit Voice (EXACT)
1. Click "🎤 Record Voice (2s)"
2. Speak into microphone
3. Click "📡 Transmit Voice"
4. **Your EXACT voice plays through speakers!**

### Receive Messages
1. Click "👂 Start Listening"
2. Receiver captures ALL audio (text frequencies + voice audio)
3. Click "⏹ Stop Listening"
4. **Text**: Decoded and displayed
5. **Voice**: Click "▶ Play Voice" to hear EXACT audio

## 🔧 Technical Details

### Text Transmission
- Frequency encoding: 1000 Hz + (char code × 50 Hz)
- Each character = 50ms tone
- Decoded via FFT analysis

### Voice Transmission (NEW!)
- **No encoding/compression** - plays EXACT audio
- Voice marker: 4000-5000 Hz (signals voice mode)
- Plays recorded audio directly through speakers
- Receiver records everything via MediaRecorder API
- Perfect audio quality (limited only by microphone/speakers)

### Why This Works
- **Transmitter**: Plays audio through speakers
- **Receiver**: Records audio through microphone
- **Result**: Exact audio transmission (like playing music to another device)

## 🎓 Perfect for Hackathons

**Demo Flow:**
1. **Text**: "Hello!" → Transmit → Receive → Show decoded text
2. **Voice**: Record "This is amazing!" → Transmit → Receive → Play EXACT audio
3. **Wow Factor**: "We transmitted voice through speakers with perfect quality!"

## 📝 Important Notes

### Advantages
✅ **Perfect Audio Quality** - No compression, no encoding
✅ **Simple & Reliable** - Just plays and records audio
✅ **Easy to Understand** - Like playing music to another device
✅ **Works Immediately** - No complex signal processing

### Limitations
⚠️ **Requires Quiet Environment** - Background noise will be recorded
⚠️ **Feedback Risk** - Use headphones or separate devices
⚠️ **Not Encrypted** - Anyone can record the audio
⚠️ **Distance Limited** - Depends on speaker/microphone quality

### Best Practices
- Use headphones to avoid feedback
- Test with two devices (not same device)
- Quiet room for best results
- Adjust speaker volume for optimal transmission

## 🚀 Quick Start

### Test Setup
```bash
# Option 1: Two Devices
Device 1: Transmit (speakers on, volume ~70%)
Device 2: Receive (microphone on, close to Device 1)

# Option 2: Two Browser Tabs (with headphones)
Tab 1: Transmit voice
Tab 2: Listen with headphones on
```

### Demo Script
```
1. Open site on Device 1
2. Record: "Hello from the hackathon!"
3. Click Transmit Voice
4. Open site on Device 2 (near Device 1)
5. Click Start Listening
6. Wait for transmission to complete
7. Click Stop Listening
8. Click Play Voice
9. Hear EXACT audio: "Hello from the hackathon!"
```

## 🔮 How It Actually Works

### Transmission
```javascript
// Record voice
MediaRecorder → Blob

// Transmit
Play voice marker (4000 Hz) → 
Play EXACT audio blob through speakers →
Play end signature (3000 Hz)
```

### Reception
```javascript
// Receive
MediaRecorder captures ALL audio from microphone →
Stores as Blob

// Playback
Audio element plays the exact Blob
```

### Why It's Clever
- **Text**: Uses frequency encoding (complex but cool)
- **Voice**: Uses direct audio playback (simple but effective)
- **Combined**: Best of both worlds!

## 🎯 Hackathon Pitch

**"We built a dual-mode audio transmission system:**
- **Text Mode**: Encodes messages as frequencies (like modems)
- **Voice Mode**: Transmits exact audio through speakers
- **Result**: Send both text and voice without WiFi/Bluetooth!"

**Technical Highlights:**
- Web Audio API for frequency generation
- MediaRecorder API for audio capture
- FFT analysis for text decoding
- Direct audio playback for voice

**Use Cases:**
- Offline communication
- Educational demos
- Accessibility tools
- IoT data transfer
- Emergency communication

## 🐛 Troubleshooting

**No audio received?**
- Check microphone permissions
- Increase speaker volume
- Reduce distance between devices
- Use quieter environment

**Feedback/echo?**
- Use headphones
- Use separate devices
- Reduce speaker volume

**Poor quality?**
- Check microphone quality
- Reduce background noise
- Adjust speaker volume
- Move devices closer

## 🤝 Contributing

Ideas to improve:
- Add noise cancellation
- Implement echo cancellation
- Add volume level indicators
- Support longer recordings
- Add file transfer mode

## 📄 License

MIT License - free for hackathons and learning!

## 🙏 Credits

- **Text Mode**: Inspired by [CHIRP](https://chirp.hex.dance/)
- **Voice Mode**: Direct audio transmission (our innovation!)
- **Combined**: Best of both worlds

---

## 🎉 The Magic

**Text**: Complex frequency encoding ✨
**Voice**: Simple audio playback 🎤
**Together**: Impressive hackathon project! 🚀

**Try it now and hear your EXACT voice transmitted through sound!**

---

**Built with ❤️ for the hackathon community**

**Questions?** Open an issue!
**Good luck!** 🚀