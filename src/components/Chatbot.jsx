import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageSquare, X, Send, ExternalLink, Phone } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useContactModal } from './ContactModalContext'
import ContactModalTrigger from './ContactModalTrigger'

// ── Knowledge Base ────────────────────────────────────────────────────────────
const KB = [
  {
    patterns: ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'hola', 'sup', 'yo'],
    reply: 'Namaste! 👋 Main EcomXtra ka AI Growth Agent hoon. Main aapki help kar sakta hoon:\n\n• Custom quotations & info\n• eCommerce services info\n• WhatsApp AI bot details\n• Quotations & consultation\n\nAap kya jaanna chahte hain?'
  },
  {
    patterns: ['price', 'pricing', 'cost', 'package', 'kitna', 'rate', 'fees', 'charge', 'budget'],
    reply: '📋 EcomXtra Core Packages & Quotations:\n\nAll our packages (Shopify/WooCommerce stores, AI WhatsApp agents, and marketing automation) are custom-tailored based on your brand requirements.\n\n💬 Chat on WhatsApp (+91 8700259557) or contact us to get a custom quotation!\n👉 https://wa.me/918700259557'
  },
  {
    patterns: ['service', 'services', 'offer', 'kya karte', 'what do you', 'help', 'kya hai'],
    reply: '🚀 EcomXtra Services:\n\n• Shopify & WooCommerce Development\n• Headless eCommerce Architecture\n• AI Chatbots (Hindi/Hinglish/English)\n• WhatsApp Business Automation\n• Amazon/Flipkart/Meesho Ranking Audits\n• Marketing Automation & CRO\n• Custom API Integrations\n• Social Media Account Management\n\nKaunsi service ke baare mein quotation chahte ho?'
  },
  {
    patterns: ['whatsapp', 'wa bot', 'auto reply', 'chatbot', 'bot', 'ai agent', 'hinglish'],
    reply: '🤖 Hamaara AI WhatsApp Agent:\n\n✓ Auto-responds in English, Hindi & Hinglish\n✓ Qualifies leads automatically\n✓ Closes deals without human intervention\n✓ Available 24/7\n✓ Learns your product catalog\n✓ Handles objections naturally\n\nAverage deal closure rate: 45%+\n\nChat on WhatsApp (+91 8700259557) for live demo & quotation!\n👉 https://wa.me/918700259557'
  },
  {
    patterns: ['amazon', 'flipkart', 'meesho', 'jiomart', 'marketplace', 'ranking', 'seo', 'listing'],
    reply: '📊 Marketplace Ranking & Audit:\n\n✓ Amazon In-App SEO → #1 Best Seller results\n✓ Flipkart Catalog Optimization → 1.8x conversions\n✓ Meesho Tier 2/3 Strategy → 310% order volume\n✓ JioMart Keyword Seeding → 20k monthly orders\n\nWe audit your current listings, fix titles/images/keywords, and boost your organic search rankings.\n\nContact us or chat on WhatsApp (+91 8700259557) for a quotation!\n👉 https://wa.me/918700259557'
  },
  {
    patterns: ['shopify', 'woocommerce', 'store', 'website', 'ecommerce', 'headless', 'theme'],
    reply: '🛒 Store Development:\n\n✓ Custom Shopify themes from scratch\n✓ WooCommerce with advanced plugins\n✓ Headless architecture (ultra-fast)\n✓ Multi-currency & multi-language\n✓ Mobile-first responsive design\n✓ Payment gateway integrations\n✓ Inventory & fulfillment sync\n\nTimeline: 4-8 weeks | Custom Quotation\n\nChat on WhatsApp (+91 8700259557) or contact us for a custom quotation!\n👉 https://wa.me/918700259557'
  },
  {
    patterns: ['book', 'consult', 'consultation', 'schedule', 'call', 'meeting', 'demo', 'appointment', 'baat', 'milna', 'quote', 'quotation'],
    reply: null, // handled by startQuestionnaire
    action: 'questionnaire'
  },
  {
    patterns: ['contact', 'email', 'reach', 'phone', 'mobile', 'whatsapp', 'office'],
    reply: '📬 Contact EcomXtra:\n\n• Email: info@ecomxtra.in\n• Mobile / WhatsApp: +91 8700259557\n• Parent Company: Quadranex IT Solutions\n👉 https://quadranex-seven.vercel.app/\n\nOr navigate to our Contact section to fill the form directly. Response time: within 2 hours!'
  },
  {
    patterns: ['parent', 'quadranex', 'identifier', 'company', 'about', 'who', 'kaun', 'team', 'founders'],
    reply: '🏢 About EcomXtra:\n\nEcomXtra is a results-driven eCommerce agency operating under Quadranex IT Solutions.\n👉 https://quadranex-seven.vercel.app/\n\nWe specialize in helping D2C brands and marketplace sellers scale faster through automation, AI, and high-converting design.'
  },
  {
    patterns: ['blog', 'blogs', 'article', 'articles', 'playbook', 'insights', 'read', 'guide', 'post', 'posts'],
    reply: '📚 EcomXtra Insights & Blogs:\n\nCheck out our latest eCommerce & AI playbooks:\n• Hinglish AI WhatsApp Automation for D2C\n• Headless Shopify vs. Liquid Speed Benchmarks\n• Amazon India #1 Ranking Algorithm Playbook\n• Tier-2/3 Regional eCommerce Psychology\n\nVisit our Blog section at /blog to read all in-depth articles!'
  },
  {
    patterns: ['theek', 'thik', 'accha', 'okay', 'ok', 'sure', 'haan', 'yes', 'yep', 'thanks', 'thank you', 'dhanyawad'],
    reply: 'Shukriya! 🙏 Koi aur sawaal ho toh zaroor poochhen. Main yahan hoon aapki madad ke liye!\n\nType "services" for our offerings, "blog" for articles, or "book" to schedule a consultation.'
  },
]

