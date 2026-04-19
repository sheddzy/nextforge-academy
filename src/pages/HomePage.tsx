import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Star, Users, BookOpen, Award, Check, X,
  Play, Zap, Shield, TrendingUp, Quote, ChevronRight,
  Globe, Briefcase, Code2, Brain, Database, Lock
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import CourseCard from '../components/CourseCard';

// Helper to spread motion props inline (used as {...fadeUp(delay)})
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function FadeUp({ children, delay = 0, className = '', style = {} }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  { value: '50,000+', label: 'Active Learners' },
  { value: '200+', label: 'Expert Instructors' },
  { value: '500+', label: 'Courses' },
  { value: '95%', label: 'Job Placement' },
];

const whyUs = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: 'Real-World Skills',
    desc: 'Every course is built around actual industry projects. No fluff — just skills that get you hired.',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Beginner-Friendly',
    desc: 'No prior tech background required. Our curriculum takes you from zero to job-ready, step by step.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Accountability Check-ins',
    desc: 'Stay on track with regular mentor check-ins, live sessions, and a supportive learning community.',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Recognised Certificates',
    desc: 'Earn certificates verified by industry partners and accepted by top employers across Africa.',
  },
];

const courses = [
  { icon: <Code2 className="w-5 h-5" />, name: 'Frontend Development', desc: 'Design with code to create beautiful websites and apps.', badge: 'Popular' },
  { icon: <Database className="w-5 h-5" />, name: 'Backend Development', desc: 'Power the systems behind every great application.', badge: '' },
  { icon: <Brain className="w-5 h-5" />, name: 'Data Science & ML', desc: 'Build predictive models that drive business decisions.', badge: 'Hot' },
  { icon: <Lock className="w-5 h-5" />, name: 'Cybersecurity', desc: 'Protect businesses from modern cyber threats.', badge: '' },
  { icon: <Globe className="w-5 h-5" />, name: 'Product Management', desc: 'Master the art of building products people love.', badge: '' },
  { icon: <TrendingUp className="w-5 h-5" />, name: 'Product Design (UI/UX)', desc: 'Learn user-centered design and create digital products.', badge: 'New' },
];

const testimonials = [
  {
    name: 'Amara Osei', role: 'Software Engineer @ Google', avatar: 'AO', color: '#ee7a3d',
    text: 'NextForge Academy transformed my career. The full-stack bootcamp was incredibly comprehensive and the mentorship was unmatched.',
  },
  {
    name: 'Tunde Adeyemi', role: 'Data Scientist @ Microsoft', avatar: 'TA', color: '#112b58',
    text: 'The ML course here is better than anything I found on Coursera or Udemy. Real projects, real skills, real results.',
  },
  {
    name: 'Chioma Eze', role: 'DevOps Engineer @ AWS', avatar: 'CE', color: '#ee7a3d',
    text: 'Got my AWS certification after completing the Cloud Architecture course. The instructor was phenomenal. 10/10.',
  },
  {
    name: 'Kwame Mensah', role: 'Frontend Dev @ Stripe', avatar: 'KM', color: '#112b58',
    text: 'The community support and mentorship here is unmatched. I landed my dream job 3 months after graduating.',
  },
];

const comparisonFeatures = [
  { feature: 'African Tech Focus', nextforge: true, coursera: false, udemy: false },
  { feature: 'Instructor Vetting & Approval', nextforge: true, coursera: true, udemy: false },
  { feature: 'Completion Certificates', nextforge: true, coursera: true, udemy: true },
  { feature: 'Quality-Controlled Courses', nextforge: true, coursera: false, udemy: false },
  { feature: 'Admin Course Approval', nextforge: true, coursera: true, udemy: false },
  { feature: 'Mobile PWA', nextforge: true, coursera: true, udemy: true },
  { feature: 'Mentorship & Check-ins', nextforge: true, coursera: false, udemy: false },
  { feature: 'Affordable Pricing (NGN)', nextforge: true, coursera: false, udemy: true },
  { feature: 'Paystack Payment', nextforge: true, coursera: false, udemy: false },
  { feature: 'Dedicated Student Dashboard', nextforge: true, coursera: true, udemy: true },
];

