import React, { useState } from 'react';
import { X, Send, Bot, User, CheckCircle2, PhoneCall } from 'lucide-react';
import { CLINIC_LOGO_URL } from '../../data/mockData';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: '¡Hola, Carolina! Soy Sofía, tu Asistente Virtual de SaludPortal EPS Sanitas. ¿En qué puedo orientarte hoy respecto a tus citas, copagos o autorizaciones?',
      time: 'Ahora',
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Generate intelligent clinical assistance response
    setTimeout(() => {
      let botReply = 'Entendido. Para consultar el estado de autorizaciones MIPRES o copagos reglamentarios, puedes ingresar al módulo "Buscar y Agendar Citas" o llamarnos al #936 desde tu celular.';
      const lower = userText.toLowerCase();

      if (lower.includes('copago') || lower.includes('costo') || lower.includes('precio') || lower.includes('pago')) {
        botReply = 'Para tu plan EPS Sanitas Plan Premium (Categoría A), el copago establecido por la Resolución MinSalud es de $4.500 COP para consultas presenciales, y se encuentra 100% exento en modalidad de telemedicina.';
      } else if (lower.includes('cancelar') || lower.includes('reprogramar') || lower.includes('mover')) {
        botReply = 'Puedes reprogramar o cancelar tus citas en la pestaña "Mis Citas Médicas" con al menos 2 horas de anticipación para no generar penalizaciones conforme a la Resolución 1552.';
      } else if (lower.includes('laboratorio') || lower.includes('examen') || lower.includes('resultado')) {
        botReply = 'Tus resultados de laboratorio recientes (como el Perfil Lipídico Completo del 12 Oct) ya están disponibles en la sección "Historial Clínico y Exámenes" para visualización y descarga en PDF.';
      } else if (lower.includes('urgencia') || lower.includes('dolor') || lower.includes('emergencia')) {
        botReply = 'Si presentas una urgencia médica o dolor agudo, por favor dirígete de inmediato a la Clínica Reina Sofía o marca el #936 (01 8000 919100) para asignación de ambulancia 24/7.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const quickQuestions = [
    '¿Cuál es el valor de mi copago?',
    '¿Cómo descargo mis exámenes?',
    '¿Cómo reprogramar mi cita de odontología?',
    'Líneas de urgencia 24/7',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-[#dce9ff] flex flex-col h-[520px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#001428] to-[#0f2942] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-[#6ffbbe]" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00a270] ring-2 ring-[#001428]"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold">Sofía • SaludPortal</h3>
                <span className="text-[10px] bg-[#0051d5] text-white px-1.5 py-0.2 rounded font-semibold">24/7</span>
              </div>
              <p className="text-[11px] text-[#7991af]">Asistente Virtual Clínico EPS Sanitas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Cerrar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8f9ff]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  m.sender === 'user' ? 'bg-[#0051d5] text-white' : 'bg-[#e5eeff] text-[#0051d5]'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[78%] space-y-1 ${m.sender === 'user' ? 'items-end' : ''}`}>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#0051d5] text-white rounded-tr-xs'
                      : 'bg-white text-[#0b1c30] border border-[#dce9ff] shadow-xs rounded-tl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-[#74777e] px-1 block">{m.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Question Chips */}
        <div className="px-3 py-2 bg-white border-t border-[#eff4ff] flex gap-1.5 overflow-x-auto scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputValue(q);
              }}
              className="text-[11px] text-[#0051d5] bg-[#eff4ff] hover:bg-[#dce9ff] px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 transition-colors font-medium border border-[#dce9ff]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#e5eeff] flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu consulta clínica aquí..."
            className="flex-1 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl px-3 py-2 text-xs text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
          />
          <button
            type="submit"
            className="p-2 bg-[#0051d5] text-white rounded-xl hover:bg-[#003ea8] transition-colors shrink-0"
            aria-label="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
