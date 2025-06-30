// js/reverseGame.js

let mediaRecorder;
let recordedChunks = [];
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let selectedSpeed = 0.75;
let currentPhrase = {};

let analyser, dataArray, ctx;

function drawWaveform(canvas) {
  if (!analyser) return;
  requestAnimationFrame(() => drawWaveform(canvas));

  analyser.getByteTimeDomainData(dataArray);
  ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  const sliceWidth = canvas.width / dataArray.length;
  let x = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * canvas.height / 2;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    x += sliceWidth;
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#0066cc';
  ctx.stroke();
}

async function playPhrase(src, canvas) {
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
  drawWaveform(canvas);
}

function toggleRecording(canvas, button) {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    button.textContent = '🎤 Start Recording';
  } else {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
      mediaRecorder.onstop = () => handleRecording(canvas);
      mediaRecorder.start();

      const micSource = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      micSource.connect(analyser);
      drawWaveform(canvas);

      button.textContent = '⏹ Stop Recording';
    });
  }
}

function handleRecording(canvas) {
  const blob = new Blob(recordedChunks, { type: 'audio/webm' });
  const reader = new FileReader();

  reader.onloadend = () => {
    audioContext.decodeAudioData(reader.result, buffer => {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        buffer.getChannelData(i).reverse();
      }

      const src = audioContext.createBufferSource();
      src.buffer = buffer;
      src.connect(audioContext.destination);
      src.start();

      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      src.connect(analyser);
      drawWaveform(canvas);
    });
  };
  reader.readAsArrayBuffer(blob);
}

function checkAnswer(userAnswer, correctAnswer, resultElement) {
  if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
    resultElement.textContent = '✅ Correct!';
    resultElement.style.color = 'green';
  } else {
    resultElement.textContent = '❌ Try again!';
    resultElement.style.color = 'red';
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('waveform');
  const select = document.getElementById('phrase-select');
  const playBtn = document.getElementById('play-phrase');
  const recordBtn = document.getElementById('record-button');
  const answerBtn = document.getElementById('check-answer');
  const phoneticOut = document.getElementById('phonetic');
  const tipOut = document.getElementById('tip');
  const imageOut = document.getElementById('hint-image');
  const inputBox = document.getElementById('user-answer');
  const resultMsg = document.getElementById('result-msg');

  const response = await fetch('data/phrases.json');
  const phrases = await response.json();

  phrases.forEach((item, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = item.title;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    currentPhrase = phrases[select.value];
    phoneticOut.textContent = currentPhrase.phonetic;
    tipOut.textContent = currentPhrase.tip;
    imageOut.src = currentPhrase.image;
    inputBox.value = '';
    resultMsg.textContent = '';
  });

  select.value = 0;
  select.dispatchEvent(new Event('change'));

  playBtn.addEventListener('click', () => {
    if (currentPhrase.file) {
      playPhrase(`snd/${currentPhrase.file}`, canvas);
    }
  });

  recordBtn.addEventListener('click', () => toggleRecording(canvas, recordBtn));

  answerBtn.addEventListener('click', () => {
    checkAnswer(inputBox.value, currentPhrase.answer, resultMsg);
  });

  document.querySelectorAll('input[name="speed"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedSpeed = parseFloat(e.target.value);
    });
  });
});
