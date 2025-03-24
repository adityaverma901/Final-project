"use client"; // This marks the file as a client component

import { useState, useEffect } from "react";
import styles from "./Chatbot.module.css";
import Navdash from "@/components/nav-dash"; // Import the Navdash component
import DOMPurify from "dompurify";

// Define message type
interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>(""); 
  const [isClient, setIsClient] = useState<boolean>(false); // To check if rendering on client
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false); // To track speech status
  const [speechInstance, setSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null); // To store the current speech instance
  const [isPaused, setIsPaused] = useState<boolean>(false); // To track if speech is paused

  // Get username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('user');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Set isClient to true after the component mounts
  useEffect(() => {
    setIsClient(true);

    // Simulate fetching the user's name (replace with actual API call)
    const fetchUserName = async () => {
      try {
        // Initial bot message with username
        setMessages([{ sender: "bot", text: `Hello ${username}, how can I assist you today?` }]);
      } catch (error) {
        console.error("Error fetching user name:", error);
        setMessages([{ sender: "bot", text: "Hello! How can I assist you today?" }]); // Fallback message
      }
    };

    fetchUserName();
  }, [username]); // Add username as dependency so this runs when username is loaded

  const sendMessage = async () => {
    if (!input.trim()) return; // Ignore empty messages

    // Add user message to chat
    setMessages((prevMessages) => [...prevMessages, { sender: "user", text: input }]);

    try {
      const response = await fetch("http://localhost:5000/get-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: data.response },
      ]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    }

    setInput(""); // Clear input field after sending
  };

  // Function to handle Text-to-Speech
  const speakText = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US"; // Set language
    speech.rate = 1; // Normal speaking rate
    setSpeechInstance(speech);
    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const pauseSpeech = () => {
    if (speechInstance && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (speechInstance && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const restartSpeech = () => {
    if (speechInstance) {
      window.speechSynthesis.cancel(); // Cancel current speech
      speakText(speechInstance.text); // Restart speech
    }
  };

  if (!isClient) return null; // Return nothing on server render

  return (
    <div>
      <Navdash />
      <div className={styles.background}>
        <div className={styles.chatbotContainer}>
          <div className={styles.chatbotTitle}>Inner Voice</div>
          <div className={styles.chatbotSubtitle}>Your Mental Health Companion</div>
          <div className={styles.chatWindow}> 

            {messages.map((msg, index) => (  
              <div
                key={index}
                className={msg.sender === "user" ? styles.userMessage : styles.botMessage}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.text) }}
                />

                {msg.sender === "bot" && (
                  <div className={styles.speechControls}>
                    <button onClick={() => speakText(msg.text)} className={styles.speakButton} title="Speak">
                      🔊
                      <span className={styles.iconText}>Speak</span>
                    </button>
                    {isSpeaking && !isPaused && (
                      <button onClick={pauseSpeech} className={styles.pauseButton} title="Pause">
                        ⏸
                        <span className={styles.iconText}>Pause</span>
                      </button>
                    )}
                    {isSpeaking && isPaused && (
                      <button onClick={resumeSpeech} className={styles.resumeButton} title="Resume">
                        ▶
                        <span className={styles.iconText}>Resume</span>
                      </button>
                    )}
                    {isSpeaking && (
                      <button onClick={restartSpeech} className={styles.restartButton} title="Restart">
                        🔄
                        <span className={styles.iconText}>Restart</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Container */}
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.inputField}
              onKeyPress={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button onClick={sendMessage} className={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}