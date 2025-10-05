import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';

const PRLDashboard = () => {
    const [prl, setPrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const prlData = localStorage.getItem('prlUser');
        if (prlData) {
            setPrl(JSON.parse(prlData));
        } else {
            const mockUser = {
                id: 1,
                name: 'PRL User',
                email: 'prl@luct.ac.ls',
                role: 'principal_lecturer'
            };
            setPrl(mockUser);
            localStorage.setItem('prlUser', JSON.stringify(mockUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('prlUser');
        navigate('/');
    };

    if (!prl) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading PRL Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* NAVIGATION - BLUE THEME WITH TEST TEXT */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <span className="navbar-brand">
                        🔵 BLUE PRL PORTAL - Welcome, {prl.name} 🔵
                    </span>
                    <div className="navbar-nav ms-auto">
                        <Link className="nav-link text-white fw-bold" to="/prl/reports">📊 BLUE REPORTS</Link>
                        <Link className="nav-link text-white fw-bold" to="/prl/courses">📚 BLUE COURSES</Link>
                        <Link className="nav-link text-white fw-bold" to="/prl/monitoring">📈 BLUE MONITORING</Link>
                        <Link className="nav-link text-white fw-bold" to="/prl/rating">⭐ BLUE RATING</Link>
                        <Link className="nav-link text-white fw-bold" to="/prl/classes">🏫 BLUE CLASSES</Link>
                        <button className="btn btn-outline-light btn-sm ms-2 fw-bold" onClick={handleLogout}>
                            BLUE LOGOUT
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container-fluid mt-3">
                <div className="alert alert-primary text-center">
                    <h4>🔵 THIS IS THE BLUE THEME - If you see this, changes are working! 🔵</h4>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default PRLDashboard;