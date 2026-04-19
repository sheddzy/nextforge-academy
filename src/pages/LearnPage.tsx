import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play, FileText, Zap, BookOpen, Check, ChevronLeft, ChevronRight,
  Award, Download, Menu, X, Lock, CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import type { Lesson, QuizQuestion } from '../lib/types';

export default function LearnPage() {
  const { courseId } = useParams();
  const { courses, currentUser, isAuthenticated, enrollments, updateProgress } = useAppStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
  }, [isAuthenticated]);

  const course = courses.find(c => c.id === courseId);
  const enrollment = enrollments.find(e => e.courseId === courseId && e.studentId === currentUser?.id);

  useEffect(() => {
    if (course && !currentLesson) {
      const firstLesson = course.modules[0]?.lessons[0];
      if (firstLesson) setCurrentLesson(firstLesson);
    }
  }, [course]);

  if (!course || !enrollment) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Access denied or course not found</h2>
        <Link to="/dashboard" className="btn-primary px-6 py-2 inline-block">Go to Dashboard</Link>
      </div>
    </div>
  );

  const allLessons = course.modules.flatMap(m => m.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isCompleted = (lessonId: string) => enrollment.completedLessons.includes(lessonId);

  const markComplete = () => {
    if (currentLesson && !isCompleted(currentLesson.id)) {
      updateProgress(enrollment.id, currentLesson.id);
    }
    if (nextLesson) setCurrentLesson(nextLesson);
  };

  const handleQuizSubmit = () => {
    if (!currentLesson?.quiz) return;
    const questions = currentLesson.quiz.questions;
    let correct = 0;
    questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) correct++;
    });
    const score = Math.round((correct / questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    if (!isCompleted(currentLesson.id)) {
      updateProgress(enrollment.id, currentLesson.id);
    }
  };

  const lessonIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (type === 'video') return <Play className="w-4 h-4" />;
    if (type === 'pdf') return <FileText className="w-4 h-4" />;
    if (type === 'quiz') return <Zap className="w-4 h-4" />;
    return <BookOpen className="w-4 h-4" />;
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden border-r flex flex-col`}
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-sidebar)' }}>
        <div className="p-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <Link to={`/courses/${course.slug}`} className="flex items-center gap-2 mb-3">
            <ChevronLeft className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Back to course</span>
          </Link>
          <h2 className="font-bold text-sm leading-snug mb-2" style={{ color: 'var(--text-primary)' }}>{course.title}</h2>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
              <div className="h-full rounded-full" style={{ width: `${enrollment.progress}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>{enrollment.progress}%</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.modules.map((module, mi) => (
            <div key={module.id}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Module {mi + 1}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{module.title}</p>
              </div>
              {module.lessons.map(lesson => (
                <button key={lesson.id}
                  onClick={() => { setCurrentLesson(lesson); setQuizSubmitted(false); setQuizAnswers({}); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b transition-all ${
                    currentLesson?.id === lesson.id ? 'sidebar-active' : 'hover:bg-accent/5'
                  }`}
                  style={{ borderColor: 'var(--border-color)' }}>
                  <span style={{ color: isCompleted(lesson.id) ? '#22c55e' : currentLesson?.id === lesson.id ? 'white' : 'var(--text-muted)', flexShrink: 0 }}>
                    {lessonIcon(lesson.type, isCompleted(lesson.id))}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${currentLesson?.id === lesson.id ? 'text-white' : ''}`}
                      style={{ color: currentLesson?.id === lesson.id ? 'white' : 'var(--text-secondary)' }}>
                      {lesson.title}
                    </p>
                    {lesson.duration && <p className="text-xs" style={{ color: currentLesson?.id === lesson.id ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{lesson.duration}</p>}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 h-14 border-b flex-shrink-0" style={{ background: 'var(--bg-nav)', borderColor: 'var(--border-color)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            {prevLesson && (
              <button onClick={() => { setCurrentLesson(prevLesson); setQuizSubmitted(false); setQuizAnswers({}); }}
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
            )}
            {nextLesson && (
              <button onClick={markComplete}
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg btn-primary">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto p-6">
              {/* Video Lesson */}
              {currentLesson.type === 'video' && (
                <div>
                  <div className="rounded-2xl overflow-hidden mb-6 flex items-center justify-center" style={{ background: '#000', aspectRatio: '16/9' }}>
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <p className="text-white/70 text-sm">Video Player</p>
                      <p className="text-white/50 text-xs mt-1">{currentLesson.duration} · {currentLesson.title}</p>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{currentLesson.title}</h1>
                  <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Duration: {currentLesson.duration}</p>
                  {!isCompleted(currentLesson.id) && (
                    <button onClick={markComplete} className="btn-primary px-6 py-3 font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4" /> Mark as Complete {nextLesson ? '& Continue' : ''}
                    </button>
                  )}
                  {isCompleted(currentLesson.id) && (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">Lesson Completed</span>
                    </div>
                  )}
                </div>
              )}

              {/* PDF Lesson */}
              {currentLesson.type === 'pdf' && (
                <div>
                  <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{currentLesson.title}</h1>
                  <div className="rounded-2xl border p-8 mb-6 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
                    <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Course Materials PDF</p>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Download the resources for this module</p>
                    <button className="btn-primary px-6 py-3 flex items-center gap-2 mx-auto">
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                  </div>
                  {!isCompleted(currentLesson.id) && (
                    <button onClick={markComplete} className="btn-primary px-6 py-3 font-semibold">
                      Mark as Complete
                    </button>
                  )}
                </div>
              )}

              {/* Quiz Lesson */}
              {currentLesson.type === 'quiz' && currentLesson.quiz && (
                <div>
                  <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{currentLesson.title}</h1>
                  <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{currentLesson.quiz.questions.length} questions · Test your knowledge</p>

                  {!quizSubmitted ? (
                    <div className="space-y-6">
                      {currentLesson.quiz.questions.map((q, qi) => (
                        <div key={q.id} className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                          <p className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Q{qi + 1}. {q.question}</p>
                          <div className="space-y-3">
                            {q.options.map((opt, oi) => (
                              <button key={oi} onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oi }))}
                                className="w-full text-left px-4 py-3 rounded-xl border transition-all text-sm"
                                style={{
                                  borderColor: quizAnswers[q.id] === oi ? 'var(--accent-primary)' : 'var(--border-color)',
                                  background: quizAnswers[q.id] === oi ? 'rgba(99,102,241,0.1)' : 'var(--bg-secondary)',
                                  color: 'var(--text-secondary)'
                                }}>
                                <span className="font-medium mr-2" style={{ color: 'var(--accent-primary)' }}>{String.fromCharCode(65 + oi)}.</span>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length < currentLesson.quiz.questions.length}
                        className="btn-primary px-8 py-3 font-bold disabled:opacity-50">
                        Submit Quiz
                      </button>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl border p-8 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${quizScore >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        <span className="text-3xl font-black" style={{ color: quizScore >= 70 ? '#22c55e' : '#ef4444' }}>{quizScore}%</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {quizScore >= 70 ? '🎉 Great job!' : 'Keep practicing!'}
                      </h3>
                      <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
                        You scored {quizScore}% on this quiz.
                      </p>
                      <div className="space-y-3 text-left mb-6">
                        {currentLesson.quiz.questions.map((q, qi) => (
                          <div key={q.id} className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Q{qi + 1}. {q.question}</p>
                            <p className="text-xs" style={{ color: quizAnswers[q.id] === q.correctIndex ? '#22c55e' : '#ef4444' }}>
                              {quizAnswers[q.id] === q.correctIndex ? '✓ Correct' : `✗ Incorrect — Answer: ${q.options[q.correctIndex]}`}
                            </p>
                          </div>
                        ))}
                      </div>
                      {nextLesson && (
                        <button onClick={() => { setCurrentLesson(nextLesson); setQuizSubmitted(false); setQuizAnswers({}); }}
                          className="btn-primary px-6 py-3">
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
                  <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{currentLesson.title}</h1>
                  <div className="rounded-2xl border p-6 mb-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Assignment Instructions</h3>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Complete the practical assignment for this module. Submit your work through the form below.
                    </p>
                    <textarea
                      rows={6}
                      placeholder="Paste your solution or GitHub repository link here..."
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                    <div className="flex gap-3 mt-4">
                      <button className="btn-secondary px-4 py-2 text-sm flex items-center gap-2">
                        <Download className="w-4 h-4" /> Download Brief
                      </button>
                      <button onClick={markComplete} className="btn-primary px-4 py-2 text-sm">
                        Submit Assignment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Completion Banner */}
              {enrollment.isCompleted && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 rounded-2xl flex items-center gap-4"
                  style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.1))', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <Award className="w-12 h-12" style={{ color: '#f59e0b', flexShrink: 0 }} />
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>🎓 Course Complete!</h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Congratulations! You've earned your certificate.</p>
                    <Link to="/dashboard/certificates" className="text-sm font-semibold" style={{ color: '#f59e0b' }}>
                      View Certificate →
                    </Link>
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
