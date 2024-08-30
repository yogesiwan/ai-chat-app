import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function generateAnswer() {
    const userMessage = { text: question, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setQuestion("");
    setTyping(true);

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCdtWRf7kR9P18m7gbQvzACDwac5VioeL4",
        method: "post",
        data: { contents: [{"parts": [{"text": question}]}] },
      });
      const aiMessage = { text: response.data.candidates[0].content.parts[0].text, sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      const errorMessage = { text: "An error occurred. Please try again.", sender: "ai" };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    
    setTyping(false);
  }

  const handleChange = (event) => {
    setQuestion(event.target.value);
  };

  return (
    <div className="h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col justify-center items-center p-10">
      <h1 className="text-4xl font-bold text-white mb-6">Chat With AI</h1>
      <div className="chat-window">
        <div className="message-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === "user" ? "user-message" : "ai-message"}`}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} /> 
        </div>
        {typing && (
          <div className="typing-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        <div className="input-container">
          <textarea
            className="w-full h-24 p-4 mt-4 text-lg border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-800 shadow-lg"
            rows="5"
            placeholder="Enter your text here..."
            value={question}
            onChange={handleChange}
          ></textarea>
          <button
            onClick={generateAnswer}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;