import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Play, Star, Users, BookOpen, Award, ArrowRight,
  Check, X, ChevronRight, Zap, Globe, Shield, TrendingUp, Quote
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import CourseCard from '../components/CourseCard';

const testimonials = [
  { name: 'Amara Osei', role: 'Software Engineer @ Google', text: 'NextForge Academy transformed my career. The full-stack bootcamp was incredibly comprehensive and practical.', avatar: 'AO', rating: 5 },
  { name: 'Tunde Adeyemi', role: 'Data Scientist @ Microsoft', text: 'The ML course here is better than anything I found on Coursera or Udemy. Real projects, real skills.', avatar: 'TA', rating: 5 },
  { name: 'Chioma Eze', role: 'DevOps Engineer @ AWS', text: 'Got my AWS certification after completing the Cloud Architecture course. The instructor was phenomenal.', avatar: 'CE', rating: 5 },
  { name: 'Kwame Mensah', role: 'Frontend Developer @ Stripe', text: 'The community support and mentorship here is unmatched. I landed my dream job 3 months after graduating.', avatar: 'KM', rating: 5 },
];

const comparisonFeatures = [
  { feature: 'African Tech Focus', nextforge: true, coursera: false, udemy: false },
  { feature: 'Instructor Vetting & Approval', nextforge: true, coursera: true, udemy: false },
  { feature: 'Completion Certificates', nextforge: true, coursera: true, udemy: true },
  { feature: 'Progress Tracking', nextforge: true, coursera: true, udemy: true },
  { feature: 'Quality-Controlled Instructors', nextforge: true, coursera: false, udemy: false },
  { feature: 'Admin Course Approval', nextforge: true, coursera: true, udemy: false },
  { feature: 'Mobile PWA', nextforge: true, coursera: true, udemy: true },
  { feature: 'Community Mentorship', nextforge: true, coursera: false, udemy: false },
  { feature: 'Affordable Pricing', nextforge: true, coursera: false, udemy: true },
  { feature: 'Dedicated Student Dashboard', nextforge: true, coursera: true, udemy: true },
];

const stats = [
  { value: '50,000+', label: 'Active Students' },
  { value: '200+', label: 'Expert Instructors' },
  { value: '500+', label: 'Courses Available' },
  { value: '95%', label: 'Job Placement Rate' },
];

const categories = [
  { name: 'Web Development', icon: '💻', count: 142 },
  { name: 'Data Science', icon: '📊', count: 87 },
  { name: 'DevOps & Cloud', icon: '☁️', count: 63 },
  { name: 'Cybersecurity', icon: '🔐', count: 45 },
  { name: 'Mobile Dev', icon: '📱', count: 58 },
  { name: 'UI/UX Design', icon: '🎨', count: 72 },
  { name: 'AI & ML', icon: '🤖', count: 94 },
  { name: 'Blockchain', icon: '⛓️', count: 31 },
];

