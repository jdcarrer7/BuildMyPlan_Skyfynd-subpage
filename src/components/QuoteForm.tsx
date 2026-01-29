'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlanStore } from '@/hooks/usePlanStore';
import { getServiceById } from '@/data/services';
import { X, Send, CheckCircle, User, Mail, Building, Phone, MessageSquare } from 'lucide-react';

const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface QuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteForm({ isOpen, onClose }: QuoteFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items, total, discountPercentage, clearPlan } = usePlanStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);

    // Build the quote summary
    const quoteSummary = {
      customer: data,
      plan: items.map(item => {
        const service = getServiceById(item.serviceId);
        return {
          service: service?.name,
          tier: item.tierId,
          addOns: item.addOns,
          subtotal: item.subtotal,
        };
      }),
      discountPercentage,
      total,
      submittedAt: new Date().toISOString(),
    };

    // Mock submission - log to console
    console.log('Quote Request Submitted:', quoteSummary);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    if (isSubmitted) {
      clearPlan();
      reset();
      setIsSubmitted(false);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50 overflow-auto"
          >
            <div className="card p-6 md:p-8 bg-[var(--bg-elevated)] max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {isSubmitted ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white font-serif mb-3">
                    Quote Request Sent!
                  </h2>
                  <p className="text-[var(--text-secondary)] mb-6">
                    Thank you for your interest! We&apos;ll review your plan and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={handleClose}
                    className="btn-primary"
                  >
                    Start a New Plan
                  </button>
                </motion.div>
              ) : (
                /* Form */
                <>
                  <h2 className="text-2xl font-bold text-white font-serif mb-2">
                    Request Your Quote
                  </h2>
                  <p className="text-[var(--text-secondary)] mb-6">
                    Fill in your details and we&apos;ll send you a detailed proposal.
                  </p>

                  {/* Plan Summary */}
                  <div className="mb-6 p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-[var(--text-muted)]">Services Selected</span>
                      <span className="text-white font-medium">{items.length}</span>
                    </div>
                    {discountPercentage > 0 && (
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-[var(--accent-blue)]">Bundle Discount</span>
                        <span className="text-[var(--accent-blue)]">{discountPercentage}% OFF</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-white font-medium">Total</span>
                      <span className="text-xl font-bold gradient-text">${total.toLocaleString()}</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 bg-[var(--bg-secondary)] border rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-all ${
                          errors.name ? 'border-red-500' : 'border-[var(--border-subtle)]'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="john@company.com"
                        className={`w-full px-4 py-3 bg-[var(--bg-secondary)] border rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-all ${
                          errors.email ? 'border-red-500' : 'border-[var(--border-subtle)]'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Company & Phone Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          <Building className="w-4 h-4 inline mr-2" />
                          Company
                        </label>
                        <input
                          {...register('company')}
                          type="text"
                          placeholder="Acme Inc."
                          className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone
                        </label>
                        <input
                          {...register('phone')}
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-all"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Additional Notes
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={3}
                        placeholder="Tell us more about your project or any specific requirements..."
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] transition-all resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Quote Request
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
