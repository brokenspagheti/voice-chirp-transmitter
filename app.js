// Voice & Text Transmitter App
class AudioTransmitter {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.isListening = false;
    this.isTransmitting = false;
    this.recordedAudio = null;
    this.receivedVoiceData = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    
    // Frequency encoding settings
    this.baseFreq = 1000; // Base frequency in Hz
    this.freqStep = 50;   // Frequency step between characters
    this.toneDuration = 0.05; // Duration of each tone in seconds
    
    // Signatures
    this.startSignature = [2000, 2500, 3000]; // Start transmission
    this.endSignature = [3000, 2500, 2000];   // End transmission
    this.voiceMarker = [4000, 4500, 5000];    // Voice data marker
    
    // Reception
    this.receivedTextData = [];
    this.receivedVoiceChunks = [];
    this.isReceivingVoice = false;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupCanvas();
    this.initAudioContext();
  }

  setupEventListeners() {
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
    this.drawIdleVisualization();
  }

  initAudioContext() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
  }

  // TEXT MODE FUNCTIONS
  async transmitText() {
    const text = document.getElementById('text-input').value.trim();
    
    if (!text) {
      this.showTransmissionStatus('Please enter some text to transmit', 'error');
      return;
    }

    this.isTransmitting = true;
    this.showTransmissionStatus('Transmitting text...', 'active');
    
    try {
      // Play start signature
      await this.playSignature(this.startSignature);
      
      // Convert text to frequencies and play
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const freq = this.charToFrequency(char);
        await this.playTone(freq, this.toneDuration);
        this.visualizeFrequency(freq);
        
        // Update progress
        const progress = Math.round(((i + 1) / text.length) * 100);
        this.showTransmissionStatus(`Transmitting text... ${progress}%`, 'active');
      }
      
      // Play end signature
      await this.playSignature(this.endSignature);
      
      this.showTransmissionStatus('✅ Text transmission complete!', 'active');
      setTimeout(() => this.showTransmissionStatus('', ''), 3000);
    } catch (error) {
      this.showTransmissionStatus('❌ Transmission failed: ' + error.message, 'error');
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
        
        statusDiv.textContent = '✅ Recording complete! Ready to transmit.';
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
      statusDiv.textContent = '❌ Microphone access denied!';
      statusDiv.classList.add('error');
      console.error('Error accessing microphone:', error);
    }
  }

  async transmitVoice() {
    if (!this.recordedAudio) {
      this.showTransmissionStatus('Please record audio first!', 'error');
      return;
    }

    this.isTransmitting = true;
    this.showTransmissionStatus('Transmitting voice...', 'active');
    
    try {
      // Convert audio blob to array buffer
      const arrayBuffer = await this.recordedAudio.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Downsample and encode
      const samples = this.downsampleAudio(audioBuffer, 8000);
      
      // Play voice marker
      await this.playSignature(this.voiceMarker);
      
      // Transmit audio samples as frequencies (first 200 samples for demo)
      const sampleCount = Math.min(samples.length, 200);
      for (let i = 0; i < sampleCount; i++) {
        const sample = samples[i];
        const freq = this.sampleToFrequency(sample);
        await this.playTone(freq, 0.02);
        this.visualizeFrequency(freq);
        
        if (i % 20 === 0) {
          const progress = Math.round((i/sampleCount)*100);
          this.showTransmissionStatus(`Transmitting voice... ${progress}%`, 'active');
        }
      }
      
      // Play end signature
      await this.playSignature(this.endSignature);
      
      this.showTransmissionStatus('✅ Voice transmission complete!', 'active');
      setTimeout(() => this.showTransmissionStatus('', ''), 3000);
    } catch (error) {
      this.showTransmissionStatus('❌ Transmission failed: ' + error.message, 'error');
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

  frequencyToSample(freq) {
    const value = (freq - this.baseFreq) / 20;
    const normalized = value / 255;
    return (normalized * 2) - 1; // Back to -1 to 1
  }

  // RECEIVER FUNCTIONS
  async startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(stream);
      
      source.connect(this.analyser);
      
      this.isListening = true;
      this.receivedTextData = [];
      this.receivedVoiceChunks = [];
      this.isReceivingVoice = false;
      
      document.getElementById('listen-btn').disabled = true;
      document.getElementById('stop-listen-btn').disabled = false;
      
      this.showListeningStatus('👂 Listening for transmissions...', 'active');
      this.detectFrequencies();
      
    } catch (error) {
      this.showListeningStatus('❌ Microphone access denied!', 'error');
      console.error('Error accessing microphone:', error);
    }
  }

  stopListening() {
    this.isListening = false;
    
    document.getElementById('listen-btn').disabled = false;
    document.getElementById('stop-listen-btn').disabled = true;
    
    this.showListeningStatus('⏹ Stopped listening', '');
    
    // Process received data
    if (this.receivedTextData.length > 0) {
      this.displayReceivedText(this.receivedTextData.join(''));
    }
    
    if (this.receivedVoiceChunks.length > 0) {
      this.displayReceivedVoice();
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
      // Check for voice marker
      if (this.isNearFrequency(dominantFreq, 4000, 100)) {
        this.isReceivingVoice = true;
        this.showListeningStatus('🎤 Receiving voice data...', 'active');
      }
      
      // Decode based on mode
      if (this.isReceivingVoice) {
        // Voice data
        if (dominantFreq >= this.baseFreq && dominantFreq < this.baseFreq + (256 * 20)) {
          const sample = this.frequencyToSample(dominantFreq);
          this.receivedVoiceChunks.push(sample);
        }
      } else {
        // Text data
        if (dominantFreq >= this.baseFreq && dominantFreq < this.baseFreq + (256 * this.freqStep)) {
          const char = this.frequencyToChar(dominantFreq);
          if (char && char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
            this.receivedTextData.push(char);
            this.showListeningStatus(`📝 Receiving text... (${this.receivedTextData.length} chars)`, 'active');
          }
        }
      }
      
      this.visualizeFrequency(dominantFreq);
    }
    
    requestAnimationFrame(() => this.detectFrequencies());
  }

  isNearFrequency(freq, target, tolerance) {
    return Math.abs(freq - target) < tolerance;
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

  displayReceivedVoice() {
    const receivedDiv = document.getElementById('received-voice');
    const playbackDiv = document.getElementById('voice-playback');
    const playBtn = document.getElementById('play-voice-btn');
    
    receivedDiv.querySelector('.placeholder').style.display = 'none';
    playbackDiv.style.display = 'block';
    playBtn.disabled = false;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = `✅ Voice message received (${this.receivedVoiceChunks.length} samples)`;
    
    receivedDiv.insertBefore(messageDiv, playbackDiv);
  }

  async playReceivedVoice() {
    if (this.receivedVoiceChunks.length === 0) {
      this.showPlaybackStatus('❌ No voice data to play', 'error');
      return;
    }

    try {
      this.showPlaybackStatus('▶ Playing...', 'active');
      
      // Create audio buffer from received samples
      const sampleRate = 8000;
      const buffer = this.audioContext.createBuffer(1, this.receivedVoiceChunks.length, sampleRate);
      const channelData = buffer.getChannelData(0);
      
      for (let i = 0; i < this.receivedVoiceChunks.length; i++) {
        channelData[i] = this.receivedVoiceChunks[i];
      }
      
      // Play the buffer
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => {
        this.showPlaybackStatus('✅ Playback complete', 'active');
        setTimeout(() => this.showPlaybackStatus('', ''), 2000);
      };
      
      source.start();
      
    } catch (error) {
      this.showPlaybackStatus('❌ Playback failed: ' + error.message, 'error');
      console.error('Playback error:', error);
    }
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

  drawIdleVisualization() {
    const ctx = this.canvasCtx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#666';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Waiting for transmission...', width / 2, height / 2);
  }

  showTransmissionStatus(message, type = '') {
    const statusDiv = document.getElementById('transmission-status');
    statusDiv.textContent = message;
    statusDiv.className = 'status-box';
    
    if (type) {
      statusDiv.classList.add(type);
    }
  }

  showListeningStatus(message, type = '') {
    const statusDiv = document.getElementById('listening-status');
    statusDiv.textContent = message;
    statusDiv.className = 'status-text';
    
    if (type) {
      statusDiv.classList.add(type);
    }
  }

  showPlaybackStatus(message, type = '') {
    const statusDiv = document.getElementById('playback-status');
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