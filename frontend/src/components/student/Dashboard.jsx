import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import StudentMonitoring from './Monitoring';
import StudentRating from './Rating';

const StudentDashboard = () => {
    const [student, setStudent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const studentData = localStorage.getItem('studentUser');
        if (studentData) {
            setStudent(JSON.parse(studentData));
        } else {
            navigate('/student/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('studentUser');
        navigate('/student/login');
    };

    if (!student) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Navigation */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <span className="navbar-brand">
                        🎓 LUCT Student Portal - Welcome, {student.name}
                    </span>
                    <div className="navbar-nav ms-auto">
                        <Link className="nav-link" to="/student/monitoring">📊 Monitoring</Link>
                        <Link className="nav-link" to="/student/rating">⭐ Rating</Link>
                        <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container-fluid mt-3">
                <Outlet />
            </div>
        </div>
    );
};

export default StudentDashboard;