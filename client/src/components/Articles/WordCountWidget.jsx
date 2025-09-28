import { useEffect, useState } from "react";
import useWordCountWS from "../../hooks/useWordCountWS.js";

export default function WordCountWidget({ text }) {
  // Prefer explicit VITE_WS_URL; fallback to VITE_API_URL then localhost
  const base =
    import.meta.env.VITE_WS_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

  // Normalize to ws/wss
  const wsUrl = base.startsWith("ws")
    ? base
    : base.replace("https://", "wss://").replace("http://", "ws://");

  const { ready, last, send } = useWordCountWS(wsUrl);
  const [searchWord, setSearchWord] = useState("");

  useEffect(() => {
    // throttle big texts
    const t = (text || "").slice(0, 5000);
    if (ready && searchWord) {
      send({ text: t, searchWord });
    }
  }, [text, searchWord, ready, send]);

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label className="form-label" style={{ marginBottom: 0 }}>
        Live word count
      </label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          className="form-input"
          placeholder="Type a word"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          style={{ maxWidth: 220 }}
        />
        <div className="btn btn-secondary" aria-live="polite">
          {ready
            ? `Count: ${last?.word === searchWord ? last?.count ?? 0 : 0}`
            : "Connecting…"}
        </div>
      </div>
      <small style={{ color: "#64748b" }}>
        WS: {wsUrl} • {ready ? "connected" : "offline"}
      </small>
    </div>
  );
}
