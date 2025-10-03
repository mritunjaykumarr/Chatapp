import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home.jsx";
import ChatRoom from "./ChatRoom.jsx";
import "./App.css"; // Global styles

function App() {
  return (
    <Router>
      {/* This header will be on every page */}
      <header className="app-header">
        <h1>Mritunjay Chat App</h1>
      </header>

      {/* The main content area where pages will be swapped */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:roomId" element={<ChatRoom />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;