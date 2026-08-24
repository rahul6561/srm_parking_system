# 🚗 SRM Smart Parking Management System

A modern, real-time campus smart parking management dashboard designed for SRM Institute of Science and Technology. Built with **React 18**, **Vite**, and **Tailwind CSS**, providing real-time slot occupancy tracking, sensor monitoring, analytics, and parking lot management.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [How to Run Locally](#-how-to-run-locally)
- [Project Structure](#-project-structure)
- [How to Commit and Push Changes to GitHub](#-how-to-commit-and-push-changes-to-github)
- [Useful Git Commands](#-useful-git-commands)
- [License](#-license)

---

## ✨ Features

- **📊 Centralized Dashboard**: Real-time stats on total capacity, available slots, occupied spaces, and peak hours.
- **📍 Parking Areas Overview**: Detailed status of different campus zones (Tech Park, University Building, Main Campus, etc.).
- **🔴 Live Monitoring**: Real-time visual slot grid showing vacant and occupied slots.
- **📡 IoT Sensor Telemetry**: Monitor sensor health, signal strength, battery levels, and connectivity status.
- **📝 Activity Logs**: Live log of vehicle entry and exit events with timestamps.
- **⚙️ Settings & Configuration**: Campus parking rules, notification preferences, and system thresholds.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 (Hooks, Context API)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

---

## 📦 Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v18.0.0 or higher recommended) — [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** / **pnpm**
- **Git** — [Download Git](https://git-scm.com/)

---

## 🚀 How to Run Locally

### 1. Clone the Repository

If you haven't cloned the project yet:
```bash
git clone https://github.com/rahul6561/srm_parking_system.git
cd srm_parking_system
```

*(If you are already in the project folder, simply open a terminal in that directory).*

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will start locally at:
👉 **`http://localhost:5173`** (or the URL shown in your terminal).

### 4. Build for Production (Optional)

To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```text
parking-system/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── src/
│   ├── App.jsx             # Main router & routes configuration
│   ├── main.jsx            # Application entry point
│   ├── index.css           # Global Tailwind CSS styles
│   ├── components/         # Reusable UI & layout components
│   ├── context/            # Global state (ParkingContext)
│   ├── data/               # Mock data for lots, sensors, and logs
│   ├── hooks/              # Custom React hooks (e.g. useParkingData)
│   ├── pages/              # App views (Dashboard, ParkingAreas, Sensors, etc.)
│   ├── services/           # Data & API services
│   └── utils/              # Helper utilities
```

---

## 📤 How to Commit and Push Changes to GitHub

Follow these steps whenever you make changes to the project and want to update GitHub:

### Step 1: Check Current Status
Check which files have been modified or added:
```bash
git status
```

### Step 2: Stage Your Changes
Add all modified and new files to the staging area:
```bash
git add .
```
*(Or add specific files: `git add src/App.jsx`)*

### Step 3: Commit with a Meaningful Message
Commit your staged changes:
```bash
git commit -m "feat: describe your changes here"
```

### Step 4: Push to GitHub
Push your commits to the `main` branch on GitHub:
```bash
git push origin main
```

---

## 💡 Useful Git Commands

| Task | Command |
| :--- | :--- |
| **Pull latest changes from GitHub** | `git pull origin main` |
| **Create and switch to a new branch** | `git checkout -b feature/your-feature-name` |
| **Push a new branch for the first time** | `git push -u origin feature/your-feature-name` |
| **View recent commit history** | `git log --oneline -n 5` |
| **Discard unstaged changes in a file** | `git restore <filename>` |

---

## 👨‍💻 Author

- **GitHub**: [@rahul6561](https://github.com/rahul6561)
- **Repository**: [srm_parking_system](https://github.com/rahul6561/srm_parking_system)
