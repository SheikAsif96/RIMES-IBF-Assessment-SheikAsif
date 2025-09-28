// server/src/services/wordCountService.js
import { WebSocketServer } from "ws";

export function createWordCountService(server) {
  // Attach WebSocket server to the same HTTP server/port
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    ws.on("message", (raw) => {
      try {
        const { text = "", searchWord = "" } = JSON.parse(raw.toString());
        const pattern = new RegExp(
          searchWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "gi"
        );
        const count = searchWord ? (text.match(pattern) || []).length : 0;
        ws.send(JSON.stringify({ word: searchWord, count }));
      } catch {
        ws.send(JSON.stringify({ error: "Bad request" }));
      }
    });
  });

  return wss;
}
