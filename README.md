# 🎵 Voice & Text Transmitter

Transmit data through sound waves - supports both text and voice input!

## 🚀 Live Demo

**[Try it here!](https://brokenspagheti.github.io/voice-chirp-transmitter/)**

## ✨ Features

- **📝 Text Mode**: Type messages and transmit as audio frequencies
- **🎤 Voice Mode**: Record voice and transmit audio samples
- **📊 Real-time Visualization**: See frequency spectrum during transmission
- **👂 Receiver**: Listen and decode transmitted messages
- **🎨 Modern UI**: Dark theme with smooth animations

## 🛠️ How It Works

### Text Transmission
1. Each character is mapped to a unique frequency
2. Text is converted to a sequence of audio tones
3. Tones are played through speakers
4. Receiver detects frequencies and decodes back to text

### Voice Transmission
1. Record 2 seconds of voice audio
2. Downsample to 8kHz for efficiency
3. Convert audio samples to frequencies
4. Transmit through speakers (demo mode)

## 🎯 Usage

### Text Mode
1. Click "📝 Text Mode"
2. Type your message
3. Click "📡 Transmit Text"
4. Watch the frequency visualization

### Voice Mode
1. Click "🎤 Voice Mode"
2. Click "🎤 Record Voice (2s)" and speak
3. Click "📡 Transmit Voice"
4. Audio samples transmitted as frequencies

### Receiving
1. Click "👂 Start Listening"
2. Play a transmission (from another device/tab)
3. Click "⏹ Stop Listening"
4. View received message

## 🔧 Technical Details

**Technologies:**
- Web Audio API
- MediaRecorder API
- Canvas API for visualization
- Vanilla JavaScript (no frameworks)

**Frequency Encoding:**
- Base frequency: 1000 Hz
- Character step: 50 Hz per character
- Tone duration: 50ms per character
- Start/End signatures for synchronization

## 🚀 Quick Start

### Run Locally
```bash
# Clone the repository
git clone https://github.com/brokenspagheti/voice-chirp-transmitter.git

# Navigate to directory
cd voice-chirp-transmitter

# Open in browser
open index.html
# or use a local server:
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Deploy to GitHub Pages
```bash
# Enable GitHub Pages in repository settings
# Select "main" branch as source
# Your site will be live at:
# https://yourusername.github.io/voice-chirp-transmitter/
```

## 📝 Notes

- **Best results in quiet environments**
- **Microphone permission required** for recording and receiving
- **Voice transmission is demo mode** - transmits first 100 samples
- **Works best with headphones** to avoid feedback loops

## 🎓 Hackathon Ready

This project is perfect for hackathons:
- ✅ Impressive visual demo
- ✅ Unique concept (audio data transmission)
- ✅ Works in 16 hours
- ✅ No external dependencies
- ✅ Easy to understand and extend

## 🔮 Future Enhancements

- [ ] Full voice transmission (not just demo)
- [ ] Audio compression (Opus codec)
- [ ] Error correction codes
- [ ] Multi-channel transmission
- [ ] Real-time streaming
- [ ] Mobile app version

## 📄 License

MIT License - feel free to use for your hackathon projects!

## 🤝 Contributing

Pull requests welcome! Feel free to:
- Improve transmission quality
- Add new features
- Fix bugs
- Enhance UI/UX

## 🙏 Credits

Inspired by [CHIRP](https://chirp.hex.dance/) - the original text-to-sound transmission project.

Built for hackathons and learning! 🚀

---

**Made with ❤️ for the hackathon community**