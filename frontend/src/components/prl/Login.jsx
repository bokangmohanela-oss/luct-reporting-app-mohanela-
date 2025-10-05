import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PRLDashboard = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('courses');
    const navigate = useNavigate();

    // Auto-login or direct access
    useEffect(() => {
        // You can either:
        // 1. Auto-login with default credentials
        autoLogin();
        // OR 2. Set a mock user directly
        // setMockUser();
    }, []);

    const autoLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/prl/login', {
                email: 'prl@luct.ac.ls',
                password: 'password123'
            });
            
            if (response.data.success) {
                setUser(response.data.user);
                localStorage.setItem('prlUser', JSON.stringify(response.data.user));
            }
        } catch (error) {
            // If auto-login fails, use mock data
            setMockUser();
        }
    };

    const setMockUser = () => {
        const mockUser = {
            id: 1,
            name: 'PRL User',
            email: 'prl@luct.ac.ls',
            role: 'principal_lecturer'
        };
        setUser(mockUser);
        localStorage.setItem('prlUser', JSON.stringify(mockUser));
    };

    // PRL Functionality Components
    const CoursesTab = () => (
        <div>
            <h4>Courses Management</h4>
            <div className="card">
                <div className="card-body">
                    <h5>View All Courses & Lectures</h5>
                    <ul className="list-group">
                        <li className="list-group-item">Computer Science Stream</li>
                        <li className="list-group-item">Business Studies Stream</li>
                        <li className="list-group-item">Engineering Stream</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const ReportsTab = () => (
        <div>
            <h4>Reports & Feedback</h4>
            <div className="card">
                <div className="card-body">
                    <h5>Lecture Reports</h5>
                    <button className="btn btn-primary me-2">View Reports</button>
                    <button className="btn btn-success">Add Feedback</button>
                </div>
            </div>
        </div>
    );

    const MonitoringTab = () => (
        <div>
            <h4>Monitoring</h4>
            <div className="card">
                <div className="card-body">
                    <h5>Real-time Monitoring</h5>
                    <p>Lecturer performance tracking</p>
                    <p>Student engagement monitoring</p>
                </div>
            </div>
        </div>
    );

    const RatingTab = () => (
        <div>
            <h4>Rating System</h4>
            <div className="card">
                <div className="card-body">
                    <h5>Lecturer Rating</h5>
                    <div className="mb-3">
                        <label>Teaching Quality:</label>
                        <select className="form-select">
                            <option>5 - Excellent</option>
                            <option>4 - Very Good</option>
                            <option>3 - Good</option>
                        </select>
                    </div>
                    <button className="btn btn-warning">Submit Rating</button>
                </div>
            </div>
        </div>
    );

    const ClassesTab = () => (
        <div>
            <h4>Classes Management</h4>
            <div className="card">
                <div className="card-body">
                    <h5>Class Overview</h5>
                    <ul className="list-group">
                        <li className="list-group-item">Timetable Coordination</li>
                        <li className="list-group-item">Resource Allocation</li>
                        <li className="list-group-item">Classroom Management</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    if (!user) {
        return <div>Loading PRL Dashboard...</div>;
    }

    return (
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header bg-warning text-dark">
                            <h3 className="mb-0">
                                🎓 PRL Dashboard - Welcome, {user.name}
                            </h3>
                        </div>
                        
                        {/* Navigation Tabs */}
                        <div className="card-body">
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('courses')}
                                    >
                                        📚 Courses
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('reports')}
                                    >
                                        📊 Reports
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'monitoring' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('monitoring')}
                                    >
                                        👁️ Monitoring
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'rating' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('rating')}
                                    >
                                        ⭐ Rating
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className={`nav-link ${activeTab === 'classes' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('classes')}
                                    >
                                        🏫 Classes
                                    </button>
                                </li>
                            </ul>

                            {/* Tab Content */}
                            <div className="tab-content mt-3">
                                {activeTab === 'courses' && <CoursesTab />}
                                {activeTab === 'reports' && <ReportsTab />}
                                {activeTab === 'monitoring' && <MonitoringTab />}
                                {activeTab === 'rating' && <RatingTab />}
                                {activeTab === 'classes' && <ClassesTab />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PRLDashboard;