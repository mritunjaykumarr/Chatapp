import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; // Import the new CSS file

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 8);
    navigate(`/chat/${id}`);
  };

  const joinRoom = () => {
    if (roomId.trim() !== "") navigate(`/chat/${roomId}`);
  };

  return (
    <div className="app-container">
      <div className="home-container">
        <p className="home-subtitle">Create a room or join one to start chatting!</p>
        <button onClick={createRoom} className="styled-button">
          Create a New Chat Room
        </button>
        <div className="input-group">
          <input
            type="text"
            className="styled-input"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
          />
          <button onClick={joinRoom} className="styled-button">
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}