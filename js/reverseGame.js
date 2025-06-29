let mediaRecorder;
let recordedChunks = [];
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let selectedSpeed = 0.75;

// Optional phonetic mappings
const phonetics = {
  "HappyBirthday_Amy.mp3": "ee-may ay-th-dirb ee-pah",
  "HappyNewYear_Amy.mp3": "ee-ray wen ee-pee ah",
  "JollyGood_Amy.mp3": "ee-may doo-g ee-laj",
  "KeepCalm_Amy.mp3": "ee-may mlak peek",
  "MerryChristmas_Amy.mp3": "ee-may smats-tsirhc yrr-ehm"
};

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
    buffer.getChannelData(i).
