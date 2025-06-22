import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";
// import { produce } from "immer";

import { Task, TaskStatus } from "../../interfaces";

interface TaskState {
  dragginTaskId?: string;
  tasks: Record<string, Task>; // {[key: string], Task}

  getTaskByStatus: (status: TaskStatus) => Task[];
  setDraggingTaskId: (taskId: string) => void;
  removeDraggingTaskId: () => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => void;
  onTaskDrop: (status: TaskStatus) => void;
  addTask: (title: string, status: TaskStatus) => void;
  totalTasks: () => number;
}

const storeApi: StateCreator<
  TaskState,
  [["zustand/immer", never]],
  [["zustand/persist", TaskState]]
> = (set, get) => ({
  dragginTaskId: undefined,
  tasks: {
    "ABC-1": { id: "ABC-1", title: "Task 1", status: "open" },
    "ABC-2": { id: "ABC-2", title: "Task 2", status: "in-progress" },
    "ABC-3": { id: "ABC-3", title: "Task 3", status: "open" },
    "ABC-4": { id: "ABC-4", title: "Task 4", status: "open" },
  },

  getTaskByStatus: (status: TaskStatus) => {
    const tasks = get().tasks;
    return Object.values(tasks).filter((task) => task.status === status);
  },

  setDraggingTaskId: (taskId: string) => set({ dragginTaskId: taskId }),

  removeDraggingTaskId: () => set({ dragginTaskId: undefined }),

  changeTaskStatus: (taskId: string, status: TaskStatus) => {
    const task = { ...get().tasks[taskId] };
    task.status = status;

    //* MIDDLEWARE IMMER
    set((state) => {
      state.tasks[taskId] = task;
    });

    //* NATIVE
    // set((state) => ({
    //   tasks: {
    //     ...state.tasks,
    //     [taskId]: task,
    //   },
    // }));
  },

  onTaskDrop: (status: TaskStatus) => {
    const taskId = get().dragginTaskId;
    if (!taskId) return;

    get().changeTaskStatus(taskId, status);
    get().removeDraggingTaskId();
  },

  addTask: (title: string, status: TaskStatus) => {
    const newTask = { id: uuidv4(), title, status };

    //* MIDDLEWARE IMMER
    set((state) => {
      state.tasks[newTask.id] = newTask;
    });

    //* WITH PRODUCE OF IMMER
    // set(
    //   produce((state: TaskState) => {
    //     state.tasks[newTask.id] = newTask;
    //   })
    // );

    //* NAVITE
    // set((state) => ({
    //   tasks: {
    //     ...state.tasks,
    //     [newTask.id]: newTask,
    //   },
    // }));
  },

  totalTasks: () => Object.keys(get().tasks).length,
});

export const useTaskStore = create<TaskState>()(
  devtools(
    immer(
      persist(storeApi, {
        name: "task-store",
      })
    )
  )
);