const INITIAL_MESSAGE = {
  id: 1,
  sender: 'bot',
  text: 'Namaste! 🙏 Main EcomXtra ka AI Growth Agent hoon.\n\nMain aapki help karoonga:\n• Custom Quotations\n• eCommerce services\n• Marketplace rankings\n• Consultation booking\n\nKya poochna chahte hain aap?'
}

function Chatbot({
  addLog
}) {
  const { openContactModal } = useContactModal()
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
        `Ya directly info@ecomxtra.in ya +91 8700259557 pe contact karein!`
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
    { label: '📋 Quotation', msg: 'pricing' },
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



  return (
    <div className={`fixed ${isOpen ? 'bottom-4 sm:bottom-6' : 'bottom-20 sm:bottom-[5.5rem]'} right-4 sm:right-6 z-50 flex flex-col items-end gap-3`}>
      <AnimatePresence initial={false}>
        {!isOpen && (
          <m.button
            key="contact-trigger"
            type="button"
            onClick={openContactModal}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="group inline-flex animate-pulse items-center gap-2 rounded-full border border-white/80 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-800 shadow-lg shadow-violet-900/15 transition hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <Phone className="launcher-icon-shake launcher-icon-shake-contact h-4 w-4 text-violet-600" />
            Contact Us
          </m.button>
        )}
        {!isOpen && (
          <m.button
            key="chat-trigger"
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Agent Chat"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, delay: 0.06, ease: 'easeOut' }}
            className="group relative inline-flex animate-pulse items-center gap-2 rounded-full border border-white/80 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-800 shadow-lg shadow-violet-900/15 transition hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <MessageSquare className="launcher-icon-shake launcher-icon-shake-chat h-4 w-4 text-violet-600" />
            AI Agent Chat
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-400 animate-pulse" />
          </m.button>
        )}
        {isOpen && (
          <m.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`flex flex-col shadow-2xl overflow-hidden ${
              'w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px] h-[500px] sm:h-[560px] border-2 border-violet-200 bg-white rounded-[1.8rem]'
            }`}
            style={{ maxHeight: 'calc(100vh - 80px)' }}
          >
          {/* Header */}
          <div className={`shrink-0 px-4 py-3.5 flex items-center justify-between ${
            'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white'
          }`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center p-0.5 bg-white shadow-xs">
                  <img src="/logo.png" alt="EcomXtra AI" className="w-full h-full object-contain" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white" />
              </div>
              <div>
                <span className={`font-clash text-xs font-black tracking-widest uppercase block leading-none`}>
                  EcomXtra AI Agent
                </span>
                <span className="text-[10px] opacity-90 leading-none">
                  {isTyping ? 'Typing...' : 'Hindi / Hinglish / English'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                className="text-[10px] font-bold opacity-80 hover:opacity-100 px-2 py-0.5 border border-white/40 rounded-full"
              >
                New Chat
              </button>
              <button onClick={() => setIsOpen(false)} className="opacity-80 hover:opacity-100 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${
            'bg-violet-50/30'
          }`}>
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full shrink-0 overflow-hidden mr-2 mt-0.5 p-0.5 bg-white border border-gray-200 shadow-xs">
                    <img src="/logo.png" alt="AI" className="w-full h-full object-contain" />
                  </div>
                  )}
                <div className={`max-w-[82%] px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-[1rem] rounded-tr-sm shadow-xs font-medium'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-[1rem] rounded-tl-sm shadow-sm'
                }`}>
                  {typeof m.text === 'string' && /(https:\/\/(?:wa\.me\/[^\s]+|quadranex-seven\.vercel\.app\/?))/g.test(m.text) ? (
                    m.text.split(/(https:\/\/(?:wa\.me\/[^\s]+|quadranex-seven\.vercel\.app\/?))/g).map((part, i) =>
                      part.startsWith('https://wa.me/') ? (
                        <ContactModalTrigger
                          key={i}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-emerald-700"
                        >
                          💬 Chat on WhatsApp (+91 8700259557)
                        </ContactModalTrigger>
                      ) : part.startsWith('https://quadranex-seven.vercel.app') ? (
                        <a
                          key={i}
                          href={part}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-violet-600"
                        >
                          Quadranex IT Solutions
                          <ExternalLink aria-hidden="true" className="h-3 w-3" />
                        </a>
                      ) : (
                        part
                      )
                    )
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full shrink-0 overflow-hidden p-0.5 bg-white border border-gray-200 shadow-xs">
                  <img src="/logo.png" alt="AI" className="w-full h-full object-contain" />
                </div>
                <div className={`px-4 py-3 ${
                  'bg-white border border-slate-200 rounded-[1rem] rounded-tl-sm shadow-sm'
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
              'border-violet-100 bg-violet-50/20'
            }`}>
              {quickActions.map(qa => (
                <button
                  key={qa.label}
                  onClick={() => handleQuickAction(qa.msg)}
                  disabled={isTyping}
                  className={`text-[10px] font-bold px-2.5 py-1 transition-all disabled:opacity-40 ${
                    'border border-violet-200 rounded-full bg-white hover:bg-gradient-to-r hover:from-violet-600 hover:to-pink-500 hover:text-white text-slate-800 shadow-2xs'
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
              'border-slate-100 bg-white'
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
                'border border-violet-200 rounded-xl focus:border-violet-500 bg-violet-50/20 text-slate-900 placeholder:text-slate-400 shadow-xs'
              }`}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className={`p-2.5 shrink-0 transition-all disabled:opacity-40 ${
                'bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-xl hover:opacity-90 shadow-xs'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          </m.div>
      )}
      </AnimatePresence>
    </div>
  )
}

export default Chatbot
