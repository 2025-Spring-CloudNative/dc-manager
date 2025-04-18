// src/App.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {MainPage} from './pages/Mainpage/MainPage';

const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
};

export default App;
