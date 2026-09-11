const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const inputError = document.getElementById("inputError");

const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const pendingBadge = document.getElementById("pendingBadge");
const completedBadge = document.getElementById("completedBadge");

const currentDate = document.getElementById("currentDate");

let tasks = JSON.parse(localStorage.getItem("focusListTasks")) || [];


// -------------------------
// DATE
// -------------------------

function showCurrentDate() {
    const date = new Date();

    currentDate.textContent = date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

showCurrentDate();


// -------------------------
// SAVE TASKS
// -------------------------

function saveTasks() {
    localStorage.setItem("focusListTasks", JSON.stringify(tasks));
}


// -------------------------
// ADD TASK
// -------------------------

function addTask() {

    const text = taskInput.value.trim();

    inputError.textContent = "";

    if (text === "") {
        inputError.textContent = "Please enter a task before adding.";
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
}

addTaskBtn.addEventListener("click", addTask);


// -------------------------
// ENTER KEY
// -------------------------

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// -------------------------
// FORMAT TIME
// -------------------------

function formatTime(dateString) {

    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit"
    });
}


// -------------------------
// CREATE TASK ELEMENT
// -------------------------

function createTaskElement(task) {

    const item = document.createElement("article");

    item.className = "task-item";

    if (task.completed) {
        item.classList.add("completed-item");
    }

    item.dataset.id = task.id;


    // CHECK BUTTON

    const checkButton = document.createElement("button");

    checkButton.className = "task-check";

    checkButton.setAttribute(
        "aria-label",
        task.completed
            ? "Mark task as pending"
            : "Mark task as completed"
    );

    checkButton.textContent = task.completed ? "✓" : "";


    checkButton.addEventListener("click", function() {

        toggleTask(task.id);

    });


    // TASK INFO

    const info = document.createElement("div");

    info.className = "task-info";


    const text = document.createElement("div");

    text.className = "task-text";

    text.textContent = task.text;


    const time = document.createElement("div");

    time.className = "task-time";

    time.textContent = `Added ${formatTime(task.createdAt)}`;


    info.appendChild(text);
    info.appendChild(time);


    // ACTIONS

    const actions = document.createElement("div");

    actions.className = "task-actions";


    // EDIT

    const editButton = document.createElement("button");

    editButton.className = "action-btn";

    editButton.title = "Edit task";

    editButton.textContent = "✎";

    editButton.addEventListener("click", function() {

        editTask(task.id);

    });


    // DELETE

    const deleteButton = document.createElement("button");

    deleteButton.className = "action-btn delete-btn";

    deleteButton.title = "Delete task";

    deleteButton.textContent = "×";

    deleteButton.addEventListener("click", function() {

        deleteTask(task.id);

    });


    actions.appendChild(editButton);
    actions.appendChild(deleteButton);


    item.appendChild(checkButton);
    item.appendChild(info);
    item.appendChild(actions);


    return item;
}


// -------------------------
// RENDER TASKS
// -------------------------

function renderTasks() {

    const pendingTasks = tasks.filter(task => !task.completed);

    const completedTasks = tasks.filter(task => task.completed);


    pendingList.innerHTML = "";
    completedList.innerHTML = "";


    // PENDING

    if (pendingTasks.length === 0) {

        pendingList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">○</div>
                <h3>No pending tasks</h3>
                <p>Add a task above and start getting things done.</p>
            </div>
        `;

    } else {

        pendingTasks.forEach(task => {

            pendingList.appendChild(
                createTaskElement(task)
            );

        });

    }


    // COMPLETED

    if (completedTasks.length === 0) {

        completedList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✓</div>
                <h3>Nothing completed yet</h3>
                <p>Completed tasks will appear here.</p>
            </div>
        `;

    } else {

        completedTasks.forEach(task => {

            completedList.appendChild(
                createTaskElement(task)
            );

        });

    }


    updateCounts();
}


// -------------------------
// COUNTS
// -------------------------

function updateCounts() {

    const total = tasks.length;

    const pending = tasks.filter(
        task => !task.completed
    ).length;

    const completed = tasks.filter(
        task => task.completed
    ).length;


    totalCount.textContent = total;

    pendingCount.textContent = pending;

    completedCount.textContent = completed;

    pendingBadge.textContent = pending;

    completedBadge.textContent = completed;
}


// -------------------------
// TOGGLE COMPLETE
// -------------------------

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    saveTasks();

    renderTasks();
}


// -------------------------
// DELETE
// -------------------------

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();
}


// -------------------------
// EDIT
// -------------------------

function editTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {
        return;
    }


    const item = document.querySelector(
        `.task-item[data-id="${id}"]`
    );

    if (!item) {
        return;
    }


    const info = item.querySelector(".task-info");

    const actions = item.querySelector(".task-actions");


    const input = document.createElement("input");

    input.className = "edit-input";

    input.type = "text";

    input.value = task.text;

    input.maxLength = 120;


    info.innerHTML = "";

    info.appendChild(input);


    actions.innerHTML = "";


    const saveButton = document.createElement("button");

    saveButton.className = "action-btn";

    saveButton.title = "Save";

    saveButton.textContent = "✓";


    const cancelButton = document.createElement("button");

    cancelButton.className = "action-btn";

    cancelButton.title = "Cancel";

    cancelButton.textContent = "×";


    actions.appendChild(saveButton);

    actions.appendChild(cancelButton);


    input.focus();

    input.select();


    function saveEdit() {

        const updatedText = input.value.trim();

        if (updatedText === "") {
            input.focus();
            return;
        }

        tasks = tasks.map(itemTask => {

            if (itemTask.id === id) {

                return {
                    ...itemTask,
                    text: updatedText
                };

            }

            return itemTask;

        });

        saveTasks();

        renderTasks();
    }


    saveButton.addEventListener(
        "click",
        saveEdit
    );


    cancelButton.addEventListener(
        "click",
        renderTasks
    );


    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                saveEdit();
            }

            if (event.key === "Escape") {
                renderTasks();
            }

        }
    );
}


// -------------------------
// INITIAL RENDER
// -------------------------

renderTasks();