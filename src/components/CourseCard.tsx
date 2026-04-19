import { Link } from 'react-router-dom';
import { Star, Users, Clock, BookOpen, Award } from 'lucide-react';
import type { Course } from '../lib/types';

interface Props {
  course: Course;
  showProgress?: boolean;
  progress?: number;
}

export default function CourseCard({ course, showProgress, progress }: Props) {
  return (
    <Link to={`/courses/${course.slug}`} className="group block">
      <div className="rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="relative overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
          {course.isFeatured && (
            <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'var(--accent-primary)' }}>Featured</span>
          )}
          <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
            course.level === 'Beginner' ? 'bg-green-500/90' :
            course.level === 'Intermediate' ? 'bg-yellow-500/90' : 'bg-red-500/90'
          } text-white`}>{course.level}</span>
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-medium px-2 py-1 rounded-md text-white" style={{ background: 'rgba(0,0,0,0.6)' }}>{course.category}</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors" style={{ color: 'var(--text-primary)' }}>
            {course.title}
          </h3>
          <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{course.description}</p>

          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3 h-3 ${i <= Math.floor(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{course.rating}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({course.reviewCount.toLocaleString()})</span>
          </div>

          <div className="flex items-center gap-3 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolledCount.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.modules.length} modules</span>
          </div>

          {showProgress && progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                <span className="font-semibold" style={{ color: 'var(--accent-primary)' }}>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }} />
              </div>
              {progress === 100 && (
                <div className="flex items-center gap-1 mt-2">
                  <Award className="w-3 h-3" style={{ color: '#f59e0b' }} />
                  <span className="text-xs font-medium" style={{ color: '#f59e0b' }}>Completed · Certificate Earned</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              {course.isFree ? (
                <span className="text-lg font-bold" style={{ color: '#22c55e' }}>Free</span>
              ) : (
                <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>${course.price}</span>
              )}
            </div>
            <span className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: 'var(--accent-primary)', color: 'white' }}>
              {showProgress ? 'Continue' : 'View Course'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
