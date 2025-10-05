import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PLCourses = () => {
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [newModule, setNewModule] = useState({
        module_code: '',
        module_name: '',
        program: '',
        credits: 3,
        semester: 1,
        lecturer_id: ''
    });

    useEffect(() => {
        fetchCourses();
        fetchLecturers();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/pl/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchLecturers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/pl/lecturers');
            setLecturers(response.data);
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        }
    };

    const handleAddModule = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/pl/courses', newModule);
            setShowAddModal(false);
            setNewModule({
                module_code: '',
                module_name: '',
                program: '',
                credits: 3,
                semester: 1,
                lecturer_id: ''
            });
            fetchCourses();
        } catch (error) {
            console.error('Error adding module:', error);
            setError('Failed to add module.');
        }
    };

    const handleAssignLecturer = async (moduleId, lecturerId) => {
        try {
            await axios.put(`http://localhost:5000/api/pl/courses/${moduleId}/assign`, {
                lecturer_id: lecturerId
            });
            fetchCourses();
        } catch (error) {
            console.error('Error assigning lecturer:', error);
            setError('Failed to assign lecturer.');
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading courses data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1">📚 Program Courses & Modules</h2>
                            <p className="text-muted mb-0">Manage course modules and assign lecturers</p>
                        </div>
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-primary"
                                onClick={() => setShowAddModal(true)}
                            >
                                ➕ Add Module
                            </button>
                            <button 
                                className="btn btn-outline-primary"
                                onClick={fetchCourses}
                            >
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                    <button className="btn btn-sm btn-outline-danger ms-3" onClick={() => setError('')}>
                        Dismiss
                    </button>
                </div>
            )}

            {/* Courses Grid */}
            <div className="row">
                {courses.map(course => (
                    <div key={course.id} className="col-lg-6 mb-4">
                        <div className="card h-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-0">{course.module_code}</h6>
                                    <small className="text-muted">{course.program}</small>
                                </div>
                                <span className={`badge ${
                                    course.status === 'active' ? 'bg-success' : 'bg-secondary'
                                }`}>
                                    {course.status}
                                </span>
                            </div>
                            <div className="card-body">
                                <h6 className="card-title text-primary">{course.module_name}</h6>
                                
                                <div className="mb-3">
                                    <small className="text-muted">
                                        <strong>Semester:</strong> {course.semester} • 
                                        <strong> Credits:</strong> {course.credits}
                                    </small>
                                </div>

                                {/* Lecturer Assignment */}
                                <div className="mb-3">
                                    <label className="form-label small"><strong>Assigned Lecturer:</strong></label>
                                    <select 
                                        className="form-select form-select-sm"
                                        value={course.lecturer_id || ''}
                                        onChange={(e) => handleAssignLecturer(course.id, e.target.value)}
                                    >
                                        <option value="">Select Lecturer</option>
                                        {lecturers.map(lecturer => (
                                            <option key={lecturer.id} value={lecturer.id}>
                                                {lecturer.name}
                                            </option>
                                        ))}
                                    </select>
                                    {course.lecturer_name && (
                                        <small className="text-success mt-1">
                                            Currently assigned to: {course.lecturer_name}
                                        </small>
                                    )}
                                </div>

                                {/* Statistics */}
                                <div className="row text-center small">
                                    <div className="col-4">
                                        <div className="border rounded p-2">
                                            <div className="fw-bold text-primary">{course.total_lectures || 0}</div>
                                            <small className="text-muted">Lectures</small>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="border rounded p-2">
                                            <div className={`fw-bold ${
                                                course.avg_attendance >= 80 ? 'text-success' : 
                                                course.avg_attendance >= 60 ? 'text-warning' : 'text-danger'
                                            }`}>
                                                {Math.round(course.avg_attendance || 0)}%
                                            </div>
                                            <small className="text-muted">Attendance</small>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="border rounded p-2">
                                            <div className={`fw-bold ${
                                                course.avg_rating >= 4 ? 'text-success' : 
                                                course.avg_rating >= 3 ? 'text-warning' : 'text-danger'
                                            }`}>
                                                {course.avg_rating ? course.avg_rating.toFixed(1) : 'N/A'}
                                            </div>
                                            <small className="text-muted">Rating</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <small className="text-muted">
                                    Created: {new Date(course.created_at).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="text-center py-5">
                    <div className="text-muted mb-3">
                        <i className="fas fa-book fa-3x"></i>
                    </div>
                    <h5>No program modules found</h5>
                    <p className="text-muted">Start by adding your first course module</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowAddModal(true)}
                    >
                        Add First Module
                    </button>
                </div>
            )}

            {/* Add Module Modal */}
            {showAddModal && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Module</h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setShowAddModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddModule}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Module Code *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newModule.module_code}
                                                onChange={(e) => setNewModule({...newModule, module_code: e.target.value})}
                                                required
                                                placeholder="e.g., WD101"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Program *</label>
                                            <select
                                                className="form-select"
                                                value={newModule.program}
                                                onChange={(e) => setNewModule({...newModule, program: e.target.value})}
                                                required
                                            >
                                                <option value="">Select Program</option>
                                                <option value="Web Development">Web Development</option>
                                                <option value="Database Systems">Database Systems</option>
                                                <option value="Networking">Networking</option>
                                                <option value="Programming">Programming</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Module Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newModule.module_name}
                                            onChange={(e) => setNewModule({...newModule, module_name: e.target.value})}
                                            required
                                            placeholder="e.g., Advanced Web Development"
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Credits</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newModule.credits}
                                                onChange={(e) => setNewModule({...newModule, credits: parseInt(e.target.value)})}
                                                min="1"
                                                max="6"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Semester</label>
                                            <select
                                                className="form-select"
                                                value={newModule.semester}
                                                onChange={(e) => setNewModule({...newModule, semester: parseInt(e.target.value)})}
                                            >
                                                <option value={1}>Semester 1</option>
                                                <option value={2}>Semester 2</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Assign Lecturer</label>
                                        <select
                                            className="form-select"
                                            value={newModule.lecturer_id}
                                            onChange={(e) => setNewModule({...newModule, lecturer_id: e.target.value})}
                                        >
                                            <option value="">Select Lecturer (Optional)</option>
                                            {lecturers.map(lecturer => (
                                                <option key={lecturer.id} value={lecturer.id}>
                                                    {lecturer.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            Add Module
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => setShowAddModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PLCourses;