let mediaRecorder;
let recordedChunks = [];
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let selectedSpeed = 0.75;

const canvas = document.getElementById('waveform');
const ctx = canvas.getContext('2d');
let analyser, dataArray;

// Optional: phrase-to-phonetic mapping
const phonetics = {
  "HappyBirthday_Amy.mp3": "ee-may ay-th-dirb ee-pah",
  "HappyNewYear_Amy.mp3": "ee-ray wen ee-pee ah",
  "JollyGood_Amy.mp3": "ee-may doo-g ee-laj",
  "KeepCalm_Amy.mp3": "ee-may mlak peek",
  "MerryChristmas_Amy.mp3": "ee-may smats-tsirhc yrr-ehm"
};

function drawWaveform() {
  if (!analyser) return;
  requestAnimationFrame(drawWaveform);

  analyser.getByteTimeDomainData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  const sliceWidth = canvas.width / dataArray.length;
  let x = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * canvas.height / 2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    x += sliceWidth;
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#0066cc';
  ctx.stroke();
}

async function playPhrase(src) {
  const response = await fetch(src);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = await audioContext.decodeAudioData(arrayBuffer);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    buffer.getChannelData(i).reverse();
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = selectedSpeed;

  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  source.connect(analyser);
  analyser.connect(audioContext.destination);

  source.start(0);
  drawWaveform();
}

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
    mediaRecorder.onstop = handleRecording;
    mediaRecorder.start();

    const micSource = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    micSource.connect(analyser);
    drawWaveform();
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

      // Visualize reversed recording
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      const src = audioContext.createBufferSource();
      src.buffer = buffer;
      src.connect(analyser);
      analyser.connect(audioContext.destination);
      src.start();
      drawWaveform();
    });
  };
  reader.readAsArrayBuffer(blob);
}

window.addEventListener('DOMContentLoaded', () => {
  const phraseSelect = document.getElementById('phrase-select');
  const phoneticOutput = document.querySelector('.phonetic em');

  document.getElementById('play-phrase').addEventListener('click', () => {
    const filename = phraseSelect.value;
    playPhrase(`snd/${filename}`);

    if (phonetics[filename]) {
      phoneticOutput.textContent = phonetics[filename];
    } else {
      phoneticOutput.textContent = "(phonetic not available)";
    }
  });

  document.getElementById('start-record').addEventListener('click', startRecording);
  document.getElementById('stop-record').addEventListener('click', stopRecording);

  document.querySelectorAll('input[name="speed"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedSpeed = parseFloat(e.target.value);
    });
  });
});
