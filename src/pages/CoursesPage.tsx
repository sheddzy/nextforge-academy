import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import CourseCard from '../components/CourseCard';

const categories = ['All', 'Web Development', 'Data Science', 'DevOps', 'Design', 'Cybersecurity', 'Mobile Development'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = ['Most Popular', 'Highest Rated', 'Newest', 'Price: Low to High', 'Price: High to Low'];

export default function CoursesPage() {
  const { courses } = useAppStore();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [sort, setSort] = useState('Most Popular');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      const match = categories.find(c => c !== 'All' && (c === cat || cat.startsWith(c) || c.startsWith(cat.split(' ')[0])));
      setCategory(match || 'All');
    }
  }, [searchParams]);

  const allPublished = courses.filter(c => c.isApproved && c.isPublished && !c.isComingSoon);
  const comingSoon = courses.filter(c => c.isComingSoon);

  const filtered = useMemo(() => {
    let result = allPublished;
    if (search) result = result.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );
    if (category !== 'All') result = result.filter(c => c.category === category);
    if (level !== 'All') result = result.filter(c => c.level === level);
    switch (sort) {
      case 'Highest Rated': return [...result].sort((a, b) => b.rating - a.rating);
      case 'Newest': return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'Price: Low to High': return [...result].sort((a, b) => a.price - b.price);
      case 'Price: High to Low': return [...result].sort((a, b) => b.price - a.price);
      default: return [...result].sort((a, b) => b.enrolledCount - a.enrolledCount);
    }
  }, [allPublished, search, category, level, sort]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="py-14 border-b" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Explore Courses</h1>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>{allPublished.length} expert-led courses available · {comingSoon.length} coming soon</p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search courses, topics, skills..." value={search} onChange={e => setSearch(e.target.value)}
              className="field pl-11" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
                style={category === cat
                  ? { background: 'var(--accent)', color: 'white', borderColor: 'var(--accent)' }
                  : { borderColor: 'var(--border-mid)', color: 'var(--text-secondary)', background: 'transparent' }}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <select value={level} onChange={e => setLevel(e.target.value)} className="field py-1.5 text-xs" style={{ width: 'auto' }}>
              {levels.map(l => <option key={l}>{l}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} className="field py-1.5 text-xs" style={{ width: 'auto' }}>
              {sortOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Results */}
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> course{filtered.length !== 1 ? 's' : ''}
          {search && <> for <strong style={{ color: 'var(--accent2)' }}>"{search}"</strong></>}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No courses found</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {filtered.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Coming soon section */}
        {comingSoon.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
              <span className="badge badge-amber px-4 py-1.5 text-xs">🚀 Coming Soon</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {comingSoon.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
