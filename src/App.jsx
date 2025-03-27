import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import NotFoundPage from './pages/NotFoundPage';
import SignupPage from './pages/SignupPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/"  element={<IndexPage/>} />
        <Route path="/signup"  element={<SignupPage/>} />
        <Route element={<NotFoundPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
