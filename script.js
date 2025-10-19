const socket = new WebSocket(`ws://${window.location.host}`);
const gauges = {
  vel: document.getElementById("velocidade"),
  rpm: document.getElementById("rpm"),
  acc: document.getElementById("aceleracao"),
};

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

document.getElementById("connectBtn").addEventListener("click", () => {
  alert("Conexão automática — se o Arduino estiver ligado, ele já está transmitindo dados!");
});
