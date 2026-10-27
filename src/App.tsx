import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAddTask, useMarkDone, useWaitingTasks } from "@/hooks/use-tasks";
import type { TaskKind } from "@/db";

function App() {
  const { data: tasks = [] } = useWaitingTasks();
  const addTask = useAddTask();
  const markDone = useMarkDone();
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<TaskKind>("go");

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addTask.mutate({ kind, title: title.trim(), agent: null }, { onSuccess: () => setTitle("") });
  }

  return (
    <main className="p-6">
      <h1 className="mb-4 text-lg font-semibold">Waiting on you: {tasks.length}</h1>

      <form onSubmit={onAdd} className="mb-4 flex gap-2">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as TaskKind)}
          className="rounded-md border px-2 text-sm"
        >
          <option value="blocked">Blocked</option>
          <option value="go">Go / no-go</option>
          <option value="decide">Decide</option>
          <option value="check">Check</option>
          <option value="run">Run</option>
        </select>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="flex-1 rounded-md border px-2 text-sm"
        />
        <Button type="submit" size="sm" disabled={addTask.isPending}>
          Add
        </Button>
      </form>

      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-2 text-sm">
            <strong className="w-16 text-xs text-muted-foreground">{t.kind.toUpperCase()}</strong>
            <span className="flex-1">{t.title}</span>
            <Button variant="outline" size="sm" onClick={() => markDone.mutate(t.id)}>
              Done
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
