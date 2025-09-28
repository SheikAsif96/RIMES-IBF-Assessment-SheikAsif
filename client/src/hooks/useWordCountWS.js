import { useEffect, useRef, useState } from "react";

export default function useWordCountWS(url) {
  const wsRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [last, setLast] = useState(null);

  useEffect(() => {
    let closed = false;
    let retry = 0;

    const connect = () => {
      console.log("[WS] connecting to", url);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[WS] open");
        setReady(true);
        retry = 0;
      };

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          console.log("[WS] message", data);
          setLast(data);
        } catch (err) {
          console.log("[WS] parse error", err);
        }
      };

      ws.onerror = (e) => {
        console.log("[WS] error", e?.message || e);
      };

      ws.onclose = () => {
        console.log("[WS] closed");
        setReady(false);
        if (!closed && retry < 5) {
          const delay = 500 * Math.pow(2, retry++);
          console.log("[WS] retry in", delay, "ms");
          setTimeout(connect, delay);
        }
      };
    };

    connect();
    return () => {
      closed = true;
      try {
        wsRef.current?.close();
      } catch {}
    };
  }, [url]);

  const send = (payload) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== 1) {
      console.log("[WS] send skipped, not ready");
      return false;
    }
    ws.send(JSON.stringify(payload));
    console.log("[WS] send", payload);
    return true;
  };

  return { ready, last, send };
}
