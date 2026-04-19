import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Shield, Lock, CheckCircle2, AlertCircle, Loader2,
  CreditCard, Smartphone, Building2, ChevronRight
} from 'lucide-react';
import { openPaystackPopup, generateReference, usdToKobo, usdToNgn, formatNgn } from '../lib/paystack';
import { useAppStore } from '../lib/store';
import type { Course } from '../lib/types';

interface Props {
  course: Course;
  onClose: () => void;
  onSuccess: () => void;
}

type PayStep = 'summary' | 'processing' | 'success' | 'failed';

export default function PaystackModal({ course, onClose, onSuccess }: Props) {
  const { currentUser, enrollAfterPayment, recordPayment } = useAppStore();
  const [step, setStep] = useState<PayStep>('summary');
  const [payRef, setPayRef] = useState('');

  const amountKobo = usdToKobo(course.price);
  const amountNgn = usdToNgn(course.price);

  const handlePay = async () => {
    if (!currentUser) return;
    setStep('processing');

    const ref = generateReference('NFA');
    setPayRef(ref);

    try {
      await openPaystackPopup({
        email: currentUser.email,
        amount: amountKobo,
        currency: 'NGN',
        ref,
        metadata: {
          'Student Name': currentUser.name,
          'Course': course.title,
          'Course ID': course.id,
          'Platform': 'NextForge Academy',
        },
        onSuccess: (reference) => {
          // Record the payment
          recordPayment({
            id: `pay_${Date.now()}`,
            studentId: currentUser.id,
            studentName: currentUser.name,
            studentEmail: currentUser.email,
            courseId: course.id,
            courseName: course.title,
            amountKobo,
            amountNgn,
            amountUsd: course.price,
            reference,
            status: 'success',
            paidAt: new Date().toISOString(),
          });
          // Grant access
          enrollAfterPayment(course.id, reference, amountKobo);
          setPayRef(reference);
          setStep('success');
        },
        onClose: () => {
          // User closed popup without paying
          setStep('failed');
        },
      });
    } catch (err) {
      setStep('failed');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          onClick={step === 'processing' ? undefined : onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
            <div className="flex items-center gap-3">
              {/* Paystack-style logo mark */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00c3f7, #0ba4e0)' }}>
                <span className="text-white font-black text-sm">₦</span>
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Secure Payment</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Powered by Paystack</p>
              </div>
            </div>
            {step !== 'processing' && (
              <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-6">

            {/* ── STEP: Summary ── */}
            {step === 'summary' && (
              <div>
                {/* Course summary */}
                <div className="flex items-start gap-4 p-4 rounded-xl mb-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <img src={course.thumbnail} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-sm leading-snug mb-1" style={{ color: 'var(--text-primary)' }}>{course.title}</p>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>by {course.instructorName}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)' }}>
                      {course.level} · {course.category}
                    </span>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="rounded-xl overflow-hidden mb-6" style={{ border: '1px solid var(--border-color)' }}>
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'var(--bg-secondary)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Course fee</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>${course.price} USD</span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Converted to NGN</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>≈ {formatNgn(amountKobo)}</span>
                  </div>
                  <div className="px-4 py-4 flex items-center justify-between" style={{ background: 'rgba(99,102,241,0.06)', borderTop: '1px solid var(--border-color)' }}>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Total Due</span>
                    <div className="text-right">
                      <p className="text-xl font-black" style={{ color: 'var(--accent-primary)' }}>{formatNgn(amountKobo)}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>${course.price} USD</p>
                    </div>
                  </div>
                </div>

                {/* What you get */}
                <div className="space-y-2 mb-6">
                  {[
                    'Instant lifetime access to all lessons',
                    'Downloadable resources & materials',
                    'Certificate of completion',
                    '30-day money-back guarantee',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-500" />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Pay methods hint */}
                <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <Smartphone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <Building2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Card · USSD · Bank Transfer · Mobile Money</p>
                </div>

                {/* Pay button */}
                <button
                  onClick={handlePay}
                  className="w-full py-4 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: 'linear-gradient(135deg, #00c3f7, #0ba4e0)', boxShadow: '0 8px 25px rgba(11,164,224,0.35)' }}
                >
                  <Lock className="w-4 h-4" />
                  Pay {formatNgn(amountKobo)} Securely
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Trust badge */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Shield className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                    256-bit SSL encryption · PCI DSS compliant · Secured by Paystack
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP: Processing ── */}
            {step === 'processing' && (
              <div className="py-10 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(11,164,224,0.12)' }}>
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#0ba4e0' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Opening Payment Window</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Complete your payment in the Paystack popup.<br />
                  Do not close this window.
                </p>
                <div className="mt-6 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reference: <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>{payRef}</span></p>
                </div>
              </div>
            )}

            {/* ── STEP: Success ── */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(34,197,94,0.15)' }}
                >
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </motion.div>
                <h3 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Payment Successful! 🎉</h3>
                <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                  You're now enrolled in
                </p>
                <p className="font-bold mb-4" style={{ color: 'var(--accent-primary)' }}>{course.title}</p>

                <div className="p-4 rounded-xl mb-6 text-left space-y-2" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Amount Paid</span>
                    <span className="font-bold text-green-500">{formatNgn(amountKobo)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Reference</span>
                    <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{payRef}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Date</span>
                    <span style={{ color: 'var(--text-primary)' }}>{new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                <button
                  onClick={onSuccess}
                  className="btn-primary w-full py-3.5 font-bold text-base"
                >
                  Start Learning Now →
                </button>
              </motion.div>
            )}

            {/* ── STEP: Failed / Abandoned ── */}
            {step === 'failed' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(239,68,68,0.12)' }}>
                  <AlertCircle className="w-10 h-10" style={{ color: '#ef4444' }} />
                </div>
                <h3 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Payment Cancelled</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                  You closed the payment window before completing.<br />
                  Your card has <strong>not</strong> been charged.
                </p>
                <div className="flex gap-3">
                  <button onClick={onClose} className="flex-1 btn-secondary py-3 font-semibold">
                    Cancel
                  </button>
                  <button onClick={() => setStep('summary')} className="flex-1 btn-primary py-3 font-semibold">
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
