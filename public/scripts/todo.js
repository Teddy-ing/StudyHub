import { api } from "/scripts/api.js";

const data = await api("/profile");
console.log(data);

// Data structure to store lists and tasks
let lists = [];
let currentListId = null;
let listToDeleteId = null;

// DOM Elements
const listsContainer = document.getElementById('lists-container');
const newListBtn = document.getElementById('new-list-btn');
const currentListTitle = document.getElementById('current-list-title');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const addTaskContainer = document.getElementById('add-task-container');
const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksContainer = document.getElementById('tasks-container');
const noListMessage = document.getElementById('no-list-message');

// Confirmation Dialog Elements
const confirmationDialog = document.getElementById('confirmation-dialog');
const dialogMessage = document.getElementById('dialog-message');
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');

// Load data from localStorage if available
function loadData() {
    const savedLists = localStorage.getItem('todoLists');
    if (savedLists) {
        lists = JSON.parse(savedLists);
        renderLists();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('todoLists', JSON.stringify(lists));
}

// Generate a unique ID
function generateId() {
    return Math.floor(Math.random() * 1000000);
}

// Create a new list
function createNewList() {
    const listId = generateId();
    const newList = {
        id: listId,
        title: 'New List',
        tasks: []
    };
    
    lists.push(newList);
    saveData();
    renderLists();
    selectList(listId);
}

// Show confirmation dialog
function showConfirmationDialog(listId, listTitle) {
    listToDeleteId = listId;
    dialogMessage.textContent = `Are you sure you want to delete "${listTitle}"?`;
    confirmationDialog.style.display = 'flex';
}

// Hide confirmation dialog
function hideConfirmationDialog() {
    confirmationDialog.style.display = 'none';
    listToDeleteId = null;
}

// Delete a list
function deleteList(listId) {
    // Remove the list from the array
    lists = lists.filter(list => list.id !== listId);
    saveData();
    
    // If the deleted list was the current list, reset the view
    if (listId === currentListId) {
        resetView();
        
        // If there are other lists, select the first one
        if (lists.length > 0) {
            selectList(lists[0].id);
        }
    }
    
    renderLists();
}

// Reset the main view
function resetView() {
    currentListId = null;
    currentListTitle.textContent = 'Select a List';
    progressContainer.style.display = 'none';
    addTaskContainer.style.display = 'none';
    tasksContainer.innerHTML = '';
    tasksContainer.appendChild(noListMessage);
    noListMessage.style.display = 'block';
}

// Render all lists in the sidebar
function renderLists() {
    listsContainer.innerHTML = '';
    
    // Message for if no lists
    if (lists.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = 'No lists yet. Create one!';
        listsContainer.appendChild(emptyMessage);
        return;
    }

    
    lists.forEach(list => {

        // Creates div for a list item
        const listElement = document.createElement('div');
        listElement.className = 'list-item';
        // Styling for current list
        if (list.id === currentListId) {
            listElement.classList.add('active');
        }
        
        // Adds list title
        const listTitle = document.createElement('div');
        listTitle.className = 'list-title';
        listTitle.textContent = list.title;
        listTitle.addEventListener('click', () => selectList(list.id));
        
        // Adds delete button
        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'delete-list';
        deleteBtn.textContent = '×';
        deleteBtn.title = 'Delete list';

        //Delete button functionality
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent list selection when clicking delete
            showConfirmationDialog(list.id, list.title);
        });
        
        listElement.appendChild(listTitle);
        listElement.appendChild(deleteBtn);
        listsContainer.appendChild(listElement);
    });
}

// Update progress bar
function updateProgressBar(list) {
    if (!list || list.tasks.length === 0) {
        progressBar.style.width = '0%';
        progressText.textContent = '0 of 0 tasks completed (0%)';
        return;
    }
    
    const totalTasks = list.tasks.length;
    const completedTasks = list.tasks.filter(task => task.completed).length;
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${completedTasks} of ${totalTasks} tasks completed (${percentage}%)`;
}

// Select a list and display its tasks
function selectList(listId) {
    currentListId = listId;
    const selectedList = lists.find(list => list.id === listId);
    
    if (selectedList) {
        currentListTitle.innerHTML = '';
        
        const titleInput = document.createElement('input');
        titleInput.value = selectedList.title;
        titleInput.addEventListener('blur', () => {
            if (titleInput.value.trim() !== '') {
                selectedList.title = titleInput.value;
                saveData();
                renderLists();
            }
        });
        titleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                titleInput.blur();
            }
        });
        
        currentListTitle.appendChild(titleInput);
        titleInput.focus();
        
        progressContainer.style.display = 'block';
        addTaskContainer.style.display = 'flex';
        noListMessage.style.display = 'none';
        renderTasks(selectedList);
        updateProgressBar(selectedList);
    }
    
    renderLists();
}

// Render tasks for the selected list
function renderTasks(list) {
    tasksContainer.innerHTML = '';
    
    if (list.tasks.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No tasks yet. Add one above!';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = '#95a5a6';
        emptyMessage.style.marginTop = '20px';
        tasksContainer.appendChild(emptyMessage);
        return;
    }
    
    list.tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        
        const checkbox = document.createElement('div');
        checkbox.className = 'task-checkbox';
        if (task.completed) {
            checkbox.classList.add('checked');
            checkbox.innerHTML = '✓';
        }
        checkbox.addEventListener('click', () => toggleTaskCompletion(task.id));
        
        const taskText = document.createElement('div');
        taskText.className = 'task-text';
        if (task.completed) {
            taskText.classList.add('completed');
        }
        taskText.textContent = task.text;
        
        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'delete-task';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        taskElement.appendChild(checkbox);
        taskElement.appendChild(taskText);
        taskElement.appendChild(deleteBtn);
        
        tasksContainer.appendChild(taskElement);
    });
}

// Add a new task to the current list
function addNewTask(taskText) {
    if (!currentListId || taskText.trim() === '') return;
    
    const currentList = lists.find(list => list.id === currentListId);
    if (currentList) {
        const newTask = {
            id: generateId(),
            text: taskText,
            completed: false
        };
        
        currentList.tasks.push(newTask);
        saveData();
        renderTasks(currentList);
        updateProgressBar(currentList);
        newTaskInput.value = '';
    }
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
    const currentList = lists.find(list => list.id === currentListId);
    if (currentList) {
        const task = currentList.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveData();
            renderTasks(currentList);
            updateProgressBar(currentList);
        }
    }
}

// Delete a task
function deleteTask(taskId) {
    const currentList = lists.find(list => list.id === currentListId);
    if (currentList) {
        currentList.tasks = currentList.tasks.filter(task => task.id !== taskId);
        saveData();
        renderTasks(currentList);
        updateProgressBar(currentList);
    }
}

// Event Listeners
newListBtn.addEventListener('click', createNewList);

addTaskBtn.addEventListener('click', () => {
    addNewTask(newTaskInput.value);
});

newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addNewTask(newTaskInput.value);
    }
});

// Confirmation dialog event listeners
cancelBtn.addEventListener('click', hideConfirmationDialog);

confirmBtn.addEventListener('click', () => {
    if (listToDeleteId) {
        deleteList(listToDeleteId);
        hideConfirmationDialog();
    }
});

// Initialize the app
loadData();