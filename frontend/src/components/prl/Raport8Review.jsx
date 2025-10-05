import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  AppBar,
  Toolbar,
  TextField,
  IconButton
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  Cancel,
  Search
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PRLRaport8Review = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for Raport 8 submissions
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      studentName: 'John Smith',
      studentId: 'STU001',
      course: 'Computer Science',
      week: 'Week 5',
      submissionDate: '2024-01-15',
      status: 'pending',
      topic: 'Data Structures and Algorithms'
    },
    {
      id: 2,
      studentName: 'Jane Doe',
      studentId: 'STU002',
      course: 'Information Technology',
      week: 'Week 5',
      submissionDate: '2024-01-14',
      status: 'approved',
      topic: 'Database Management'
    },
    {
      id: 3,
      studentName: 'Mike Johnson',
      studentId: 'STU003',
      course: 'Software Engineering',
      week: 'Week 5',
      submissionDate: '2024-01-16',
      status: 'rejected',
      topic: 'Software Development Lifecycle'
    },
    {
      id: 4,
      studentName: 'Sarah Wilson',
      studentId: 'STU004',
      course: 'Computer Science',
      week: 'Week 4',
      submissionDate: '2024-01-10',
      status: 'pending',
      topic: 'Object-Oriented Programming'
    }
  ]);

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'Pending' },
      approved: { color: 'success', label: 'Approved' },
      rejected: { color: 'error', label: 'Rejected' }
    };
    
    const config = statusConfig[status];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const handleApprove = (id) => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, status: 'approved' } : sub
    ));
  };

  const handleReject = (id) => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, status: 'rejected' } : sub
    ));
  };

  const handleViewDetails = (id) => {
    // Navigate to detailed view
    navigate(`/prl/raport8-review/${id}`);
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Raport 8 Review
          </Typography>
          <Button color="inherit" onClick={() => navigate('/prl/dashboard')}>
            Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Raport 8 Submissions
            </Typography>
            <TextField
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              size="small"
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Week</TableCell>
                  <TableCell>Topic</TableCell>
                  <TableCell>Submission Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.studentName}</TableCell>
                    <TableCell>{submission.studentId}</TableCell>
                    <TableCell>{submission.course}</TableCell>
                    <TableCell>{submission.week}</TableCell>
                    <TableCell>{submission.topic}</TableCell>
                    <TableCell>{submission.submissionDate}</TableCell>
                    <TableCell>{getStatusChip(submission.status)}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="info" 
                        onClick={() => handleViewDetails(submission.id)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton 
                        color="success" 
                        onClick={() => handleApprove(submission.id)}
                        size="small"
                        disabled={submission.status === 'approved'}
                      >
                        <CheckCircle />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleReject(submission.id)}
                        size="small"
                        disabled={submission.status === 'rejected'}
                      >
                        <Cancel />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default PRLRaport8Review;
