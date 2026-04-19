import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, BookOpen, Award, ArrowRight, Check, X, Zap, Quote, Video, Download, Shield } from 'lucide-react';
import { useAppStore } from '../lib/store';
import CourseCard from '../components/CourseCard';

const testimonials = [
  { name: 'Amara Osei', role: 'Software Engineer @ Google', text: 'NextForge Academy transformed my career. The full-stack bootcamp was incredibly comprehensive and practical.', avatar: 'AO' },
  { name: 'Tunde Adeyemi', role: 'Data Scientist @ Microsoft', text: 'The ML course here beats anything on Coursera or Udemy. Real projects, real skills, real results.', avatar: 'TA' },
  { name: 'Chioma Eze', role: 'DevOps Engineer @ AWS', text: 'The live classes are a game-changer. Direct access to the instructor made all the difference.', avatar: 'CE' },
  { name: 'Kwame Mensah', role: 'Frontend Dev @ Stripe', text: 'Community support and mentorship here is unmatched. Landed my dream job 3 months after graduating.', avatar: 'KM' },
];

const comparison = [
  { feature: 'African Tech Focus', nf: true, coursera: false, udemy: false },
  { feature: 'Live Interactive Classes', nf: true, coursera: false, udemy: false },
  { feature: 'Class Recordings', nf: true, coursera: true, udemy: false },
  { feature: 'Downloadable Materials', nf: true, coursera: true, udemy: true },
  { feature: 'Admin Course Approval', nf: true, coursera: true, udemy: false },
  { feature: 'Completion Certificates', nf: true, coursera: true, udemy: true },
  { feature: 'Paystack (NGN) Payments', nf: true, coursera: false, udemy: false },
  { feature: 'Mobile PWA', nf: true, coursera: true, udemy: true },
  { feature: 'Affordable Pricing', nf: true, coursera: false, udemy: true },
  { feature: 'Quality-Controlled Instructors', nf: true, coursera: true, udemy: false },
];

const stats = [
  { value: '50K+', label: 'Active Students' },
  { value: '3', label: 'Expert Courses' },
  { value: '95%', label: 'Job Placement' },
  { value: '4.9★', label: 'Avg Rating' },
];

const features = [
  { icon: <Video className="w-5 h-5" />, title: 'Live Classes', desc: 'Join real-time sessions with your instructor via Jitsi Meet — free, no downloads needed.', color: 'var(--cyan)' },
  { icon: <Download className="w-5 h-5" />, title: 'Downloadable Materials', desc: 'Download slides, PDFs and resources to study offline at your own pace.', color: 'var(--green)' },
  { icon: <Award className="w-5 h-5" />, title: 'Certificates', desc: 'Earn industry-recognised certificates automatically when you complete a course.', color: 'var(--amber)' },
  { icon: <Shield className="w-5 h-5" />, title: 'Quality Assured', desc: 'Every instructor is vetted and every course reviewed before it goes live.', color: 'var(--accent2)' },
];

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay } });

