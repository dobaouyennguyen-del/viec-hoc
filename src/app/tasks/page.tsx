"use client";

import { useState } from "react";
import Link from "next/link";

type Task = {
  id: number;
  title: string;
  done: boolean;
};

const initialTasks: Task[] = [
  { id: 1, title: "Ôn tập chương 1 môn Toán", done: false },
  { id: 2, title: "Làm bài tập Tiếng Anh", done: true },
  { id: 3, title: "Đọc tài liệu Next.js", done: false },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  function addTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setTasks([...tasks, { id: Date.now(), title, done: false }]);
    setNewTitle("");
  }

  function toggleTask(id: number) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id: number) {
    setTasks(tasks.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setEditTitle(task.title);
  }

  function saveEdit(id: number) {
    const title = editTitle.trim();
    if (!title) return;
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title } : t)));
    setEditingId(null);
  }

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-100 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">📚 Việc học của tôi</h1>
            <p className="mt-1 text-sm text-slate-500">
              Đã hoàn thành {doneCount}/{tasks.length} công việc
            </p>
          </div>
          <Link
            href="/login"
            className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Đăng xuất
          </Link>
        </header>

        <div className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-200 sm:p-6">
          <form onSubmit={addTask} className="mb-5 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nhập tên công việc..."
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white shadow transition hover:bg-indigo-700 active:scale-[0.98]"
            >
              Thêm
            </button>
          </form>

          {tasks.length === 0 ? (
            <p className="py-8 text-center text-slate-400">Chưa có công việc nào. Hãy thêm một việc mới!</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-indigo-200 hover:bg-indigo-50/40 sm:flex-row sm:items-center"
                >
                  {editingId === task.id ? (
                    <>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(task.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        className="flex-1 rounded-lg border border-indigo-400 px-3 py-1.5 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="flex-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-600 sm:flex-none"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-300 sm:flex-none"
                        >
                          Hủy
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="flex flex-1 cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleTask(task.id)}
                          className="h-5 w-5 shrink-0 cursor-pointer accent-indigo-600"
                        />
                        <span
                          className={`break-words ${
                            task.done ? "text-slate-400 line-through" : "text-slate-800"
                          }`}
                        >
                          {task.title}
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(task)}
                          className="flex-1 rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-amber-200 sm:flex-none"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="flex-1 rounded-lg bg-rose-100 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-200 sm:flex-none"
                        >
                          Xóa
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
