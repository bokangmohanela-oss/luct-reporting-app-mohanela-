import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const PLDashboard = () => {
    const [pl, setPl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Since PL doesn't need login, we'll use a default PL user
        const plUser = {
            id: 1,
            name: '',
            email: 'pl@luct.ac.ls',
            role: 'pl'
        };
        setPl(plUser);
        localStorage.setItem('plUser', JSON.stringify(plUser));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('plUser');
        navigate('/');
    };

    if (!pl) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading Program Leader Portal...</p>
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
                        🎓 Program Leader Portal  {pl.name}
                    </span>
                    <div className="navbar-nav ms-auto">
                        <Link className="nav-link text-white" to="/pl/dashboard">📊 Dashboard</Link>
                        <Link className="nav-link text-white" to="/pl/courses">📚 Courses</Link>
                        <Link className="nav-link text-white" to="/pl/reports">📋 Reports</Link>
                        <Link className="nav-link text-white" to="/pl/monitoring">📈 Monitoring</Link>
                        <Link className="nav-link text-white" to="/pl/classes">🏫 Classes</Link>
                        <Link className="nav-link text-white" to="/pl/lectures">📖 Lectures</Link>
                        <Link className="nav-link text-white" to="/pl/rating">⭐ Rating</Link>
                        <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                            Exit Portal
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

export default PLDashboard;