 CREATE TABLE tasks (
    id          TEXT PRIMARY KEY NOT NULL,
    kind        TEXT NOT NULL CHECK (kind IN ('run', 'go', 'decide', 'check', 'blocked')),
    title       TEXT NOT NULL,
    agent       TEXT,
    status      TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'done')),
    answer      TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    answered_at TEXT
  );