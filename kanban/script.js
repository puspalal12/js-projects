const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskLists = document.querySelectorAll('.task-list');


document.addEventListener('DOMContentLoaded', getTasks);


addBtn.addEventListener('click', () => {
    if (taskInput.value === '') return;
    createTask(taskInput.value, 'todo');
    saveTasks();
    taskInput.value = '';
});

function createTask(text, status) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.draggable = true;
    card.innerText = text;


    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        saveTasks();
    });

    document.getElementById(status).appendChild(card);
}


taskLists.forEach(list => {
    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        list.classList.add('drag-over');
    });

    list.addEventListener('dragleave', () => {
        list.classList.remove('drag-over');
    });

    list.addEventListener('drop', (e) => {
        e.preventDefault();
        list.classList.remove('drag-over');
        const draggingCard = document.querySelector('.dragging');
        list.appendChild(draggingCard);
        saveTasks();
    });
});


function saveTasks() {
    const boardState = {
        todo: [],
        doing: [],
        done: []
    };

    taskLists.forEach(list => {
        const status = list.id;
        const cards = list.querySelectorAll('.card');
        cards.forEach(card => {
            boardState[status].push(card.innerText);
        });
    });

    localStorage.setItem('kanban-data', JSON.stringify(boardState));
}

function getTasks() {
    const data = JSON.parse(localStorage.getItem('kanban-data'));
    if (!data) return;

    Object.keys(data).forEach(status => {
        data[status].forEach(taskText => {
            createTask(taskText, status);
        });
    });
}