export default function HomePage() {
  const { courses } = useAppStore();
  const navigate = useNavigate();
  const featuredCourses = courses.filter(c => c.isFeatured && c.isApproved && c.isPublished).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg-hero)', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div className="absolute inset-0 hero-grid" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-6"
                style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', background: 'var(--accent-primary)15' }}>
                <Zap className="w-4 h-4" /> Africa's #1 Tech Academy
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6"
                style={{ color: 'var(--text-primary)' }}>
                Master Tech Skills.<br />
                <span style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Build Your Future.
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-lg mb-8 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                Join 50,000+ students learning from Africa's top tech instructors. From web development to AI — build real skills, earn certificates, land jobs.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/register" className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold">
                  Start Learning Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/courses" className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold">
                  <BookOpen className="w-4 h-4" /> Browse Courses
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {['AO', 'TA', 'CE', 'KM'].map((init, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white" style={{ borderColor: 'var(--bg-primary)', background: `hsl(${i * 60 + 200}, 70%, 50%)` }}>{init}</div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>4.9/5 from 12,000+ reviews</p>
                </div>
              </motion.div>
            </div>

            {/* Hero Visual */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, type: 'spring' }}
              className="hidden lg:block relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>Student Dashboard</span>
                  </div>
                  <div className="space-y-3">
                    {featuredCourses.map((course, i) => (
                      <div key={course.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                        <img src={course.thumbnail} className="w-12 h-12 rounded-lg object-cover" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{course.title}</p>
                          <div className="h-1.5 rounded-full mt-2" style={{ background: 'var(--border-color)' }}>
                            <div className="h-full rounded-full" style={{ width: `${[65, 32, 88][i]}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }} />
                          </div>
                        </div>
                        <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>{[65, 32, 88][i]}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                    <Award className="w-8 h-8" style={{ color: '#f59e0b' }} />
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Certificate Earned!</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Full-Stack Development</p>
                    </div>
                  </div>
                </div>
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-4 py-2 rounded-xl shadow-lg text-sm font-bold"
                style={{ background: 'var(--accent-primary)', color: 'white' }}>
                🎓 50K+ Students
              </motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl shadow-lg text-sm font-bold"
                style={{ background: '#f59e0b', color: 'white' }}>
                ⭐ 4.9 Rating
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center">
                <p className="text-3xl font-black mb-1" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Explore Learning Paths</h2>
            <p style={{ color: 'var(--text-muted)' }}>Choose from 8 in-demand tech categories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="cursor-pointer p-5 rounded-2xl border text-center transition-all"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.name)}`)}>
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{cat.name}</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{cat.count} courses</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Featured Courses</h2>
              <p style={{ color: 'var(--text-muted)' }}>Hand-picked by our expert team</p>
            </div>
            <Link to="/courses" className="hidden sm:flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--accent-primary)' }}>
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Why NextForge Academy?</h2>
            <p style={{ color: 'var(--text-muted)' }}>See how we compare to the biggest platforms</p>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="grid grid-cols-4 text-center">
              <div className="p-4 border-b border-r" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Feature</span>
              </div>
              {[{ name: 'NextForge', highlight: true }, { name: 'Coursera', highlight: false }, { name: 'Udemy', highlight: false }].map(p => (
                <div key={p.name} className={`p-4 border-b ${p.highlight ? '' : 'border-l'}`} style={{ borderColor: 'var(--border-color)', background: p.highlight ? 'rgba(99,102,241,0.1)' : '' }}>
                  <span className="text-sm font-bold" style={{ color: p.highlight ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{p.name}</span>
                  {p.highlight && <div className="text-xs mt-0.5" style={{ color: 'var(--accent-primary)' }}>✦ Recommended</div>}
                </div>
              ))}
            </div>
            {comparisonFeatures.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-4 text-center ${i < comparisonFeatures.length - 1 ? 'border-b' : ''}`} style={{ borderColor: 'var(--border-color)' }}>
                <div className="p-3 text-left border-r" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{row.feature}</span>
                </div>
                {[row.nextforge, row.coursera, row.udemy].map((val, j) => (
                  <div key={j} className={`p-3 flex items-center justify-center ${j > 0 ? 'border-l' : ''}`} style={{ borderColor: 'var(--border-color)', background: j === 0 ? 'rgba(99,102,241,0.03)' : '' }}>
                    {val ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-400" />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Student Success Stories</h2>
            <p style={{ color: 'var(--text-muted)' }}>Real results from real students</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <Quote className="w-6 h-6 mb-3" style={{ color: 'var(--accent-primary)' }} />
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>{t.avatar}</div>
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

      {/* CTA */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Start Your Tech Journey?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Join 50,000+ students. Get access to 500+ courses. Earn industry-recognized certificates.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105" style={{ background: 'white', color: 'var(--accent-primary)' }}>
              Enroll Now — It's Free
            </Link>
            <Link to="/courses" className="px-8 py-4 rounded-xl font-bold text-base border-2 border-white text-white transition-all hover:bg-white/10">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
