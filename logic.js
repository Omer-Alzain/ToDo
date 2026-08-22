let nextId = 1;
const tasks =JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks(tasks);
document.getElementById("addButton").addEventListener("click", () => addTask(document.getElementById("task-input").value, document.getElementById("due-date").value));
function addTask(title, dueDate) {
    if (!title || !dueDate) {
        alert("Please enter a task title and due date.");
        return;
    }
    const newTask = {
        id: tasks.length + 1,
        title: title,
        dueDate: dueDate,
        completed: false
    };
    nextId++;
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(tasks);
    document.getElementById("task-input").value = "";
    document.getElementById("due-date").value = "";
}
function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
        tasks.splice(index, 1);
        renderTasks(tasks);
    }
}
function getTasksStatus(tasks) {
    const completedTasks = tasks.filter(task => task.completed);
    const inProgressTasks = tasks.filter(task => !task.completed);
    const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && !task.completed);
    return { completedTasks, inProgressTasks, overdueTasks };
}
function renderTasks(tasksToRender) {
    const taskList = document.getElementById("task-list");

    taskList.innerHTML = "";
     if (!tasksToRender || tasksToRender.length === 0) {
        document.getElementById("task-list").innerHTML = "<p>No tasks available.</p>";
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

        taskElement.appendChild(titleElement);
        taskElement.appendChild(dateElement);
        taskElement.appendChild(editButton);
        taskElement.appendChild(deleteButton);

        taskList.appendChild(taskElement);
        
    });
}
const tasksSideBar = document.querySelectorAll(".sidebar-item");
tasksTypeSwicth(tasksSideBar);
function tasksTypeSwicth(tasksContainer){
    tasksContainer.forEach(item =>{
        item.addEventListener("click",() => {
            tasksContainer.forEach(item => {item.classList.remove("active")});
            item.classList.add("active");
            const section = item.dataset.section;
            if(section === "tasks"){
                renderTasks(tasks);
            }else if(section === "completed"){
                const { completedTasks } = getTasksStatus(tasks);
                renderTasks(completedTasks);
            }else if(section === "in-progress"){
                const { inProgressTasks } = getTasksStatus(tasks);
                renderTasks(inProgressTasks);
            }else if(section === "overdue"){
                const { overdueTasks } = getTasksStatus(tasks);
                renderTasks(overdueTasks);
            }
        });
    });
}

