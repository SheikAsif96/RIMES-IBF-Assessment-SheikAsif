import { WebSocketServer } from "ws";

export function createWordCountService(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    console.log("WS connected from", req.socket.remoteAddress);
    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        console.log("WS recv", msg);
        const { text = "", searchWord = "" } = msg;
        const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = searchWord
          ? new RegExp(escape(searchWord), "gi")
          : null;
        const count = pattern ? ((text || "").match(pattern) || []).length : 0;
        const payload = JSON.stringify({ word: searchWord, count });
        ws.send(payload);
        console.log("WS send", payload);
      } catch (e) {
        console.log("WS error parse", e.message);
        ws.send(JSON.stringify({ error: "Bad request" }));
      }
    });
    ws.on("close", () => console.log("WS closed by client"));
    ws.on("error", (e) => console.log("WS socket error", e.message));
  });

  wss.on("error", (e) => console.log("WSS error", e.message));
  console.log("WSS ready");
  return wss;
}
