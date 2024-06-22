import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ListUserPage.css'; // Component-specific CSS

const ListUserPage = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/api/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/student/${id}`);
      setStudents(students.filter((student) => student.id !== id));
      alert('Successfully deleted student');
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div className="list-container">
      <Link to="/addstudent" className="button"><strong>Add a New Student</strong></Link>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>Major</th>
            <th>Fees</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.major}</td>
              <td>{student.fees}</td>
              <td>{student.grade}</td>
              <td>
                <Link to={`/user/${student.id}/edit`} className="edit-button"><strong>Edit</strong></Link>
                <button onClick={() => handleDelete(student.id)} className="delete-button"><strong>Delete</strong></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListUserPage;
