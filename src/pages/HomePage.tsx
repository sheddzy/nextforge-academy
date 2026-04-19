import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, BookOpen, Award, ArrowRight, Check, X, Zap, Quote, TrendingUp, Shield, Globe } from 'lucide-react';
import { useAppStore } from '../lib/store';
import CourseCard from '../components/CourseCard';

const testimonials = [
  { name: 'Amara Osei', role: 'Software Engineer @ Google', text: 'NextForge transformed my career. The full-stack bootcamp was incredibly comprehensive and practical.', avatar: 'AO' },
  { name: 'Tunde Adeyemi', role: 'Data Scientist @ Microsoft', text: 'The ML course here is better than anything on Coursera or Udemy. Real projects, real skills.', avatar: 'TA' },
  { name: 'Chioma Eze', role: 'DevOps Engineer @ AWS', text: 'Got my AWS certification after the Cloud Architecture course. The instructor was phenomenal.', avatar: 'CE' },
  { name: 'Kwame Mensah', role: 'Frontend Dev @ Stripe', text: 'The community and mentorship here is unmatched. Landed my dream job 3 months after graduating.', avatar: 'KM' },
];

const comparison = [
  { feature: 'African Tech Focus',              nf: true,  coursera: false, udemy: false },
  { feature: 'Instructor Vetting & Approval',   nf: true,  coursera: true,  udemy: false },
  { feature: 'Completion Certificates',         nf: true,  coursera: true,  udemy: true  },
  { feature: 'Progress Tracking',               nf: true,  coursera: true,  udemy: true  },
  { feature: 'Quality-Controlled Instructors',  nf: true,  coursera: false, udemy: false },
  { feature: 'Admin Course Approval',           nf: true,  coursera: true,  udemy: false },
  { feature: 'Mobile PWA',                      nf: true,  coursera: true,  udemy: true  },
  { feature: 'Community Mentorship',            nf: true,  coursera: false, udemy: false },
  { feature: 'Affordable Pricing',              nf: true,  coursera: false, udemy: true  },
  { feature: 'Paystack (NGN) Payments',         nf: true,  coursera: false, udemy: false },
];

const categories = [
  { name: 'Web Development',    icon: '💻', count: 142, cat: 'Web Development' },
  { name: 'Data Science',       icon: '📊', count: 87,  cat: 'Data Science' },
  { name: 'DevOps & Cloud',     icon: '☁️', count: 63,  cat: 'DevOps' },
  { name: 'Cybersecurity',      icon: '🔐', count: 45,  cat: 'Cybersecurity' },
  { name: 'Mobile Dev',         icon: '📱', count: 58,  cat: 'Mobile Development' },
  { name: 'UI/UX Design',       icon: '🎨', count: 72,  cat: 'Design' },
  { name: 'AI & ML',            icon: '🤖', count: 94,  cat: 'Data Science' },
  { name: 'Blockchain',         icon: '⛓️', count: 31,  cat: 'Web Development' },
];

const stats = [
  { value: '50,000+', label: 'Active Students',    icon: <Users className="w-5 h-5" /> },
  { value: '200+',    label: 'Expert Instructors',  icon: <Award className="w-5 h-5" /> },
  { value: '500+',    label: 'Courses Available',   icon: <BookOpen className="w-5 h-5" /> },
  { value: '95%',     label: 'Job Placement Rate',  icon: <TrendingUp className="w-5 h-5" /> },
];

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.5 } });

