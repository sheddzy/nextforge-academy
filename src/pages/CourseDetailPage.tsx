import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star, Users, Clock, BookOpen, Play, FileText, Award, Check,
  ChevronDown, ChevronUp, Lock, Zap
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import PaystackModal from '../components/PaystackModal';
import ReviewSection from '../components/ReviewSection';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { courses, currentUser, isAuthenticated, enrollInCourse, getEnrollment } = useAppStore();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const course = courses.find(c => c.slug === slug);
  if (!course) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Course not found</h2>
        <Link to="/courses" className="btn-primary px-6 py-2 inline-block">Browse Courses</Link>
      </div>
    </div>
  );

  const enrollment = isAuthenticated ? getEnrollment(course.id) : undefined;
  const isEnrolled = !!enrollment;
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalVideos = course.modules.reduce((acc, m) => acc + m.lessons.filter(l => l.type === 'video').length, 0);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleEnroll = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (course.isFree || course.price === 0) {
      // Free course — enroll directly
      setEnrolling(true);
      setTimeout(() => {
        enrollInCourse(course.id);
        setEnrolling(false);
        navigate(`/learn/${course.id}`);
      }, 600);
      return;
    }
    // Paid course — open Paystack
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    navigate(`/learn/${course.id}`);
  };

  const lessonIcon = (type: string) => {
    if (type === 'video') return <Play className="w-3.5 h-3.5" />;
    if (type === 'pdf') return <FileText className="w-3.5 h-3.5" />;
    if (type === 'quiz') return <Zap className="w-3.5 h-3.5" />;
    return <BookOpen className="w-3.5 h-3.5" />;
  };

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div className="py-16" style={{ background: 'var(--bg-hero)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)' }}>{course.category}</span>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  course.level === 'Beginner' ? 'bg-green-500/20 text-green-500' :
                  course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                }`}>{course.level}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>{course.title}</h1>
              <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.floor(course.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}
                  <span className="font-bold ml-1" style={{ color: 'var(--text-primary)' }}>{course.rating}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({course.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}><Users className="w-4 h-4" />{course.enrolledCount.toLocaleString()} students</span>
                <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}><Clock className="w-4 h-4" />{course.duration}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                  {course.instructorName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Created by</p>
                  <p className="font-semibold" style={{ color: 'var(--accent-primary)' }}>{course.instructorName}</p>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:sticky lg:top-20 self-start">
              <div className="rounded-2xl border overflow-hidden shadow-xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <img src={course.thumbnail} alt="" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {course.isFree || course.price === 0 ? (
                      <span className="text-3xl font-black text-green-500">Free</span>
                    ) : (
                      <>
                        <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>${course.price}</span>
                        <span className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>${(course.price * 1.5).toFixed(2)}</span>
                        <span className="text-sm font-bold text-green-500">33% OFF</span>
                      </>
                    )}
                  </div>

                  {isEnrolled ? (
                    <Link to={`/learn/${course.id}`} className="btn-primary w-full py-3.5 text-center block font-bold text-base mb-4">
                      Continue Learning →
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-3.5 font-bold text-base mb-4 rounded-xl text-white disabled:opacity-70 transition-all hover:opacity-90 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      style={{
                        background: course.isFree || course.price === 0
                          ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                          : 'linear-gradient(135deg, #00c3f7, #0ba4e0)',
                        boxShadow: course.isFree || course.price === 0
                          ? '0 8px 25px rgba(34,197,94,0.3)'
                          : '0 8px 25px rgba(11,164,224,0.3)',
                      }}
                    >
                      {enrolling ? 'Enrolling...' : course.isFree || course.price === 0 ? 'Enroll Free' : `Pay with Paystack — $${course.price}`}
                    </button>
                  )}

                  {/* Paystack badge for paid courses */}
                  {!isEnrolled && !course.isFree && course.price > 0 && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00c3f7, #0ba4e0)' }}>
                        <span className="text-white font-black text-xs">₦</span>
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Secured by <strong style={{ color: '#0ba4e0' }}>Paystack</strong> · NGN · Card · USSD · Transfer</span>
                    </div>
                  )}

                  <div className="space-y-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {[`${totalLessons} lessons`, `${totalVideos} video lectures`, `${course.duration} total content`, 'Certificate of completion', 'Full lifetime access', 'Mobile & desktop access'].map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* What you'll learn */}
            <section>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>What You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-3 p-6 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                {course.whatYouLearn.map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Course Curriculum</h2>
              <div className="space-y-3">
                {course.modules.map((module, mi) => (
                  <div key={module.id} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                    <button onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 text-left transition-colors"
                      style={{ background: 'var(--bg-card)' }}>
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent-primary)' }}>{mi + 1}</span>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{module.title}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{module.lessons.length} lessons</p>
                        </div>
                      </div>
                      {expandedModules.includes(module.id)
                        ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
                    </button>
                    {expandedModules.includes(module.id) && (
                      <div className="border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                        {module.lessons.map(lesson => (
                          <div key={lesson.id} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border-color)' }}>
                            <span style={{ color: lesson.isPreview ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{lessonIcon(lesson.type)}</span>
                            <span className="flex-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{lesson.title}</span>
                            {lesson.duration && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{lesson.duration}</span>}
                            {lesson.isPreview
                              ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)' }}>Preview</span>
                              : !isEnrolled ? <Lock className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /> : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map(req => (
                  <li key={req} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent-primary)' }} />
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            {/* Reviews */}
            <ReviewSection courseId={course.id} />
          </div>

          {/* Tags sidebar */}
          <div>
            <div className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1.5 rounded-full border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paystack Payment Modal */}
      {showPayment && (
        <PaystackModal
          course={course}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
