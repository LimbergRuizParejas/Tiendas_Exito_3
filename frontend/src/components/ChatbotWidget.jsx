import React, { useState } from 'react';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! Bienvenido a Tiendas Exito Soy el asistente virtual, ¿en qué puedo ayudarte?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Simulación respuesta (reemplaza con llamada al backend)
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: `Entiendo que dices: "${input}". ¡Gracias por tu consulta!` }
      ]);
    }, 800);
  };

  return (
    <div className={`chatbot-widget ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header" onClick={() => setIsOpen(!isOpen)}>
        🤖 Asistente De Tiendas Exito
      </div>
      {isOpen && (
        <div className="chatbot-body">
          <div className="messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.from}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input 
              type="text" 
              placeholder="Escribe algo..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
