let mediaRecorder;
let recordedChunks = [];
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let selectedSpeed = 1.0;

async function playPhrase(src) {
  const response = await fetch(src);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = await audioContext.decodeAudioData(arrayBuffer);

  // Reverse buffer
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    buffer.getChannelData(i).reverse();
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = selectedSpeed;
  source.connect(audioContext.destination);
  source.start(0);
}

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
    mediaRecorder.onstop = handleRecording;
    mediaRecorder.start();
  });
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

function handleRecording() {
  const blob = new Blob(recordedChunks, { type: 'audio/webm' });
  const reader = new FileReader();

  reader.onloadend = () => {
    audioContext.decodeAudioData(reader.result, buffer => {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        buffer.getChannelData(i).reverse();
      }
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
    });
  };
  reader.readAsArrayBuffer(blob);
}

// UI Hookup
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('play-phrase').addEventListener('click', () => {
    playPhrase('snd/HappyBirthday_Amy.mp3');
  });
  document.getElementById('start-record').addEventListener('click', startRecording);
  document.getElementById('stop-record').addEventListener('click', stopRecording);

  // Set selected speed from radio buttons
  document.querySelectorAll('input[name=\"speed\"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedSpeed = parseFloat(e.target.value);
    });
  });
});
