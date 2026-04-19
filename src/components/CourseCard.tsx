import { Link } from 'react-router-dom';
import { Star, Users, Clock, BookOpen, Award, Lock } from 'lucide-react';
import type { Course } from '../lib/types';

interface Props {
  course: Course;
  showProgress?: boolean;
  progress?: number;
  compact?: boolean;
}

const levelColor = { Beginner: '#22c55e', Intermediate: '#f59e0b', Advanced: '#ef4444' };

export default function CourseCard({ course, showProgress, progress, compact }: Props) {
  return (
    <Link to={`/courses/${course.slug}`} className="group block">
      <div className="card card-hover overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30">
        {/* Thumbnail */}
        <div className="relative overflow-hidden" style={{ height: compact ? 140 : 168 }}>
          <img src={course.thumbnail} alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {course.isFeatured && (
              <span className="badge" style={{ background: 'var(--accent-primary)', color: 'white', fontSize: 10 }}>★ Featured</span>
            )}
            <span className="badge ml-auto" style={{ background: `${levelColor[course.level]}22`, color: levelColor[course.level], fontSize: 10 }}>
              {course.level}
            </span>
          </div>

          {/* Category */}
          <div className="absolute bottom-3 left-3">
            <span className="badge" style={{ background: 'rgba(0,0,0,0.6)', color: '#ccc', fontSize: 10, backdropFilter: 'blur(4px)' }}>
              {course.category}
            </span>
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-3 right-3">
            <span className="text-sm font-black text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              {course.isFree || course.price === 0 ? 'Free' : `$${course.price}`}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-indigo-400 transition-colors"
            style={{ color: 'var(--text-primary)' }}>
            {course.title}
          </h3>

          <p className="text-xs mb-3 line-clamp-2 flex-1" style={{ color: 'var(--text-muted)' }}>
            {course.description}
          </p>

          {/* Instructor */}
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            by <span style={{ color: 'var(--text-secondary)' }}>{course.instructorName}</span>
          </p>

          {/* Rating */}
          {course.rating > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3 h-3" style={{ fill: i <= Math.floor(course.rating) ? '#f59e0b' : 'transparent', color: i <= Math.floor(course.rating) ? '#f59e0b' : '#374151' }} />
                ))}
              </div>
              <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>{course.rating}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({course.reviewCount.toLocaleString()})</span>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolledCount.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.modules.length}m</span>
          </div>

          {/* Progress */}
          {showProgress && progress !== undefined && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              {progress === 100 && (
                <div className="flex items-center gap-1 mt-1.5">
                  <Award className="w-3 h-3" style={{ color: 'var(--yellow)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--yellow)' }}>Certificate Earned</span>
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg block text-center ${showProgress ? 'btn-primary' : ''}`}
              style={showProgress ? {} : { background: 'rgba(99,102,241,0.12)', color: 'var(--accent-primary)' }}>
              {showProgress ? (progress === 100 ? 'Review Course' : 'Continue Learning') : 'View Course →'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
