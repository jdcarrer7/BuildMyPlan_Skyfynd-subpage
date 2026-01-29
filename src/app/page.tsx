'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { categories, getServicesByCategory } from '@/data/services';
import { usePlanStore } from '@/hooks/usePlanStore';
import { useUnifiedQuoteStore, serviceMetadata } from '@/hooks/useUnifiedQuoteStore';
import CategoryTabs from '@/components/CategoryTabs';
import ServiceCard from '@/components/ServiceCard';
import PlanSummary from '@/components/PlanSummary';
import QuoteForm from '@/components/QuoteForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Sparkles, ArrowRight, Percent, FileText } from 'lucide-react';
import Link from 'next/link';

export default function BuildMyPlan() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { itemCount, discountPercentage, total, items } = usePlanStore();
  const { getAllConfiguredServices } = useUnifiedQuoteStore();

  // Prevent hydration mismatch from Zustand persisted state
  useEffect(() => {
    setMounted(true);
  }, []);

  const configuredServices = mounted ? getAllConfiguredServices() : [];
  const hasConfiguredServices = configuredServices.length > 0;
  const firstConfiguredService = configuredServices[0];

  const filteredServices = useMemo(() => {
    return getServicesByCategory(activeCategory);
  }, [activeCategory]);

  const currentCategory = categories.find(c => c.id === activeCategory);

  // Refs for service cards to enable auto-scroll
  const serviceCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prevItemCount = useRef(itemCount);

  // Auto-scroll to the service card when a new item is added
  useEffect(() => {
    if (itemCount > prevItemCount.current && items.length > 0) {
      // A new item was added - find the most recently added service
      const lastAddedItem = items[items.length - 1];
      const cardRef = serviceCardRefs.current[lastAddedItem.serviceId];

      if (cardRef) {
        // Scroll the card into view, aligned with the top of the viewport
        cardRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    prevItemCount.current = itemCount;
  }, [itemCount, items]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg-primary)] bg-particles" style={{ paddingTop: '100px' }}>
      {/* Header - More generous spacing */}
      <header className="relative pt-20 pb-16 md:pt-12 md:pb-24 px-6 text-center overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[600px] bg-gradient-to-b from-[var(--accent-blue)]/8 via-[var(--accent-teal)]/5 to-transparent rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Top Badge - Refined */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-8 bg-[var(--bg-card)]/60 backdrop-blur-sm border border-[var(--border-subtle)] rounded-full"
          >
            <Sparkles className="w-4 h-4 text-[var(--accent-purple)]" />
            <span className="text-sm text-[var(--text-secondary)] tracking-wide">13 Services • 3 Tiers • Unlimited Possibilities</span>
          </motion.div>

          {/* Title - SkyFynd style: 64px hero, tight line-height */}
          <h1 className="font-serif mb-6" style={{ fontSize: 'clamp(36px, 8vw, 64px)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#FAFAFA' }}>
            Build Your{' '}
            <span className="gradient-text">Perfect Plan</span>
          </h1>

          <p className="max-w-2xl mx-auto mb-12" style={{ fontSize: 'clamp(17px, 3vw, 21px)', color: '#A1A1AA', lineHeight: 1.5 }}>
            Select services, choose your tier, and build a custom package tailored to your needs.
            Bundle more to save more.
          </p>

          {/* Discount Badges - Sophisticated, subtle */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {/* 10% OFF - Purple */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-[var(--accent-purple)]/10 to-[var(--accent-purple-light)]/10 backdrop-blur-sm rounded-2xl border border-[var(--accent-purple)]/20"
            >
              <div className="w-7 h-7 rounded-full bg-[var(--accent-purple)]/15 flex items-center justify-center">
                <Percent className="w-3.5 h-3.5 text-[var(--accent-purple)]" />
              </div>
              <div className="text-left">
                <span className="text-xs text-[var(--text-muted)] block">3+ services</span>
                <span className="text-sm font-semibold text-[var(--accent-purple)]">10% OFF</span>
              </div>
            </motion.div>

            {/* 15% OFF - Blue */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-2.5 px-5 py-3 bg-[var(--bg-card)]/40 backdrop-blur-sm rounded-2xl border border-[var(--accent-blue)]/20"
            >
              <div className="w-7 h-7 rounded-full bg-[var(--accent-blue)]/10 flex items-center justify-center">
                <Percent className="w-3.5 h-3.5 text-[var(--accent-blue)]" />
              </div>
              <div className="text-left">
                <span className="text-xs text-[var(--text-muted)] block">5+ services</span>
                <span className="text-sm font-semibold text-[var(--accent-blue)]">15% OFF</span>
              </div>
            </motion.div>

            {/* 20% OFF - Green/Teal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center gap-2.5 px-5 py-3 bg-[var(--bg-card)]/40 backdrop-blur-sm rounded-2xl border border-[var(--accent-teal)]/20"
            >
              <div className="w-7 h-7 rounded-full bg-[var(--accent-teal)]/15 flex items-center justify-center">
                <Percent className="w-3.5 h-3.5 text-[var(--accent-teal)]" />
              </div>
              <div className="text-left">
                <span className="text-xs text-[var(--text-muted)] block">7+ services</span>
                <span className="text-sm font-semibold text-[var(--accent-teal)]">20% OFF</span>
              </div>
            </motion.div>
          </div>

          {/* Quote Summary Button - Only visible when services are configured */}
          {hasConfiguredServices && firstConfiguredService && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-10"
            >
              <Link
                href={`${serviceMetadata[firstConfiguredService.type].builderPath}?summary=true`}
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[rgba(139,92,246,0.6)] via-[rgba(59,130,246,0.5)] to-[rgba(16,185,129,0.5)] text-white font-semibold rounded-xl border border-[rgba(59,130,246,0.3)] hover:shadow-[0_8px_32px_rgba(59,130,246,0.25)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <FileText className="w-5 h-5" />
                View Quote Summary
                <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-sm">
                  {configuredServices.length} {configuredServices.length === 1 ? 'service' : 'services'}
                </span>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </header>

      {/* Main Content - More breathing room */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Category Description */}
        {currentCategory && (
          <motion.p
            key={currentCategory.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto"
          >
            {currentCategory.description}
          </motion.p>
        )}

        {/* Grid Layout - Services with sidebar using flexbox for sticky support */}
        <div className="lg:flex lg:gap-8 lg:items-start">
          {/* Services Grid */}
          <div className="flex-1 min-w-0">
            <motion.div
              layout
              className="grid md:grid-cols-2 gap-6 lg:gap-8"
            >
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  ref={(el) => { serviceCardRefs.current[service.id] = el; }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="scroll-mt-4"
                >
                  <ServiceCard
                    service={service}
                    isExpanded={expandedServiceId === service.id}
                    onToggleExpand={() => setExpandedServiceId(
                      expandedServiceId === service.id ? null : service.id
                    )}
                    onScrollToCard={() => {
                      const cardRef = serviceCardRefs.current[service.id];
                      if (cardRef) {
                        cardRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Plan Summary - Shows below services on mobile */}
            <div className="lg:hidden mt-10">
              <PlanSummary onRequestQuote={() => setIsQuoteFormOpen(true)} />
            </div>
          </div>

          {/* Plan Summary Sidebar - CSS sticky positioning */}
          <div
            className="hidden lg:block w-[380px] flex-shrink-0 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto z-30"
          >
            <PlanSummary onRequestQuote={() => setIsQuoteFormOpen(true)} />
          </div>
        </div>
      </section>

      {/* Floating CTA (Mobile) - Refined glass effect */}
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 p-5 glass border-t border-[var(--border-subtle)] lg:hidden z-40"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[var(--text-secondary)] text-sm">{itemCount} services selected</span>
              {discountPercentage > 0 && (
                <span className="ml-2 px-2.5 py-1 bg-[var(--accent-blue)]/15 text-[var(--accent-blue)] text-xs font-medium rounded-full">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>
            <div className="text-2xl font-bold gradient-text">
              ${total.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => setIsQuoteFormOpen(true)}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4"
          >
            Request Quote
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Quote Form Modal */}
      <QuoteForm isOpen={isQuoteFormOpen} onClose={() => setIsQuoteFormOpen(false)} />
    </main>
      <Footer />
    </>
  );
}
