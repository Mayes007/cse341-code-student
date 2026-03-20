import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import Anakin from "./pages/Anakin";
import Leia from "./pages/Leia";
import Comparison from "./pages/Comparison";
import Quotes from "./pages/Quotes";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        
        {/* Header */}
        <header className="hero">
          <h1>Star Wars Character Comparison</h1>
          <p>Exploring the similarities between Anakin and Leia</p>
        </header>

        {/* Navigation 🔥 */}
        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Anakin
          </NavLink>

          <NavLink to="/leia" className="nav-link">
            Princess Leia
          </NavLink>

          <NavLink to="/comparison" className="nav-link">
            Comparison
          </NavLink>

          <NavLink to="/quotes" className="nav-link">
            Quotes
          </NavLink>
        </nav>

        {/* Page Content */}
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Anakin />} />
            <Route path="/leia" element={<Leia />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/quotes" element={<Quotes />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;