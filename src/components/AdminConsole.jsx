import React, { useState } from 'react'
import { X, Save, Trash2, Edit, Check, Settings, RefreshCw, List, Clipboard, Terminal } from 'lucide-react'

function AdminConsole({
  isOpen,
  onClose,
  theme,
  setTheme,
  services,
  showcases,
  testimonials,
  careers,
  logs,
  handleCRUD
}) {
  const [activeTab, setActiveTab] = useState('db'); // 'health' | 'db' | 'leads' | 'logs'
  const [dbSubTab, setDbSubTab] = useState('services'); // 'services' | 'showcases' | 'testimonials'

  // Service Editor State
  const [newService, setNewService] = useState({ title: '', description: '', category: 'Development' });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editingService, setEditingService] = useState({ title: '', description: '', category: '' });

  // Showcase Editor State
  const [newShowcase, setNewShowcase] = useState({ key: '', title: '', metric: '', description: '' });
  const [editingShowcaseId, setEditingShowcaseId] = useState(null);
  const [editingShowcase, setEditingShowcase] = useState({ title: '', metric: '', description: '' });

  // Testimonial Editor State
  const [newTestimonial, setNewTestimonial] = useState({ author: '', company: '', text: '' });
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState({ author: '', company: '', text: '' });

  const isSwiss = theme === 'swiss';

  // CRUD Forms Handlers
  const handleCreateService = (e) => {
    e.preventDefault();
    if (!newService.title.trim()) return;
    handleCRUD.addService(newService);
    setNewService({ title: '', description: '', category: 'Development' });
  };

  const startEditService = (s) => {
    setEditingServiceId(s.id);
    setEditingService({ title: s.title, description: s.description, category: s.category });
  };

  const handleUpdateServiceSubmit = (id) => {
    handleCRUD.updateService(id, editingService);
    setEditingServiceId(null);
  };

  // Showcase forms handlers
  const handleCreateShowcase = (e) => {
    e.preventDefault();
    if (!newShowcase.title.trim() || !newShowcase.key.trim()) return;
    handleCRUD.addShowcase(newShowcase);
    setNewShowcase({ key: '', title: '', metric: '', description: '' });
  };

  const startEditShowcase = (item) => {
    setEditingShowcaseId(item.id);
    setEditingShowcase({ title: item.title, metric: item.metric, description: item.description });
  };

  const handleUpdateShowcaseSubmit = (id) => {
    handleCRUD.updateShowcase(id, editingShowcase);
    setEditingShowcaseId(null);
  };

  // Testimonials forms handlers
  const handleCreateTestimonial = (e) => {
    e.preventDefault();
    if (!newTestimonial.author.trim() || !newTestimonial.text.trim()) return;
    handleCRUD.addTestimonial(newTestimonial);
    setNewTestimonial({ author: '', company: '', text: '' });
  };

  const startEditTestimonial = (t) => {
    setEditingTestimonialId(t.id);
    setEditingTestimonial({ author: t.author, company: t.company, text: t.text });
  };

  const handleUpdateTestimonialSubmit = (id) => {
    handleCRUD.updateTestimonial(id, editingTestimonial);
    setEditingTestimonialId(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-end font-satoshi">
      {/* Container Drawer */}
      <div className={`w-full max-w-4xl h-full bg-white flex flex-col justify-between shadow-2xl transition-all duration-300 ${
        isSwiss ? 'border-l border-swiss-text' : 'rounded-l-[2rem] overflow-hidden'
      }`}>
        {/* Drawer Header */}
        <div className={`p-6 flex justify-between items-center ${
          isSwiss ? 'bg-swiss-text text-swiss-bg border-b border-swiss-text' : 'bg-softly-sage text-softly-bg'
        }`}>
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 animate-spin-slow" />
            <div>
              <h2 className="font-clash text-base font-black tracking-widest uppercase">EcomXtra Control Hub</h2>
              <span className="text-[10px] uppercase opacity-75">Admin Control Panel overlay</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 border transition-all ${
              isSwiss ? 'border-swiss-bg hover:bg-swiss-bg hover:text-swiss-text' : 'border-softly-bg/30 rounded-full hover:bg-softly-bg/25'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-swiss-bg/40 border-b border-swiss-text/20">
          {[
            { id: 'db', label: 'CRUD Manager', icon: <List className="w-4 h-4" /> },
            { id: 'leads', label: 'Careers Leads', icon: <Clipboard className="w-4 h-4" /> },
            { id: 'logs', label: 'Sync Terminal logs', icon: <Terminal className="w-4 h-4" /> },
            { id: 'health', label: 'Theme & API Sync', icon: <RefreshCw className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-2 text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 border-r border-swiss-text/10 ${
                activeTab === tab.id ? 'bg-swiss-text text-swiss-bg' : 'text-swiss-text hover:bg-swiss-bg'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Drawer Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-swiss-bg/10">
          
          {/* TAB 1: CRUD Manager */}
          {activeTab === 'db' && (
            <div>
              {/* CRUD Sub tabs */}
              <div className="flex gap-2 mb-6 border-b border-swiss-text/10 pb-4">
                {[
                  { id: 'services', label: 'Services' },
                  { id: 'showcases', label: 'Showcases' },
                  { id: 'testimonials', label: 'Testimonials' },
                ].map((subTab) => (
                  <button
                    key={subTab.id}
                    onClick={() => setDbSubTab(subTab.id)}
                    className={`px-4 py-2 text-xs font-bold uppercase border ${
                      dbSubTab === subTab.id
                        ? 'bg-swiss-text text-swiss-bg border-swiss-text'
                        : 'border-swiss-text/20 hover:border-swiss-text'
                    }`}
                  >
                    {subTab.label}
                  </button>
                ))}
              </div>

              {/* services CRUD Panel */}
              {dbSubTab === 'services' && (
                <div className="space-y-6">
                  {/* Create service form */}
                  <form onSubmit={handleCreateService} className="border border-swiss-text/30 p-4 bg-white space-y-4">
                    <h3 className="font-clash text-xs font-black uppercase tracking-wider">[ Create New Service ]</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        value={newService.title}
                        onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                        placeholder="Service Title..."
                        className="border border-swiss-text/20 p-2 text-xs w-full"
                      />
                      <select
                        value={newService.category}
                        onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                        className="border border-swiss-text/20 p-2 text-xs w-full"
                      >
                        <option value="Development">Development</option>
                        <option value="AI Automation">AI Automation</option>
                        <option value="Growth">Growth</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Integrations">Integrations</option>
                      </select>
                    </div>
                    <textarea
                      required
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      placeholder="Service Description detail..."
                      className="border border-swiss-text/20 p-2 text-xs w-full h-16 resize-none"
                    />
                    <button type="submit" className="px-4 py-2 bg-swiss-text text-swiss-bg text-xs font-bold uppercase hover:bg-swiss-bg hover:text-swiss-text border border-swiss-text">
                      Add Service Record
                    </button>
                  </form>

                  {/* List of services */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase">[ ACTIVE SERVICES DATABASE ]</h4>
                    {services.map((s) => (
                      <div key={s.id} className="border border-swiss-text/20 p-4 bg-white flex flex-col justify-between sm:flex-row sm:items-center gap-4">
                        {editingServiceId === s.id ? (
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              value={editingService.title}
                              onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                              className="border p-1.5 text-xs w-full"
                            />
                            <textarea
                              value={editingService.description}
                              onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                              className="border p-1.5 text-xs w-full h-16"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateServiceSubmit(s.id)} className="p-1 bg-green-500 text-white rounded"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setEditingServiceId(null)} className="p-1 bg-red-500 text-white rounded"><X className="w-4 h-4" /></button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <span className="text-[10px] font-bold text-swiss-text/60 uppercase">[{s.category}]</span>
                            <h5 className="font-bold text-xs mt-1">{s.title}</h5>
                            <p className="text-[11px] text-swiss-text/75 mt-1">{s.description}</p>
                          </div>
                        )}
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => startEditService(s)} className="p-2 border hover:bg-swiss-bg"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleCRUD.deleteService(s.id)} className="p-2 border text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Showcases CRUD Panel */}
              {dbSubTab === 'showcases' && (
                <div className="space-y-6">
                  {/* Create showcase item */}
                  <form onSubmit={handleCreateShowcase} className="border border-swiss-text/30 p-4 bg-white space-y-4">
                    <h3 className="font-clash text-xs font-black uppercase tracking-wider">[ Create Showcase Audit ]</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input
                        type="text"
                        required
                        value={newShowcase.key}
                        onChange={(e) => setNewShowcase({ ...newShowcase, key: e.target.value })}
                        placeholder="Unique Key (e.g. amazon, flipkart)..."
                        className="border border-swiss-text/20 p-2 text-xs w-full"
                      />
                      <input
                        type="text"
                        required
                        value={newShowcase.title}
                        onChange={(e) => setNewShowcase({ ...newShowcase, title: e.target.value })}
                        placeholder="Study Title..."
                        className="border border-swiss-text/20 p-2 text-xs w-full"
                      />
                      <input
                        type="text"
                        required
                        value={newShowcase.metric}
                        onChange={(e) => setNewShowcase({ ...newShowcase, metric: e.target.value })}
                        placeholder="Core Metric (e.g. #1 Best Seller)..."
                        className="border border-swiss-text/20 p-2 text-xs w-full"
                      />
                    </div>
                    <textarea
                      required
                      value={newShowcase.description}
                      onChange={(e) => setNewShowcase({ ...newShowcase, description: e.target.value })}
                      placeholder="Audit Description detail..."
                      className="border border-swiss-text/20 p-2 text-xs w-full h-16 resize-none"
                    />
                    <button type="submit" className="px-4 py-2 bg-swiss-text text-swiss-bg text-xs font-bold uppercase hover:bg-swiss-bg hover:text-swiss-text border border-swiss-text">
                      Add Case Audit Record
                    </button>
                  </form>

                  {/* List of cases */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase">[ ACTIVE MARKETPLACE ARCHIVES ]</h4>
                    {showcases.map((s) => (
                      <div key={s.id} className="border border-swiss-text/20 p-4 bg-white flex flex-col justify-between sm:flex-row sm:items-center gap-4">
                        {editingShowcaseId === s.id ? (
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              value={editingShowcase.title}
                              onChange={(e) => setEditingShowcase({ ...editingShowcase, title: e.target.value })}
                              className="border p-1.5 text-xs w-full"
                            />
                            <input
                              type="text"
                              value={editingShowcase.metric}
                              onChange={(e) => setEditingShowcase({ ...editingShowcase, metric: e.target.value })}
                              className="border p-1.5 text-xs w-full"
                            />
                            <textarea
                              value={editingShowcase.description}
                              onChange={(e) => setEditingShowcase({ ...editingShowcase, description: e.target.value })}
                              className="border p-1.5 text-xs w-full h-16"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateShowcaseSubmit(s.id)} className="p-1 bg-green-500 text-white rounded"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setEditingShowcaseId(null)} className="p-1 bg-red-500 text-white rounded"><X className="w-4 h-4" /></button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-swiss-text/60 uppercase">[{s.key}]</span>
                              <span className="font-bold text-xs bg-swiss-bg text-swiss-text px-2 py-0.5">{s.metric}</span>
                            </div>
                            <h5 className="font-bold text-xs mt-1.5">{s.title}</h5>
                            <p className="text-[11px] text-swiss-text/75 mt-1">{s.description}</p>
                          </div>
                        )}
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => startEditShowcase(s)} className="p-2 border hover:bg-swiss-bg"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleCRUD.deleteShowcase(s.id)} className="p-2 border text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials CRUD Panel */}
              {dbSubTab === 'testimonials' && (
                <div className="space-y-6">
                  {/* Create testimonial */}
                  <form onSubmit={handleCreateTestimonial} className="border border-swiss-text/30 p-4 bg-white space-y-4">
                    <h3 className="font-clash text-xs font-black uppercase tracking-wider">[ Create Testimonial Record ]</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        value={newTestimonial.author}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
                        placeholder="Author Name (e.g. Karan)..."
                        className="border border-swiss-text/20 p-2 text-xs w-full"
                      />
                      <input
                        type="text"
                        value={newTestimonial.company}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                        placeholder="Company Name (e.g. GlowOrganic)..."
                        className="border border-swiss-text/20 p-2 text-xs w-full"
                      />
                    </div>
                    <textarea
                      required
                      value={newTestimonial.text}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                      placeholder="Testimonial text detail..."
                      className="border border-swiss-text/20 p-2 text-xs w-full h-16 resize-none"
                    />
                    <button type="submit" className="px-4 py-2 bg-swiss-text text-swiss-bg text-xs font-bold uppercase hover:bg-swiss-bg hover:text-swiss-text border border-swiss-text">
                      Add Testimonial Record
                    </button>
                  </form>

                  {/* List of testimonials */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase">[ ACTIVE REVIEWS DATABASE ]</h4>
                    {testimonials.map((t) => (
                      <div key={t.id} className="border border-swiss-text/20 p-4 bg-white flex flex-col justify-between sm:flex-row sm:items-center gap-4">
                        {editingTestimonialId === t.id ? (
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              value={editingTestimonial.author}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                              className="border p-1.5 text-xs w-full"
                            />
                            <input
                              type="text"
                              value={editingTestimonial.company}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                              className="border p-1.5 text-xs w-full"
                            />
                            <textarea
                              value={editingTestimonial.text}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                              className="border p-1.5 text-xs w-full h-16"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdateTestimonialSubmit(t.id)} className="p-1 bg-green-500 text-white rounded"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setEditingTestimonialId(null)} className="p-1 bg-red-500 text-white rounded"><X className="w-4 h-4" /></button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <span className="text-[10px] font-bold text-swiss-text/60 uppercase">[{t.company || 'Private client'}]</span>
                            <h5 className="font-bold text-xs mt-1">Author: {t.author}</h5>
                            <p className="text-[11px] text-swiss-text/75 mt-1">"{t.text}"</p>
                          </div>
                        )}
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => startEditTestimonial(t)} className="p-2 border hover:bg-swiss-bg"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleCRUD.deleteTestimonial(t.id)} className="p-2 border text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Career applications leads list */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider mb-2">[ Careers Applications Portal ({careers.length} leads) ]</h3>
              
              {careers.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-swiss-text/30 bg-white">
                  <span className="text-xs font-bold text-swiss-text/50">No applications received yet.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {careers.map((c) => (
                    <div key={c.id} className="border border-swiss-text/20 p-4 bg-white rounded space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-xs block">{c.name}</span>
                          <span className="text-[10px] text-swiss-text/60">{c.email}</span>
                        </div>
                        <span className="bg-swiss-text text-swiss-bg text-[10px] font-black tracking-wider uppercase px-2 py-0.5">
                          {c.role}
                        </span>
                      </div>
                      <div className="text-xs leading-relaxed text-swiss-text/85">
                        <strong>Message:</strong> "{c.message || 'No message provided.'}"
                      </div>
                      <div className="pt-2 border-t border-swiss-text/10 flex justify-between items-center text-[10px] text-swiss-text/50">
                        <span>Submitted on: {c.date}</span>
                        <a href={c.resume} target="_blank" rel="noreferrer" className="underline font-bold text-swiss-text hover:opacity-80">
                          View Resume Document
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Terminal Push Sync Logs */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider mb-2">[ Sync Log Live Terminal Stream ]</h3>
              <div className="bg-[#111111] text-green-400 p-4 rounded h-[400px] overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 select-text">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <span className="text-white/40">[{log.timestamp}]</span>
                    <span className="whitespace-pre-wrap">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Theme Controls & API Health */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              {/* Theme controllers */}
              <div className="border border-swiss-text/20 p-4 bg-white space-y-3">
                <h4 className="text-xs font-black uppercase">[ Global Theme Toggles ]</h4>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTheme('swiss')}
                    className={`flex-1 py-3 border text-xs font-bold uppercase tracking-wider ${
                      theme === 'swiss' ? 'bg-swiss-text text-swiss-bg border-swiss-text' : 'hover:bg-swiss-bg'
                    }`}
                  >
                    Swiss Brutalist Mode
                  </button>
                  <button
                    onClick={() => setTheme('softly')}
                    className={`flex-1 py-3 border text-xs font-bold uppercase tracking-wider ${
                      theme !== 'swiss' ? 'bg-softly-sage text-white border-softly-sage' : 'hover:bg-swiss-bg'
                    }`}
                  >
                    Colourful Wellness Mode
                  </button>
                </div>
              </div>

              {/* API Integration Health check */}
              <div className="border border-swiss-text/20 p-4 bg-white space-y-4">
                <h4 className="text-xs font-black uppercase">[ Sync API Connectors ]</h4>
                
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-bold">Google Sheets Integration API (v4)</span>
                    <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">CONNECTED</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-bold">WhatsApp Business API Gateway</span>
                    <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">ONLINE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Hinglish AI Agent Core Engine</span>
                    <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">READY</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer controls */}
        <div className={`p-4 border-t flex justify-end gap-2 ${
          isSwiss ? 'border-swiss-text bg-white' : 'bg-softly-sand/30 border-softly-sand'
        }`}>
          <button
            onClick={onClose}
            className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isSwiss
                ? 'bg-swiss-text text-swiss-bg border border-swiss-text hover:bg-white hover:text-swiss-text'
                : 'bg-softly-sage text-softly-bg rounded-full hover:bg-softly-peach'
            }`}
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminConsole
