// frontend/app.js
const API = "http://localhost:5000"; // 👈 local backend URL

// Build query string helper
function buildQuery(params) {
  const qs = Object.entries(params)
    .filter(([k,v]) => v !== undefined && v !== null && v !== '')
    .map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return qs ? `?${qs}` : '';
}

// Load tasks with filters
async function loadTasks() {
  const priority = document.getElementById('filterPriority').value;
  const status = document.getElementById('filterStatus').value;
  const sort = document.getElementById('sortBy').value;

  const q = buildQuery({ priority, status, sort });
  const res = await fetch(`${API}/tasks${q}`);
  const tasks = await res.json();

  document.getElementById('tasks').innerHTML = tasks.map(t => {
    const titleStyle = t.status === 'Completed' ? 'text-decoration: line-through; color: gray;' : '';
    return `
      <div class="task" id="task-${t.id}">
        <b style="${titleStyle}">${escapeHtml(t.title)}</b>
        <div class="meta">
          ${escapeHtml(t.description || '')}
          <span>Priority: ${t.priority}</span>
          <span>Status: ${t.status}</span>
          <span>Due: ${t.due_date}</span>
        </div>
        <div class="actions">
          <button onclick="toggleComplete(${t.id}, '${t.status}')">
            ${t.status === 'Completed' ? '✔ Done' : 'Mark Done'}
          </button>
          <button onclick="deleteTask(${t.id})">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

// Escape HTML to avoid injection
function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Toggle complete status
async function toggleComplete(id, currentStatus) {
  const newStatus = currentStatus === 'Completed' ? 'Open' : 'Completed';
  await fetch(`${API}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  await loadTasks();
  await loadInsights();
}

// Delete task
async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
  await loadTasks();
  await loadInsights();
}

// Load insights
async function loadInsights() {
  try {
    const res = await fetch(`${API}/insights`);
    const data = await res.json();
    document.getElementById('insights').innerText = data.summary || '';
  } catch (err) {
    document.getElementById('insights').innerText = '';
  }
}

// Add task
document.getElementById('taskForm').addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('desc').value.trim();
  const priority = document.getElementById('priority').value;
  const due_date = document.getElementById('due').value;

  if (!title || !due_date) {
    alert('Please provide title and due date');
    return;
  }

  await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, priority, due_date })
  });

  e.target.reset();
  await loadTasks();
  await loadInsights();
});

// Filter apply / clear
document.getElementById('applyFilters').addEventListener('click', (e) => {
  e.preventDefault();
  loadTasks();
});
document.getElementById('clearFilters').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('filterPriority').value = '';
  document.getElementById('filterStatus').value = '';
  document.getElementById('sortBy').value = 'due_date';
  loadTasks();
});

// Initial load
loadTasks();
loadInsights();
