# Exam Portal MERN

Exam Portal MERN is a full-stack web application that allows students to take online exams while enabling administrators to manage exams, view detailed reports, and monitor exam sessions with integrated proctoring features. This project is built using the MERN stack (MongoDB, Express, React, Node.js) along with Vite and Tailwind CSS for the front-end.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
  - [Backend on Render](#deploying-the-backend-on-render)
  - [Frontend on Netlify](#deploying-the-frontend-on-netlify)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Exam Management:** Create, update, delete, and view exam details.
- **Question Bank:** Manage questions associated with each exam.
- **Proctoring:** Detect and log suspicious activities (e.g., tab switching, window blur) during an exam.
- **Reporting:** Generate detailed exam and user performance reports.
- **User Authentication:** Secure registration and login using JWT.
- **Responsive UI:** Modern, responsive front-end built with React, Vite, and Tailwind CSS.

## Technologies

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose (MongoDB)
- **Authentication:** JWT, bcrypt
- **Deployment:** Netlify (frontend) & Render (backend)

## Project Structure

```plaintext
Exam-Portal-MERN/
├── client/
│   └── exam-portal/         # React front-end application
│       ├── public/
│       ├── src/
│       ├── .env              # Environment variables for the client
│       ├── package.json
│       └── ...
└── server/                  # Node/Express back-end application
    ├── controllers/         # API controllers (exam, questionBank, proctoring, reports, etc.)
    ├── models/              # Mongoose models (Exam, QuestionBank, ProctoringSession, etc.)
    ├── routes/              # Express routes
    ├── .env               # Environment variables for the server
    ├── package.json
    └── ...

``
``
``
``
``
``
```

Installation & Setup
Prerequisites
Node.js (v14 or later)
MongoDB (local installation or MongoDB Atlas)
Setup Backend
Navigate to the server directory:

bash
Copy code
cd server
Install dependencies:

bash
Copy code
npm install
Create a .env file in the server folder with your environment variables:

env
Copy code
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
Start the backend server:

bash
Copy code
npm start
Setup Frontend
Navigate to the client directory:

bash
Copy code
cd client/exam-portal
Install dependencies:

bash
Copy code
npm install
Create a .env file in the client/exam-portal folder with:

env
Copy code
REACT_APP_API_URL=https://your-backend.onrender.com/api/v1
For local development, you might use:

env
Copy code
REACT_APP_API_URL=http://localhost:5000/api/v1
Start the frontend development server:

bash
Copy code
npm run dev
Your React app should be running on a port like 5173.

Running Locally
Backend: Ensure your server is running (e.g., on http://localhost:5000).
Frontend: Run npm run dev in the client/exam-portal folder and open your browser at http://localhost:5173.
Deployment
Deploying the Backend on Render
Sign in to Render and create a new Web Service.
Set the Root Directory: Enter server (since your backend code is in that folder).
Build Command: npm install
Start Command: npm start
Set Environment Variables: Configure variables such as MONGO_URI, JWT_SECRET, etc.
Deploy: Render will deploy your backend and provide a URL (e.g., https://your-backend.onrender.com).
Deploying the Frontend on Netlify
Sign in to Netlify and create a new site from Git.
Base Directory: Set this to client/exam-portal
Build Command: npm run build (since Vite outputs files to a dist folder)
Publish Directory: Set this to dist
Set Environment Variables: Under Netlify site settings, add:
env
Copy code
REACT_APP_API_URL=https://your-backend.onrender.com/api/v1
Deploy: Netlify will build and deploy your site, providing a URL (e.g., https://your-frontend.netlify.app).
Contributing
Contributions are welcome! Follow these steps:

Fork the repository.
Create a new branch for your feature or bug fix.
Commit your changes.
Open a pull request.
License
This project is licensed under the MIT License.

yaml
Copy code

---

### Instructions:

1. **Create a file named `README.md`** at the root of your repository.
2. **Copy and paste** the above text into the file.
3. **Commit and push** the file to your repository.
