import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        
        if (formData.password !== formData.confirmPassword) {
            setMessage('❌ Passwords do not match');
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:5000/api/students/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            if (response.data.success) {
                setMessage('✅ Registration successful! Please login.');
                setTimeout(() => {
                    navigate('/student/login');
                }, 2000);
            }
        } catch (error) {
            setMessage('❌ ' + (error.response?.data?.error || 'Registration failed'));
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h3 className="mb-0">Student Registration</h3>
                        </div>
                        <div className="card-body">
                            {message && (
                                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                                    {message}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
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
                                
                                <div className="mb-3">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-success">
                                        Register
                                    </button>
                                </div>
                            </form>
                            
                            <div className="text-center mt-3">
                                <p>Already have an account? <Link to="/student/login">Login here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentRegister;