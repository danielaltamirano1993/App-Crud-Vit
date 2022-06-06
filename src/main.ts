import { v4 } from "uuid";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { Task } from "./interfaces/Task";

import "./index.css";
// import './style.css'

let tasks: Task[] = [];

const taskForm = document.querySelector<HTMLFormElement>("#taskForm");
const tasksList = document.querySelector<HTMLDivElement>("#tasksList");

taskForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = taskForm["title"] as unknown as HTMLInputElement;
  const description = taskForm["description"] as unknown as HTMLTextAreaElement;

  tasks.unshift({
    title: title.value,
    description: description.value,
    id: v4(),
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks(tasks);

  taskForm.reset();
  title.focus();

  Toastify({
    text: "Task Saved",
  }).showToast();
});

// Load tasks from localstorage when the app loads
document.addEventListener("DOMContentLoaded", () => {
  tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  renderTasks(tasks);
});

function renderTasks(tasks: Task[]) {
  tasksList!.innerHTML = "";

  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className =
      "bg-zinc-800 mb-1 p-4 rounded-lg hover:bg-zinc-700 hover:cursor-pointer";

    const header = document.createElement("header");
    header.className = "flex justify-between";

    const title = document.createElement("span");
    title.innerText = task.title;
    header.append(title);

    const btnDelete = document.createElement("button");
    btnDelete.innerText = "delete";
    btnDelete.className = "bg-red-500 px-2 py-1 rounded-md";
    header.append(btnDelete);

    btnDelete.addEventListener("click", () => {
      const index = tasks.findIndex((t) => t.id === task.id);
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks(tasks);
    });

    taskElement?.append(header);

    const id = document.createElement("p");
    id.className = "text-gray-400 text-xs";
    id.innerText = task.id;
    taskElement?.append(id);

    const description = document.createElement("div");
    description.innerText = task.description || "";
    taskElement.append(description);

    tasksList?.append(taskElement);
  });
}
