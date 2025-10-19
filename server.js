import express from "express";
import { WebSocketServer } from "ws";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
const server = app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);

const wss = new WebSocketServer({ server });

let port;
let parser;
let conectado = false;

function conectarArduino() {
  try {
    port = new SerialPort({ path: "COM4", baudRate: 9600 }); // 🔧 altere a COM se necessário
    parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));
    conectado = true;
    console.log("✅ Arduino conectado via HC-06 em COM4");

    parser.on("data", (data) => {
      console.log("Arduino:", data);
      wss.clients.forEach((client) => {
        if (client.readyState === 1) client.send(data.trim());
      });
    });
  } catch (err) {
    console.log("⚠️ Erro ao conectar Arduino:", err.message);
  }
}

wss.on("connection", (ws) => {
  console.log("💻 Cliente conectado via WebSocket");

  ws.on("message", (msg) => {
    if (msg.toString() === "connect-arduino") {
      conectarArduino();
    }
  });
});
