import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import "./App.css";

// For demonstration: create a unique user ID for this browser session
// This helps differentiate between sender and receiver
const currentUserId = sessionStorage.getItem("userId") || `user_${Math.random().toString(36).substring(2, 9)}`;
sessionStorage.setItem("userId", currentUserId);

export default function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);

  // Function to auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll down whenever new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to fetch messages from Firestore in real-time
  useEffect(() => {
    if (!roomId) return;
    const q = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      },
      (error) => console.error("Error fetching messages: ", error)
    );
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [roomId]);

  // Function to send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMsg.trim() === "") return;
    try {
      await addDoc(collection(db, "rooms", roomId, "messages"), {
        text: newMsg,
        createdAt: serverTimestamp(),
        userId: currentUserId, // Add the sender's ID to the message
      });
      setNewMsg("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="app-container">
      <div className="chatroom-container">
        <div className="chatroom-header">
            <h2>Chat Room: <span className="room-id">{roomId}</span></h2>
            <Link to="/" className="home-link">Leave</Link>
        </div>
        <div className="messages-container">
          {messages.map((msg) => {
            // Determine if the message was sent by the current user
            const messageClass =
              msg.userId === currentUserId ? "sender" : "receiver";
            return (
              <div
                key={msg.id}
                className={`message-bubble ${messageClass}`}
              >
                {msg.text}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="message-form">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type a message..."
            className="styled-input message-input"
          />
          <button type="submit" className="styled-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}