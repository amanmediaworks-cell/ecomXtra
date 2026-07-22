import React, { useState, useEffect, useRef, useCallback } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'

// ── Knowledge Base ────────────────────────────────────────────────────────────
const KB = [
  {
    patterns: ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'hola', 'sup', 'yo'],
    reply: 'Namaste! 👋 Main EcomXtra ka AI Growth Agent hoon. Main aapki help kar sakta hoon:\n\n• Pricing & packages\n• eCommerce services info\n• WhatsApp AI bot details\n• Consultation booking\n\nAap kya jaanna chahte hain?'
  },
  {
    patterns: ['price', 'pricing', 'cost', 'package', 'kitna', 'rate', 'fees', 'charge', 'budget'],
    reply: '💰 EcomXtra Core Packages:\n\n1. Shopify / WooCommerce Custom Store\n   → ₹3,99,000 / $4,999 (one-time)\n\n2. AI WhatsApp Deal-Closer Agent\n   → ₹1,99,000 / $2,499 (one-time)\n\n3. Marketing Automation Setup\n   → ₹1,49,000 / $1,999 per month\n\n4. Full eCommerce Growth Bundle\n   → Custom quote\n\nWant to book a free consultation? Type "book" or click the button below!'
  },
  {
    patterns: ['service', 'services', 'offer', 'kya karte', 'what do you', 'help', 'kya hai'],
    reply: '🚀 EcomXtra Services:\n\n• Shopify & WooCommerce Development\n• Headless eCommerce Architecture\n• AI Chatbots (Hindi/Hinglish/English)\n• WhatsApp Business Automation\n• Amazon/Flipkart/Meesho Ranking Audits\n• Marketing Automation & CRO\n• Custom API Integrations\n• Social Media Account Management\n\nKaunsi service ke baare mein aur jaanna chahte ho?'
  },
  {
    patterns: ['whatsapp', 'wa bot', 'auto reply', 'chatbot', 'bot', 'ai agent', 'hinglish'],
    reply: '🤖 Hamaara AI WhatsApp Agent:\n\n✓ Auto-responds in English, Hindi & Hinglish\n✓ Qualifies leads automatically\n✓ Closes deals without human intervention\n✓ Available 24/7\n✓ Learns your product catalog\n✓ Handles objections naturally\n\nAverage deal closure rate: 45%+\n\nInterested? Type "book" to schedule a demo!'
  },
  {
    patterns: ['amazon', 'flipkart', 'meesho', 'jiomart', 'marketplace', 'ranking', 'seo', 'listing'],
    reply: '📊 Marketplace Ranking & Audit:\n\n✓ Amazon In-App SEO → #1 Best Seller results\n✓ Flipkart Catalog Optimization → 1.8x conversions\n✓ Meesho Tier 2/3 Strategy → 310% order volume\n✓ JioMart Keyword Seeding → 20k monthly orders\n\nWe audit your current listings, fix titles/images/keywords, and boost your organic search rankings.\n\nWant a free marketplace audit? Type "book"!'
  },
  {
    patterns: ['shopify', 'woocommerce', 'store', 'website', 'ecommerce', 'headless', 'theme'],
    reply: '🛒 Store Development:\n\n✓ Custom Shopify themes from scratch\n✓ WooCommerce with advanced plugins\n✓ Headless architecture (ultra-fast)\n✓ Multi-currency & multi-language\n✓ Mobile-first responsive design\n✓ Payment gateway integrations\n✓ Inventory & fulfillment sync\n\nTimeline: 4-8 weeks | Starting ₹3,99,000\n\nBook a free scope call → type "book"'
  },
  {
    patterns: ['book', 'consult', 'consultation', 'schedule', 'call', 'meeting', 'demo', 'appointment', 'baat', 'milna'],
    reply: null, // handled by startQuestionnaire
    action: 'questionnaire'
  },
  {
    patterns: ['contact', 'email', 'reach', 'phone', 'address', 'location', 'office'],
    reply: '📬 Contact EcomXtra:\n\n• Email: hello@ecomxtra.com\n• Location: New Delhi, India\n• Parent Company: Identifier IT Solutions\n\nOr scroll down to our Contact section to fill the form directly. Response time: within 2 hours!'
  },
  {
    patterns: ['parent', 'identifier', 'company', 'about', 'who', 'kaun', 'team', 'founders'],
    reply: '🏢 About EcomXtra:\n\nEcomXtra is a results-driven eCommerce agency operating under Identifier IT Solutions — an Indian IT conglomerate.\n\nWe specialize in helping D2C brands and marketplace sellers scale faster through automation, AI, and high-converting design.\n\nFounded in New Delhi | Serving clients across India & globally.'
  },
  {
    patterns: ['theek', 'thik', 'accha', 'okay', 'ok', 'sure', 'haan', 'yes', 'yep', 'thanks', 'thank you', 'dhanyawad'],
    reply: 'Shukriya! 🙏 Koi aur sawaal ho toh zaroor poochhen. Main yahan hoon aapki madad ke liye!\n\nType "services" for our offerings, "pricing" for packages, or "book" to schedule a consultation.'
  },
]

