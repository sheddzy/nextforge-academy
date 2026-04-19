import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  videoUrl: string;
  title: string;
  courseName: string;
  onDismiss: () => void; // called when student confirms they watched it
}

export default function OrientationVideo({ videoUrl, title, courseName, onDismiss }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(onDismiss, 600);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      >
        <motion.div
          initial={{ scale: 0.92, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 24 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--orange-bright))' }}>
                <Play className="w-4 h-4 text-white ml-0.5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>
                  Orientation — Watch First
                </p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{courseName}</p>
              </div>
            </div>
          </div>

          {/* Notice banner */}
          <div className="flex items-start gap-3 px-5 py-3" style={{ background: 'rgba(238,122,61,0.08)', borderBottom: '1px solid rgba(238,122,61,0.2)' }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
            <p className="text-xs" style={{ color: 'var(--orange-light)' }}>
              Please watch this orientation video before accessing course content. It contains important information about how this course is structured.
            </p>
          </div>

          {/* Video */}
          <div className="relative" style={{ aspectRatio: '16/9', background: '#000' }}>
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full"
              style={{ display: 'block' }}
            />
          </div>

          {/* Title & CTA */}
          <div className="p-5">
            <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
              Watch the full video above, then confirm below to unlock your course content.
            </p>

            {!confirmed ? (
              <button
                onClick={handleConfirm}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--orange-bright))', boxShadow: '0 8px 24px rgba(238,122,61,0.3)' }}
              >
                <CheckCircle2 className="w-5 h-5" />
                I've Watched the Orientation — Start Learning
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 py-3.5">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-green-500">Great! Loading your course…</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
