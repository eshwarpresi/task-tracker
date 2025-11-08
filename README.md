# 📝 Task Tracker

A modern, responsive web application for managing your daily tasks efficiently. Built with vanilla JavaScript frontend and Node.js/Express backend.

## 🚀 Live Demo

**Live Application:** [Task Tracker Live Demo](https://task-tracker-6od3xog4v-eshwarpresis-projects.vercel.app/)
📁 Repository
GitHub Repository: https://github.com/eshwarpresi/task-tracker.git
## 📋 Features

- ✅ **Add New Tasks** with title, description, priority, and due date
- 📊 **Smart Insights** with task statistics and analytics
- 🎯 **Priority Management** (High, Medium, Low)
- 📅 **Due Date Tracking** with sorting capabilities
- 🔄 **Status Management** (Open, In Progress, Completed)
- 🔍 **Advanced Filtering** by priority and status
- 🗑️ **Delete Tasks** with confirmation
- 📱 **Responsive Design** works on all devices
- 💾 **Persistent Storage** using file-based JSON storage

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling and responsive design
- **Vanilla JavaScript** - Client-side functionality
- **Vercel** - Deployment

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Render** - Cloud deployment

## 📁 Project Structure
task-tracker/
├── backend/
│ ├── src/
│ │ ├── routes/
│ │ │ ├── tasks.js
│ │ │ └── insights.js
│ │ ├── services/
│ │ │ └── insights.js
│ │ └── db/
│ │ └── data.json
│ ├── server.js
│ ├── package.json
│ └── vercel.json
├── frontend/
│ ├── index.html
│ ├── style.css
│ ├── app.js
│ └── vercel.json
└── README.md

text

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eshwarpresi/task-tracker.git
   cd task-tracker
Setup Backend

bash
cd backend
npm install
npm start
Backend runs on http://localhost:10000

Setup Frontend

bash
cd ../frontend
# Open index.html in browser or use live server
Development
Backend API: http://localhost:10000

Frontend: Open frontend/index.html in browser

🔌 API Endpoints
Tasks
GET /api/tasks - Get all tasks (with optional filtering)

POST /api/tasks - Create new task

PATCH /api/tasks/:id - Update task status/priority

DELETE /api/tasks/:id - Delete task

Insights
GET /api/insights - Get task statistics and analytics

Query Parameters
priority - Filter by priority (High/Medium/Low)

status - Filter by status (Open/In Progress/Completed)

sort - Sort by due_date or priority

🎯 Usage
Adding a Task

Fill in the task title (required)

Add optional description

Select priority level

Set due date

Click "Add Task"

Managing Tasks

Use "Mark Done" to complete tasks

Use "Delete" to remove tasks

Apply filters to view specific tasks

Smart Insights

View total task count

See completion statistics

Track priority distribution

Identify due soon tasks

🌐 Deployment
Frontend (Vercel)
Automatic deployment from GitHub

Connected to main branch

Live URL: Task Tracker

Backend (Render)
Automatic deployment from GitHub

Uses free tier instance

API URL: https://task-tracker-backend-xxik.onrender.com

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Eshwar Presi

GitHub: @eshwarpresi
 
## New Update 
