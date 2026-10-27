import { useEffect, useState } from "react";
  import { setCount } from "./tray";
  import { addTask, listWaiting, markDone, type Task, type TaskKind } from "./db";

  function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState("");
    const [kind, setKind] = useState<TaskKind>("go");

    // Read waiting tasks from the database and update the screen and tray.
    async function refresh() {
      const waiting = await listWaiting();
      setTasks(waiting);
      await setCount(waiting.length);
    }

    useEffect(() => {
      refresh();
    }, []);

    async function onAdd(e: React.FormEvent) {
      e.preventDefault();
      if (!title.trim()) return;
      await addTask(kind, title.trim(), null);
      setTitle("");
      await refresh();
    }

    async function onDone(id: string) {
      await markDone(id);
      await refresh();
    }

    return (
      <main style={{ fontFamily: "-apple-system, sans-serif", padding: 24 }}>
        <h1>Waiting on you: {tasks.length}</h1>

        <form onSubmit={onAdd}>
          <select value={kind} onChange={(e) => setKind(e.target.value as TaskKind)}>
            <option value="blocked">Blocked</option>
            <option value="go">Go / no-go</option>
            <option value="decide">Decide</option>
            <option value="check">Check</option>
            <option value="run">Run</option>
          </select>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
          <button type="submit">Add</button>
        </form>

        <ul>
          {tasks.map((t) => (
            <li key={t.id}>
              <strong>{t.kind.toUpperCase()}</strong> {t.title}{" "}
              <button onClick={() => onDone(t.id)}>Done</button>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  export default App;


