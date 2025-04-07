import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import MainPage from './pages/MainPage'
import ManagementPage from './pages/ManagementPage'

const App = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Index</Link>
          </li>
          <li>
            <Link to="/mainpage">Main Page</Link>
          </li>
          <li>
            <Link to="/management">Management</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/mainpage" element={<MainPage aaa="itjowg"><p>children say hello</p></MainPage>} />
        <Route path="/management" element={<ManagementPage />} />
      </Routes>
    </div>
  )
}

export default App
