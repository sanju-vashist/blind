const video = document.getElementById("webcam");
const startBtn = document.getElementById("startBtn");
const results = document.getElementById("results");

let model;

startBtn.onclick = async () => {
  startBtn.disabled = true;
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  model = await cocoSsd.load();
  detectFrame();
};

async function detectFrame() {
  const predictions = await model.detect(video);
  results.innerHTML = predictions.map(
    p => `Detected: <b>${p.class}</b> (${Math.round(p.score * 100)}%)`
  ).join("<br>");

  // Audio feedback for accessibility
  if (predictions.length > 0) {
    const spoken = predictions.map(p => p.class).join(", ");
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(`Detected: ${spoken}`));
  }

  requestAnimationFrame(detectFrame);
}
