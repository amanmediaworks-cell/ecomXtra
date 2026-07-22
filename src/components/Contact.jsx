import React, { useState } from 'react'

function Contact({ theme, onAddSubmission, onAddConsultation }) {
  const [activeTab, setActiveTab] = useState('consult'); // 'consult' | 'careers'
  
  // Consultation form state
  const [consultForm, setConsultForm] = useState({ name: '', email: '', business: '', message: '' });
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  // Careers form state
  const [careerForm, setCareerForm] = useState({ name: '', email: '', role: 'eCommerce Developer', resume: '', message: '' });
  const [careerSubmitted, setCareerSubmitted] = useState(false);

  const handleConsultSubmit = (e) => {
    e.preventDefault();
    // Save the enquiry so admin can see it
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

  if (theme === 'swiss') {
    return (
      <section id="contact" className="py-20 md:py-28 px-6 md:px-12 border-b border-swiss-text">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Info & Description */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-satoshi text-xs font-black tracking-widest uppercase text-swiss-text block mb-2">
                [ GET IN TOUCH ]
              </span>
              <h2 className="font-clash text-3xl md:text-5xl font-bold tracking-tight text-swiss-text leading-tight">
                Scale Your Marketplace Presence
              </h2>
              <p className="font-satoshi text-sm text-swiss-text/80 mt-6 leading-relaxed">
                Whether you are looking to audit your marketplace rankings, automate deals via Hinglish WhatsApp chatbots, or build a custom headless Shopify storefront—we can help.
              </p>
            </div>

            <div className="mt-12 space-y-4 font-satoshi text-xs tracking-widest uppercase font-black text-swiss-text">
              <div>EMAIL: hello@ecomxtra.com</div>
              <div>LOCATIONS: New Delhi, India</div>
              <div>IDENTIFIER IT SOLUTIONS PARENT CO.</div>
            </div>
          </div>

          {/* Right Column: Double Portal Form */}
          <div className="lg:col-span-7 border border-swiss-text bg-white p-8">
            {/* Tab Swapping */}
            <div className="flex border-b border-swiss-text mb-8">
              <button
                type="button"
                onClick={() => { setActiveTab('consult'); setConsultSubmitted(false); }}
                className={`flex-1 py-4 text-xs font-satoshi font-black tracking-widest uppercase border-r border-swiss-text ${
                  activeTab === 'consult' ? 'bg-swiss-text text-swiss-bg' : 'bg-transparent text-swiss-text hover:bg-swiss-bg/40'
                }`}
              >
                Book Consultation
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('careers'); setCareerSubmitted(false); }}
                className={`flex-1 py-4 text-xs font-satoshi font-black tracking-widest uppercase ${
                  activeTab === 'careers' ? 'bg-swiss-text text-swiss-bg' : 'bg-transparent text-swiss-text hover:bg-swiss-bg/40'
                }`}
              >
                Apply for Careers
              </button>
            </div>

            {/* Book Consultation Form */}
            {activeTab === 'consult' && (
              <div>
                {consultSubmitted ? (
                  <div className="py-12 text-center border border-dashed border-swiss-text">
                    <span className="font-clash text-xl font-bold text-swiss-text block">Consultation Requested Successfully!</span>
                    <span className="font-satoshi text-xs text-swiss-text/75 block mt-2">Our representative will email you within 2 hours.</span>
                  </div>
                ) : (
                  <form onSubmit={handleConsultSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-satoshi font-black tracking-wider uppercase text-swiss-text mb-2">FULL NAME *</label>
                      <input
                        type="text"
                        required
                        value={consultForm.name}
                        onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
                        className="w-full border border-swiss-text p-3 text-xs font-satoshi focus:outline-none focus:bg-swiss-bg"
                        placeholder="e.g. Rahul Verma"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-satoshi font-black tracking-wider uppercase text-swiss-text mb-2">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        required
                        value={consultForm.email}
                        onChange={(e) => setConsultForm({...consultForm, email: e.target.value})}
                        className="w-full border border-swiss-text p-3 text-xs font-satoshi focus:outline-none focus:bg-swiss-bg"
                        placeholder="e.g. rahul@fitfuel.co"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-satoshi font-black tracking-wider uppercase text-swiss-text mb-2">BUSINESS NAME</label>
                      <input
                        type="text"
                        value={consultForm.business}
                        onChange={(e) => setConsultForm({...consultForm, business: e.target.value})}
                        className="w-full border border-swiss-text p-3 text-xs font-satoshi focus:outline-none focus:bg-swiss-bg"
                        placeholder="e.g. FitFuel Brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-satoshi font-black tracking-wider uppercase text-swiss-text mb-2">HOW CAN WE HELP?</label>
                      <textarea
                        rows="4"
                        value={consultForm.message}
                        onChange={(e) => setConsultForm({...consultForm, message: e.target.value})}
                        className="w-full border border-swiss-text p-3 text-xs font-satoshi focus:outline-none focus:bg-swiss-bg resize-none"
                        placeholder="Detail your eCommerce challenges..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-swiss-text text-swiss-bg border border-swiss-text text-xs font-satoshi font-black tracking-widest uppercase hover:bg-swiss-bg hover:text-swiss-text transition-colors"
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
                  <div className="py-12 text-center border border-dashed border-swiss-text">
                    <span className="font-clash text-xl font-bold text-swiss-text block">Application Submitted!</span>
                    <p className="font-satoshi text-xs text-swiss-text/75 mt-3 px-8">
                      Your resume was successfully submitted. Real-time push sync logs have been fired to the WhatsApp dashboard pipeline and Google Sheets table.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCareerSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-satoshi font-black tracking-wider uppercase text-swiss-text mb-2">FULL NAME *</label>
                        <input
                          type="text"
                          required
                          value={careerForm.name}
                          onChange={(e) => setCareerForm({...careerForm, name: e.target.value})}
                          className="w-full border border-swiss-text p-3 text-xs font-satoshi focus:outline-none focus:bg-swiss-bg"
                          placeholder="e.g. Anjali Sen"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-satoshi font-black tracking-wider uppercase text-swiss-text mb-2">EMAIL ADDRESS *</label>
                        <input
                          type="email"
                          required
                          value={careerForm.email}
                          onChange={(e) => setCareerForm({...careerForm, email: e.target.value})}
                          className="w-full border border-swiss-text p-3 text-xs font-satoshi focus:outline-none focus:bg-swiss-bg"
                          placeholder="e.g. anjali@dev.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-satoshi font-black tracking-wider uppercase text-swiss-text mb-2">POSITION APPLYING FOR *</label>
                      <select
                        value={careerForm.role}
                        onChange={(e) => setCareerForm({...careerForm, role: e.target.value})}
                        className="w-full border border-swiss-text p-3 text-xs font-satoshi focus:outline-none focus:bg-swiss-bg"
                      >
                        {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-satoshi font-black tracking-wider uppercase text-swiss-text mb-2">RESUME LINK *</label>
                      <input
                        type="url"
                        required
                        value={careerForm.resume}
                        onChange={(e) => setCareerForm({...careerForm, resume: e.target.value})}
                        className="w-full border border-swiss-text p-3 text-xs font-satoshi focus:outline-none focus:bg-swiss-bg"
                        placeholder="https://drive.google.com/.../resume.pdf"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-satoshi font-black tracking-wider uppercase text-swiss-text mb-2">SHORT NOTE</label>
                      <textarea
                        rows="3"
                        value={careerForm.message}
                        onChange={(e) => setCareerForm({...careerForm, message: e.target.value})}
                        className="w-full border border-swiss-text p-3 text-xs font-satoshi focus:outline-none focus:bg-swiss-bg resize-none"
                        placeholder="Tell us about your tech stack and experiences..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-swiss-text text-swiss-bg border border-swiss-text text-xs font-satoshi font-black tracking-widest uppercase hover:bg-swiss-bg hover:text-swiss-text transition-colors"
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

  // Softly Theme Contact Section
  return (
    <section id="contact" className="py-20 md:py-28 px-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column */}
        <div className="lg:col-span-5 text-left">
          <span className="text-softly-sage font-semibold tracking-wider text-sm uppercase block mb-2">[ COLLABORATE ]</span>
          <h2 className="font-outfit text-3xl md:text-5xl font-bold text-softly-text leading-snug">
            We are always listening.
          </h2>
          <p className="font-outfit text-sm text-softly-text/80 mt-4 leading-relaxed">
            Reach out to schedule a consultation with our development lead. We also have open positions for builders, designers, and growth experts who value serene, quality production.
          </p>
          <div className="mt-8 space-y-2 text-xs font-semibold text-softly-text/70 uppercase">
            <div>Support: hello@ecomxtra.com</div>
            <div>Parent: Identifier IT Solutions</div>
            <div>Region: New Delhi, IN</div>
          </div>
        </div>

        {/* Right Column: Soft form styling */}
        <div className="lg:col-span-7 bg-white border border-softly-sand rounded-[2rem] p-8 shadow-sm">
          {/* Custom Pill Toggle Tabs */}
          <div className="flex gap-2 p-1.5 bg-softly-sand/50 rounded-full mb-8">
            <button
              type="button"
              onClick={() => { setActiveTab('consult'); setConsultSubmitted(false); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all duration-300 ${
                activeTab === 'consult' ? 'bg-softly-sage text-softly-bg shadow-sm' : 'text-softly-text hover:bg-softly-sand'
              }`}
            >
              Consultation
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('careers'); setCareerSubmitted(false); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all duration-300 ${
                activeTab === 'careers' ? 'bg-softly-sage text-softly-bg shadow-sm' : 'text-softly-text hover:bg-softly-sand'
              }`}
            >
              Careers Portal
            </button>
          </div>

          {/* Consultation Form */}
          {activeTab === 'consult' && (
            <div>
              {consultSubmitted ? (
                <div className="py-12 text-center bg-softly-peach/10 border border-softly-peach/30 rounded-2xl">
                  <span className="font-outfit text-lg font-bold text-softly-text block">Consultation Booked!</span>
                  <span className="font-outfit text-xs text-softly-text/80 block mt-2">Check your email for details shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleConsultSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-softly-text/70 mb-1.5 ml-1">YOUR NAME</label>
                    <input
                      type="text"
                      required
                      value={consultForm.name}
                      onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
                      className="w-full bg-softly-sand/40 border border-softly-sand rounded-xl p-3 text-xs focus:outline-none focus:border-softly-sage"
                      placeholder="e.g. Rahul Verma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-softly-text/70 mb-1.5 ml-1">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={consultForm.email}
                      onChange={(e) => setConsultForm({...consultForm, email: e.target.value})}
                      className="w-full bg-softly-sand/40 border border-softly-sand rounded-xl p-3 text-xs focus:outline-none focus:border-softly-sage"
                      placeholder="e.g. rahul@fitfuel.co"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-softly-text/70 mb-1.5 ml-1">BUSINESS WEBSITE/NAME</label>
                    <input
                      type="text"
                      value={consultForm.business}
                      onChange={(e) => setConsultForm({...consultForm, business: e.target.value})}
                      className="w-full bg-softly-sand/40 border border-softly-sand rounded-xl p-3 text-xs focus:outline-none focus:border-softly-sage"
                      placeholder="e.g. fitfuel.co"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-softly-text/70 mb-1.5 ml-1">YOUR CHALLENGE</label>
                    <textarea
                      rows="3"
                      value={consultForm.message}
                      onChange={(e) => setConsultForm({...consultForm, message: e.target.value})}
                      className="w-full bg-softly-sand/40 border border-softly-sand rounded-xl p-3 text-xs focus:outline-none focus:border-softly-sage resize-none"
                      placeholder="Tell us about your brand..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-softly-sage text-softly-bg rounded-full text-xs font-semibold hover:bg-softly-peach transition-all duration-300 shadow-sm"
                  >
                    SEND CONSULTATION REQUEST
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Careers Application Form */}
          {activeTab === 'careers' && (
            <div>
              {careerSubmitted ? (
                <div className="py-12 text-center bg-softly-peach/10 border border-softly-peach/30 rounded-2xl">
                  <span className="font-outfit text-lg font-bold text-softly-text block">Application Received!</span>
                  <p className="font-outfit text-xs text-softly-text/80 mt-2 px-6">
                    Our team was notified via WhatsApp Channel sync. Row added to local Sheets db.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCareerSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-softly-text/70 mb-1.5 ml-1">FULL NAME</label>
                      <input
                        type="text"
                        required
                        value={careerForm.name}
                        onChange={(e) => setCareerForm({...careerForm, name: e.target.value})}
                        className="w-full bg-softly-sand/40 border border-softly-sand rounded-xl p-3 text-xs focus:outline-none focus:border-softly-sage"
                        placeholder="Anjali Sen"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-softly-text/70 mb-1.5 ml-1">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        value={careerForm.email}
                        onChange={(e) => setCareerForm({...careerForm, email: e.target.value})}
                        className="w-full bg-softly-sand/40 border border-softly-sand rounded-xl p-3 text-xs focus:outline-none focus:border-softly-sage"
                        placeholder="anjali@dev.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-softly-text/70 mb-1.5 ml-1">ROLE</label>
                    <select
                      value={careerForm.role}
                      onChange={(e) => setCareerForm({...careerForm, role: e.target.value})}
                      className="w-full bg-softly-sand/40 border border-softly-sand rounded-xl p-3 text-xs focus:outline-none focus:border-softly-sage"
                    >
                      {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-softly-text/70 mb-1.5 ml-1">LINK TO RESUME</label>
                    <input
                      type="url"
                      required
                      value={careerForm.resume}
                      onChange={(e) => setCareerForm({...careerForm, resume: e.target.value})}
                      className="w-full bg-softly-sand/40 border border-softly-sand rounded-xl p-3 text-xs focus:outline-none focus:border-softly-sage"
                      placeholder="e.g. drive.google.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-softly-text/70 mb-1.5 ml-1">ABOUT YOU</label>
                    <textarea
                      rows="3"
                      value={careerForm.message}
                      onChange={(e) => setCareerForm({...careerForm, message: e.target.value})}
                      className="w-full bg-softly-sand/40 border border-softly-sand rounded-xl p-3 text-xs focus:outline-none focus:border-softly-sage resize-none"
                      placeholder="Summarize your tech stack..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-softly-sage text-softly-bg rounded-full text-xs font-semibold hover:bg-softly-peach transition-all duration-300 shadow-sm"
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
