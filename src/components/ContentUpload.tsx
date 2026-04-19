import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Video, FileText, Presentation, Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../lib/store';
import type { Lesson } from '../lib/types';

const typeIcons: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  pdf: <FileText className="w-4 h-4" />,
  slide: <Presentation className="w-4 h-4" />,
};

const typeColors: Record<string, string> = {
  video: 'var(--accent)',
  pdf: 'var(--red)',
  slide: 'var(--amber)',
};

function UploadZone({ type, onFile }: { type: 'video' | 'pdf' | 'slide'; onFile: (name: string, size: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState<string | null>(null);

  const accept = type === 'video' ? 'video/*' : '.pdf,.pptx,.ppt';

  const handleFile = (file: File) => {
    const size = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(0)} KB`;
    setUploaded(file.name);
    onFile(file.name, size);
  };

  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
      style={{
        borderColor: dragging ? 'var(--accent)' : uploaded ? 'var(--green)' : 'var(--border-mid)',
        background: dragging ? 'rgba(108,99,255,0.06)' : uploaded ? 'rgba(34,197,94,0.05)' : 'var(--bg-secondary)',
      }}
    >
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      {uploaded ? (
        <div className="flex items-center justify-center gap-2">
          <Check className="w-4 h-4" style={{ color: 'var(--green)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--green)' }}>{uploaded}</span>
        </div>
      ) : (
        <>
          <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Drop {type === 'video' ? 'video' : type === 'pdf' ? 'PDF' : 'slides'} here or click to browse
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {type === 'video' ? 'MP4, MOV, AVI up to 2GB' : type === 'pdf' ? 'PDF up to 50MB' : 'PDF, PPTX up to 50MB'}
          </p>
        </>
      )}
    </div>
  );
}

function AddLessonForm({ moduleId, courseId, onDone }: { moduleId: string; courseId: string; onDone: () => void }) {
  const { addLesson } = useAppStore();
  const [form, setForm] = useState({ title: '', type: 'video' as 'video' | 'pdf' | 'slide', isPreview: false, isDownloadable: false, duration: '', fileName: '', fileSize: '' });
  const [saving, setSaving] = useState(false);

  const handleFile = (name: string, size: string) => setForm(f => ({ ...f, fileName: name, fileSize: size }));

  const handleSave = () => {
    if (!form.title) return;
    setSaving(true);
    setTimeout(() => {
      const lesson: Lesson = {
        id: `les_${Date.now()}`,
        moduleId,
        title: form.title,
        type: form.type,
        isPreview: form.isPreview,
        isDownloadable: form.isDownloadable,
        order: 99,
        ...(form.type === 'video' ? { duration: form.duration, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' } : {}),
        ...(form.type !== 'video' ? { fileName: form.fileName || `${form.title}.pdf`, fileSize: form.fileSize || '1 MB', fileUrl: '#' } : {}),
      };
      addLesson(moduleId, courseId, lesson);
      setSaving(false);
      onDone();
    }, 600);
  };

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      className="mt-3 p-4 rounded-xl border" style={{ background: 'var(--bg-card2)', borderColor: 'var(--border-mid)' }}>
      <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Add New Lesson</h4>
      <div className="space-y-3">
        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Lesson title" className="field text-sm" />

        <div className="flex gap-2">
          {(['video', 'pdf', 'slide'] as const).map(t => (
            <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all border`}
              style={form.type === t ? { background: typeColors[t] + '20', borderColor: typeColors[t], color: typeColors[t] } : { borderColor: 'var(--border-color)', color: 'var(--text-muted)', background: 'transparent' }}>
              {typeIcons[t]} {t}
            </button>
          ))}
        </div>

        {form.type === 'video' && (
          <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
            placeholder="Duration e.g. 24:30" className="field text-sm" />
        )}

        <UploadZone type={form.type} onFile={handleFile} />

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={form.isPreview} onChange={e => setForm(f => ({ ...f, isPreview: e.target.checked }))} className="rounded" />
            Free preview
          </label>
          {form.type !== 'video' && (
            <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={form.isDownloadable} onChange={e => setForm(f => ({ ...f, isDownloadable: e.target.checked }))} className="rounded" />
              Downloadable
            </label>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={onDone} className="btn-secondary px-4 py-2 text-xs">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.title} className="btn-primary px-4 py-2 text-xs">
            {saving ? 'Saving...' : 'Add Lesson'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ContentUpload() {
  const { currentUser, courses, updateLesson, deleteLesson } = useAppStore();
  const myCourse = courses.find(c => c.instructorId === currentUser?.id);
  const [expandedMods, setExpandedMods] = useState<string[]>(myCourse?.modules.map(m => m.id) || []);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  if (!myCourse) return (
    <div className="text-center py-16 card">
      <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
      <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No course yet</p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Create your course first before uploading content.</p>
    </div>
  );

  const toggleMod = (id: string) => setExpandedMods(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);

  const startEdit = (lesson: Lesson) => { setEditingLesson(lesson.id); setEditTitle(lesson.title); };
  const saveEdit = (courseId: string, lessonId: string) => {
    updateLesson(courseId, lessonId, { title: editTitle });
    setEditingLesson(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>Content Upload</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Upload videos, PDFs and slide decks for <span style={{ color: 'var(--accent2)' }}>{myCourse.title}</span></p>
      </div>

      {/* Upload guide */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: <Video className="w-5 h-5" />, label: 'Video Lessons', desc: 'MP4, MOV, AVI · Up to 2GB', color: 'var(--accent)' },
          { icon: <FileText className="w-5 h-5" />, label: 'PDF Materials', desc: 'Reference docs, notes · Up to 50MB', color: 'var(--red)' },
          { icon: <Presentation className="w-5 h-5" />, label: 'Slide Decks', desc: 'PPTX, PDF slides · Up to 50MB', color: 'var(--amber)' },
        ].map(item => (
          <div key={item.label} className="card p-4 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: item.color + '15', color: item.color }}>
              {item.icon}
            </div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {myCourse.modules.map(module => (
          <div key={module.id} className="card overflow-hidden">
            <button onClick={() => toggleMod(module.id)}
              className="w-full flex items-center justify-between p-4 text-left"
              style={{ background: 'var(--bg-card)' }}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
                  {module.order}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{module.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{module.lessons.length} lessons</p>
                </div>
              </div>
              {expandedMods.includes(module.id)
                ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
            </button>

            {expandedMods.includes(module.id) && (
              <div className="border-t p-4 space-y-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                {module.lessons.map(lesson => (
                  <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl border"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <span style={{ color: typeColors[lesson.type] || 'var(--text-muted)' }}>{typeIcons[lesson.type] || <FileText className="w-4 h-4" />}</span>
                    <div className="flex-1 min-w-0">
                      {editingLesson === lesson.id ? (
                        <div className="flex items-center gap-2">
                          <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                            className="field text-xs py-1 px-2 flex-1" autoFocus />
                          <button onClick={() => saveEdit(myCourse.id, lesson.id)} className="btn-ghost p-1 rounded-lg" style={{ color: 'var(--green)' }}><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setEditingLesson(null)} className="btn-ghost p-1 rounded-lg" style={{ color: 'var(--red)' }}><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{lesson.title}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{lesson.type}</span>
                        {lesson.duration && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {lesson.duration}</span>}
                        {lesson.fileName && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>· {lesson.fileName}</span>}
                        {lesson.isPreview && <span className="badge badge-accent" style={{ fontSize: 10, padding: '1px 6px' }}>Preview</span>}
                        {lesson.isDownloadable && <span className="badge badge-green" style={{ fontSize: 10, padding: '1px 6px' }}>Downloadable</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {editingLesson !== lesson.id && (
                        <button onClick={() => startEdit(lesson)} className="btn-ghost p-1.5 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                      )}
                      <button onClick={() => deleteLesson(myCourse.id, lesson.id)} className="btn-ghost p-1.5 rounded-lg" style={{ color: 'var(--red)' }}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}

                {/* Add lesson */}
                <AnimatePresence>
                  {addingTo === module.id && (
                    <AddLessonForm key="form" moduleId={module.id} courseId={myCourse.id} onDone={() => setAddingTo(null)} />
                  )}
                </AnimatePresence>

                {addingTo !== module.id && (
                  <button onClick={() => setAddingTo(module.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-colors"
                    style={{ borderColor: 'var(--border-mid)', color: 'var(--text-muted)' }}>
                    <Plus className="w-4 h-4" /> Add Lesson
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
