import Database from "@tauri-apps/plugin-sql";

export type TaskKind = "run" | "go" | "decide" | "check" | "blocked";

export type Task = {
  id: string;
  kind: TaskKind;
  title: string;
  agent: string | null;
  status: "waiting" | "done";
  answer: string | null;
  created_at: string;
  answered_at: string | null;
};

// Open the database once and reuse it everywhere.
let dbPromise: Promise<Database> | null = null;
function db() {
  dbPromise ??= Database.load("sqlite:handoff.db");
  return dbPromise;
}

// Waiting tasks, blockers first, then newest first.
export async function listWaiting(): Promise<Task[]> {
  return (await db()).select<Task[]>(
    `SELECT * FROM tasks
       WHERE status = 'waiting'
       ORDER BY CASE kind WHEN 'blocked' THEN 0 ELSE 1 END, created_at DESC`,
  );
}

export async function addTask(
  kind: TaskKind,
  title: string,
  agent: string | null,
) {
  await (
    await db()
  ).execute(
    "INSERT INTO tasks (id, kind, title, agent) VALUES ($1, $2, $3, $4)",
    [crypto.randomUUID(), kind, title, agent],
  );
}

export async function markDone(id: string) {
  await (
    await db()
  ).execute(
    "UPDATE tasks SET status = 'done', answered_at = datetime('now') WHERE id = $1",
    [id],
  );
}
