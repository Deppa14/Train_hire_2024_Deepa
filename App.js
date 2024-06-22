import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListUserPage from './components/ListUserPage';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser';
import './App.css'; // Import global styles

const App = () => {
  return (
    <div className="container">
      <header className="page-header text-center"><strong>College Management</strong></header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListUserPage />} />
          <Route path="/addstudent" element={<CreateUser />} />
          <Route path="/user/:id/edit" element={<EditUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
