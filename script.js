const socket = new WebSocket(`ws://localhost:3000`);
const connectBtn = document.getElementById("connectBtn");

const gauges = {
  vel: document.getElementById("velocidade"),
  rpm: document.getElementById("rpm"),
  acc: document.getElementById("aceleracao"),
};

connectBtn.addEventListener("click", () => {
  socket.send("connect-arduino");
  connectBtn.innerText = "🔌 Conectando...";
  setTimeout(() => (connectBtn.innerText = "✅ Conectado!"), 2000);
});

socket.onmessage = (event) => {
  const [vel, rpm, acc] = event.data.trim().split(",");
  updateGauge("vel", parseInt(vel));
  updateGauge("rpm", parseInt(rpm));
  updateGauge("acc", parseInt(acc));
};

function updateGauge(type, value) {
  const el = gauges[type];
  const rotation = (value / (type === "rpm" ? 6000 : 100)) * 180;
  el.style.transform = `rotate(${rotation}deg)`;

  if (type === "vel") document.getElementById("vel-value").innerText = `${value} KM/H`;
  if (type === "rpm") document.getElementById("rpm-value").innerText = `${value}`;
  if (type === "acc") document.getElementById("acc-value").innerText = `${value}%`;
}
