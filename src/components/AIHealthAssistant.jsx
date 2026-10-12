import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  AlertTriangle, 
  Calendar, 
  Stethoscope, 
  Pill, 
  HelpCircle, 
  CheckCircle, 
  User,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { aiHealthService } from '../services/aiHealthService';
import { medicineService } from '../services/medicineService';

const AIHealthAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: 'નમસ્તે! I am your **MediCare AI Clinical Assistant** (ગુજરાત સ્વાસ્થ્ય સહાયક). You can ask me in **Gujarati or English** about your symptoms, specialist doctors in Gujarat, or PMJAY-MA scheme benefits.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'છાતીમાં દુખાવો (Chest Pain)',
        'તાવ અને શરદી (Fever & Cold)',
        'PMJAY-MA યોજના હોસ્પિટલ',
        'ગોઠણ/સાંધાનો દુખાવો (Joint Pain)',
        'માથાનો દુખાવો (Headache)',
        'Check Paracetamol dosage'
      ]
    }
  ]);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customText = null) => {
    const textToSend = customText || inputQuery;
    if (!textToSend || !textToSend.trim() || loading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      // Check if user is asking about medication
      if (textToSend.toLowerCase().startsWith('check ') || textToSend.toLowerCase().includes('dosage') || textToSend.toLowerCase().includes('medicine') || textToSend.toLowerCase().includes('drug')) {
        const drugName = textToSend.replace(/(check|dosage|medicine|drug|for|of|the)/gi, '').trim();
        const drugs = await medicineService.searchDrugs(drugName || 'Paracetamol');
        const drug = drugs[0];

        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          isMedication: true,
          drug,
          text: `Here is the OpenFDA clinical summary for **${drug.brandName}** (${drug.genericName}):`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        // Triage symptoms
        const triageResult = await aiHealthService.triageSymptoms(textToSend);
        const botMsg = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          triage: triageResult,
          text: triageResult.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: 'I encountered an issue processing your query. Please select a specialist department from our directory or call our 24/7 helpdesk.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          backgroundColor: '#0B6E99',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50px',
          padding: '0.85rem 1.35rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontWeight: '700',
          fontSize: '0.92rem',
          boxShadow: '0 10px 25px rgba(11, 110, 153, 0.4)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        aria-label="Open MediCare AI Health Assistant"
      >
        <Sparkles size={20} color="#FACC15" />
        <span>MediCare AI Assistant</span>
        <div
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#10B981',
            borderRadius: '50%',
            boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.3)'
          }}
        />
      </button>

      {/* Interactive Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: '420px',
            maxWidth: 'calc(100vw - 32px)',
            height: '580px',
            maxHeight: 'calc(100vh - 120px)',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1.1rem 1.25rem',
              backgroundColor: '#0B6E99',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={22} color="#ffffff" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
                  MediCare AI Triage (ગુજરાત સહાયક)
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#E0F2FE' }}>
                  ગુજરાતી & English Clinical AI • PMJAY-MA Support
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                opacity: 0.85,
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
              aria-label="Close Assistant"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              backgroundColor: '#F8FAFC'
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '100%'
                  }}
                >
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      backgroundColor: isUser ? 'var(--primary)' : '#ffffff',
                      color: isUser ? '#ffffff' : 'var(--text-dark)',
                      fontSize: '0.88rem',
                      lineHeight: '1.45',
                      boxShadow: isUser ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                      border: isUser ? 'none' : '1px solid var(--border)',
                      maxWidth: '92%'
                    }}
                  >
                    <div>{msg.text}</div>

                    {/* Triage Output Card */}
                    {msg.triage && (
                      <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div
                          style={{
                            backgroundColor: msg.triage.urgency === 'Emergency' ? '#FEE2E2' : '#EFF6FF',
                            padding: '0.6rem 0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            color: msg.triage.urgency === 'Emergency' ? '#991B1B' : '#1E40AF',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <AlertTriangle size={15} />
                          <span>{msg.triage.triageLevel}</span>
                        </div>

                        {msg.triage.clinicalWarning && (
                          <div style={{ fontSize: '0.78rem', color: '#991B1B', lineHeight: '1.35' }}>
                            <strong>⚠️ Critical Notice:</strong> {msg.triage.clinicalWarning}
                          </div>
                        )}

                        {msg.triage.suggestedDoctors && msg.triage.suggestedDoctors.length > 0 && (
                          <div style={{ marginTop: '0.35rem' }}>
                            <strong style={{ fontSize: '0.78rem', color: 'var(--primary-dark)', display: 'block', marginBottom: '0.3rem' }}>
                              Recommended Specialists:
                            </strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              {msg.triage.suggestedDoctors.map(doc => (
                                <div
                                  key={doc.id}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.5rem 0.65rem',
                                    backgroundColor: '#F1F5F9',
                                    borderRadius: '6px',
                                    fontSize: '0.76rem'
                                  }}
                                >
                                  <div>
                                    <div style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{doc.name}</div>
                                    <div style={{ color: 'var(--text-muted)' }}>{doc.department} • {doc.experience}</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsOpen(false);
                                      navigate(`/book-appointment?doctorId=${doc.id}`);
                                    }}
                                    className="btn btn-primary btn-sm"
                                    style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
                                  >
                                    Book
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Medication Output Card */}
                    {msg.drug && (
                      <div
                        style={{
                          marginTop: '0.75rem',
                          backgroundColor: '#F0FDF4',
                          border: '1px solid #BBF7D0',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          fontSize: '0.8rem',
                          color: '#166534'
                        }}
                      >
                        <div style={{ fontWeight: '800', fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                          💊 {msg.drug.brandName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#15803D', marginBottom: '0.4rem' }}>
                          Category: {msg.drug.category}
                        </div>
                        <div style={{ marginBottom: '0.3rem' }}>
                          <strong>Indication:</strong> {msg.drug.indication}
                        </div>
                        <div>
                          <strong>Standard Dosage:</strong> {msg.drug.dosage}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(sug)}
                          style={{
                            fontSize: '0.74rem',
                            padding: '0.35rem 0.65rem',
                            backgroundColor: '#ffffff',
                            border: '1px solid var(--border)',
                            borderRadius: '20px',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <RefreshCw size={14} className="spin" />
                <span>MediCare AI analyzing symptoms...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="લક્ષણો અથવા દવા લખો (e.g. તાવ, છાતીમાં દુખાવો, PMJAY, Paracetamol)..."
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: inputQuery.trim() ? 'var(--primary)' : '#E2E8F0',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputQuery.trim() ? 'pointer' : 'default'
              }}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIHealthAssistant;
