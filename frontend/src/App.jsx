import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Student Components
import StudentLogin from './components/student/Login';
import StudentRegister from './components/student/Register';
import StudentDashboard from './components/student/Dashboard';
import StudentMonitoring from './components/student/Monitoring';
import StudentRating from './components/student/Rating';

// Lecturer Components
import ReportForm from './components/lecturer/ReportForm';

// PRL Components
import PRLLogin from './components/prl/Login';
import PRLDashboard from './components/prl/Dashboard';
import PRLReportsReview from './components/prl/ReportsReview';
import PRLCourses from './components/prl/Courses';
import PRLMonitoring from './components/prl/Monitoring';
import PRLRating from './components/prl/Rating';
import PRLClasses from './components/prl/Classes';

// PL Components
import PLDashboard from './components/pl/Dashboard';
import PLDashboardMain from './components/pl/DashboardMain';
import PLCourses from './components/pl/Courses';
import PLReports from './components/pl/Reports';
import PLMonitoring from './components/pl/Monitoring';
import PLClasses from './components/pl/Classes';
import PLLectures from './components/pl/Lectures';
import PLRating from './components/pl/Rating';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div className="App">
                {/* Main Navigation */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <Link className="navbar-brand" to="/">
                            🎓 LUCT Reporting System
                        </Link>
                        <div className="navbar-nav">
                            <Link className="nav-link" to="/lecturer">👨‍🏫 Lecturer</Link>
                            <Link className="nav-link" to="/prl/login">📋 PRL</Link>
                            <Link className="nav-link" to="/pl/dashboard">🎓 Program Leader</Link>
                            <Link className="nav-link" to="/student/login">🎓 Student</Link>
                        </div>
                    </div>
                </nav>

                <Routes>
                    {/* ==================== LECTURER ROUTES ==================== */}
                    <Route path="/lecturer" element={<ReportForm />} />
                    
                    {/* ==================== STUDENT ROUTES ==================== */}
                    <Route path="/student/login" element={<StudentLogin />} />
                    <Route path="/student/register" element={<StudentRegister />} />
                    
                    {/* Nested Student Dashboard Routes */}
                    <Route path="/student" element={<StudentDashboard />}>
                        <Route path="monitoring" element={<StudentMonitoring />} />
                        <Route path="rating" element={<StudentRating />} />
                        <Route index element={<StudentMonitoring />} />
                    </Route>
                    
                    {/* ==================== PRL ROUTES ==================== */}
                    <Route path="/prl/login" element={<PRLLogin />} />
                    
                    {/* Nested PRL Dashboard Routes */}
                    <Route path="/prl" element={<PRLDashboard />}>
                        <Route path="reports" element={<PRLReportsReview />} />
                        <Route path="courses" element={<PRLCourses />} />
                        <Route path="monitoring" element={<PRLMonitoring />} />
                        <Route path="rating" element={<PRLRating />} />
                        <Route path="classes" element={<PRLClasses />} />
                        <Route index element={<PRLReportsReview />} />
                    </Route>

                    {/* ==================== PROGRAM LEADER (PL) ROUTES ==================== */}
                    
                    {/* Nested PL Dashboard Routes */}
                    <Route path="/pl" element={<PLDashboard />}>
                        <Route path="dashboard" element={<PLDashboardMain />} />
                        <Route path="courses" element={<PLCourses />} />
                        <Route path="reports" element={<PLReports />} />
                        <Route path="monitoring" element={<PLMonitoring />} />
                        <Route path="classes" element={<PLClasses />} />
                        <Route path="lectures" element={<PLLectures />} />
                        <Route path="rating" element={<PLRating />} />
                        <Route index element={<PLDashboardMain />} />
                    </Route>
                    
                    {/* ==================== DEFAULT & HOME ROUTES ==================== */}
                    <Route path="/" element={
                        <div className="container mt-5">
                            <div className="row justify-content-center">
                                <div className="col-md-12 text-center">
                                    <div className="card">
                                        <div className="card-header bg-primary text-white">
                                            <h2>Welcome to LUCT Reporting System</h2>
                                            <p className="mb-0">Faculty of Information Communication Technology</p>
                                        </div>
                                        <div className="card-body">
                                            <p className="lead">Choose your role to access the system:</p>
                                            <div className="row mt-4">
                                                {/* Lecturer Card */}
                                                <div className="col-lg-3 col-md-6 mb-4">
                                                    <div className="card h-100">
                                                        <div className="card-body">
                                                            <div className="text-primary mb-3">
                                                                <span className="fs-1">👨‍🏫</span>
                                                            </div>
                                                            <h5 className="card-title">Lecturer Portal</h5>
                                                            <p className="card-text small">
                                                                Submit lecture reports, manage classes, and track student attendance.
                                                            </p>
                                                            <ul className="list-unstyled text-start small">
                                                                <li>✓ Submit weekly reports</li>
                                                                <li>✓ Track class attendance</li>
                                                                <li>✓ Manage course content</li>
                                                            </ul>
                                                            <Link to="/lecturer" className="btn btn-primary w-100">
                                                                Access Lecturer Portal
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* PRL Card */}
                                                <div className="col-lg-3 col-md-6 mb-4">
                                                    <div className="card h-100">
                                                        <div className="card-body">
                                                            <div className="text-warning mb-3">
                                                                <span className="fs-1">📋</span>
                                                            </div>
                                                            <h5 className="card-title">PRL Portal</h5>
                                                            <p className="card-text small">
                                                                Review reports, monitor courses, and provide feedback to lecturers.
                                                            </p>
                                                            <ul className="list-unstyled text-start small">
                                                                <li>✓ Review submitted reports</li>
                                                                <li>✓ Monitor course performance</li>
                                                                <li>✓ Provide feedback & ratings</li>
                                                            </ul>
                                                            <Link to="/prl/login" className="btn btn-warning w-100">
                                                                Access PRL Portal
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Program Leader Card */}
                                                <div className="col-lg-3 col-md-6 mb-4">
                                                    <div className="card h-100">
                                                        <div className="card-body">
                                                            <div className="text-info mb-3">
                                                                <span className="fs-1">🎓</span>
                                                            </div>
                                                            <h5 className="card-title">Program Leader</h5>
                                                            <p className="card-text small">
                                                                Manage programs, assign modules, and oversee academic performance.
                                                            </p>
                                                            <ul className="list-unstyled text-start small">
                                                                <li>✓ Add & assign course modules</li>
                                                                <li>✓ Monitor program performance</li>
                                                                <li>✓ View PRL-reviewed reports</li>
                                                                <li>✓ Analyze ratings across programs</li>
                                                            </ul>
                                                            <Link to="/pl/dashboard" className="btn btn-info w-100 text-white">
                                                                Access Program Leader
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Student Card */}
                                                <div className="col-lg-3 col-md-6 mb-4">
                                                    <div className="card h-100">
                                                        <div className="card-body">
                                                            <div className="text-success mb-3">
                                                                <span className="fs-1">🎓</span>
                                                            </div>
                                                            <h5 className="card-title">Student Portal</h5>
                                                            <p className="card-text small">
                                                                Monitor lectures, submit ratings, and track academic progress.
                                                            </p>
                                                            <ul className="list-unstyled text-start small">
                                                                <li>✓ View lecture reports</li>
                                                                <li>✓ Rate teaching quality</li>
                                                                <li>✓ Track course progress</li>
                                                            </ul>
                                                            <Link to="/student/login" className="btn btn-success w-100">
                                                                Access Student Portal
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* System Information */}
                                            <div className="row mt-5">
                                                <div className="col-12">
                                                    <div className="card bg-light">
                                                        <div className="card-body">
                                                            <h5 className="card-title">System Features</h5>
                                                            <div className="row text-center">
                                                                <div className="col-md-2">
                                                                    <div className="feature-item">
                                                                        <i className="fas fa-file-alt fa-2x text-primary mb-2"></i>
                                                                        <h6>Report Management</h6>
                                                                        <p className="small">Comprehensive reporting</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <div className="feature-item">
                                                                        <i className="fas fa-chart-line fa-2x text-success mb-2"></i>
                                                                        <h6>Analytics</h6>
                                                                        <p className="small">Performance monitoring</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <div className="feature-item">
                                                                        <i className="fas fa-star fa-2x text-warning mb-2"></i>
                                                                        <h6>Rating System</h6>
                                                                        <p className="small">Student feedback</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <div className="feature-item">
                                                                        <i className="fas fa-users fa-2x text-info mb-2"></i>
                                                                        <h6>Multi-role</h6>
                                                                        <p className="small">Role-based access</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <div className="feature-item">
                                                                        <i className="fas fa-book fa-2x text-danger mb-2"></i>
                                                                        <h6>Program Management</h6>
                                                                        <p className="small">Course modules</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <div className="feature-item">
                                                                        <i className="fas fa-graduation-cap fa-2x text-secondary mb-2"></i>
                                                                        <h6>Academic Oversight</h6>
                                                                        <p className="small">Quality assurance</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Stats */}
                                            <div className="row mt-4">
                                                <div className="col-12">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="card-title">System Overview</h5>
                                                            <div className="row text-center">
                                                                <div className="col-md-3">
                                                                    <div className="border rounded p-3">
                                                                        <div className="h4 text-primary">4</div>
                                                                        <small className="text-muted">User Roles</small>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="border rounded p-3">
                                                                        <div className="h4 text-success">Multiple</div>
                                                                        <small className="text-muted">Academic Programs</small>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="border rounded p-3">
                                                                        <div className="h4 text-info">Real-time</div>
                                                                        <small className="text-muted">Monitoring</small>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="border rounded p-3">
                                                                        <div className="h4 text-warning">Comprehensive</div>
                                                                        <small className="text-muted">Analytics</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer text-muted">
                                            <small>LUCT Faculty of ICT - Web Application Development Project</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    } />
                    
                    {/* ==================== CATCH-ALL ROUTE ==================== */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                
                {/* Global Footer */}
                <footer className="bg-dark text-light py-4 mt-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <h5>LUCT Reporting System</h5>
                                <p>Faculty of Information Communication Technology</p>
                                <p>Limkokwing University of Creative Technology</p>
                            </div>
                            <div className="col-md-6 text-md-end">
                                <h5>Quick Links</h5>
                                <div className="d-flex flex-column">
                                    <Link to="/lecturer" className="text-light mb-1">Lecturer Portal</Link>
                                    <Link to="/prl/login" className="text-light mb-1">PRL Portal</Link>
                                    <Link to="/pl/dashboard" className="text-light mb-1">Program Leader</Link>
                                    <Link to="/student/login" className="text-light mb-1">Student Portal</Link>
                                </div>
                            </div>
                        </div>
                        <hr className="my-3" />
                        <div className="text-center">
                            <small>&copy; 2024 LUCT Faculty of ICT. All rights reserved.</small>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;