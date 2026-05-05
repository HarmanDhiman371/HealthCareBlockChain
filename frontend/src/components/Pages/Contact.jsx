import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Info Side */}
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8">Get in <span className="text-teal-400">Touch</span>.</h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-12">
              Have questions about our blockchain implementation or want to partner with us? Our team of cryptography experts and health professionals are here to help.
            </p>

            <div className="space-y-8">
              <ContactInfoItem icon={<Mail className="text-teal-400" />} title="Email Us" text="support@healthchain.network" />
              <ContactInfoItem icon={<Phone className="text-emerald-400" />} title="Call Support" text="+1 (555) 888-HEALTH" />
              <ContactInfoItem icon={<MapPin className="text-sky-400" />} title="Global Office" text="123 Web3 Way, Crypto Valley, Switzerland" />
            </div>

            <div className="mt-16 p-8 bg-slate-900/40 border border-white/10 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Network Status: Online</span>
              </div>
              <p className="text-slate-500 text-sm">Typical response time for general inquiries is less than 4 hours.</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-slate-900/60 border border-white/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <MessageSquare size={150} className="text-white" />
            </div>
            
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                  <Send className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-400">We've received your transmission and will get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="mt-8 text-teal-400 font-bold hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input required type="text" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-500 transition-colors" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <input required type="email" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-500 transition-colors" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                  <select className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-500 transition-colors appearance-none">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Partnership Request</option>
                    <option>Security Reporting</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Your Message</label>
                  <textarea required rows="6" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-teal-500 transition-colors" placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" className="w-full py-5 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl text-white font-black text-lg shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                  Send Transmission <Send size={18} />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

function ContactInfoItem({ icon, title, text }) {
  return (
    <div className="flex gap-6">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
        {icon}
      </div>
      <div>
        <h4 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-white font-bold text-lg">{text}</p>
      </div>
    </div>
  );
}
