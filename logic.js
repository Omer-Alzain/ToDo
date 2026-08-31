let tasks =JSON.parse(localStorage.getItem("tasks")) || [];
let currentSection = "tasks";
let editingTaskId = null;
const editCard = document.getElementById("edit-card");
const editTitle = document.getElementById("edit-title");
const editDate = document.getElementById("edit-date");

const saveEditButton = document.getElementById("save-edit");
const cancelEditButton = document.getElementById("cancel-edit");



renderCurrentSection();
document.getElementById("addButton").addEventListener("click", () => addTask(document.getElementById("task-input").value, document.getElementById("due-date").value));
function addTask(title, dueDate) {
    if (!title || !dueDate) {
        alert("Please enter a task title and due date.");
        return;
    }
    const newTask = {
        id: Date.now(),
        title: title,
        dueDate: dueDate,
        completed: false
    };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderCurrentSection();
    document.getElementById("task-input").value = "";
    document.getElementById("due-date").value = "";
}
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    editingTaskId = id;

    editTitle.value = task.title;
    editDate.value = task.dueDate;

    editCard.classList.remove("hidden");

    saveEditButton.addEventListener("click", () => {

        const task = tasks.find(task => task.id === editingTaskId);

        if (!task) {
            return;
        }

        const newTitle = editTitle.value.trim();
        const newDueDate = editDate.value;

        if (!newTitle || !newDueDate) {
            alert("Please enter a task title and due date.");
            return;
        }

        task.title = newTitle;
        task.dueDate = newDueDate;

        localStorage.setItem("tasks", JSON.stringify(tasks));

        editCard.classList.add("hidden");

        editingTaskId = null;

        renderCurrentSection();
    });
    cancelEditButton.addEventListener("click", () => {

        editCard.classList.add("hidden");

        editingTaskId = null;
    });
}
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderCurrentSection();
}
function getTasksStatus(tasks) {
    const completedTasks = tasks.filter(task => task.completed);
    const inProgressTasks = tasks.filter(task => !task.completed && new Date(task.dueDate) >= new Date());
    const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && !task.completed);
    return { completedTasks, inProgressTasks, overdueTasks };
}
function renderTasks(tasksToRender, noDataMessage = "No tasks available.") {
    const taskList = document.getElementById("task-list");

    taskList.innerHTML = "";
    taskList.innerHTML = `<div id="task-list-header">
    <h2>Task List</h2>
    <p>Total Tasks: ${tasksToRender.length}</p>
    <p>Actions</p>
    </div>`;
     if (!tasksToRender || tasksToRender.length === 0) {
        taskList.innerHTML = `<p id="no-tasks-message">${noDataMessage}</p>`;
        return;
    }

    tasksToRender.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task-row");

        const titleElement = document.createElement("h3");
        titleElement.textContent = task.title;
        titleElement.classList.add("task-title");

        const dateElement = document.createElement("p");
        dateElement.textContent = task.dueDate;
        dateElement.classList.add("task-date");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editTask(task.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        const completeCheckbox = document.createElement("input");
        completeCheckbox.type = "checkbox";
        completeCheckbox.checked = task.completed;
        completeCheckbox.addEventListener("click", () => toggleTaskCompletion(task.id));

        taskElement.appendChild(titleElement);
        taskElement.appendChild(dateElement);
        taskElement.appendChild(editButton);
        taskElement.appendChild(deleteButton);
        taskElement.appendChild(completeCheckbox);

        taskList.appendChild(taskElement);
        
    });
}

function getCurrentSectionTasks() {

    if (currentSection === "tasks") {
        return tasks;
    }

    const { completedTasks, inProgressTasks, overdueTasks } =
        getTasksStatus(tasks);

    if (currentSection === "completed") {
        return completedTasks;
    }

    if (currentSection === "in-progress") {
        return inProgressTasks;
    }

    if (currentSection === "overdue") {
        return overdueTasks;
    }

    return [];
}

function renderCurrentSection(tasksToRender = getCurrentSectionTasks()) {
    const catogerieHeader = document.getElementById("catogerie");
    catogerieHeader.textContent = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
    renderTasks(tasksToRender, "No tasks available in this section.");
}

const tasksSideBar = document.querySelectorAll(".sidebar-item");
tasksTypeSwicth(tasksSideBar);
function tasksTypeSwicth(tasksContainer){
    tasksContainer.forEach(item =>{
        item.addEventListener("click",() => {
            tasksContainer.forEach(item => {
                item.classList.remove("active")});
                item.classList.add("active");
                currentSection = item.dataset.section;
                document.getElementById("search-input").value = "";
                renderCurrentSection();
        });
    });
}


function searchTasks(query) {
    const currentTasks = getCurrentSectionTasks();
    const filteredTasks = currentTasks.filter(task => task.title.toLowerCase().includes(query.toLowerCase()));
    renderTasks(filteredTasks, "No tasks found !");
}


function toggleTaskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderCurrentSection();
    }
}

document.getElementById("search-input").addEventListener("input", (event) => {
    const query = event.target.value;
    searchTasks(query);
});

