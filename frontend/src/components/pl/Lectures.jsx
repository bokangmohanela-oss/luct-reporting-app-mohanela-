import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PLLectures = () => {
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchLectures();
    }, []);

    const fetchLectures = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/pl/lectures');
            setLectures(response.data);
        } catch (error) {
            console.error('Error fetching lectures:', error);
            setError('Failed to load lectures data.');
        } finally {
            setLoading(false);
        }
    };

    const filteredLectures = filter === 'all' 
        ? lectures 
        : lectures.filter(lecture => lecture.program === filter);

    const uniquePrograms = [...new Set(lectures.map(lecture => lecture.program))];

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading lectures data...</p>
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
                            <h2 className="mb-1">📖 All Lectures</h2>
                            <p className="text-muted mb-0">Comprehensive view of lectures across all programs</p>
                        </div>
                        <div className="d-flex gap-2">
                            <select 
                                className="form-select form-select-sm"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Programs</option>
                                {uniquePrograms.map(program => (
                                    <option key={program} value={program}>{program}</option>
                                ))}
                            </select>
                            <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={fetchLectures}
                            >
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lectures List */}
            <div className="row">
                {filteredLectures.map(lecture => (
                    <div key={lecture.id} className="col-lg-6 mb-4">
                        <div className="card h-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-0">{lecture.course_code}</h6>
                                    <small className="text-muted">{lecture.program}</small>
                                </div>
                                <span className={`badge ${
                                    lecture.status === 'reviewed' ? 'bg-success' : 'bg-warning'
                                }`}>
                                    {lecture.status}
                                </span>
                            </div>
                            <div className="card-body">
                                <h6 className="card-title">{lecture.course_name}</h6>
                                
                                <div className="mb-3">
                                    <p className="small mb-1">
                                        <strong>Class:</strong> {lecture.class_name}
                                    </p>
                                    <p className="small mb-1">
                                        <strong>Lecturer:</strong> {lecture.lecturer_name}
                                    </p>
                                    <p className="small mb-1">
                                        <strong>Week:</strong> {lecture.week_of_reporting} • 
                                        <strong> Date:</strong> {new Date(lecture.date_of_lecture).toLocaleDateString()}
                                    </p>
                                    <p className="small mb-2">
                                        <strong>Attendance:</strong> {lecture.actual_students_present}/{lecture.total_registered_students}
                                    </p>
                                </div>

                                <div className="mb-3">
                                    <strong>Topic:</strong>
                                    <p className="small text-muted">
                                        {lecture.topic_taught.length > 100 
                                            ? `${lecture.topic_taught.substring(0, 100)}...` 
                                            : lecture.topic_taught
                                        }
                                    </p>
                                </div>

                                {lecture.avg_rating && (
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className={`badge ${
                                            lecture.avg_rating >= 4 ? 'bg-success' : 
                                            lecture.avg_rating >= 3 ? 'bg-warning' : 'bg-danger'
                                        }`}>
                                            {lecture.avg_rating.toFixed(1)} ⭐ ({lecture.total_ratings} ratings)
                                        </span>
                                        <small className="text-muted">
                                            {new Date(lecture.created_at).toLocaleDateString()}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredLectures.length === 0 && (
                <div className="text-center py-5">
                    <div className="text-muted mb-3">
                        <i className="fas fa-chalkboard fa-3x"></i>
                    </div>
                    <h5>No lectures found</h5>
                    <p className="text-muted">
                        {filter !== 'all' 
                            ? `No lectures found for ${filter} program` 
                            : 'No lecture data available'
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default PLLectures;