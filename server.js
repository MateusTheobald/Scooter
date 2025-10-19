import express from "express";
import { WebSocketServer } from "ws";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const app = express();
const PORT = process.env.PORT || 3000;

// Servir os arquivos estáticos
app.use(express.static("public"));
const server = app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);

// WebSocket
const wss = new WebSocketServer({ server });

// === CONFIGURAÇÃO DO ARDUINO ===
// Altere "COM3" para sua porta (Windows) ou "/dev/ttyUSB0" (Linux)
let serialAtivo = false;
try {
  const port = new SerialPort({ path: "COM3", baudRate: 9600 });
  const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));
  serialAtivo = true;

  parser.on("data", (data) => {
    console.log("Arduino:", data);
    wss.clients.forEach((client) => {
      if (client.readyState === 1) client.send(data.trim());
    });
  });
} catch (err) {
  console.log("⚠️ Nenhum Arduino detectado. Modo simulação ativo.");
  serialAtivo = false;
}

// === SIMULAÇÃO DE DADOS (para Vercel ou sem Arduino) ===
if (!serialAtivo) {
  setInterval(() => {
    const velocidade = Math.floor(Math.random() * 80);
    const rpm = Math.floor(Math.random() * 6000);
    const aceleracao = Math.floor(Math.random() * 100);
    const msg = `${velocidade},${rpm},${aceleracao}`;
    wss.clients.forEach((client) => {
      if (client.readyState === 1) client.send(msg);
    });
  }, 1000);
}
