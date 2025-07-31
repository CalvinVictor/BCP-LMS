import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Gemini Pro API Configuration
  const GEMINI_API_KEY = '';
  
  const callGeminiAPI = async (message) => {
    try {
      const educationalResponses = {
        'oxygen': `🧪 **Oxygen - The Life-Giving Element:**

Oxygen (O₂) is essential for life and one of the most important elements in chemistry!

**Basic Properties:**
• **Atomic Number**: 8
• **Symbol**: O
• **Colorless, odorless gas** at room temperature
• **Highly reactive** - supports combustion
• **Makes up 21%** of Earth's atmosphere

**Key Facts:**
• **Molecular Form**: O₂ (two oxygen atoms bonded together)
• **Essential for Respiration**: Cells use it to produce energy
• **Combustion Support**: Fire needs oxygen to burn
• **Ozone**: O₃ protects us from UV radiation

**Biological Importance:**
- 🫁 **Breathing**: Lungs extract O₂ from air
- 🩸 **Blood Transport**: Hemoglobin carries oxygen
- ⚡ **Cellular Energy**: Powers ATP production
- 🧬 **Metabolism**: Breaks down food for energy

**Industrial Uses:**
- Steel production and welding
- Medical oxygen therapy
- Water treatment
- Rocket fuel oxidizer

**Fun Fact**: Without oxygen, complex life as we know it couldn't exist! Would you like to know more about oxygen's role in photosynthesis or cellular respiration?`,

        'react': `⚛️ **React Development Guide:**

React is a powerful JavaScript library for building user interfaces!

**Core Concepts:**
• **Components**: Reusable UI building blocks
• **JSX**: JavaScript + HTML syntax
• **Props**: Data passed between components
• **State**: Component's internal data
• **Hooks**: Functions that let you use state and lifecycle features

**Essential Hooks:**
- \`useState\`: Manage component state
- \`useEffect\`: Handle side effects
- \`useContext\`: Share data across components
- \`useRef\`: Access DOM elements directly

**Best Practices:**
✅ Keep components small and focused
✅ Use functional components with hooks
✅ Implement proper prop validation
✅ Follow naming conventions
✅ Optimize with React.memo when needed

**Common Patterns:**
- Conditional rendering: \`{condition && <Component />}\`
- List rendering: \`{items.map(item => <Item key={item.id} />)}\`
- Event handling: \`onClick={() => handleClick()}\`

**Project Structure:**
\`\`\`
src/
  components/
  pages/
  hooks/
  utils/
  styles/
\`\`\`

Want to dive deeper into any specific React concept?`,

        'node': `🟢 **Node.js Backend Development:**

Node.js enables server-side JavaScript development with incredible performance!

**Key Features:**
• **Event-Driven**: Non-blocking I/O operations
• **Fast**: Built on Chrome's V8 engine
• **NPM**: Massive package ecosystem
• **Cross-Platform**: Runs everywhere

**Core Modules:**
- \`http\`: Create web servers
- \`fs\`: File system operations
- \`path\`: Handle file paths
- \`crypto\`: Cryptographic functionality
- \`util\`: Utility functions

**Popular Frameworks:**
🚀 **Express.js**: Minimal and flexible
🏗️ **Nest.js**: Scalable and modular
⚡ **Fastify**: High performance
🔥 **Koa.js**: Next-generation web framework

**Essential Packages:**
- \`express\`: Web application framework
- \`mongoose\`: MongoDB object modeling
- \`jsonwebtoken\`: JWT authentication
- \`bcrypt\`: Password hashing
- \`cors\`: Cross-origin resource sharing

**REST API Example:**
\`\`\`javascript
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
\`\`\`

**Best Practices:**
✅ Use environment variables
✅ Implement proper error handling
✅ Add input validation
✅ Use middleware for common tasks
✅ Structure your project well

Ready to build something amazing with Node.js?`,

        'css': `🎨 **CSS & Styling Mastery:**

Master the art of web styling with modern CSS techniques!

**CSS Fundamentals:**
• **Selectors**: Target HTML elements
• **Box Model**: Content, padding, border, margin
• **Positioning**: Static, relative, absolute, fixed
• **Display**: Block, inline, flex, grid

**Modern Layout:**
🔥 **Flexbox**: One-dimensional layouts
\`display: flex; justify-content: center; align-items: center;\`

🔥 **CSS Grid**: Two-dimensional layouts
\`display: grid; grid-template-columns: 1fr 2fr 1fr;\`

**Responsive Design:**
- Mobile-first approach
- Media queries: \`@media (min-width: 768px)\`
- Flexible units: rem, em, %, vw, vh
- Responsive images: \`max-width: 100%\`

**CSS Animations:**
\`\`\`css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate { animation: fadeIn 0.5s ease-in; }
\`\`\`

**Modern CSS Features:**
- CSS Variables: \`--primary-color: #3498db;\`
- CSS Functions: \`calc(), clamp(), min(), max()\`
- CSS Logical Properties
- Container Queries

**Tailwind CSS Benefits:**
✅ Utility-first approach
✅ Rapid development
✅ Consistent design system
✅ Built-in responsive design
✅ Easy customization

Which CSS topic would you like to explore further?`,

        'javascript': `🟨 **JavaScript Programming Guide:**

JavaScript powers the modern web - let's master it together!

**ES6+ Features:**
• **Arrow Functions**: \`const add = (a, b) => a + b\`
• **Template Literals**: \`Hello \${name}!\`
• **Destructuring**: \`const {name, age} = user\`
• **Spread Operator**: \`[...array1, ...array2]\`
• **Async/Await**: Handle promises elegantly

**Core Concepts:**
🔧 **Variables**: let, const, var
🔄 **Functions**: Regular, arrow, async
📦 **Objects**: Creation, methods, prototypes
📋 **Arrays**: Methods, iteration, manipulation
🎯 **Events**: DOM interaction, event listeners

**Advanced Topics:**
- **Closures**: Functions with persistent scope
- **Prototypes**: Object inheritance
- **Event Loop**: Asynchronous execution
- **Modules**: ES6 import/export
- **Error Handling**: try/catch/finally

**Useful Array Methods:**
\`\`\`javascript
// Transform data
const doubled = numbers.map(n => n * 2);
const filtered = users.filter(u => u.active);
const total = prices.reduce((sum, price) => sum + price, 0);

// Find elements
const user = users.find(u => u.id === 1);
const exists = users.some(u => u.admin);
\`\`\`

**Async JavaScript:**
\`\`\`javascript
// Promises
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data));

// Async/Await
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
\`\`\`

**DOM Manipulation:**
- \`document.querySelector()\`
- \`element.addEventListener()\`
- \`element.classList.add/remove()\`
- \`element.textContent\`

What JavaScript concept would you like to practice?`
      };

      // Determine response based on message content
      let response = "I'd be happy to help you with your studies! Here are some ways I can assist:\n\n• **Explain complex concepts** in simple terms\n• **Help with homework** and assignments\n• **Create study plans** tailored to your needs\n• **Provide practice problems** and solutions\n• **Review and summarize** course material\n• **Suggest learning resources** and techniques\n\nWhat specific topic or subject would you like to explore today? Just ask me anything about your studies!";

      const msgLower = message.toLowerCase();
      if (msgLower.includes('oxygen') || msgLower.includes('o2') || msgLower.includes('chemistry')) {
        response = educationalResponses.oxygen;
      } else if (msgLower.includes('react') || msgLower.includes('jsx') || msgLower.includes('component')) {
        response = educationalResponses.react;
      } else if (msgLower.includes('node') || msgLower.includes('nodejs') || msgLower.includes('backend') || msgLower.includes('server')) {
        response = educationalResponses.node;
      } else if (msgLower.includes('css') || msgLower.includes('styling') || msgLower.includes('tailwind')) {
        response = educationalResponses.css;
      } else if (msgLower.includes('javascript') || msgLower.includes('js') || msgLower.includes('function')) {
        response = educationalResponses.javascript;
      } else if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('how are you')) {
        response = "Hello! 👋 I'm your AI Learning Assistant, and I'm doing great - ready to help you excel in your studies!\n\nI can assist you with:\n• 📚 Explaining difficult concepts\n• 📝 Homework and assignments\n• 🎯 Study strategies and planning\n• 🧠 Memory techniques\n• 📊 Practice problems\n\nWhat subject or topic would you like to explore today?";
      }

      // Simulate API delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      return response;

    } catch (error) {
      console.error('API Error:', error);
      return "I apologize, but I'm having trouble connecting right now. Please try asking your question again, and I'll do my best to help with your studies!";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setShowWelcome(false);

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await callGeminiAPI(userMessage);
      
      setIsTyping(false);
      
      // Add AI response
      setMessages(prev => [...prev, {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date()
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = [
    "Explain React components",
    "Help with Node.js backend",
    "CSS Grid vs Flexbox",
    "JavaScript async/await"
  ];

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setTimeout(handleSendMessage, 100);
  };

  const formatMessage = (content) => {
    // Convert markdown-style formatting to JSX
    const parts = content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={index} className="font-bold text-blue-300 mb-2">{line.slice(2, -2)}</div>;
      }
      if (line.startsWith('• ')) {
        return <div key={index} className="ml-4 mb-1">• {line.slice(2)}</div>;
      }
      if (line.startsWith('- ')) {
        return <div key={index} className="ml-4 mb-1">- {line.slice(2)}</div>;
      }
      if (line.startsWith('✅ ')) {
        return <div key={index} className="ml-4 mb-1 text-green-400">✅ {line.slice(2)}</div>;
      }
      if (line.includes('`') && line.includes('`')) {
        const parts = line.split('`');
        return (
          <div key={index} className="mb-1">
            {parts.map((part, i) => 
              i % 2 === 1 ? 
                <code key={i} className="bg-gray-700 px-1 rounded text-blue-300">{part}</code> : 
                part
            )}
          </div>
        );
      }
      return line ? <div key={index} className="mb-1">{line}</div> : <div key={index} className="mb-2"></div>;
    });
    return <div>{parts}</div>;
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        >
          <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        </button>
      </div>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-96 h-[600px] bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Learning Assistant</h3>
                <p className="text-blue-100 text-sm">Ready to help you learn</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {showWelcome && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Welcome to your AI Learning Assistant!</h3>
                <p className="text-gray-400 text-sm mb-6">I'm here to help you with programming, web development, and your studies!</p>
                
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors border border-gray-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-br from-purple-500 to-purple-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    <div className="text-sm">
                      {message.type === 'user' ? message.content : formatMessage(message.content)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-800 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about programming..."
                className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .chat-window {
            width: calc(100vw - 2rem);
            height: calc(100vh - 2rem);
            bottom: 1rem;
            right: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default AIChatWidget;