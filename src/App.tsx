import { useEffect, useState } from "react";
import { setCount } from "./tray";

function App() {
  const [count, setLocalCount] = useState(3);

  useEffect(() => {
    setCount(count);
  }, [count]);

  return (
    <main style={{ fontFamily: "-apple-system, sans-serif", padding: 24 }}>
      <h1>Waiting on you: {count}</h1>
      <button onClick={() => setLocalCount((c) => c + 1)}>+ task</button>
      <button onClick={() => setLocalCount((c) => Math.max(0, c - 1))}>
        - task
      </button>
    </main>
  );
}

export default App;