export default function HomePage() {
  const { courses } = useAppStore();
  const navigate = useNavigate();
  const featured = courses.filter(c => c.isFeatured && c.isApproved && c.isPublished).slice(0, 3);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg-hero)', minHeight: '88vh', display: 'flex', alignItems: 'center' }}>
        <div className="absolute inset-0 hero-grid" />
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: 'var(--accent-primary)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none" style={{ background: 'var(--accent-secondary)' }} />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div {...fade(0.1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold mb-7"
                style={{ borderColor: 'rgba(99,102,241,0.4)', color: 'var(--accent-primary)', background: 'rgba(99,102,241,0.08)' }}>
                <Zap className="w-3.5 h-3.5" /> Africa's #1 Tech Academy
              </motion.div>

              <motion.h1 {...fade(0.15)} className="text-5xl xl:text-6xl font-black leading-[1.08] mb-6" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Master Tech Skills.<br />
                <span className="gradient-text">Build Your Future.</span>
              </motion.h1>

              <motion.p {...fade(0.2)} className="text-lg mb-9 max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Join 50,000+ students learning from Africa's top tech instructors. From web development to AI — build real skills, earn certificates, land jobs.
              </motion.p>

              <motion.div {...fade(0.25)} className="flex flex-wrap gap-4 mb-10">
                <Link to="/register" className="btn-primary px-8 py-3.5 text-base gap-2">
                  Start Learning Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/courses" className="btn-secondary px-8 py-3.5 text-base gap-2">
                  <BookOpen className="w-4 h-4" /> Browse Courses
                </Link>
              </motion.div>

              <motion.div {...fade(0.3)} className="flex items-center gap-5">
                <div className="flex -space-x-2.5">
                  {['AO','TA','CE','KM'].map((init, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                      style={{ borderColor: 'var(--bg-primary)', background: `hsl(${i*60+200},65%,48%)` }}>{init}</div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>4.9/5 from 12,000+ reviews</p>
                </div>
              </motion.div>
            </div>

            {/* Right — dashboard mockup */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
              className="hidden lg:block">
              <div className="card p-6 shadow-2xl shadow-black/50">
                {/* Window chrome */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs font-medium mono" style={{ color: 'var(--text-muted)' }}>student-dashboard.tsx</span>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[{ v: '3', l: 'Enrolled', c: 'var(--accent-primary)' }, { v: '67%', l: 'Avg Progress', c: 'var(--yellow)' }, { v: '1', l: 'Certificate', c: 'var(--green)' }].map(s => (
                    <div key={s.l} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                      <p className="text-lg font-black" style={{ color: s.c }}>{s.v}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.l}</p>
                    </div>
                  ))}
                </div>

                {/* Course progress rows */}
                <div className="space-y-3 mb-5">
                  {featured.map((course, i) => (
                    <div key={course.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <img src={course.thumbnail} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate mb-1.5" style={{ color: 'var(--text-primary)' }}>{course.title}</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${[65, 32, 88][i]}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--accent-primary)' }}>{[65, 32, 88][i]}%</span>
                    </div>
                  ))}
                </div>

                {/* Certificate badge */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <Award className="w-8 h-8 flex-shrink-0" style={{ color: 'var(--yellow)' }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>🎓 Certificate Earned!</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Full-Stack Development · NFA-X9K2M</p>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg"
                style={{ background: 'var(--accent-primary)' }}>
                🎓 50K+ Students
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg"
                style={{ background: 'var(--yellow)' }}>
                ⭐ 4.9 Rating
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <section className="border-y py-10" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--accent-primary)' }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-black gradient-text">{s.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Explore Learning Paths</h2>
            <p style={{ color: 'var(--text-muted)' }}>8 in-demand tech categories to launch your career</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat, i) => (
              <motion.button key={cat.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.04, y: -2 }}
                onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.cat)}`)}
                className="card p-4 text-center cursor-pointer transition-all hover:border-indigo-500/40">
                <div className="text-2xl mb-2">{cat.icon}</div>
                <p className="font-semibold text-xs leading-snug mb-1" style={{ color: 'var(--text-primary)' }}>{cat.name}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{cat.count}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ──────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Featured Courses</h2>
              <p style={{ color: 'var(--text-muted)' }}>Hand-picked by our expert team</p>
            </div>
            <Link to="/courses" className="btn-ghost text-sm gap-2 hidden sm:flex" style={{ color: 'var(--accent-primary)' }}>
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ──────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Why NextForge Academy?</h2>
            <p style={{ color: 'var(--text-muted)' }}>See how we compare to the biggest platforms</p>
          </div>
          <div className="card overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="p-4 border-r" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Feature</span>
              </div>
              {[{ n: 'NextForge', h: true }, { n: 'Coursera', h: false }, { n: 'Udemy', h: false }].map(p => (
                <div key={p.n} className={`p-4 text-center border-l`} style={{ borderColor: 'var(--border-color)', background: p.h ? 'rgba(99,102,241,0.07)' : '' }}>
                  <p className="text-sm font-bold" style={{ color: p.h ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{p.n}</p>
                  {p.h && <p className="text-[10px] mt-0.5" style={{ color: 'var(--accent-primary)' }}>✦ Recommended</p>}
                </div>
              ))}
            </div>
            {comparison.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-4 ${i < comparison.length - 1 ? 'border-b' : ''}`} style={{ borderColor: 'var(--border-color)' }}>
                <div className="p-3 border-r" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{row.feature}</span>
                </div>
                {[row.nf, row.coursera, row.udemy].map((v, j) => (
                  <div key={j} className="p-3 flex items-center justify-center border-l" style={{ borderColor: 'var(--border-color)', background: j === 0 ? 'rgba(99,102,241,0.03)' : '' }}>
                    {v ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-400 opacity-50" />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Student Success Stories</h2>
            <p style={{ color: 'var(--text-muted)' }}>Real results from real students</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="card p-6">
                <Quote className="w-6 h-6 mb-4" style={{ color: 'var(--accent-primary)' }} />
                <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3730a3, #6366f1, #8b5cf6)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5" style={{ letterSpacing: '-0.02em' }}>
            Ready to Start Your Tech Journey?
          </h2>
          <p className="text-white/75 text-lg mb-10 max-w-2xl mx-auto">
            Join 50,000+ students. Access 500+ courses. Earn industry-recognized certificates. Pay securely with Paystack.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-10 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: 'white', color: 'var(--accent-primary)' }}>
              Enroll Now — It's Free
            </Link>
            <Link to="/courses" className="px-10 py-4 rounded-xl font-bold text-base border-2 border-white/40 text-white transition-all hover:bg-white/10">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
