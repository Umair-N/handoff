import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTask, listWaiting, markDone, type TaskKind } from "@/db";
import { setCount } from "@/tray";

const waitingKey = ["tasks", "waiting"] as const;

// Waiting tasks from SQLite; the tray count follows whatever the query returns.
export function useWaitingTasks() {
  const query = useQuery({ queryKey: waitingKey, queryFn: listWaiting });

  const count = query.data?.length;
  useEffect(() => {
    if (count !== undefined) setCount(count);
  }, [count]);

  return query;
}

export function useAddTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: { kind: TaskKind; title: string; agent: string | null }) =>
      addTask(task.kind, task.title, task.agent),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: waitingKey }),
  });
}

export function useMarkDone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markDone,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: waitingKey }),
  });
}
