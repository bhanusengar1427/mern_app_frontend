import React from 'react';
import { Container } from '@material-ui/core'
import Navbar from './components/Navbar/Navbar.js';
import Home from './components/Home/Home.js';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth/Auth.js';
import PostDetails from './components/PostDetails/PostDetails';

const App =() => {
  const user = JSON.parse(localStorage.getItem('profile'));

  
  return (
    <BrowserRouter>
      <Container maxidth="xl">
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Navigate replace to='/posts' />} />
          <Route path='/posts' exact element={<Home />} />
          <Route path='/posts/search' exact element={<Home />} />
          <Route path='/posts/:id' element={<PostDetails />} />
          <Route path="/auth" exact element={(!user ? <Auth /> : <Navigate replace to='/posts' />)} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
