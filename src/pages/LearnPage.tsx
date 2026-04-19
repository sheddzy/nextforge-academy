import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, FileText, Zap, BookOpen, Check, ChevronLeft, ChevronRight, Award, Download, Menu, X, CheckCircle2, Presentation } from 'lucide-react';
import { useAppStore } from '../lib/store';
import type { Lesson } from '../lib/types';

export default function LearnPage() {
  const { courseId } = useParams();
  const { courses, currentUser, isAuthenticated, enrollments, updateProgress } = useAppStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated]);

  const course = courses.find(c => c.id === courseId);
  const enrollment = enrollments.find(e => e.courseId === courseId && e.studentId === currentUser?.id);

  useEffect(() => {
    if (course && !currentLesson) {
      const first = course.modules[0]?.lessons[0];
      if (first) setCurrentLesson(first);
    }
  }, [course]);

  if (!course || !enrollment) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Access denied or course not found</h2>
        <Link to="/dashboard" className="btn-primary px-6 py-2.5 text-sm">Go to Dashboard</Link>
      </div>
    </div>
  );

  const allLessons = course.modules.flatMap(m => m.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isCompleted = (id: string) => enrollment.completedLessons.includes(id);

  const markComplete = () => {
    if (currentLesson && !isCompleted(currentLesson.id)) updateProgress(enrollment.id, currentLesson.id);
    if (nextLesson) { setCurrentLesson(nextLesson); setQuizSubmitted(false); setQuizAnswers({}); }
  };

  const handleQuizSubmit = () => {
    if (!currentLesson?.quiz) return;
    const qs = currentLesson.quiz.questions;
    const correct = qs.filter(q => quizAnswers[q.id] === q.correctIndex).length;
    setQuizScore(Math.round((correct / qs.length) * 100));
    setQuizSubmitted(true);
    if (!isCompleted(currentLesson.id)) updateProgress(enrollment.id, currentLesson.id);
  };

  const typeIcon = (type: string, done: boolean) => {
    if (done) return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
    if (type === 'video') return <Play className="w-3.5 h-3.5" />;
    if (type === 'pdf') return <FileText className="w-3.5 h-3.5" />;
    if (type === 'slide') return <Presentation className="w-3.5 h-3.5" />;
    if (type === 'quiz') return <Zap className="w-3.5 h-3.5" />;
    return <BookOpen className="w-3.5 h-3.5" />;
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden border-r flex flex-col`}
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-sidebar)' }}>
        <div className="p-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <Link to={`/courses/${course.slug}`} className="flex items-center gap-2 mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <ChevronLeft className="w-3.5 h-3.5" /> Back to course
          </Link>
          <p className="font-bold text-xs leading-snug mb-2" style={{ color: 'var(--text-primary)' }}>{course.title}</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 progress-bar"><div className="progress-fill" style={{ width: `${enrollment.progress}%` }} /></div>
            <span className="text-xs font-bold" style={{ color: 'var(--accent2)' }}>{enrollment.progress}%</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {course.modules.map((mod, mi) => (
            <div key={mod.id}>
              <div className="px-4 py-2.5 border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Module {mi + 1}</p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{mod.title}</p>
              </div>
              {mod.lessons.map(lesson => (
                <button key={lesson.id}
                  onClick={() => { setCurrentLesson(lesson); setQuizSubmitted(false); setQuizAnswers({}); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-left border-b transition-all ${currentLesson?.id === lesson.id ? 'sidebar-active' : 'hover:bg-white/3'}`}
                  style={{ borderColor: 'var(--border-color)' }}>
                  <span style={{ color: isCompleted(lesson.id) ? 'var(--green)' : currentLesson?.id === lesson.id ? 'white' : 'var(--text-muted)', flexShrink: 0 }}>
                    {typeIcon(lesson.type, isCompleted(lesson.id))}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: currentLesson?.id === lesson.id ? 'white' : 'var(--text-secondary)' }}>{lesson.title}</p>
                    {lesson.duration && <p className="text-xs" style={{ color: currentLesson?.id === lesson.id ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>{lesson.duration}</p>}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 h-13 border-b flex-shrink-0" style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)', height: 52 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn-ghost p-2 rounded-lg">
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2">
            {prevLesson && (
              <button onClick={() => { setCurrentLesson(prevLesson); setQuizSubmitted(false); setQuizAnswers({}); }}
                className="btn-ghost px-3 py-1.5 text-xs rounded-lg flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
            )}
            {nextLesson && (
              <button onClick={markComplete} className="btn-primary px-3 py-1.5 text-xs rounded-lg flex items-center gap-1">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-3xl mx-auto p-5 sm:p-8">

              {/* Video */}
              {currentLesson.type === 'video' && (
                <div>
                  <div className="rounded-2xl overflow-hidden mb-5" style={{ background: '#000', aspectRatio: '16/9' }}>
                    {currentLesson.videoUrl ? (
                      <video controls className="w-full h-full" src={currentLesson.videoUrl} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Play className="w-12 h-12 text-white/30 mx-auto mb-2" />
                          <p className="text-white/50 text-sm">Video unavailable</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{currentLesson.title}</h1>
                  {currentLesson.duration && <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>Duration: {currentLesson.duration}</p>}
                  {!isCompleted(currentLesson.id)
                    ? <button onClick={markComplete} className="btn-primary px-5 py-2.5 text-sm gap-2"><Check className="w-4 h-4" /> Mark Complete{nextLesson ? ' & Continue' : ''}</button>
                    : <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--green)' }}><CheckCircle2 className="w-4 h-4" /> Completed</div>}
                </div>
              )}

              {/* PDF / Slide */}
              {(currentLesson.type === 'pdf' || currentLesson.type === 'slide') && (
                <div>
                  <h1 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>{currentLesson.title}</h1>
                  <div className="card p-8 mb-5 text-center">
                    {currentLesson.type === 'slide' ? <Presentation className="w-14 h-14 mx-auto mb-3" style={{ color: 'var(--amber)' }} /> : <FileText className="w-14 h-14 mx-auto mb-3" style={{ color: 'var(--red)' }} />}
                    <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{currentLesson.fileName || `${currentLesson.title}.pdf`}</p>
                    {currentLesson.fileSize && <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{currentLesson.fileSize}</p>}
                    {currentLesson.isDownloadable && (
                      <a href={currentLesson.fileUrl || '#'} download className="btn-primary px-5 py-2.5 text-sm gap-2 inline-flex">
                        <Download className="w-4 h-4" /> Download {currentLesson.type === 'slide' ? 'Slides' : 'PDF'}
                      </a>
                    )}
                  </div>
                  {!isCompleted(currentLesson.id)
                    ? <button onClick={markComplete} className="btn-primary px-5 py-2.5 text-sm">Mark as Complete</button>
                    : <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--green)' }}><CheckCircle2 className="w-4 h-4" /> Completed</div>}
                </div>
              )}

              {/* Quiz */}
              {currentLesson.type === 'quiz' && currentLesson.quiz && (
                <div>
                  <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{currentLesson.title}</h1>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{currentLesson.quiz.questions.length} questions</p>
                  {!quizSubmitted ? (
                    <div className="space-y-5">
                      {currentLesson.quiz.questions.map((q, qi) => (
                        <div key={q.id} className="card p-5">
                          <p className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>Q{qi + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((opt, oi) => (
                              <button key={oi} onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oi }))}
                                className="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all"
                                style={{
                                  borderColor: quizAnswers[q.id] === oi ? 'var(--accent)' : 'var(--border-color)',
                                  background: quizAnswers[q.id] === oi ? 'rgba(108,99,255,0.1)' : 'var(--bg-secondary)',
                                  color: 'var(--text-secondary)',
                                }}>
                                <span className="font-semibold mr-2" style={{ color: 'var(--accent2)' }}>{String.fromCharCode(65 + oi)}.</span>{opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length < currentLesson.quiz.questions.length}
                        className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50">Submit Quiz</button>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center">
                      <div className={`w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-4 ${quizScore >= 70 ? 'bg-green-500/15' : 'bg-red-500/15'}`} style={{ width: 72, height: 72 }}>
                        <span className="text-2xl font-black" style={{ color: quizScore >= 70 ? 'var(--green)' : 'var(--red)' }}>{quizScore}%</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{quizScore >= 70 ? '🎉 Great job!' : 'Keep practicing!'}</h3>
                      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>You scored {quizScore}%</p>
                      {nextLesson && (
                        <button onClick={() => { setCurrentLesson(nextLesson); setQuizSubmitted(false); setQuizAnswers({}); }} className="btn-primary px-5 py-2.5 text-sm">
                          Continue to Next Lesson
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Assignment */}
              {currentLesson.type === 'assignment' && (
                <div>
                  <h1 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>{currentLesson.title}</h1>
                  <div className="card p-6 mb-5">
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Complete the practical assignment and submit your solution below.</p>
                    <textarea rows={5} placeholder="Paste your solution or GitHub link here..." className="field resize-none mb-4" />
                    <button onClick={markComplete} className="btn-primary px-5 py-2.5 text-sm">Submit Assignment</button>
                  </div>
                </div>
              )}

              {/* Completion banner */}
              {enrollment.isCompleted && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-5 rounded-2xl flex items-center gap-4"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <Award className="w-10 h-10 flex-shrink-0" style={{ color: 'var(--amber)' }} />
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>🎓 Course Complete!</h3>
                    <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Congratulations! Your certificate has been issued.</p>
                    <Link to="/dashboard/certificates" className="text-sm font-semibold" style={{ color: 'var(--amber)' }}>View Certificate →</Link>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p style={{ color: 'var(--text-muted)' }}>Select a lesson to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
