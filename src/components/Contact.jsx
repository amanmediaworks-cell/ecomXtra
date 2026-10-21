import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

const WHATSAPP_NUMBER = '918700259557'

function openWhatsAppMessage(message, whatsappNumber = WHATSAPP_NUMBER) {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
}

function Contact({ content }) {
    const [activeTab, setActiveTab] = useState('consult'); // 'consult' | 'careers'


    // Consultation form state
    const [consultForm, setConsultForm] = useState({ name: '', email: '', business: '', message: '' });
    const [consultSubmitted, setConsultSubmitted] = useState(false);

    // Careers form state
    const [careerForm, setCareerForm] = useState({ name: '', email: '', role: 'eCommerce Developer', resume: '', message: '' });
    const [careerSubmitted, setCareerSubmitted] = useState(false);

    const handleConsultSubmit = (e) => {
        e.preventDefault();
        openWhatsAppMessage([
            'Hi EcomXtra, I would like to book a consultation.',
            '',
            `Name: ${consultForm.name}`,
            `Email: ${consultForm.email}`,
            `Business: ${consultForm.business || 'Not provided'}`,
            `How can we help: ${consultForm.message || 'Not provided'}`
        ].join('\n'), content?.whatsappNumber || WHATSAPP_NUMBER);
        setConsultSubmitted(true);
        setTimeout(() => {
            setConsultSubmitted(false);
            setConsultForm({ name: '', email: '', business: '', message: '' });
        }, 5000);
    };

    const handleCareerSubmit = (e) => {
        e.preventDefault();
        openWhatsAppMessage([
            'Hi EcomXtra, I would like to apply for a position.',
            '',
            `Name: ${careerForm.name}`,
            `Email: ${careerForm.email}`,
            `Position: ${careerForm.role}`,
            `Resume: ${careerForm.resume}`,
            `Note: ${careerForm.message || 'Not provided'}`
        ].join('\n'), content?.whatsappNumber || WHATSAPP_NUMBER);
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
        <section id="contact" className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                {/* Left Column: Info & Description */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                        <span className={`text-xs font-black tracking-widest uppercase block mb-1.5 ${'font-outfit text-violet-600 font-extrabold'
                            }`}>
                            {content?.eyebrow || '[ GET IN TOUCH ]'}
                        </span>
                        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight ${'font-outfit text-slate-900 font-extrabold'
                            }`}>
                            {content?.heading || 'Scale Your Marketplace Presence'}
                        </h2>
                        <p className={`text-xs sm:text-sm mt-3 leading-relaxed ${'font-outfit text-slate-600 font-medium'
                            }`}>
                            {content?.description || 'Whether you are looking to audit your marketplace rankings, automate deals via Hinglish WhatsApp chatbots, or build a custom headless Shopify storefront—we can help.'}
                        </p>
                    </div>

                    <div className={`mt-6 md:mt-8 space-y-2.5 text-xs tracking-widest uppercase font-black ${'font-outfit text-slate-500'
                        }`}>
                        <div>EMAIL: {content?.email || 'info@ecomxtra.in'}</div>
                        <div>PHONE: {content?.phone || '+91 8700259557'}</div>
                        <div>
                            PARENT CO:{' '}
                            <a href={content?.parentCompanyUrl || 'https://quadranex-seven.vercel.app/'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                                {(content?.parentCompany || 'Quadranex IT Solutions').toUpperCase()}
                                <ExternalLink aria-hidden="true" className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Column: Double Portal Form */}
                <div className={`lg:col-span-7 p-5 md:p-7 ${'bg-white/95 backdrop-blur-md border-2 border-violet-200 rounded-2xl shadow-xl shadow-violet-500/10'
                    }`}>
                    {/* Tab Swapping */}
                    <div className={`flex mb-5 ${'gap-1.5 p-1 bg-violet-100/60 rounded-full'
                        }`}>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('consult'); setConsultSubmitted(false); }}
                            className={`flex-1 py-2.5 text-xs font-black uppercase transition-all ${activeTab === 'consult' ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white font-extrabold shadow-md rounded-full' : 'text-slate-700 hover:bg-white/60 rounded-full'
                                }`}
                        >
                            {content?.consultationButton || 'Book Consultation'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('careers'); setCareerSubmitted(false); }}
                            className={`flex-1 py-2.5 text-xs font-black uppercase transition-all ${activeTab === 'careers' ? 'bg-gradient-to-r from-violet-600 to-pink-500 text-white font-extrabold shadow-md rounded-full' : 'text-slate-700 hover:bg-white/60 rounded-full'
                                }`}
                        >
                            {content?.careersButton || 'Apply for Careers'}
                        </button>
                    </div>

                    {/* Book Consultation Form */}
                    {activeTab === 'consult' && (
                        <div>
                            {consultSubmitted ? (
                                <div className={`py-8 text-center border ${'bg-violet-50 border-2 border-violet-200 rounded-2xl'
                                    }`}>
                                    <span className="text-lg font-bold block font-outfit text-slate-900">
                                        WhatsApp Message Ready
                                    </span>
                                    <span className="text-xs block mt-1.5 font-outfit text-slate-600">
                                        Your details are pre-filled in WhatsApp. Press Send there to submit your request.
                                    </span>
                                </div>
                            ) : (
                                <form onSubmit={handleConsultSubmit} className="space-y-3.5">
                                    <div>
                                        <label className={`block text-[11px] font-black tracking-wider uppercase mb-1.5 ${'font-outfit text-slate-700 font-extrabold'
                                            }`}>FULL NAME *</label>
                                        <input
                                            type="text"
                                            required
                                            value={consultForm.name}
                                            onChange={(e) => setConsultForm({ ...consultForm, name: e.target.value })}
                                            className={`w-full p-2.5 sm:p-3 text-xs focus:outline-none transition-all ${'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                                                }`}
                                            placeholder="e.g. Rahul Verma"
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-[11px] font-black tracking-wider uppercase mb-1.5 ${'font-outfit text-slate-700 font-extrabold'
                                            }`}>EMAIL ADDRESS *</label>
                                        <input
                                            type="email"
                                            required
                                            value={consultForm.email}
                                            onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                                            className={`w-full p-2.5 sm:p-3 text-xs focus:outline-none transition-all ${'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                                                }`}
                                            placeholder="e.g. rahul@fitfuel.co"
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-[11px] font-black tracking-wider uppercase mb-1.5 ${'font-outfit text-slate-700 font-extrabold'
                                            }`}>BUSINESS NAME</label>
                                        <input
                                            type="text"
                                            value={consultForm.business}
                                            onChange={(e) => setConsultForm({ ...consultForm, business: e.target.value })}
                                            className={`w-full p-2.5 sm:p-3 text-xs focus:outline-none transition-all ${'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                                                }`}
                                            placeholder="e.g. FitFuel Brand"
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-[11px] font-black tracking-wider uppercase mb-1.5 ${'font-outfit text-slate-700 font-extrabold'
                                            }`}>HOW CAN WE HELP?</label>
                                        <textarea
                                            rows="3"
                                            value={consultForm.message}
                                            onChange={(e) => setConsultForm({ ...consultForm, message: e.target.value })}
                                            className={`w-full p-2.5 sm:p-3 text-xs focus:outline-none resize-none transition-all ${'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                                                }`}
                                            placeholder="Detail your eCommerce challenges..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className={`w-full py-3 text-xs font-black tracking-widest uppercase transition-all ${'font-outfit bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 hover:opacity-95 text-white font-extrabold rounded-full shadow-lg shadow-pink-500/20 hover:scale-[1.01]'
                                            }`}
                                    >
                                        BOOK CONSULTATION
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Careers Application Form */}
                    {activeTab === 'careers' && (
                        <div>
                            {careerSubmitted ? (
                                <div className={`py-8 text-center border ${'bg-violet-50 border-2 border-violet-200 rounded-2xl'
                                    }`}>
                                    <span className="text-lg font-bold block font-outfit text-slate-900">
                                        WhatsApp Message Ready
                                    </span>
                                    <p className="text-xs mt-2 px-6 font-outfit text-slate-600">
                                        Your application details are pre-filled in WhatsApp. Press Send there to submit your application.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleCareerSubmit} className="space-y-3.5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div>
                                            <label className={`block text-[11px] font-black tracking-wider uppercase mb-1.5 ${'font-outfit text-slate-700 font-extrabold'
                                                }`}>FULL NAME *</label>
                                            <input
                                                type="text"
                                                required
                                                value={careerForm.name}
                                                onChange={(e) => setCareerForm({ ...careerForm, name: e.target.value })}
                                                className={`w-full p-2.5 sm:p-3 text-xs focus:outline-none transition-all ${'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                                                    }`}
                                                placeholder="e.g. Anjali Sen"
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-[11px] font-black tracking-wider uppercase mb-1.5 ${'font-outfit text-slate-700 font-extrabold'
                                                }`}>EMAIL ADDRESS *</label>
                                            <input
                                                type="email"
                                                required
                                                value={careerForm.email}
                                                onChange={(e) => setCareerForm({ ...careerForm, email: e.target.value })}
                                                className={`w-full p-2.5 sm:p-3 text-xs focus:outline-none transition-all ${'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                                                    }`}
                                                placeholder="e.g. anjali@dev.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={`block text-[11px] font-black tracking-wider uppercase mb-1.5 ${'font-outfit text-slate-700 font-extrabold'
                                            }`}>POSITION APPLYING FOR *</label>
                                        <select
                                            value={careerForm.role}
                                            onChange={(e) => setCareerForm({ ...careerForm, role: e.target.value })}
                                            className={`w-full p-2.5 sm:p-3 text-xs focus:outline-none transition-all ${'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                                                }`}
                                        >
                                            {roles.map((r) => <option key={r} value={r} className="bg-white text-slate-900">{r}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={`block text-[11px] font-black tracking-wider uppercase mb-1.5 ${'font-outfit text-slate-700 font-extrabold'
                                            }`}>RESUME LINK *</label>
                                        <input
                                            type="url"
                                            required
                                            value={careerForm.resume}
                                            onChange={(e) => setCareerForm({ ...careerForm, resume: e.target.value })}
                                            className={`w-full p-2.5 sm:p-3 text-xs focus:outline-none transition-all ${'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                                                }`}
                                            placeholder="https://drive.google.com/.../resume.pdf"
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-[11px] font-black tracking-wider uppercase mb-1.5 ${'font-outfit text-slate-700 font-extrabold'
                                            }`}>SHORT NOTE</label>
                                        <textarea
                                            rows="2.5"
                                            value={careerForm.message}
                                            onChange={(e) => setCareerForm({ ...careerForm, message: e.target.value })}
                                            className={`w-full p-2.5 sm:p-3 text-xs focus:outline-none resize-none transition-all ${'bg-violet-50/40 border border-violet-200 text-slate-900 font-medium rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-xs'
                                                }`}
                                            placeholder="Tell us about your tech stack and experiences..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className={`w-full py-3 text-xs font-black tracking-widest uppercase transition-all ${'font-outfit bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 hover:opacity-95 text-white font-extrabold rounded-full shadow-lg shadow-pink-500/20 hover:scale-[1.01]'
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
