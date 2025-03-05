import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ExamList from './pages/Exams/ExamList.jsx';
import ExamDetail from './pages/Exams/ExamDetail.jsx';
import TakeExam from './pages/Exams/TakeExam.jsx';
import ExamResults from './pages/Exams/ExamResults.jsx'; // Import your new component
import ProctorSession from './pages/Proctoring/ProctorSession.jsx';
import ExamReports from './pages/Reports/ExamReports.jsx';
import UserReports from './pages/Reports/UserReports.jsx';
import Profile from './pages/Users/Profile.jsx';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import PrivateRoute from "./components/common/PrivateRoute.jsx";
import CreateExam from './pages/Exams/CreateExam.jsx';
import EditExam from './pages/Exams/EditExam.jsx';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Navbar />

        <main className="flex-1 flex flex-col">
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                  <Dashboard />
              } />

              <Route path="/exams" element={
                <PrivateRoute>
                  <ExamList />
                </PrivateRoute>
              } />

              <Route path="/exams/:examId" element={
                <PrivateRoute>
                  <ExamDetail />
                </PrivateRoute>
              } />

              <Route path="/exams/:examId/take" element={
                <PrivateRoute>
                  <TakeExam />
                </PrivateRoute>
              } />

              <Route path="/exams/:examId/results" element={
                <PrivateRoute>
                  <ExamResults />
                </PrivateRoute>
              } />

              <Route path="/proctoring" element={
                <PrivateRoute>
                  <ProctorSession />
                </PrivateRoute>
              } />

              <Route path="/reports/exams" element={
                <PrivateRoute>
                  <ExamReports />
                </PrivateRoute>
              } />

              <Route path="/reports/users" element={
                <PrivateRoute>
                  <UserReports />
                </PrivateRoute>
              } />

              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />

              <Route path="/createexam" element={
                <PrivateRoute>
                  <CreateExam />
                </PrivateRoute>
              } />

              <Route path="/exams/:examId/edit" element={
                  <PrivateRoute>
                    <EditExam />
                  </PrivateRoute>
                } />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
