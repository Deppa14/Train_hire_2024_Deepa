import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditUser.css'; // Component-specific CSS

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [major, setMajor] = useState('');
  const [fees, setFees] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`/api/student/${id}`);
        const student = response.data;
        setName(student.name);
        setAge(student.age);
        setMajor(student.major);
        setFees(student.fees);
        setGrade(student.grade);
      } catch (error) {
        console.error('Error fetching student:', error);
      }
    };
    fetchStudent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ageNumber = parseInt(age, 10);
    const feesNumber = parseInt(fees, 10);
    if (!/^[A-Za-z\s]+$/.test(name)) {
      alert('Name should be a string and should not contain any special character or number.');
      return;
    }
    if (ageNumber < 2 || ageNumber > 100) {
      alert('Age should be within 2-100 range.');
      return;
    }
    if (feesNumber < 0) {
      alert('Fees should be a positive number.');
      return;
    }
    const updatedStudent = { name, age: ageNumber, major, fees: feesNumber, grade };
    try {
      await axios.put(`/api/student/${id}`, updatedStudent);
      navigate('/');
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div>
          <label>Major:</label>
          <input type="text" value={major} onChange={(e) => setMajor(e.target.value)} required />
        </div>
        <div>
          <label>Fees:</label>
          <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} required />
        </div>
        <div>
          <label>Grade:</label>
          <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} required />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditUser;
