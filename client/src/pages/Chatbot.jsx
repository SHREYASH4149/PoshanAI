import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Loader, Sparkles, RotateCcw, Mic } from 'lucide-react';

const suggestedQuestions = [
  'What is the recommended diet for a 3-year-old with MAM?',
  'How to calculate BMI for children under 5?',
  'What are the signs of severe malnutrition?',
  'Which foods are rich in iron for toddlers?',
  'How often should weight be measured at Anganwadi?',
];

const botResponses = {
  default: "I'm PoshanAI Assistant, your nutrition advisor for Anganwadi centers. I can help you with child nutrition guidance, malnutrition assessment, diet recommendations, and government scheme information. How can I help you today?",
  mam: "For a 3-year-old with Moderate Acute Malnutrition (MAM):\n\n**Diet Recommendations:**\n• Energy: 100–130 kcal/kg/day\n• Protein: 3–4 g/kg/day\n• Micronutrient supplements as per ICDS protocol\n\n**Food suggestions:**\n• Fortified dal-khichdi with ghee\n• Egg with rice twice a week\n• Sattu porridge with jaggery\n• Banana, papaya, green leafy vegetables\n\n**Monitoring:** Weigh weekly, measure MUAC bi-weekly. Refer to NRC if no improvement in 4 weeks.",
  bmi: "For children under 5, WHO uses **Weight-for-Height Z-score (WHZ)** instead of BMI:\n\n• **Normal:** WHZ > -2\n• **MAM:** WHZ between -3 and -2\n• **SAM:** WHZ < -3 or MUAC < 11.5 cm\n\nMUAC (Mid-Upper Arm Circumference) is easier to measure:\n• ≥13.5 cm: Normal\n• 12.5–13.5 cm: At risk\n• <12.5 cm: SAM\n\nAlways cross-reference with WHO growth charts.",
  signs: "**Signs of Severe Acute Malnutrition (SAM):**\n\n**Visible severe wasting:**\n• Extreme thinness, ribs visible\n• Loose, wrinkled skin (skin-and-bones appearance)\n\n**Oedema:**\n• Bilateral pitting oedema of feet/legs\n• Swollen face (kwashiorkor)\n\n**MUAC < 11.5 cm**\n\n**Complications to watch for:**\n• Hypothermia, hypoglycemia\n• Severe infections\n• Lethargy, unresponsive\n\n⚠️ SAM cases must be referred to NRC immediately.",
  iron: "**Iron-rich foods for toddlers (1–5 years):**\n\n**Animal sources (high bioavailability):**\n• Chicken liver (excellent source)\n• Egg yolk\n• Lean meat, fish\n\n**Plant sources (pair with Vitamin C to enhance absorption):**\n• Spinach, fenugreek leaves\n• Lentils (masoor, moong dal)\n• Rajma (kidney beans)\n• Jaggery, sesame seeds\n\n**Tip:** Avoid tea/coffee with meals as tannins inhibit iron absorption. Give amla or lemon juice with iron-rich foods.",
};

function getResponse(message) {
  const m = message.toLowerCase();
  if (m.includes('mam') || m.includes('diet') || m.includes('3-year') || m.includes('moderate')) return botResponses.mam;
  if (m.includes('bmi') || m.includes('calculate') || m.includes('measure')) return botResponses.bmi;
  if (m.includes('sign') || m.includes('severe') || m.includes('malnutrition')) return botResponses.signs;
  if (m.includes('iron') || m.includes('food')) return botResponses.iron;
  return "That's a great question! As an AI nutrition advisor, I can tell you that every child's nutritional needs depend on their age, weight, health status, and local food availability.\n\nFor personalized guidance, I recommend:\n1. Consulting your CDPO supervisor\n2. Referring to the ICDS nutrition guidelines\n3. Using PoshanAI's nutrition analysis tool\n\nIs there something specific about child nutrition you'd like to know?";
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: botResponses.default, time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
    const botMsg = { id: Date.now() + 1, role: 'bot', text: getResponse(text), time: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const reset = () => setMessages([{ id: 1, role: 'bot', text: botResponses.default, time: new Date() }]);

  const formatText = (text) => text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    return <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: bold || '&nbsp;' }} />;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="page-header">AI Nutrition Assistant</h1>
          <p className="page-subheader">Ask anything about child nutrition, malnutrition, or Anganwadi protocols</p>
        </div>
        <button onClick={reset} className="btn-ghost text-sm flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Suggestions */}
        <div className="hidden lg:flex flex-col gap-3 w-64 flex-shrink-0">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-green-400" />
              <h3 className="text-white font-semibold text-sm">Suggested Questions</h3>
            </div>
            <div className="space-y-2">
              {suggestedQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left text-xs text-white/50 hover:text-white hover:bg-white/10 p-2.5 rounded-lg transition-all border border-transparent hover:border-white/10"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/60 text-xs">AI Model: GPT-4 Nutrition</span>
            </div>
            <p className="text-white/30 text-xs">Specialized in Indian child nutrition and ICDS protocols.</p>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col glass-card overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'bot' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-orange-500 to-amber-600'
                }`}>
                  {msg.role === 'bot' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-lg rounded-2xl px-4 py-3 text-sm space-y-1 ${
                  msg.role === 'bot'
                    ? 'bg-white/5 border border-white/10 text-white/80 rounded-tl-none'
                    : 'bg-green-500/20 border border-green-500/20 text-white rounded-tr-none'
                }`}>
                  {formatText(msg.text)}
                  <p className="text-white/25 text-xs pt-1">{msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                  <Loader className="w-4 h-4 text-green-400 animate-spin" />
                  <span className="text-white/40 text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/5 p-4">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask about child nutrition, malnutrition, diet plans..."
                className="input-field flex-1 text-sm"
                disabled={loading}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn-primary px-4 py-3 flex-shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