export default function HomePage() {
  const { courses: storeCourses } = useAppStore();
  const navigate = useNavigate();
  const featured = storeCourses.filter(c => c.isFeatured && c.isApproved && c.isPublished).slice(0, 3);

  return (
    <div style={{ background: 'var(--bg-primary)' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        <div className="absolute inset-0 hero-grid" />
        {/* Orange glow blob */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(238,122,61,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(17,43,88,0.4) 0%, transparent 70%)' }} />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <motion.div {...fadeUp(0.05)} className="inline-flex items-center gap-2 badge-orange mb-6">
                <Zap className="w-3.5 h-3.5" /> Africa's #1 Tech Academy
              </motion.div>

              <motion.h1 {...fadeUp(0.12)}
                className="font-black leading-[1.05] mb-6"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', color: 'var(--text-primary)' }}>
                Redefining Learning<br />
                for the{' '}
                <span className="gradient-text">Future Workforce</span>
              </motion.h1>

              <motion.p {...fadeUp(0.2)} className="text-lg mb-8 max-w-lg" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Join 50,000+ learners who've launched high-paying tech careers — no experience required. Practical skills, expert mentors, real results.
              </motion.p>

              <motion.div {...fadeUp(0.27)} className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/register" className="btn-primary flex items-center gap-2 px-8 py-4 text-base">
                  Start Learning Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/courses" className="btn-outline-orange flex items-center gap-2 px-8 py-4 text-base">
                  <Play className="w-4 h-4" /> Explore Courses
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div {...fadeUp(0.33)} className="flex items-center gap-5">
                <div className="flex -space-x-2">
                  {['AO', 'TA', 'CE', 'KM', 'JL'].map((init, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                      style={{ borderColor: 'var(--bg-primary)', background: i % 2 === 0 ? 'var(--orange)' : 'var(--navy-mid)' }}>
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>4.9/5 · 12,000+ reviews</p>
                </div>
              </motion.div>
            </div>

            {/* Right — Dashboard preview */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, type: 'spring', damping: 20 }}
              className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl orange-glow"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>nextforgeacademy.online — Student Dashboard</span>
                </div>
                <div className="p-5 space-y-3">
                  {featured.map((course, i) => (
                    <div key={course.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <img src={course.thumbnail} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate mb-1.5" style={{ color: 'var(--text-primary)' }}>{course.title}</p>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-card)' }}>
                          <motion.div className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${[68, 35, 91][i]}%` }}
                            transition={{ delay: 0.8 + i * 0.2, duration: 1, ease: 'easeOut' }}
                            style={{ background: 'linear-gradient(90deg, var(--orange), var(--orange-bright))' }} />
                        </div>
                      </div>
                      <span className="text-xs font-black flex-shrink-0" style={{ color: 'var(--orange)' }}>{[68, 35, 91][i]}%</span>
                    </div>
                  ))}
                  <div className="p-3 rounded-xl flex items-center gap-3"
                    style={{ background: 'rgba(238,122,61,0.08)', border: '1px solid rgba(238,122,61,0.2)' }}>
                    <Award className="w-8 h-8 flex-shrink-0" style={{ color: '#f59e0b' }} />
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Certificate Earned! 🎉</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Full-Stack Development · NFA-2024</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-4 py-2 rounded-xl shadow-lg text-sm font-bold text-white"
                style={{ background: 'var(--orange)', boxShadow: '0 8px 25px rgba(238,122,61,0.4)' }}>
                🎓 50K+ Students
              </motion.div>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl shadow-lg text-sm font-bold text-white"
                style={{ background: 'var(--navy-mid)', boxShadow: '0 8px 25px rgba(17,43,88,0.5)' }}>
                ⭐ 4.9 Rating
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="py-14 border-y" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.08)} className="text-center">
                <p className="text-3xl sm:text-4xl font-black mb-1 gradient-text">{s.value}</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.div {...fadeUp()} className="inline-flex items-center gap-2 badge-orange mb-4">
              Why Choose Us
            </motion.div>
            <motion.h2 {...fadeUp(0.08)} className="text-3xl sm:text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
              We're more than an academy —<br />
              <span className="gradient-text">we're your partner in growth</span>
            </motion.h2>
            <motion.p {...fadeUp(0.14)} className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Here's why thousands of learners across Africa choose NextForge Academy to launch their tech careers.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} {...fadeUp(i * 0.1)}
                className="card p-6 group cursor-default">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110"
                  style={{ background: 'rgba(238,122,61,0.12)', color: 'var(--orange)' }}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES ───────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <motion.div {...fadeUp()} className="inline-flex items-center gap-2 badge-orange mb-4">Explore Our Courses</motion.div>
              <motion.h2 {...fadeUp(0.08)} className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
                Practical, beginner-friendly programs<br />
                <span className="gradient-text">designed to launch careers</span>
              </motion.h2>
            </div>
            <motion.div {...fadeUp(0.1)}>
              <Link to="/courses" className="btn-outline-orange px-5 py-2.5 text-sm whitespace-nowrap flex items-center gap-2">
                View All Courses <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Course category cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {courses.map((course, i) => (
              <motion.div key={course.name} {...fadeUp(i * 0.07)}
                onClick={() => navigate(`/courses?category=${encodeURIComponent(course.name)}`)}
                className="card p-5 cursor-pointer group flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                  style={{ background: 'rgba(238,122,61,0.12)', color: 'var(--orange)' }}>
                  {course.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{course.name}</h3>
                    {course.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: 'rgba(238,122,61,0.15)', color: 'var(--orange)' }}>
                        {course.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{course.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" style={{ color: 'var(--orange)' }} />
              </motion.div>
            ))}
          </div>

          {/* Featured courses */}
          {featured.length > 0 && (
            <>
              <h3 className="text-lg font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Featured Courses</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((course, i) => (
                  <motion.div key={course.id} {...fadeUp(i * 0.1)}>
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── PARTNER ───────────────────────────────────────────────────────── */}
      <section className="py-16 border-y" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p {...fadeUp()} className="text-sm font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
            Our Global Partner
          </motion.p>
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(238,122,61,0.12)' }}>
              <Globe className="w-6 h-6" style={{ color: 'var(--orange)' }} />
            </div>
            <div className="text-left">
              <p className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>American Council of Training and Development</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Internationally recognised certifications</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.div {...fadeUp()} className="inline-flex items-center gap-2 badge-orange mb-4">Student Success Stories</motion.div>
            <motion.h2 {...fadeUp(0.08)} className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
              What People Are Saying
            </motion.h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeUp(i * 0.08)}
                className="card p-6 flex flex-col">
                <Quote className="w-6 h-6 mb-4 flex-shrink-0" style={{ color: 'var(--orange)' }} />
                <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: t.color }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 {...fadeUp()} className="text-3xl sm:text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
              Why NextForge?
            </motion.h2>
            <motion.p {...fadeUp(0.08)} style={{ color: 'var(--text-muted)' }}>See how we stack up against the biggest platforms</motion.p>
          </div>

          <motion.div {...fadeUp(0.1)} className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
            {/* Header */}
            <div className="grid grid-cols-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="p-4" style={{ background: 'var(--bg-secondary)' }} />
              {[
                { name: 'NextForge', highlight: true },
                { name: 'Coursera', highlight: false },
                { name: 'Udemy', highlight: false },
              ].map(p => (
                <div key={p.name} className="p-4 text-center border-l" style={{ borderColor: 'var(--border-color)', background: p.highlight ? 'rgba(238,122,61,0.06)' : 'var(--bg-secondary)' }}>
                  <p className="font-black text-sm" style={{ color: p.highlight ? 'var(--orange)' : 'var(--text-primary)' }}>{p.name}</p>
                  {p.highlight && <p className="text-xs mt-0.5" style={{ color: 'var(--orange)' }}>✦ Best Choice</p>}
                </div>
              ))}
            </div>
            {/* Rows */}
            {comparisonFeatures.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-4 ${i < comparisonFeatures.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: 'var(--border-color)' }}>
                <div className="p-3 border-r" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{row.feature}</span>
                </div>
                {[row.nextforge, row.coursera, row.udemy].map((val, j) => (
                  <div key={j} className="p-3 flex items-center justify-center border-l"
                    style={{ borderColor: 'var(--border-color)', background: j === 0 ? 'rgba(238,122,61,0.03)' : 'var(--bg-card)' }}>
                    {val
                      ? <Check className="w-4 h-4 text-green-500" />
                      : <X className="w-4 h-4" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--navy-deep) 0%, var(--navy) 50%, #1a3a6e 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(238,122,61,0.15) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp()} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border text-sm font-semibold"
            style={{ borderColor: 'rgba(238,122,61,0.4)', color: 'var(--orange)', background: 'rgba(238,122,61,0.08)' }}>
            <Zap className="w-4 h-4" /> Limited Spots Available
          </motion.div>
          <motion.h2 {...fadeUp(0.08)} className="text-3xl sm:text-5xl font-black text-white mb-4">
            Ready to Start Your<br />
            <span className="gradient-text">Tech Career?</span>
          </motion.h2>
          <motion.p {...fadeUp(0.14)} className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Join 50,000+ learners. Access 500+ courses. Earn industry-recognised certificates. Pay with Paystack — NGN supported.
          </motion.p>
          <motion.div {...fadeUp(0.2)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary px-10 py-4 text-base font-bold flex items-center gap-2">
              Enroll Now — It's Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/courses" className="btn-outline-orange px-10 py-4 text-base font-bold" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
              Browse Courses
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
