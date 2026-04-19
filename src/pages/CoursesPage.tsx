import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import CourseCard from '../components/CourseCard';

const categories = ['All', 'Web Development', 'Data Science', 'DevOps', 'Design', 'Cybersecurity'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = ['Most Popular', 'Highest Rated', 'Newest', 'Price: Low to High', 'Price: High to Low'];

export default function CoursesPage() {
  const { courses } = useAppStore();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [sort, setSort] = useState('Most Popular');

  // Pre-select category from query param (e.g. ?category=Web+Development)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      // Match against known categories (partial match for cases like "DevOps & Cloud" → "DevOps")
      const match = categories.find(c => c !== 'All' && (c === cat || cat.startsWith(c) || c.startsWith(cat.split(' ')[0])));
      setCategory(match || 'All');
    }
  }, [searchParams]);

  const publishedCourses = courses.filter(c => c.isApproved && c.isPublished);

  const filtered = useMemo(() => {
    let result = publishedCourses;
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
  }, [publishedCourses, search, category, level, sort]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="py-16 border-b" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>Explore Courses</h1>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Discover {publishedCourses.length}+ expert-led courses</p>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search courses, topics, skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border text-sm outline-none"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all border"
                style={category === cat
                  ? { background: 'var(--accent-primary)', color: 'white', borderColor: 'var(--accent-primary)' }
                  : { borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <select value={level} onChange={e => setLevel(e.target.value)}
              className="px-4 py-2 rounded-xl border text-sm outline-none"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
              {levels.map(l => <option key={l}>{l}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-2 rounded-xl border text-sm outline-none"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
              {sortOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> courses
          {search && <> for <strong style={{ color: 'var(--accent-primary)' }}>"{search}"</strong></>}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No courses found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
