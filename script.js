let seconds = 0;
let timer;

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        document.getElementById("timer").innerText = seconds + " sec";
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageId).classList.add('active');
}
// Add Task
function addTask() {
    const input = document.getElementById("taskInput");
    const task = input.value.trim();

    if (task === "") return;

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const span = document.createElement("span");
    span.innerText = task;

    li.appendChild(checkbox);
    li.appendChild(span);

    document.getElementById("taskList").appendChild(li);

    input.value = "";

    // 🎯 REMOVE TASK WHEN CHECKED
    checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
        li.classList.add("removing");

        setTimeout(() => {
            li.remove();
        }, 800); // total animation time
    }
});
}
// Save Journal
function saveJournal() {
    const text = document.getElementById("journalText").value;
    localStorage.setItem("journal", text);
    alert("Journal Saved!");
}

// Load Journal
window.onload = function () {
    const saved = localStorage.getItem("journal");
    if (saved) {
        document.getElementById("journalText").value = saved;
    }
};