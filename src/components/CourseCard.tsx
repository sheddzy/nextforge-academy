import { Link } from 'react-router-dom';
import { Star, Users, Clock, BookOpen, Lock } from 'lucide-react';
import type { Course } from '../lib/types';

interface Props { course: Course; showProgress?: boolean; progress?: number; }

export default function CourseCard({ course, showProgress, progress }: Props) {
  if (course.isComingSoon) {
    return (
      <div className="card card-hover overflow-hidden opacity-80">
        <div className="relative overflow-hidden">
          <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" style={{ filter: 'grayscale(40%) brightness(0.7)' }} />
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(7,9,15,0.55)' }}>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.4)' }}>
                <Lock className="w-4 h-4" style={{ color: 'var(--accent2)' }} />
              </div>
              <span className="badge badge-accent text-xs">Coming Soon</span>
            </div>
          </div>
          <span className="absolute top-3 left-3 badge badge-muted">{course.category}</span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-1 clamp-2" style={{ color: 'var(--text-secondary)' }}>{course.title}</h3>
          <p className="text-xs clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>{course.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>${course.price}</span>
            <span className="badge badge-muted">Notify Me</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/courses/${course.slug}`} className="block group">
      <div className="card card-hover overflow-hidden">
        <div className="relative overflow-hidden">
          <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,9,15,0.7) 0%, transparent 55%)' }} />
          {course.isFeatured && <span className="absolute top-3 left-3 badge badge-accent">Featured</span>}
          <span className={`absolute top-3 right-3 badge ${course.level === 'Beginner' ? 'badge-green' : course.level === 'Intermediate' ? 'badge-amber' : 'badge-red'}`}>{course.level}</span>
          <span className="absolute bottom-3 left-3 badge badge-muted">{course.category}</span>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm leading-snug mb-1.5 clamp-2" style={{ color: 'var(--text-primary)' }}>{course.title}</h3>
          <p className="text-xs mb-3 clamp-2" style={{ color: 'var(--text-muted)' }}>{course.description}</p>

          <div className="flex items-center gap-1 mb-3">
            {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= Math.floor(course.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />)}
            <span className="text-xs font-semibold ml-1" style={{ color: 'var(--text-primary)' }}>{course.rating}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({course.reviewCount.toLocaleString()})</span>
          </div>

          <div className="flex items-center gap-3 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolledCount.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.modules.length} modules</span>
          </div>

          {showProgress && progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                <span className="font-semibold" style={{ color: 'var(--accent2)' }}>{progress}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {course.isFree ? <span style={{ color: 'var(--green)' }}>Free</span> : `$${course.price}`}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--accent2)' }}>
              {showProgress ? 'Continue →' : 'View Course →'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
