import React, { useState } from 'react'

function Contact({ theme, onAddSubmission, onAddConsultation }) {
  const [activeTab, setActiveTab] = useState('consult'); // 'consult' | 'careers'
  const isSwiss = theme === 'swiss';
  
  // Consultation form state
  const [consultForm, setConsultForm] = useState({ name: '', email: '', business: '', message: '' });
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  // Careers form state
  const [careerForm, setCareerForm] = useState({ name: '', email: '', role: 'eCommerce Developer', resume: '', message: '' });
  const [careerSubmitted, setCareerSubmitted] = useState(false);

  const handleConsultSubmit = (e) => {
    e.preventDefault();
    onAddConsultation && onAddConsultation({ ...consultForm });
    setConsultSubmitted(true);
    setTimeout(() => {
      setConsultSubmitted(false);
      setConsultForm({ name: '', email: '', business: '', message: '' });
    }, 5000);
  };

  const handleCareerSubmit = (e) => {
    e.preventDefault();
    onAddSubmission(careerForm);
    setCareerSubmitted(true);
    setTimeout(() => {
      setCareerSubmitted(false);
      setCareerForm({ name: '', email: '', role: 'eCommerce Developer', resume: '', message: '' });
    }, 5000);
  };

  const roles = [
    'eCommerce Developer',
    'AI Chatbot Engineer',
    'Growth Marketer',
    'Fulfillment Integrator'
  ];

  return (
    <section id="contact" className={`py-12 md:py-20 px-6 max-w-6xl mx-auto ${
      isSwiss ? 'border-b border-swiss-text' : ''
    }`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Info & Description */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className={`text-xs font-black tracking-widest uppercase block mb-2 ${
              isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-violet-600 font-extrabold'
            }`}>
              [ GET IN TOUCH ]
            </span>
            <h2 className={`text-3xl md:text-5xl font-bold tracking-tight leading-tight ${
              isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
            }`}>
              Scale Your Marketplace Presence
            </h2>
            <p className={`text-sm mt-6 leading-relaxed ${
              isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600 font-medium'
            }`}>
              Whether you are looking to audit your marketplace rankings, automate deals via Hinglish WhatsApp chatbots, or build a custom headless Shopify storefront—we can help.
            </p>
          </div>

          <div className={`mt-12 space-y-4 text-xs tracking-widest uppercase font-black ${
            isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-500'
          }`}>
            <div>EMAIL: info@ecomxtra.in</div>
            <div>PHONE: +91 8700259557</div>
            <div>PARENT CO: QUADRANEX IT SOLUTIONS</div>
          </div>
        </div>

        {/* Right Column: Double Portal Form */}
        <div className={`lg:col-span-7 p-8 ${
          isSwiss
            ? 'border border-swiss-text bg-white'
            : 'bg-white/95 backdrop-blur-md border-2 border-violet-200 rounded-3xl shadow-xl shadow-violet-500/10'
        }`}>
          {/* Tab Swapping */}
          <div className={`flex mb-8 ${
            isSwiss
              ? 'border-b border-swiss-text'
              : 'gap-2 p-1.5 bg-violet-100/60 rounded-full'
          }`}>
            <button
              type="button"
              onClick={() => { setActiveTab('consult'); setConsultSubmitted(false); }}
              className={`flex-1 py-3 text-xs font-black uppercase transition-all ${
                isSwiss
                  ? (activeTab === 'consult' ? 'bg-swiss-text text-swiss-bg border-r border-swiss-text' : 'bg-transparent text-swiss-text hover:bg-swiss-bg/40 border-r border-swiss-text')
                  : (activeTab === 'consult' ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white font-extrabold shadow-md rounded-full' : 'text-slate-700 hover:bg-white/60 rounded-full')
              }`}
            >
              Book Consultation
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('careers'); setCareerSubmitted(false); }}
              className={`flex-1 py-3 text-xs font-black uppercase transition-all ${
                isSwiss
                  ? (activeTab === 'careers' ? 'bg-swiss-text text-swiss-bg' : 'bg-transparent text-swiss-text hover:bg-swiss-bg/40')
                  : (activeTab === 'careers' ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white font-extrabold shadow-md rounded-full' : 'text-slate-700 hover:bg-white/60 rounded-full')
              }`}
            >
              Apply for Careers
            </button>
          </div>

          {/* Book Consultation Form */}
          {activeTab === 'consult' && (
            <div>
              {consultSubmitted ? (
                <div className={`py-12 text-center border ${
                  isSwiss ? 'border-dashed border-swiss-text' : 'bg-violet-50 border-2 border-violet-200 rounded-2xl'
                }`}>
                  <span className={`text-xl font-bold block ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900'}`}>
                    Consultation Requested Successfully!
                  </span>
                  <span className={`text-xs block mt-2 ${isSwiss ? 'font-satoshi text-swiss-text/75' : 'font-outfit text-slate-600'}`}>
                    Our representative will email you within 2 hours.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleConsultSubmit} className="space-y-5">
                  <div>
                    <label className={`block text-xs font-black tracking-wider uppercase mb-2 ${
                      isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-700 font-extrabold'
                    }`}>FULL NAME *</label>
                    <input
                      type="text"
                      required
                      value={consultForm.name}
                      onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
                      className={`w-full p-3.5 text-xs focus:outline-none transition-all ${
                        isSwiss
                          ? 'border border-swiss-text font-satoshi focus:bg-swiss-bg'
                          : 'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                      }`}
                      placeholder="e.g. Rahul Verma"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-black tracking-wider uppercase mb-2 ${
                      isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-700 font-extrabold'
                    }`}>EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      required
                      value={consultForm.email}
                      onChange={(e) => setConsultForm({...consultForm, email: e.target.value})}
                      className={`w-full p-3.5 text-xs focus:outline-none transition-all ${
                        isSwiss
                          ? 'border border-swiss-text font-satoshi focus:bg-swiss-bg'
                          : 'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                      }`}
                      placeholder="e.g. rahul@fitfuel.co"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-black tracking-wider uppercase mb-2 ${
                      isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-700 font-extrabold'
                    }`}>BUSINESS NAME</label>
                    <input
                      type="text"
                      value={consultForm.business}
                      onChange={(e) => setConsultForm({...consultForm, business: e.target.value})}
                      className={`w-full p-3.5 text-xs focus:outline-none transition-all ${
                        isSwiss
                          ? 'border border-swiss-text font-satoshi focus:bg-swiss-bg'
                          : 'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                      }`}
                      placeholder="e.g. FitFuel Brand"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-black tracking-wider uppercase mb-2 ${
                      isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-700 font-extrabold'
                    }`}>HOW CAN WE HELP?</label>
                    <textarea
                      rows="4"
                      value={consultForm.message}
                      onChange={(e) => setConsultForm({...consultForm, message: e.target.value})}
                      className={`w-full p-3.5 text-xs focus:outline-none resize-none transition-all ${
                        isSwiss
                          ? 'border border-swiss-text font-satoshi focus:bg-swiss-bg'
                          : 'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                      }`}
                      placeholder="Detail your eCommerce challenges..."
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-4 text-xs font-black tracking-widest uppercase transition-all ${
                      isSwiss
                        ? 'font-satoshi bg-swiss-text text-swiss-bg border border-swiss-text hover:bg-swiss-bg hover:text-swiss-text'
                        : 'font-outfit bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 hover:opacity-95 text-white font-extrabold rounded-full shadow-lg shadow-pink-500/20 hover:scale-[1.01]'
                    }`}
                  >
                    SUBMIT REQUEST
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Careers Application Form */}
          {activeTab === 'careers' && (
            <div>
              {careerSubmitted ? (
                <div className={`py-12 text-center border ${
                  isSwiss ? 'border-dashed border-swiss-text' : 'bg-violet-50 border-2 border-violet-200 rounded-2xl'
                }`}>
                  <span className={`text-xl font-bold block ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900'}`}>
                    Application Submitted!
                  </span>
                  <p className={`text-xs mt-3 px-8 ${isSwiss ? 'font-satoshi text-swiss-text/75' : 'font-outfit text-slate-600'}`}>
                    Your resume was successfully submitted. Real-time push sync logs have been fired to the WhatsApp dashboard pipeline and Google Sheets table.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCareerSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={`block text-xs font-black tracking-wider uppercase mb-2 ${
                        isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-700 font-extrabold'
                      }`}>FULL NAME *</label>
                      <input
                        type="text"
                        required
                        value={careerForm.name}
                        onChange={(e) => setCareerForm({...careerForm, name: e.target.value})}
                        className={`w-full p-3.5 text-xs focus:outline-none transition-all ${
                          isSwiss
                            ? 'border border-swiss-text font-satoshi focus:bg-swiss-bg'
                            : 'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                        }`}
                        placeholder="e.g. Anjali Sen"
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-black tracking-wider uppercase mb-2 ${
                        isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-700 font-extrabold'
                      }`}>EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        required
                        value={careerForm.email}
                        onChange={(e) => setCareerForm({...careerForm, email: e.target.value})}
                        className={`w-full p-3.5 text-xs focus:outline-none transition-all ${
                          isSwiss
                            ? 'border border-swiss-text font-satoshi focus:bg-swiss-bg'
                            : 'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                        }`}
                        placeholder="e.g. anjali@dev.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-black tracking-wider uppercase mb-2 ${
                      isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-700 font-extrabold'
                    }`}>POSITION APPLYING FOR *</label>
                    <select
                      value={careerForm.role}
                      onChange={(e) => setCareerForm({...careerForm, role: e.target.value})}
                      className={`w-full p-3.5 text-xs focus:outline-none transition-all ${
                        isSwiss
                          ? 'border border-swiss-text font-satoshi focus:bg-swiss-bg'
                          : 'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                      }`}
                    >
                      {roles.map((r) => <option key={r} value={r} className="bg-white text-slate-900">{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-black tracking-wider uppercase mb-2 ${
                      isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-700 font-extrabold'
                    }`}>RESUME LINK *</label>
                    <input
                      type="url"
                      required
                      value={careerForm.resume}
                      onChange={(e) => setCareerForm({...careerForm, resume: e.target.value})}
                      className={`w-full p-3.5 text-xs focus:outline-none transition-all ${
                        isSwiss
                          ? 'border border-swiss-text font-satoshi focus:bg-swiss-bg'
                          : 'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                      }`}
                      placeholder="https://drive.google.com/.../resume.pdf"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-black tracking-wider uppercase mb-2 ${
                      isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-700 font-extrabold'
                    }`}>SHORT NOTE</label>
                    <textarea
                      rows="3"
                      value={careerForm.message}
                      onChange={(e) => setCareerForm({...careerForm, message: e.target.value})}
                      className={`w-full p-3.5 text-xs focus:outline-none resize-none transition-all ${
                        isSwiss
                          ? 'border border-swiss-text font-satoshi focus:bg-swiss-bg'
                          : 'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                      }`}
                      placeholder="Tell us about your tech stack and experiences..."
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-4 text-xs font-black tracking-widest uppercase transition-all ${
                      isSwiss
                        ? 'font-satoshi bg-swiss-text text-swiss-bg border border-swiss-text hover:bg-swiss-bg hover:text-swiss-text'
                        : 'font-outfit bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 hover:opacity-95 text-white font-extrabold rounded-full shadow-lg shadow-pink-500/20 hover:scale-[1.01]'
                    }`}
                  >
                    SUBMIT APPLICATION
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact
