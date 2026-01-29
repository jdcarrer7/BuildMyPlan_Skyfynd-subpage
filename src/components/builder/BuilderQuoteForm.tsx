'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBuilderStore } from '@/hooks/useBuilderStore';
import {
  projectTypes,
  siteSizeOptions,
  designOptions,
  cmsOptions,
  features,
  additionalServices,
  timelineOptions,
} from '@/data/websiteBuilder';
import { ArrowLeft, Send, CheckCircle, User, Mail, Building2, Phone, MessageSquare } from 'lucide-react';

interface BuilderQuoteFormProps {
  onBack: () => void;
}

export default function BuilderQuoteForm({ onBack }: BuilderQuoteFormProps) {
  const {
    customerInfo,
    setCustomerInfo,
    projectType,
    siteSize,
    siteSizePrice,
    designComplexity,
    designPrice,
    cms,
    cmsPrice,
    selectedFeatures,
    selectedServices,
    timeline,
    timelineMultiplier,
    subtotal,
    rushFee,
    total,
    monthlyRecurring,
    hasCustomQuote,
    resetBuilder,
  } = useBuilderStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Prepare summary data
    const summaryData = {
      customerInfo,
      projectType: projectTypes.find(p => p.id === projectType)?.label,
      siteSize: siteSizeOptions.find(s => s.id === siteSize)?.label,
      siteSizePrice,
      designComplexity: designOptions.find(d => d.id === designComplexity)?.label,
      designPrice,
      cms: cmsOptions.find(c => c.id === cms)?.label,
      cmsPrice,
      features: selectedFeatures.map(sf => {
        const feature = features.find(f => f.id === sf.id);
        const option = feature?.options.find(o => o.id === sf.optionId);
        return {
          name: feature?.name,
          option: option?.label,
          price: sf.price,
        };
      }),
      services: selectedServices.map(ss => {
        const service = additionalServices.find(s => s.id === ss.id);
        return {
          name: service?.label,
          price: ss.price,
          recurring: ss.recurring,
        };
      }),
      timeline: timelineOptions.find(t => t.id === timeline)?.label,
      timelineMultiplier,
      subtotal,
      rushFee,
      total,
      monthlyRecurring,
      hasCustomQuote,
    };

    // Simulate API call
    console.log('Website Builder Quote Submission:', summaryData);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-white font-serif mb-3">
          Quote Request Submitted!
        </h2>

        <p className="text-[var(--text-secondary)] mb-6">
          Thank you, {customerInfo.name}! We&apos;ve received your custom website configuration.
          Our team will review your requirements and send a detailed quote to{' '}
          <span className="text-white">{customerInfo.email}</span> within 24-48 hours.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              resetBuilder();
              window.location.href = '/';
            }}
            className="px-6 py-3 rounded-lg bg-[var(--bg-secondary)] text-white hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            Back to Services
          </button>
          <button
            onClick={() => {
              resetBuilder();
              setIsSubmitted(false);
            }}
            className="btn-primary px-6 py-3"
          >
            Configure Another Site
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="card p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Summary
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          Request Your Quote
        </h2>
        <p className="text-[var(--text-secondary)]">
          Fill in your details and we&apos;ll send you a detailed quote for your custom website.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
            <User className="w-4 h-4 text-[var(--accent-blue)]" />
            Full Name *
          </label>
          <input
            type="text"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({ name: e.target.value })}
            className={`
              w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border transition-colors
              text-white placeholder:text-[var(--text-muted)]
              ${errors.name
                ? 'border-red-500 focus:border-red-500'
                : 'border-[var(--border-subtle)] focus:border-[var(--accent-blue)]'
              }
              focus:outline-none
            `}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
            <Mail className="w-4 h-4 text-[var(--accent-blue)]" />
            Email Address *
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({ email: e.target.value })}
            className={`
              w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border transition-colors
              text-white placeholder:text-[var(--text-muted)]
              ${errors.email
                ? 'border-red-500 focus:border-red-500'
                : 'border-[var(--border-subtle)] focus:border-[var(--accent-blue)]'
              }
              focus:outline-none
            `}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
            <Building2 className="w-4 h-4 text-[var(--accent-blue)]" />
            Company (Optional)
          </label>
          <input
            type="text"
            value={customerInfo.company}
            onChange={(e) => setCustomerInfo({ company: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[var(--accent-blue)] focus:outline-none transition-colors text-white placeholder:text-[var(--text-muted)]"
            placeholder="Your Company Inc."
          />
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
            <Phone className="w-4 h-4 text-[var(--accent-blue)]" />
            Phone (Optional)
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({ phone: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[var(--accent-blue)] focus:outline-none transition-colors text-white placeholder:text-[var(--text-muted)]"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
            <MessageSquare className="w-4 h-4 text-[var(--accent-blue)]" />
            Additional Notes (Optional)
          </label>
          <textarea
            value={customerInfo.notes}
            onChange={(e) => setCustomerInfo({ notes: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[var(--accent-blue)] focus:outline-none transition-colors text-white placeholder:text-[var(--text-muted)] resize-none"
            placeholder="Any specific requirements, preferences, or questions..."
          />
        </div>

        {/* Estimate Display */}
        <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)]">Estimated Total</span>
            <span className="text-xl font-bold gradient-text">
              {hasCustomQuote ? 'Custom Quote' : `$${total.toLocaleString()}`}
            </span>
          </div>
          {monthlyRecurring > 0 && (
            <div className="flex justify-between items-center mt-1 text-sm">
              <span className="text-[var(--text-muted)]">+ Monthly</span>
              <span className="text-[var(--text-secondary)]">${monthlyRecurring}/mo</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Quote Request
            </>
          )}
        </motion.button>

        <p className="text-xs text-[var(--text-muted)] text-center">
          By submitting, you agree to be contacted regarding your quote request.
        </p>
      </form>
    </div>
  );
}
