// components/Articles/WordCountWidget.jsx
import { useState, useEffect, useRef } from "react";

export default function WordCountWidget({ text }) {
  const [searchWord, setSearchWord] = useState("");
  const [count, setCount] = useState(0);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:4000");
    return () => ws.current?.close();
  }, []);

  useEffect(() => {
    if (ws.current && searchWord && text) {
      ws.current.send(JSON.stringify({ text, searchWord }));
    }
  }, [text, searchWord]);

  useEffect(() => {
    if (ws.current) {
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.count !== undefined) setCount(data.count);
      };
    }
  }, []);

  return (
    <div className="word-count-widget">
      <input
        placeholder="Search word in text"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />
      <span>Count: {count}</span>
    </div>
  );
}
