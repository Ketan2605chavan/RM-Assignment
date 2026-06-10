# RM Assignment Engine

A full-stack web application that allows administrators to bulk assign clients to Relationship Managers (RMs) via CSV file upload, with real-time notifications and assignment history tracking.

## Features

- Drag and drop CSV file upload
- Workload validation (max 15 clients per RM)
- Real-time toast notifications via Socket.io
- Assignment history table with search
- MongoDB data persistence

## Tech Stack

- **Frontend:** React.js (Vite), Axios, Socket.io-client, React Router DOM
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** MongoDB (Mongoose)
- **File Handling:** Multer

## Project Structure
rm-assignment-engine/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── AssignmentLog.js
│   ├── routes/
│   │   ├── upload.js
│   │   └── assignments.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
├── src/
│   ├── components/
│   │   └── UploadZone.jsx
│   ├── pages/
│   │   └── History.jsx
│   ├── App.jsx
│   └── main.jsx
└── package.json

## How to Run Locally

### Prerequisites
- Node.js v18+
- MongoDB installed locally
- npm

### Step 1 — Start Backend
cd backend
npm install
npm run dev
Expected output:
✅ MongoDB connected
✅ Server running on port 5000

### Step 2 — Start Frontend
Open a second terminal:
cd frontend
npm install
npm run dev
Open browser at: http://localhost:5173

## Environment Variables

Create a `.env` file inside the `backend` folder:
PORT=5000
MONGO_URI=mongodb://localhost:27017/rmengine

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/upload` | Upload CSV file |
| GET | `/api/assignments` | Get all assignments |

## Sample CSV Format
Client Name,Assigned RM Name
Alice Johnson,Rajiv Menon
Bob Smith,Sunita Sharma
Carol White,Anil Kapoor

## Workload Validation Rule

An RM cannot have more than **15 clients** assigned.
If the CSV upload pushes any RM over this limit,
the entire upload is rejected with a clear error message.

## Database Schema

### AssignmentLog
| Field | Type | Description |
|-------|------|-------------|
| clientName | String | Client full name |
| rmName | String | RM full name |
| assignedBy | ObjectId | Reference to admin |
| status | String | success / failed |
| createdAt | Date | Auto timestamp |

### User
| Field | Type | Description |
|-------|------|-------------|
| name | String | Full name |
| email | String | Unique email |
| password | String | Password |
| role | String | admin/rm/client |
| createdAt | Date | Auto timestamp |
