import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Mail, Phone, MapPin, Send, GraduationCap, Award, Users, BookOpen, Zap } from 'lucide-react';

export function AboutPage() {
  const team = [
    { name: 'Dr. Amara Osei', role: 'CEO & Co-founder', bio: 'Former Google engineer, 15 years in tech education', avatar: 'AO' },
    { name: 'Tunde Williams', role: 'CTO', bio: 'MIT PhD, ex-Microsoft Principal Engineer', avatar: 'TW' },
    { name: 'Chioma Nwosu', role: 'Head of Curriculum', bio: 'EdTech expert, designed courses for 100K+ students', avatar: 'CN' },
    { name: 'Kwame Asante', role: 'Head of Partnerships', bio: 'Former McKinsey, connects learners to top employers', avatar: 'KA' },
  ];

  const values = [
    { icon: '🎯', title: 'Quality First', desc: 'Every instructor is vetted. Every course is reviewed before publishing.' },
    { icon: '🌍', title: 'African-Focused', desc: 'Built for African learners, by African educators. Relevant, practical, impactful.' },
    { icon: '💡', title: 'Innovation', desc: 'We embrace cutting-edge technology to deliver the best learning experience.' },
    { icon: '🤝', title: 'Community', desc: 'Learning is better together. We foster a supportive, collaborative environment.' },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
            About NextForge Academy
          </motion.h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            We're on a mission to democratize world-class tech education across Africa and beyond.
            Founded in 2022, we've already helped 50,000+ students transform their careers.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[{ v: '50K+', l: 'Students' }, { v: '200+', l: 'Instructors' }, { v: '500+', l: 'Courses' }, { v: '95%', l: 'Employment Rate' }].map((s, i) => (
              <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <p className="text-4xl font-black mb-2" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.v}</p>
                <p style={{ color: 'var(--text-muted)' }}>{s.l}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Our Story</h2>
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                NextForge Academy was born from a simple observation: talented people across Africa were being held back not by lack of ambition, but by lack of access to quality tech education.
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                We built a platform where the best instructors from across the continent could share their knowledge with ambitious learners, creating a virtuous cycle of growth and opportunity.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((v, i) => (
                <motion.div key={v.title} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="text-2xl mb-2">{v.icon}</div>
                  <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <h2 className="text-3xl font-black text-center mb-10" style={{ color: 'var(--text-primary)' }}>Meet the Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black mx-auto mb-4" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                  {member.avatar}
                </div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{member.name}</h3>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent-primary)' }}>{member.role}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function PricingPage() {
  const plans = [
    {
      name: 'Free', price: 0, period: 'forever', color: '#22c55e',
      features: ['Access to free courses', 'Basic progress tracking', 'Community forum access', 'Course certificates'],
      cta: 'Get Started Free', popular: false,
    },
    {
      name: 'Pro', price: 29, period: 'month', color: 'var(--accent-primary)',
      features: ['All courses access', 'Advanced progress tracking', 'Priority support', 'Downloadable resources', 'Offline viewing', 'Certificate of completion', 'Career guidance'],
      cta: 'Start Pro Trial', popular: true,
    },
    {
      name: 'Team', price: 99, period: 'month', color: '#8b5cf6',
      features: ['Everything in Pro', 'Up to 10 team members', 'Team analytics dashboard', 'Custom learning paths', 'Dedicated account manager', 'API access', 'Custom branding'],
      cta: 'Contact Sales', popular: false,
    },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Simple, Transparent Pricing</h1>
          <p className="text-xl" style={{ color: 'var(--text-muted)' }}>Choose the plan that works best for you. Upgrade or downgrade anytime.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border p-8 relative ${plan.popular ? 'ring-2 ring-indigo-500' : ''}`}
                style={{ background: 'var(--bg-card)', borderColor: plan.popular ? plan.color : 'var(--border-color)' }}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white" style={{ background: plan.color }}>
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black" style={{ color: plan.color }}>${plan.price}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register"
                  className="block w-full py-3 rounded-xl font-bold text-center transition-all hover:opacity-90"
                  style={plan.popular ? { background: plan.color, color: 'white' } : { border: `2px solid ${plan.color}`, color: plan.color }}>
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border p-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-black text-center mb-8" style={{ color: 'var(--text-primary)' }}>Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { q: 'Can I switch plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
                { q: 'Is there a free trial?', a: 'Yes! Pro plan comes with a 14-day free trial. No credit card required.' },
                { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, PayPal, and mobile money (M-Pesa, MTN, Airtel).' },
                { q: 'Can I get a refund?', a: 'Yes, we offer a 30-day money-back guarantee on all paid plans.' },
              ].map(faq => (
                <div key={faq.q}>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{faq.q}</h4>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <section className="py-20" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>Get in Touch</h1>
          <p className="text-xl" style={{ color: 'var(--text-muted)' }}>We're here to help. Reach out to our team anytime.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="space-y-6">
              {[
                { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'hello@nextforge.academy' },
                { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+234 800 NEXTFORGE' },
                { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'Lagos, Nigeria · Nairobi, Kenya · Accra, Ghana' },
              ].map(contact => (
                <div key={contact.label} className="flex items-start gap-4 p-5 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)' }}>
                    {contact.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{contact.label}</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{contact.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              {sent ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-16 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(34,197,94,0.15)' }}>
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text-muted)' }}>We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <div className="rounded-2xl border p-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Name</label>
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
                        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Subject</label>
                      <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Message</label>
                      <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={6}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    </div>
                    <button type="submit" className="btn-primary px-8 py-3 flex items-center gap-2 font-semibold">
                      <Send className="w-4 h-4" /> Send Message
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