const INITIAL_MESSAGE = {
  id: 1,
  sender: 'bot',
  text: 'Namaste! 🙏 Main EcomXtra ka AI Growth Agent hoon.\n\nMain aapki help karoonga:\n• Pricing & packages\n• eCommerce services\n• Marketplace rankings\n• Consultation booking\n\nKya poochna chahte hain aap?'
}

function Chatbot({ theme, addLog }) {
  const [isOpen, setIsOpen]     = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [inputText, setInputText] = useState('')
  const [qStep, setQStep]       = useState(null)   // null | 'name' | 'email' | 'biz'
  const answersRef              = useRef({ name: '', email: '', business: '' })

  // Messages: load from localStorage once, then manage in state
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('ecom_chats')
      return saved ? JSON.parse(saved) : [INITIAL_MESSAGE]
    } catch {
      return [INITIAL_MESSAGE]
    }
  })

  const chatEndRef = useRef(null)
  const inputRef   = useRef(null)

  // Persist messages
  useEffect(() => {
    try { localStorage.setItem('ecom_chats', JSON.stringify(messages)) } catch {}
  }, [messages])

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  const pushMsg = useCallback((sender, text) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender, text }])
  }, [])

  const botReply = useCallback((text, delay = 900) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      pushMsg('bot', text)
    }, delay)
  }, [pushMsg])

  // ── Questionnaire ──────────────────────────────────────────────────────────
  const startQuestionnaire = useCallback(() => {
    setQStep('name')
    botReply('Perfect! Let\'s get you scheduled. 📅\n\nFirst, what\'s your full name?', 600)
  }, [botReply])

  const processQuestionnaire = useCallback((val) => {
    if (qStep === 'name') {
      answersRef.current.name = val
      setQStep('email')
      botReply(`Great, ${val}! 👍\n\nWhat's your email address? (We'll send the calendar invite here)`)
    } else if (qStep === 'email') {
      // Basic email validation
      if (!val.includes('@') || !val.includes('.')) {
        botReply('Hmm, that doesn\'t look like a valid email. Please try again:')
        return
      }
      answersRef.current.email = val
      setQStep('biz')
      botReply('Got it! 📧\n\nLastly, what type of business do you run?\n(e.g. Fashion, Fitness, Food, Electronics, etc.)')
    } else if (qStep === 'biz') {
      answersRef.current.business = val
      const final = { ...answersRef.current }
      setQStep(null)
      answersRef.current = { name: '', email: '', business: '' }

      // Persist lead
      try { localStorage.setItem('ecom_chatbot_lead', JSON.stringify(final)) } catch {}

      // Fire sync log
      addLog?.(`[AI Chatbot] 🎯 New lead captured: ${final.name} (${final.email}) — Business: ${final.business}`)

      botReply(
        `✅ Perfect! Here's a summary of your booking request:\n\n` +
        `• Name: ${final.name}\n` +
        `• Email: ${final.email}\n` +
        `• Business: ${final.business}\n\n` +
        `Our team will reach out within 2 hours to confirm your consultation slot! 🚀\n\n` +
        `Meanwhile, feel free to browse our services or ask any questions.`,
        700
      )
    }
  }, [qStep, botReply, addLog])

  // ── Message Handler ───────────────────────────────────────────────────────
  const handleSend = useCallback((e) => {
    e?.preventDefault()
    const val = inputText.trim()
    if (!val || isTyping) return

    pushMsg('user', val)
    setInputText('')

    // If in questionnaire mode
    if (qStep !== null) {
      processQuestionnaire(val)
      return
    }

    // Match knowledge base
    const lower = val.toLowerCase()
    const matched = KB.find(entry => entry.patterns.some(p => lower.includes(p)))

    if (matched) {
      if (matched.action === 'questionnaire') {
        startQuestionnaire()
      } else {
        botReply(matched.reply)
      }
    } else {
      botReply(
        `Samajh gaya! 🤔 Aapne pucha: "${val}"\n\n` +
        `Main specifically is topic ke baare mein trained hoon:\n` +
        `• "pricing" — packages & costs\n` +
        `• "services" — what we offer\n` +
        `• "whatsapp" — AI agent details\n` +
        `• "amazon" — marketplace ranking\n` +
        `• "book" — schedule a consultation\n\n` +
        `Ya directly hello@ecomxtra.com pe email karein!`
      )
    }
  }, [inputText, isTyping, qStep, processQuestionnaire, startQuestionnaire, botReply, pushMsg])

  const handleReset = useCallback(() => {
    setMessages([{ ...INITIAL_MESSAGE, id: Date.now() }])
    setQStep(null)
    setIsTyping(false)
    answersRef.current = { name: '', email: '', business: '' }
    setInputText('')
    try { localStorage.removeItem('ecom_chats') } catch {}
  }, [])

  // Quick action buttons
  const quickActions = [
    { label: '💰 Pricing', msg: 'pricing' },
    { label: '🛒 Services', msg: 'services' },
    { label: '🤖 WhatsApp Bot', msg: 'whatsapp' },
    { label: '📅 Book Call', msg: 'book' },
  ]

  const handleQuickAction = useCallback((msg) => {
    pushMsg('user', msg)
    const lower = msg.toLowerCase()
    const matched = KB.find(entry => entry.patterns.some(p => lower.includes(p)))
    if (matched) {
      if (matched.action === 'questionnaire') {
        startQuestionnaire()
      } else {
        botReply(matched.reply)
      }
    }
  }, [pushMsg, startQuestionnaire, botReply])

  const isSwiss = theme === 'swiss'

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* ── Floating Trigger ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI chat assistant"
          className={`group relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isSwiss
              ? 'bg-swiss-text text-swiss-bg hover:shadow-swiss-text/20'
              : 'bg-softly-peach text-softly-bg hover:shadow-softly-peach/30'
          } hover:shadow-2xl`}
        >
          <MessageSquare className="w-6 h-6" />
          {/* Notification dot */}
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* ── Chat Panel ── */}
      {isOpen && (
        <div
          className={`flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
            isSwiss
              ? 'w-[360px] sm:w-[400px] h-[560px] border border-swiss-text bg-swiss-bg'
              : 'w-[360px] sm:w-[400px] h-[560px] border border-softly-sand bg-white rounded-[1.5rem]'
          }`}
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          {/* Header */}
          <div className={`shrink-0 px-4 py-3 flex items-center justify-between ${
            isSwiss ? 'bg-swiss-text text-swiss-bg' : 'bg-softly-sage text-softly-bg'
          }`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isSwiss ? 'bg-swiss-bg text-swiss-text' : 'bg-softly-bg text-softly-sage'
                }`}>AI</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white" />
              </div>
              <div>
                <span className={`font-clash text-xs font-black tracking-widest uppercase block leading-none`}>
                  EcomXtra AI Agent
                </span>
                <span className="text-[10px] opacity-70 leading-none">
                  {isTyping ? 'Typing...' : 'Hindi / Hinglish / English'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                className="text-[10px] opacity-60 hover:opacity-100 px-2 py-0.5 border border-current/30 rounded"
              >
                New Chat
              </button>
              <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${
            isSwiss ? 'bg-swiss-bg/60' : 'bg-softly-sand/20'
          }`}>
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'bot' && (
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black mr-2 mt-0.5 ${
                    isSwiss ? 'bg-swiss-text text-swiss-bg' : 'bg-softly-sage text-softly-bg'
                  }`}>AI</div>
                )}
                <div className={`max-w-[82%] px-3 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? isSwiss
                      ? 'bg-swiss-text text-swiss-bg'
                      : 'bg-softly-peach text-softly-bg rounded-[1rem] rounded-tr-sm'
                    : isSwiss
                      ? 'bg-white border border-swiss-text/20 text-swiss-text'
                      : 'bg-white border border-softly-sand text-softly-text rounded-[1rem] rounded-tl-sm shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${
                  isSwiss ? 'bg-swiss-text text-swiss-bg' : 'bg-softly-sage text-softly-bg'
                }`}>AI</div>
                <div className={`px-4 py-3 ${
                  isSwiss ? 'bg-white border border-swiss-text/20' : 'bg-white border border-softly-sand rounded-[1rem] rounded-tl-sm shadow-sm'
                }`}>
                  <div className="flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions — only when not in questionnaire */}
          {qStep === null && (
            <div className={`shrink-0 px-3 py-2 border-t flex flex-wrap gap-1.5 ${
              isSwiss ? 'border-swiss-text/15 bg-white' : 'border-softly-sand/60 bg-softly-sand/10'
            }`}>
              {quickActions.map(qa => (
                <button
                  key={qa.label}
                  onClick={() => handleQuickAction(qa.msg)}
                  disabled={isTyping}
                  className={`text-[10px] font-bold px-2.5 py-1 transition-all disabled:opacity-40 ${
                    isSwiss
                      ? 'border border-swiss-text/25 hover:bg-swiss-text hover:text-swiss-bg bg-swiss-bg text-swiss-text'
                      : 'border border-softly-sage/25 rounded-full bg-white hover:bg-softly-sage hover:text-softly-bg text-softly-text'
                  }`}
                >
                  {qa.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSend}
            className={`shrink-0 flex gap-2 p-3 border-t ${
              isSwiss ? 'border-swiss-text/20 bg-white' : 'border-softly-sand/60 bg-white'
            }`}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={isTyping}
              placeholder={
                qStep === 'name'  ? 'Enter your full name...' :
                qStep === 'email' ? 'Enter your email address...' :
                qStep === 'biz'   ? 'Your business type...' :
                'Message in English / Hindi / Hinglish...'
              }
              className={`flex-1 text-xs p-2.5 focus:outline-none disabled:opacity-50 ${
                isSwiss
                  ? 'border border-swiss-text/25 focus:border-swiss-text bg-swiss-bg'
                  : 'border border-softly-sand rounded-xl focus:border-softly-sage bg-softly-sand/20'
              }`}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className={`p-2.5 shrink-0 transition-all disabled:opacity-40 ${
                isSwiss
                  ? 'bg-swiss-text text-swiss-bg border border-swiss-text hover:bg-swiss-bg hover:text-swiss-text'
                  : 'bg-softly-sage text-softly-bg rounded-xl hover:bg-softly-peach'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Chatbot
