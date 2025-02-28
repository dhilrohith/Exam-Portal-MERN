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



