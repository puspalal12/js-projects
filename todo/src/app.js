const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

const searchInput = document.getElementById('search-input'); 

let tasks = JSON.parse(localStorage.getItem('todos')) || [];
let searchTerm = ""; 

function renderTasks() {
  todoList.innerHTML = '';

 
  const filteredTasks = tasks.filter(task => 
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = "grid grid-cols-[160px_1fr_auto] items-center gap-4 px-6 py-4 hover:bg-blue-50 transition-colors";

    li.innerHTML = `
      <span class="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded w-fit">
        #${task.id}
      </span>
      <span class="text-slate-700 font-medium truncate" title="${task.text}">
        ${task.text}
      </span>
      <div class="flex gap-2">
        <button onclick="editTask(${task.id})" class="px-3 py-1 text-xs font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
          EDIT
        </button>
        <button onclick="deleteTask(${task.id})" class="px-3 py-1 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition-all">
          DELETE
        </button>
      </div>
    `;
    todoList.appendChild(li);
  });

 
  localStorage.setItem('todos', JSON.stringify(tasks));
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();

  if (text) {
    const newTask = {
      id: Date.now(),
      text: text
    };

    tasks.push(newTask);
    todoInput.value = '';
    renderTasks();
  }
});

function deleteTask(id) {
  if(confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
  }
}

function editTask(id) {
  const taskToEdit = tasks.find(task => task.id === id);
  const updatedText = prompt("Edit Task:", taskToEdit.text);

  if (updatedText !== null && updatedText.trim() !== "") {
    taskToEdit.text = updatedText.trim();
    renderTasks();
  }
}

searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value;
  renderTasks();
});


renderTasks();