export default function HomePage() {
  const { courses } = useAppStore();
  const navigate = useNavigate();

  const activeCourses = courses.filter(c => c.isApproved && c.isPublished && !c.isComingSoon);
  const comingSoon = courses.filter(c => c.isComingSoon);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden flex items-center" style={{ minHeight: '92vh', background: 'var(--bg-hero)' }}>
        <div className="absolute inset-0 hero-grid" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.12), transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.08), transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold mb-6"
                style={{ borderColor: 'rgba(108,99,255,0.4)', color: 'var(--accent2)', background: 'rgba(108,99,255,0.08)' }}>
                <Zap className="w-3.5 h-3.5" /> Africa's #1 Tech Academy
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                className="text-5xl sm:text-6xl font-black leading-[1.08] mb-5"
                style={{ color: 'var(--text-primary)' }}>
                Master Tech.<br />
                <span className="grad-text">Build Your Future.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-lg mb-8 max-w-lg" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Expert-led courses, live interactive classes, downloadable materials, and industry certificates — all in one platform built for African learners.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}
                className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link to="/register" className="btn-primary px-8 py-4 text-base font-bold gap-2">
                  Start Learning Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/courses" className="btn-secondary px-8 py-4 text-base font-bold gap-2">
                  <BookOpen className="w-4 h-4" /> Browse Courses
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="flex items-center gap-5">
                <div className="flex -space-x-2">
                  {['AO','TA','CE','KM'].map((init, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                      style={{ borderColor: 'var(--bg-primary)', background: `hsl(${i * 70 + 200}, 65%, 48%)` }}>{init}</div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>4.9/5 · 12,000+ reviews</p>
                </div>
              </motion.div>
            </div>

            {/* Dashboard preview */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, type: 'spring', damping: 22 }}
              className="hidden lg:block relative">
              <div className="card p-5 shadow-2xl" style={{ background: 'var(--bg-card2)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>Student Dashboard</span>
                </div>
                <div className="space-y-3 mb-4">
                  {activeCourses.slice(0, 3).map((c, i) => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <img src={c.thumbnail} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate mb-1.5" style={{ color: 'var(--text-primary)' }}>{c.title}</p>
                        <div className="progress-bar" style={{ height: 4 }}>
                          <div className="progress-fill" style={{ width: `${[65, 32, 88][i]}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--accent2)' }}>{[65,32,88][i]}%</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl flex items-center gap-3"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <Award className="w-7 h-7 flex-shrink-0" style={{ color: 'var(--amber)' }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Certificate Earned! 🎉</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Full-Stack Development</p>
                  </div>
                </div>
              </div>
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg"
                style={{ background: 'var(--accent)' }}>🎓 50K+ Students</motion.div>
              <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg"
                style={{ background: 'var(--amber)' }}>⭐ 4.9 Rating</motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-10 border-y" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.label} {...fade(i * 0.08)} className="text-center">
                <p className="text-3xl font-black mb-1 grad-text">{s.value}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 {...fade()} className="text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Everything You Need to Succeed</motion.h2>
            <motion.p {...fade(0.1)} style={{ color: 'var(--text-muted)' }}>A complete learning ecosystem, not just videos</motion.p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fade(i * 0.08)} className="card p-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: f.color + '18', color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Active Courses ── */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.h2 {...fade()} className="text-3xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>Available Courses</motion.h2>
              <motion.p {...fade(0.08)} style={{ color: 'var(--text-muted)' }}>Enroll today and start learning immediately</motion.p>
            </div>
            <Link to="/courses" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--accent2)' }}>
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.map((c, i) => (
              <motion.div key={c.id} {...fade(i * 0.1)}><CourseCard course={c} /></motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coming Soon ── */}
      {comingSoon.length > 0 && (
        <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <motion.div {...fade()} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold mb-4"
                style={{ borderColor: 'rgba(245,158,11,0.4)', color: 'var(--amber)', background: 'rgba(245,158,11,0.08)' }}>
                🚀 Coming Soon
              </motion.div>
              <motion.h2 {...fade(0.08)} className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>More Courses on the Way</motion.h2>
              <motion.p {...fade(0.14)} style={{ color: 'var(--text-muted)' }}>We're building more world-class courses. Stay tuned.</motion.p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoon.map((c, i) => (
                <motion.div key={c.id} {...fade(i * 0.08)}><CourseCard course={c} /></motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Comparison ── */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <motion.h2 {...fade()} className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Why NextForge Academy?</motion.h2>
            <motion.p {...fade(0.08)} style={{ color: 'var(--text-muted)' }}>See how we compare to the biggest platforms</motion.p>
          </div>
          <motion.div {...fade(0.12)} className="card overflow-hidden">
            <div className="grid grid-cols-4 text-center border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="p-4 border-r" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Feature</span>
              </div>
              {[{ n: 'NextForge', h: true }, { n: 'Coursera', h: false }, { n: 'Udemy', h: false }].map(p => (
                <div key={p.n} className="p-4 border-l" style={{ borderColor: 'var(--border-color)', background: p.h ? 'rgba(108,99,255,0.06)' : '' }}>
                  <span className="text-sm font-bold" style={{ color: p.h ? 'var(--accent2)' : 'var(--text-primary)' }}>{p.n}</span>
                  {p.h && <div className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>✦ Best</div>}
                </div>
              ))}
            </div>
            {comparison.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-4 text-center ${i < comparison.length - 1 ? 'border-b' : ''}`} style={{ borderColor: 'var(--border-color)' }}>
                <div className="p-3 text-left border-r" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{row.feature}</span>
                </div>
                {[row.nf, row.coursera, row.udemy].map((val, j) => (
                  <div key={j} className="p-3 flex items-center justify-center border-l" style={{ borderColor: 'var(--border-color)', background: j === 0 ? 'rgba(108,99,255,0.03)' : '' }}>
                    {val ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <motion.h2 {...fade()} className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Student Success Stories</motion.h2>
            <motion.p {...fade(0.08)} style={{ color: 'var(--text-muted)' }}>Real results from real students</motion.p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fade(i * 0.08)} className="card p-5">
                <Quote className="w-5 h-5 mb-3" style={{ color: 'var(--accent)' }} />
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: `hsl(${t.avatar.charCodeAt(0) * 20 % 360}, 60%, 48%)` }}>{t.avatar}</div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1060 0%, #0d1a4a 100%)' }}>
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.2), transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 {...fade()} className="text-4xl font-black text-white mb-4">Ready to Start Your Tech Journey?</motion.h2>
          <motion.p {...fade(0.1)} className="text-white/70 text-lg mb-8">
            Join 50,000+ students. 3 expert courses available now. More coming soon.
          </motion.p>
          <motion.div {...fade(0.18)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: 'white', color: 'var(--accent)' }}>
              Enroll Now — It's Free
            </Link>
            <Link to="/courses"
              className="px-8 py-4 rounded-xl font-bold text-base border-2 border-white/30 text-white transition-all hover:bg-white/10">
              Browse Courses
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
