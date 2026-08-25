let tasks =JSON.parse(localStorage.getItem("tasks")) || [];
let currentSection = "tasks";

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
function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        renderCurrentSection();
    }
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log(`Task with ID ${id} deleted.`);
}
function getTasksStatus(tasks) {
    const completedTasks = tasks.filter(task => task.completed);
    const inProgressTasks = tasks.filter(task => !task.completed);
    const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && !task.completed);
    return { completedTasks, inProgressTasks, overdueTasks };
}
function renderTasks(tasksToRender, noDataMessage = "No tasks available.") {
    const taskList = document.getElementById("task-list");

    taskList.innerHTML = "";
     if (!tasksToRender || tasksToRender.length === 0) {
        document.getElementById("task-list").innerHTML = `<p>${noDataMessage}</p>`;
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


function renderCurrentSection() {
            if(currentSection === "tasks"){
                renderTasks(tasks);
            }else if(currentSection === "completed"){
                const { completedTasks } = getTasksStatus(tasks);
                renderTasks(completedTasks);
            }else if(currentSection === "in-progress"){
                const { inProgressTasks } = getTasksStatus(tasks);
                renderTasks(inProgressTasks);
            }else if(currentSection === "overdue"){
                const { overdueTasks } = getTasksStatus(tasks);
                renderTasks(overdueTasks);
            }
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
                renderCurrentSection();
        });
    });
}

function searchTasks(query) {
    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(query.toLowerCase()));
    renderTasks(filteredTasks, "No Match.");
}
function clickedSearchTasks(query) {
    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(query.toLowerCase()));
    renderTasks(filteredTasks, "No Tasks Found.");
}
document.getElementById("search-input").addEventListener("input", (event) => {
    const query = event.target.value;
    searchTasks(query);
});
document.getElementById("searchButton").addEventListener("click", (event) => {
    const query = document.getElementById("search-input").value;
    clickedSearchTasks(query);
});
function toggleTaskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderCurrentSection();
    }
}
