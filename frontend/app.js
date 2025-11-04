// frontend/app.js - CORRECTED VERSION
const API = "https://task-tracker-backend-xxik.onrender.com/api";

// Build query string helper
function buildQuery(params) {
  const qs = Object.entries(params)
    .filter(([k, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return qs ? `?${qs}` : "";
}

// Load tasks with filters
async function loadTasks() {
  try {
    const priority = document.getElementById("filterPriority").value;
    const status = document.getElementById("filterStatus").value;
    const sort = document.getElementById("sortBy").value;

    const q = buildQuery({ priority, status, sort });
    const res = await fetch(`${API}/tasks${q}`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const tasks = await res.json();

    document.getElementById("tasks").innerHTML = tasks
      .map((t) => {
        const titleStyle =
          t.status === "Completed"
            ? "text-decoration: line-through; color: gray;"
            : "";
        return `
        <div class="task" id="task-${t.id}">
          <b style="${titleStyle}">${escapeHtml(t.title)}</b>
          <div class="meta">
            ${escapeHtml(t.description || "")}
            <span>Priority: ${t.priority}</span>
            <span>Status: ${t.status}</span>
            <span>Due: ${t.due_date}</span>
          </div>
          <div class="actions">
            <button onclick="toggleComplete(${t.id}, '${t.status}')">
              ${t.status === "Completed" ? "✔ Done" : "Mark Done"}
            </button>
            <button onclick="deleteTask(${t.id})">Delete</button>
          </div>
        </div>
      `;
      })
      .join("");
  } catch (error) {
    console.error('Error loading tasks:', error);
    document.getElementById("tasks").innerHTML = `<p>Error loading tasks: ${error.message}</p>`;
  }
}

// Escape HTML
function escapeHtml(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Toggle complete
async function toggleComplete(id, currentStatus) {
  try {
    const newStatus = currentStatus === "Completed" ? "Open" : "Completed";
    const response = await fetch(`${API}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    
    await loadTasks();
    await loadInsights();
  } catch (error) {
    console.error('Error toggling task:', error);
    alert('Failed to update task: ' + error.message);
  }
}

// Delete task
async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  
  try {
    const response = await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    
    await loadTasks();
    await loadInsights();
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Failed to delete task: ' + error.message);
  }
}

// Load insights
async function loadInsights() {
  try {
    const res = await fetch(`${API}/insights`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    document.getElementById("insights").innerText = data.summary || "";
  } catch (err) {
    console.error('Error loading insights:', err);
    document.getElementById("insights").innerText = "Insights unavailable";
  }
}

// Add task
document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("desc").value.trim();
  const priority = document.getElementById("priority").value;
  const due_date = document.getElementById("due").value;

  if (!title || !due_date) {
    alert("Please provide title and due date");
    return;
  }

  try {
    const response = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, priority, due_date }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Clear form
    e.target.reset();
    
    // Reload tasks and insights
    await loadTasks();
    await loadInsights();
    
    alert('Task added successfully!');
    
  } catch (error) {
    console.error('Error adding task:', error);
    alert('Failed to add task: ' + error.message);
  }
});

// Filter apply / clear
document.getElementById("applyFilters").addEventListener("click", (e) => {
  e.preventDefault();
  loadTasks();
});

document.getElementById("clearFilters").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("filterPriority").value = "";
  document.getElementById("filterStatus").value = "";
  document.getElementById("sortBy").value = "due_date";
  loadTasks();
});

// Initial load
loadTasks();
loadInsights();