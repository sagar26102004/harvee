# 🚀 Full Stack MERN Project

This project contains a **client (React + Vite)** and a **server (Node.js + Express)** inside the root folder.  
Follow the simple setup steps below to run the project locally or using Docker.

## 📁 Folder Structure

```
root-folder/
│
├── client/       # React Frontend
│   ├── package.json
│   └── .env
│
├── server/       # Node.js Backend
│   ├── package.json
│   └── .env
│
└── README.md
```

# 🔧 Installation & Setup Guide

## 1️⃣ Clone the Repository

```bash
git clone <your-github-repo-url>
cd <project-folder>
```

# 🛠 Backend Setup (Server)

### 2️⃣ Open Terminal 1, navigate to server folder:

```bash
cd server
```

### 3️⃣ Install server dependencies:

```bash
npm install
```

### 4️⃣ Create `.env` file inside `/server`:

```
PORT=5000
MONGO_URI=your_mongodb_url_here
JWT_SECRET=your_secret_here
```

### 5️⃣ Start backend:

```bash
npm run dev
```

# 🎨 Frontend Setup (Client)

### 6️⃣ Open Terminal 2, navigate to client folder:

```bash
cd client
```

### 7️⃣ Install client dependencies:

```bash
npm install
```

### 8️⃣ Create `.env` file inside `/client`:

```
VITE_API_URL=http://localhost:5000
```

### 9️⃣ Start frontend:

```bash
npm run dev
```

# 🌐 Open App in Browser

👉 http://localhost:5173

# 📜 Available Scripts

## Server

| Command | Description |
|--------|-------------|
| `npm run dev` | Run backend |

## Client

| Command | Description |
|--------|-------------|
| `npm run dev` | Run frontend |