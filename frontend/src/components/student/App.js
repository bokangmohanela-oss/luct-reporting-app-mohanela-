import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StudentLogin = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');

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
                // Store user data in localStorage or context
                localStorage.setItem('studentUser', JSON.stringify(response.data.user));
                onLogin(response.data.user);
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;