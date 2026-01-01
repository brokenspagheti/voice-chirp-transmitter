// Voice & Text Transmitter App
class AudioTransmitter {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.isListening = false;
    this.isTransmitting = false;
    this.currentMode = 'text'; // 'text' or 'voice'
    this.recordedAudio = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    
    // Frequency encoding settings
    this.baseFreq = 1000; // Base frequency in Hz
    this.freqStep = 50;   // Frequency step between characters
    this.toneDuration = 0.05; // Duration of each tone in seconds
    
    // Signatures
    this.startSignature = [2000, 2500, 3000]; // Start transmission
    this.endSignature = [3000, 2500, 2000];   // End transmission
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupCanvas();
    this.initAudioContext();
  }

  setupEventListeners() {
    // Mode switching
    document.getElementById('text-mode-btn').addEventListener('click', () => this.switchMode('text'));
    document.getElementById('voice-mode-btn').addEventListener('click', () => this.switchMode('voice'));
    
    // Text mode
    document.getElementById('transmit-text-btn').addEventListener('click', () => this.transmitText());
    
    // Voice mode
    document.getElementById('record-btn').addEventListener('click', () => this.recordVoice());
    document.getElementById('transmit-voice-btn').addEventListener('click', () => this.transmitVoice());
    
    // Receiver
    document.getElementById('listen-btn').addEventListener('click', () => this.startListening());
    document.getElementById('stop-listen-btn').addEventListener('click', () => this.stopListening());
    document.getElementById('play-voice-btn').addEventListener('click', () => this.playReceivedVoice());
  }

  setupCanvas() {
    this.canvas = document.getElementById('frequency-canvas');
    this.canvasCtx = this.canvas.getContext('2d');
    this.canvas.width = 800;
    this.canvas.height = 200;
  }

  initAudioContext() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
  }

  switchMode(mode) {
    this.currentMode = mode;
    
    // Update UI
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.mode-panel').forEach(panel => panel.classList.remove('active'));
    
    if (mode === 'text') {
      document.getElementById('text-mode-btn').classList.add('active');
      document.getElementById('text-mode').classList.add('active');
    } else {
      document.getElementById('voice-mode-btn').classList.add('active');
      document.getElementById('voice-mode').classList.add('active');
    }
  }

  // TEXT MODE FUNCTIONS
  async transmitText() {
    const text = document.getElementById('text-input').value.trim();
    
    if (!text) {
      this.showStatus('Please enter some text to transmit', 'error');
      return;
    }

    this.isTransmitting = true;
    this.showStatus('Transmitting text...', 'active');
    
    try {
      // Play start signature
      await this.playSignature(this.startSignature);
      
      // Convert text to frequencies and play
      for (let char of text) {
        const freq = this.charToFrequency(char);
        await this.playTone(freq, this.toneDuration);
        this.visualizeFrequency(freq);
      }
      
      // Play end signature
      await this.playSignature(this.endSignature);
      
      this.showStatus('Text transmission complete!', 'active');
    } catch (error) {
      this.showStatus('Transmission failed: ' + error.message, 'error');
    } finally {
      this.isTransmitting = false;
    }
  }

  charToFrequency(char) {
    const charCode = char.charCodeAt(0);
    return this.baseFreq + (charCode * this.freqStep);
  }

  frequencyToChar(freq) {
    const charCode = Math.round((freq - this.baseFreq) / this.freqStep);
    return String.fromCharCode(charCode);
  }

  async playTone(frequency, duration) {
    return new Promise((resolve) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Envelope to avoid clicks
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
      
      setTimeout(resolve, duration * 1000);
    });
  }

  async playSignature(frequencies) {
    for (let freq of frequencies) {
      await this.playTone(freq, 0.1);
    }
  }

  // VOICE MODE FUNCTIONS
  async recordVoice() {
    const recordBtn = document.getElementById('record-btn');
    const statusDiv = document.getElementById('recording-status');
    const transmitBtn = document.getElementById('transmit-voice-btn');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
      
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.recordedAudio = audioBlob;
        
        statusDiv.textContent = 'Recording complete! Ready to transmit.';
        statusDiv.classList.add('active');
        transmitBtn.disabled = false;
        recordBtn.classList.remove('recording');
        recordBtn.textContent = '🎤 Record Voice (2s)';
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      this.mediaRecorder.start();
      recordBtn.classList.add('recording');
      recordBtn.textContent = '🔴 Recording...';
      statusDiv.textContent = 'Recording... (2 seconds)';
      statusDiv.classList.add('active');
      
      // Stop after 2 seconds
      setTimeout(() => {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.stop();
        }
      }, 2000);
      
    } catch (error) {
      statusDiv.textContent = 'Microphone access denied!';
      statusDiv.classList.add('error');
      console.error('Error accessing microphone:', error);
    }
  }

  async transmitVoice() {
    if (!this.recordedAudio) {
      this.showStatus('Please record audio first!', 'error');
      return;
    }

    this.isTransmitting = true;
    this.showStatus('Transmitting voice... (this is a demo)', 'active');
    
    try {
      // Convert audio blob to array buffer
      const arrayBuffer = await this.recordedAudio.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Downsample and encode (simplified for demo)
      const samples = this.downsampleAudio(audioBuffer, 8000);
      
      // Play start signature
      await this.playSignature(this.startSignature);
      
      // Transmit audio samples as frequencies (demo - first 100 samples)
      const sampleCount = Math.min(samples.length, 100);
      for (let i = 0; i < sampleCount; i++) {
        const sample = samples[i];
        const freq = this.sampleToFrequency(sample);
        await this.playTone(freq, 0.02);
        this.visualizeFrequency(freq);
        
        if (i % 10 === 0) {
          this.showStatus(`Transmitting... ${Math.round((i/sampleCount)*100)}%`, 'active');
        }
      }
      
      // Play end signature
      await this.playSignature(this.endSignature);
      
      this.showStatus('Voice transmission complete!', 'active');
    } catch (error) {
      this.showStatus('Transmission failed: ' + error.message, 'error');
      console.error('Transmission error:', error);
    } finally {
      this.isTransmitting = false;
    }
  }

  downsampleAudio(audioBuffer, targetSampleRate) {
    const originalSampleRate = audioBuffer.sampleRate;
    const channelData = audioBuffer.getChannelData(0);
    const ratio = originalSampleRate / targetSampleRate;
    const newLength = Math.floor(channelData.length / ratio);
    const result = new Float32Array(newLength);
    
    for (let i = 0; i < newLength; i++) {
      const index = Math.floor(i * ratio);
      result[i] = channelData[index];
    }
    
    return result;
  }

  sampleToFrequency(sample) {
    // Convert audio sample (-1 to 1) to frequency
    const normalized = (sample + 1) / 2; // 0 to 1
    const value = Math.floor(normalized * 255); // 0 to 255
    return this.baseFreq + (value * 20); // Map to frequency range
  }

  // RECEIVER FUNCTIONS
  async startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(stream);
      
      source.connect(this.analyser);
      
      this.isListening = true;
      this.receivedData = [];
      
      document.getElementById('listen-btn').disabled = true;
      document.getElementById('stop-listen-btn').disabled = false;
      
      this.showStatus('Listening for transmissions...', 'active');
      this.detectFrequencies();
      
    } catch (error) {
      this.showStatus('Microphone access denied!', 'error');
      console.error('Error accessing microphone:', error);
    }
  }

  stopListening() {
    this.isListening = false;
    
    document.getElementById('listen-btn').disabled = false;
    document.getElementById('stop-listen-btn').disabled = true;
    
    this.showStatus('Stopped listening', '');
    
    // Process received data
    if (this.receivedData && this.receivedData.length > 0) {
      this.displayReceivedText(this.receivedData.join(''));
    }
  }

  detectFrequencies() {
    if (!this.isListening) return;
    
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    this.analyser.getByteFrequencyData(dataArray);
    
    // Find dominant frequency
    const dominantFreq = this.getDominantFrequency(dataArray);
    
    if (dominantFreq > 0) {
      // Try to decode as character
      if (dominantFreq >= this.baseFreq && dominantFreq < this.baseFreq + (256 * this.freqStep)) {
        const char = this.frequencyToChar(dominantFreq);
        if (char && char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
          this.receivedData.push(char);
        }
      }
      
      this.visualizeFrequency(dominantFreq);
    }
    
    requestAnimationFrame(() => this.detectFrequencies());
  }

  getDominantFrequency(dataArray) {
    let maxValue = 0;
    let maxIndex = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }
    
    if (maxValue < 50) return 0; // Threshold
    
    const nyquist = this.audioContext.sampleRate / 2;
    const frequency = (maxIndex * nyquist) / dataArray.length;
    
    return frequency;
  }

  displayReceivedText(text) {
    const receivedDiv = document.getElementById('received-text');
    receivedDiv.innerHTML = '';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = text;
    
    receivedDiv.appendChild(messageDiv);
  }

  playReceivedVoice() {
    // Placeholder for voice playback
    this.showStatus('Voice playback not yet implemented', 'error');
  }

  // VISUALIZATION
  visualizeFrequency(frequency) {
    const ctx = this.canvasCtx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw frequency bar
    const barHeight = (frequency / 10000) * height;
    const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
    gradient.addColorStop(0, '#00ffaa');
    gradient.addColorStop(0.5, '#3185ff');
    gradient.addColorStop(1, '#ff41b4');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(width / 2 - 50, height - barHeight, 100, barHeight);
    
    // Draw frequency text
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(frequency)} Hz`, width / 2, 30);
  }

  showStatus(message, type = '') {
    const statusDiv = document.getElementById('transmission-status');
    statusDiv.textContent = message;
    statusDiv.className = 'status-text';
    
    if (type) {
      statusDiv.classList.add(type);
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AudioTransmitter();
});