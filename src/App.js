import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Categories from './Categories';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </div>
    </Router>
  );
}

function Header() {
  return (
    <header className="App-header">
      <h1>Budget Tracker</h1>
    </header>
  );
}

function NavBar() {
  return (
    <nav className="App-nav">
      <Link to="/" className="App-nav-link">Home</Link>
      <Link to="/categories" className="App-nav-link">Categories</Link>
    </nav>
  );
}

export default App;
