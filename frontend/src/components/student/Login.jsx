import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        try {
            const response = await axios.post('http://localhost:5000/api/students/login', formData);
            
            if (response.data.success) {
                setMessage('✅ Login successful!');
                // Store user data in localStorage
                localStorage.setItem('studentUser', JSON.stringify(response.data.user));
                navigate('/student');
            }
        } catch (error) {
            setMessage('❌ ' + (error.response?.data?.error || 'Login failed'));
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-info text-white">
                            <h3 className="mb-0">Student Login</h3>
                        </div>
                        <div className="card-body">
                            {message && (
                                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                                    {message}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-info">
                                        Login
                                    </button>
                                </div>
                            </form>
                            
                            <div className="text-center mt-3">
                                <p>Don't have an account? <Link to="/student/register">Register here</Link></p>
                            </div>

                            {/* Test credentials */}
                            <div className="mt-3 p-3 bg-light rounded">
                                <h6>Test Credentials:</h6>
                                <p className="mb-1">Email: student@luct.ac.ls</p>
                                <p className="mb-0">Password: password123</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;