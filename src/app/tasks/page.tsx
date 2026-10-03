import { createServerSupabaseClient } from "@/lib/supabase";
import TaskList, { type Task } from "./task-list";

export default async function TasksPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, done")
    .order("created_at", { ascending: true });

  return (
    <TaskList
      initialTasks={(data ?? []) as Task[]}
      loadError={error ? "Không tải được danh sách công việc. Vui lòng thử lại." : ""}
    />
  );
}
