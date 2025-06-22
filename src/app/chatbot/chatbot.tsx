"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, YoutubeIcon, BookOpen, Dumbbell, Music, Info, Volume2, VolumeX } from 'lucide-react';
import DOMPurify from 'dompurify';
import styles from "./Chatbot.module.css";
import Navdash from "@/components/nav-dash";

// Enhanced Recommendation Interface
interface Recommendation {
  title: string;
  description: string;
  link: string;
  category: string;
  imageUrl?: string;
}

// Message Interface - Added TTS-related properties
interface Message {
  sender: "user" | "bot";
  text: string;
  recommendations?: Recommendation[];
  isSpeaking?: boolean;
}

export default function Chatbot() {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  
  // TTS State
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Category Icons Mapping
  const categoryIcons = {
    'Music': <Music className={styles.categoryIcon} />,
    'Exercise': <Dumbbell className={styles.categoryIcon} />,
    'Article': <BookOpen className={styles.categoryIcon} />,
    'Video': <YoutubeIcon className={styles.categoryIcon} />
  };

  // Initialize username and client-side rendering
  useEffect(() => {
    const storedUsername = localStorage.getItem('user') || "User";
    setUsername(storedUsername);
    setIsClient(true);
    
    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
    }
    
    // Initial welcome message
    setMessages([{ 
      sender: "bot", 
      text: `Hello ${storedUsername}, how can I help you today?`,
      isSpeaking: false 
    }]);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, recommendations]);

  // TTS Functionality
  const startSpeaking = (messageIndex: number) => {
    if (!speechSynthesis) return;

    // Stop any ongoing speech
    speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(messages[messageIndex].text);
    setCurrentUtterance(utterance);

    // Update message to indicate speaking
    const updatedMessages = [...messages];
    updatedMessages[messageIndex].isSpeaking = true;
    setMessages(updatedMessages);

    // Speaking events
    utterance.onend = () => {
      const endedMessages = [...messages];
      endedMessages[messageIndex].isSpeaking = false;
      setMessages(endedMessages);
      setCurrentUtterance(null);
    };

    // Speak the message
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis && currentUtterance) {
      speechSynthesis.cancel();
      
      // Reset speaking state for all messages
      const updatedMessages = messages.map(msg => ({
        ...msg, 
        isSpeaking: false
      }));
      setMessages(updatedMessages);
      
      setCurrentUtterance(null);
    }
  };

  // Send message handler
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { 
      sender: "user", 
      text: input 
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      // Create bot message with isSpeaking set to false
      const botMessage: Message = { 
        sender: "bot", 
        text: data.text || "I'm here to help!",
        recommendations: data.recommendations || [],
        isSpeaking: false
      };
      setMessages(prev => [...prev, botMessage]);

      // Handle recommendations
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "Sorry, something went wrong. Please try again.",
        isSpeaking: false
      }]);
    }

    // Reset input
    setInput("");
  };

  // Render recommendation card
  const renderRecommendationCard = (rec: Recommendation, index: number) => {
    // Determine icon based on category, fallback to Info icon
    const CategoryIcon = categoryIcons[rec.category as keyof typeof categoryIcons] || <Info />;

    return (
      <div key={index} className={styles.recommendationCard}>
        <div className={styles.recommendationCardHeader}>
          {CategoryIcon}
          <h3>{rec.category}</h3>
        </div>
        
        {rec.imageUrl && (
          <div className={styles.recommendationImageContainer}>
            <img 
              src={rec.imageUrl} 
              alt={rec.title} 
              className={styles.recommendationImage} 
            />
          </div>
        )}
        
        <div className={styles.recommendationCardContent}>
          <h4>{rec.title}</h4>
          <p>{rec.description}</p>
          <a 
            href={rec.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.recommendationLink}
          >
            View Resource
          </a>
        </div>
      </div>
    );
  };

  // Render method for individual messages with TTS controls
  const renderMessage = (msg: Message, index: number) => {
    // Only show TTS button for bot messages
    const isBotMessage = msg.sender === "bot";
    
    return (
      <React.Fragment key={index}>
        <div 
          className={msg.sender === "user" ? styles.userMessage : styles.botMessage}
        >
          {isBotMessage && (
            <div className={styles.ttsControls}>
              {msg.isSpeaking ? (
                <VolumeX 
                  onClick={stopSpeaking} 
                  className={styles.ttsIcon} 
                />
              ) : (
                <Volume2 
                  onClick={() => startSpeaking(index)} 
                  className={styles.ttsIcon} 
                />
              )}
            </div>
          )}
          <div 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(msg.text) 
            }} 
          />
        </div>
        
        {/* Inline Recommendations for Mobile/Small Screens */}
        {msg.recommendations && msg.recommendations.length > 0 && (
          <div className={styles.inlineRecommendations}>
            {msg.recommendations.map((rec, recIndex) => (
              <div key={recIndex} className={styles.inlineRecommendationCard}>
                <strong>{rec.title}</strong>
                <p>{rec.description}</p>
                <a href={rec.link} target="_blank" rel="noopener noreferrer">
                  View Resource
                </a>
              </div>
            ))}
          </div>
        )}
      </React.Fragment>
    );
  };

  // Render method
  if (!isClient) return null;

  return (
    <div className={styles.container}>
      {/* Left Sidebar */}
      <aside className={styles.leftSidebar}>
        <div className={styles.sidebarContent}>
          <p className={styles.username}>{username}</p>
          <button className={styles.sidebarButton}>Settings</button>
          <button className={styles.sidebarButton}>Logout</button>
        </div>
      </aside>

      {/* Main Chat Section */}
      <div className={styles.mainContent}>
        <Navdash />

        <div className={styles.chatbotContainer}>
          <div className={styles.chatbotTitle}>Inner Voice</div>
          <div className={styles.chatbotSubtitle}>Your Mental Health Companion</div>

          {/* Chat Window */}
          <div 
            ref={chatWindowRef} 
            className={styles.chatWindow}
          >
            {messages.map(renderMessage)}
          </div>

          {/* Input Container */}
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.inputField}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button 
              onClick={sendMessage} 
              className={styles.sendButton}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar (Dynamic Recommendations) */}
      {showSidebar && (
        <aside className={styles.rightSidebar}>
          <div className={styles.recommendationsSectionHeader}>
            <h3>Recommendations</h3>
            <button 
              onClick={() => setShowSidebar(false)}
              className={styles.closeRecommendationsButton}
            >
              ×
            </button>
          </div>
          <div className={styles.recommendationsContainer}>
            {recommendations.map(renderRecommendationCard)}
          </div>
        </aside>
      )}
    </div>
  );
}