import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Calendar, Clock, Users, Play, Square, Plus, Trash2, ExternalLink, Radio, Film } from 'lucide-react';
import { useAppStore } from '../lib/store';
import type { LiveClass } from '../lib/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function StatusBadge({ status }: { status: LiveClass['status'] }) {
  if (status === 'live') return (
    <span className="flex items-center gap-1.5 badge badge-red">
      <span className="live-dot" style={{ width: 6, height: 6 }} /> LIVE
    </span>
  );
  if (status === 'scheduled') return <span className="badge badge-cyan">Scheduled</span>;
  return <span className="badge badge-muted">Ended</span>;
}

/* ─── Instructor: Schedule form ─── */
function ScheduleForm({ courseId, onDone }: { courseId: string; onDone: () => void }) {
  const { scheduleLiveClass } = useAppStore();
  const [form, setForm] = useState({ title: '', description: '', scheduledAt: '', duration: '60' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      scheduleLiveClass({ ...form, courseId, duration: parseInt(form.duration) });
      setLoading(false);
      onDone();
    }, 500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="card p-6 mb-6">
      <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Schedule New Live Class</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Class Title *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
            placeholder="e.g. React Hooks Deep Dive" className="field" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Description</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
            placeholder="What will you cover?" className="field resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Date & Time *</label>
            <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} required className="field" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Duration (mins)</label>
            <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="field">
              {['30','45','60','90','120'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onDone} className="btn-secondary px-5 py-2.5 text-sm">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5 text-sm">
            {loading ? 'Scheduling...' : 'Schedule Class'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

/* ─── Single class card ─── */
function ClassCard({ lc, isInstructor }: { lc: LiveClass; isInstructor?: boolean }) {
  const { startLiveClass, endLiveClass, deleteLiveClass } = useAppStore();
  const [ending, setEnding] = useState(false);

  const handleJoin = () => {
    if (isInstructor && lc.status === 'scheduled') startLiveClass(lc.id);
    window.open(lc.meetingUrl, '_blank');
  };

  const handleEnd = () => {
    setEnding(true);
    // Simulate recording URL after ending
    setTimeout(() => {
      endLiveClass(lc.id, 'https://www.w3schools.com/html/mov_bbb.mp4');
      setEnding(false);
    }, 800);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <StatusBadge status={lc.status} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{lc.duration} min</span>
          </div>
          <h3 className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{lc.title}</h3>
          {lc.description && <p className="text-xs clamp-2" style={{ color: 'var(--text-muted)' }}>{lc.description}</p>}
        </div>
        {isInstructor && lc.status !== 'live' && (
          <button onClick={() => deleteLiveClass(lc.id)} className="btn-ghost p-1.5 rounded-lg flex-shrink-0" style={{ color: 'var(--red)' }}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(lc.scheduledAt)}</span>
        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{lc.instructorName}</span>
      </div>

      {/* Jitsi Meet info */}
      <div className="p-3 rounded-xl mb-4 text-xs" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <p className="font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Meeting Room</p>
        <p className="font-mono" style={{ color: 'var(--accent2)' }}>{lc.roomName}</p>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Powered by Jitsi Meet · No account required</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {lc.status !== 'ended' && (
          <button onClick={handleJoin}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white ${lc.status === 'live' ? '' : ''}`}
            style={{ background: lc.status === 'live' ? 'var(--red)' : 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
            {lc.status === 'live' ? <><Radio className="w-3.5 h-3.5" /> Join Live</> : <><Play className="w-3.5 h-3.5" /> {isInstructor ? 'Start Class' : 'Join Class'}</>}
          </button>
        )}

        {isInstructor && lc.status === 'live' && (
          <button onClick={handleEnd} disabled={ending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--red)' }}>
            <Square className="w-3.5 h-3.5" /> {ending ? 'Ending...' : 'End & Save Recording'}
          </button>
        )}

        {lc.recordingUrl && (
          <a href={lc.recordingUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(108,99,255,0.12)', color: 'var(--accent2)' }}>
            <Film className="w-3.5 h-3.5" /> Watch Recording
          </a>
        )}

        <a href={lc.meetingUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
          <ExternalLink className="w-3 h-3" /> Open in Jitsi
        </a>
      </div>
    </motion.div>
  );
}

/* ─── Main exported view ─── */
export default function LiveClassesView({ isInstructor, courseId }: { isInstructor?: boolean; courseId?: string }) {
  const { liveClasses, currentUser, courses } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  // Filter classes relevant to this user
  let classes = liveClasses;
  if (isInstructor && currentUser) {
    classes = liveClasses.filter(lc => lc.instructorId === currentUser.id);
  } else if (!isInstructor && currentUser) {
    // Students see classes for courses they're enrolled in
    // (or all if no courseId filter)
    if (courseId) classes = liveClasses.filter(lc => lc.courseId === courseId);
  }

  const live = classes.filter(lc => lc.status === 'live');
  const scheduled = classes.filter(lc => lc.status === 'scheduled').sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const ended = classes.filter(lc => lc.status === 'ended').sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  // Instructor: use their course
  const myCourse = isInstructor && currentUser ? courses.find(c => c.instructorId === currentUser.id) : null;
  const effectiveCourseId = courseId || myCourse?.id || '';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Live Classes</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {isInstructor ? 'Schedule and manage live sessions for your students' : 'Join live sessions and watch recordings'}
          </p>
        </div>
        {isInstructor && effectiveCourseId && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Schedule Class
          </button>
        )}
      </div>

      {isInstructor && showForm && effectiveCourseId && (
        <ScheduleForm courseId={effectiveCourseId} onDone={() => setShowForm(false)} />
      )}

      {/* Jitsi info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl mb-6" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
        <Video className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--cyan)' }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--cyan)' }}>Powered by Jitsi Meet (Open Source)</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Free, open-source video conferencing. No account needed for students — just click Join. Classes are recorded and available after the session ends.
          </p>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-16 card">
          <Video className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No live classes yet</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {isInstructor ? 'Schedule your first live class above.' : 'Your instructor will schedule live sessions here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {live.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--red)' }}>
                <span className="live-dot" /> Happening Now
              </h2>
              <div className="space-y-3">{live.map(lc => <ClassCard key={lc.id} lc={lc} isInstructor={isInstructor} />)}</div>
            </div>
          )}
          {scheduled.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Upcoming</h2>
              <div className="space-y-3">{scheduled.map(lc => <ClassCard key={lc.id} lc={lc} isInstructor={isInstructor} />)}</div>
            </div>
          )}
          {ended.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Past Sessions & Recordings</h2>
              <div className="space-y-3">{ended.map(lc => <ClassCard key={lc.id} lc={lc} isInstructor={isInstructor} />)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
