import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Edit2, Trash2, CheckCircle2, Lock, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../lib/store';

interface Props {
  courseId: string;
}

function StarPicker({ value, onChange, size = 'md' }: { value: number; onChange?: (v: number) => void; size?: 'sm' | 'md' | 'lg' }) {
  const [hovered, setHovered] = useState(0);
  const sz = size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4';
  const active = hovered || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHovered(i)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`transition-transform ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star
            className={sz}
            style={{
              fill: i <= active ? '#f59e0b' : 'transparent',
              color: i <= active ? '#f59e0b' : '#4b5563',
              transition: 'fill 0.1s, color 0.1s',
            }}
          />
        </button>
      ))}
    </div>
  );
}

const ratingLabels: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 w-16 justify-end">
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{star}</span>
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      </div>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: pct > 0 ? '#f59e0b' : 'transparent' }}
        />
      </div>
      <span className="text-xs w-8" style={{ color: 'var(--text-muted)' }}>{count}</span>
    </div>
  );
}

export default function ReviewSection({ courseId }: Props) {
  const { currentUser, isAuthenticated, reviews, enrollments, submitReview, updateReview, deleteReview, getUserReview } = useAppStore();

  const courseReviews = reviews.filter(r => r.courseId === courseId);
  const userReview = getUserReview(courseId);
  const isEnrolled = isAuthenticated && !!enrollments.find(e => e.courseId === courseId && e.studentId === currentUser?.id);

  const [rating, setRating] = useState(userReview?.rating || 0);
  const [comment, setComment] = useState(userReview?.comment || '');
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Rating breakdown
  const total = courseReviews.length;
  const avgRating = total > 0 ? (courseReviews.reduce((a, r) => a + r.rating, 0) / total) : 0;
  const breakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: courseReviews.filter(r => r.rating === star).length,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (comment.trim().length < 10) { setError('Review must be at least 10 characters.'); return; }

    setSubmitting(true);
    setTimeout(() => {
      if (editing && userReview) {
        updateReview(userReview.id, rating, comment.trim());
        setSuccess('Review updated!');
        setEditing(false);
      } else {
        const result = submitReview(courseId, rating, comment.trim());
        if (!result.success) { setError(result.error || 'Failed to submit review.'); setSubmitting(false); return; }
        setSuccess('Review submitted! Thank you.');
      }
      setSubmitting(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 500);
  };

  const handleEdit = () => {
    if (!userReview) return;
    setRating(userReview.rating);
    setComment(userReview.comment);
    setEditing(true);
    setSuccess('');
    setError('');
  };

  const handleDelete = () => {
    if (!userReview) return;
    if (!confirm('Delete your review?')) return;
    deleteReview(userReview.id);
    setRating(0);
    setComment('');
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setRating(userReview?.rating || 0);
    setComment(userReview?.comment || '');
    setError('');
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
        Student Reviews
      </h2>

      {/* Rating Summary */}
      {total > 0 && (
        <div className="rounded-2xl border p-6 mb-8 grid sm:grid-cols-2 gap-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          {/* Average */}
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-6xl font-black mb-2" style={{ color: '#f59e0b' }}>{avgRating.toFixed(1)}</p>
            <StarPicker value={Math.round(avgRating)} size="lg" />
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Course Rating · {total} review{total !== 1 ? 's' : ''}</p>
          </div>
          {/* Breakdown bars */}
          <div className="space-y-2 justify-center flex flex-col">
            {breakdown.map(({ star, count }) => (
              <RatingBar key={star} star={star} count={count} total={total} />
            ))}
          </div>
        </div>
      )}

      {/* Write / Edit Review Form */}
      <div className="mb-8">
        {!isAuthenticated ? (
          <div className="rounded-2xl border p-6 flex items-center gap-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <Lock className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Sign in to leave a review</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                <Link to="/login" style={{ color: 'var(--accent-primary)' }} className="font-semibold">Log in</Link> or <Link to="/register" style={{ color: 'var(--accent-primary)' }} className="font-semibold">register</Link> to share your experience.
              </p>
            </div>
          </div>
        ) : !isEnrolled ? (
          <div className="rounded-2xl border p-6 flex items-center gap-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <MessageSquare className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Enroll to leave a review</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Only enrolled students can review this course.</p>
            </div>
          </div>
        ) : userReview && !editing ? (
          /* Your submitted review */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border p-6" style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'var(--accent-primary)', borderWidth: '1.5px' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                  {currentUser?.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Your Review</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(userReview.updatedAt || userReview.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleEdit} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--accent-primary)' }}>
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button onClick={handleDelete} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
            <StarPicker value={userReview.rating} size="md" />
            <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{userReview.comment}</p>
          </motion.div>
        ) : (
          /* Write / Edit form */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              {editing ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star picker */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Your Rating *</label>
                <div className="flex items-center gap-4">
                  <StarPicker value={rating} onChange={setRating} size="lg" />
                  {rating > 0 && (
                    <span className="text-sm font-semibold" style={{ color: '#f59e0b' }}>{ratingLabels[rating]}</span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Your Review *</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={4}
                  placeholder="Share your experience with this course — what did you learn, what stood out, would you recommend it?"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-colors"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
                <p className="text-xs mt-1 text-right" style={{ color: comment.length < 10 ? '#ef4444' : 'var(--text-muted)' }}>
                  {comment.length} / 10 min characters
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-xl text-sm flex items-center gap-2" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {success}
                </div>
              )}

              <div className="flex gap-3">
                {editing && (
                  <button type="button" onClick={handleCancelEdit} className="btn-secondary px-5 py-2.5 text-sm">
                    Cancel
                  </button>
                )}
                <button type="submit" disabled={submitting || rating === 0} className="btn-primary px-6 py-2.5 text-sm font-semibold disabled:opacity-60">
                  {submitting ? 'Submitting...' : editing ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Reviews List */}
      {courseReviews.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <Star className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No reviews yet</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Be the first to review this course!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courseReviews
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border p-5"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: `hsl(${review.studentName.charCodeAt(0) * 15 % 360}, 60%, 50%)` }}
                    >
                      {review.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {review.studentName}
                        {review.studentId === currentUser?.id && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)' }}>You</span>
                        )}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(review.updatedAt || review.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {review.updatedAt && <span className="ml-1">(edited)</span>}
                      </p>
                    </div>
                  </div>
                  <StarPicker value={review.rating} size="sm" />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
              </motion.div>
            ))}
        </div>
      )}
    </section>
  );
}
