const API = "https://task-backend.onrender.com";

// REGISTER
function register() {
    fetch(API + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value
        })
    }).then(res => res.json())
        .then(data => {
            alert(data.message);
            window.location.href = "login.html";
        });
}

// LOGIN
function login() {
    fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
        .then(res => {
            if (!res.ok) throw new Error("Login failed");
            return res.json();
        })
        .then(data => {
            localStorage.setItem("token", data.access_token);
            window.location.href = "dashboard.html";
        })
        .catch(() => {
            alert("Invalid email or password");
        });
}


// LOAD TASKS
function loadTasks() {
    fetch(API + "/tasks", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
        .then(res => res.json())
        .then(tasks => {
            pending.innerHTML = "";
            completed.innerHTML = "";

            tasks.forEach(task => {
                const li = document.createElement("li");

                const span = document.createElement("span");
                span.innerText = task.title;

                const delBtn = document.createElement("button");
                delBtn.innerText = "✖";
                delBtn.className = "delete-btn";
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                };

                li.appendChild(span);
                li.appendChild(delBtn);

                if (task.completed) {
                    completed.appendChild(li);
                } else {
                    li.onclick = () => completeTask(task.id);
                    pending.appendChild(li);
                }
            });
        });
}

function deleteTask(id) {
    if (!confirm("Delete this task?")) return;

    fetch(API + `/tasks/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }).then(loadTasks);
}

// CREATE TASK
function createTask() {
    fetch(API + "/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ title: taskInput.value })
    }).then(() => {
        taskInput.value = "";
        loadTasks();
    });
}

// COMPLETE TASK
function completeTask(id) {
    fetch(API + `/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ completed: true })
    }).then(loadTasks);
}

// LOGOUT
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}