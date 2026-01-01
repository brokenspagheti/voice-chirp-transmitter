# 🎵 Voice & Text Transmitter

Transmit both text and voice through sound waves in a single unified interface!

## 🚀 Live Demo

**[Try it here!](https://brokenspagheti.github.io/voice-chirp-transmitter/)**

## ✨ Features

### 📡 Transmitter
- **📝 Text Input**: Type messages and transmit as audio frequencies
- **🎤 Voice Input**: Record 2-second voice clips and transmit audio samples
- **📊 Real-time Visualization**: See frequency spectrum during transmission
- **Progress Tracking**: Monitor transmission progress in real-time

### 👂 Receiver
- **Unified Listening**: Single receiver for both text and voice
- **📝 Text Display**: Decoded text messages shown in real-time
- **🔊 Voice Playback**: Play received voice messages with one click
- **Smart Detection**: Automatically distinguishes between text and voice data

### 🎨 Interface
- **Combined Layout**: Text and voice inputs side-by-side
- **Modern Dark Theme**: Gradient accents and smooth animations
- **Responsive Design**: Works on desktop and mobile
- **Clear Status Updates**: Real-time feedback for all operations

## 🛠️ How It Works

### Text Transmission
1. Each character is mapped to a unique frequency (1000 Hz + char code × 50 Hz)
2. Text is converted to a sequence of audio tones
3. Start signature → character tones → end signature
4. Receiver detects frequencies and decodes back to text

### Voice Transmission
1. Record 2 seconds of voice audio via microphone
2. Downsample to 8kHz for efficient transmission
3. Convert audio samples to frequencies (1000-6000 Hz range)
4. Voice marker → audio sample tones → end signature
5. Receiver collects samples and reconstructs audio for playback

### Smart Reception
- Detects voice marker (4000-5000 Hz) to switch modes
- Text mode: Decodes character frequencies
- Voice mode: Collects audio samples
- Both can be received in the same listening session

## 🎯 Usage Guide

### Transmit Text
1. Type your message in the "Text Message" box
2. Click "📡 Transmit Text"
3. Watch the frequency visualization
4. Wait for "✅ Text transmission complete!"

### Transmit Voice
1. Click "🎤 Record Voice (2s)"
2. Speak into your microphone for 2 seconds
3. Wait for "✅ Recording complete!"
4. Click "📡 Transmit Voice"
5. Watch transmission progress

### Receive Messages
1. Click "👂 Start Listening"
2. Play a transmission (from another device/tab)
3. Watch as text appears or voice samples are collected
4. Click "⏹ Stop Listening" when done
5. For voice: Click "▶ Play Voice" to hear the message

## 🔧 Technical Details

**Technologies:**
- Web Audio API (frequency generation & analysis)
- MediaRecorder API (voice recording)
- Canvas API (frequency visualization)
- Vanilla JavaScript (no frameworks!)

**Frequency Encoding:**
- Text: 1000 Hz base + (char code × 50 Hz)
- Voice: 1000 Hz base + (sample value × 20 Hz)
- Start signature: 2000, 2500, 3000 Hz
- Voice marker: 4000, 4500, 5000 Hz
- End signature: 3000, 2500, 2000 Hz

**Audio Processing:**
- Voice downsampling: 8 kHz sample rate
- Tone duration: 50ms (text), 20ms (voice)
- Transmission speed: ~20 chars/sec, ~50 samples/sec

## 🚀 Quick Start

### Run Locally
```bash
# Clone the repository
git clone https://github.com/brokenspagheti/voice-chirp-transmitter.git

# Navigate to directory
cd voice-chirp-transmitter

# Open in browser
open index.html

# Or use a local server:
python -m http.server 8000
# Visit: http://localhost:8000
```

### Test It Out
```bash
# Option 1: Two browser tabs
# Tab 1: Transmit a message
# Tab 2: Start listening, receive the message

# Option 2: Two devices
# Device 1: Transmit (speakers on)
# Device 2: Listen (microphone on)

# Best results: Use headphones to avoid feedback!
```

## 📝 Important Notes

- **Microphone Permission Required**: For recording and receiving
- **Quiet Environment**: Best results in low-noise settings
- **Headphones Recommended**: Prevents feedback loops
- **Voice Quality**: Transmitted voice is low quality (8kHz, demo mode)
- **Browser Support**: Chrome, Firefox, Safari (modern versions)

## 🎓 Perfect for Hackathons

This project is ideal for 16-hour hackathons:
- ✅ **Impressive Demo**: Visual + audio transmission
- ✅ **Unique Concept**: Data through sound waves
- ✅ **Works Immediately**: No complex setup
- ✅ **Easy to Extend**: Add features quickly
- ✅ **No Dependencies**: Pure vanilla JavaScript
- ✅ **Mobile Friendly**: Responsive design

## 🎯 Hackathon Demo Script

**Opening (30 sec):**
"We built a system that transmits both text and voice through sound waves - like a modem, but for any audio message!"

**Demo (2 min):**
1. Type "Hello Hackathon!" → Transmit → Show visualization
2. Record voice "This is amazing!" → Transmit → Show progress
3. Switch to receiver → Decode text → Play voice
4. "Both text and voice transmitted through speakers!"

**Technical (1 min):**
"Uses Web Audio API for frequency modulation. Text encoded as character frequencies, voice downsampled to 8kHz and transmitted as audio samples. Real-time visualization shows transmission."

**Impact (30 sec):**
"Potential uses: Offline communication, accessibility tools, educational demos, IoT data transfer without WiFi/Bluetooth."

## 🔮 Future Enhancements

- [ ] Audio compression (Opus codec)
- [ ] Error correction codes (Reed-Solomon)
- [ ] Multi-channel transmission (parallel frequencies)
- [ ] Real-time streaming (not just 2-second clips)
- [ ] Noise filtering and adaptive equalization
- [ ] Mobile app version (React Native)
- [ ] File transfer support
- [ ] Encryption for secure transmission

## 🐛 Known Limitations

- Voice transmission is demo mode (first 200 samples only)
- Low audio quality due to downsampling
- Sensitive to background noise
- Not suitable for real-time conversation
- Requires quiet environment for best results
- Transmission slower than modern wireless

## 🤝 Contributing

Pull requests welcome! Areas to improve:
- Better noise filtering
- Improved voice quality
- Error correction
- UI/UX enhancements
- Mobile optimization
- Documentation

## 📄 License

MIT License - free to use for hackathons and learning!

## 🙏 Credits

Inspired by:
- [CHIRP](https://chirp.hex.dance/) - Original text-to-sound transmission
- Dial-up modems - The OG audio data transmission
- Amateur radio - Frequency modulation techniques

## 🌟 Star This Repo!

If you use this for your hackathon or find it helpful, please star the repo! ⭐

---

**Built with ❤️ for the hackathon community**

**Questions?** Open an issue or reach out!

**Good luck with your hackathon!** 🚀