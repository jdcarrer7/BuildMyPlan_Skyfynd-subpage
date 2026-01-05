'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { categories, getServicesByCategory } from '@/data/services';
import { usePlanStore } from '@/hooks/usePlanStore';
import CategoryTabs from '@/components/CategoryTabs';
import ServiceCard from '@/components/ServiceCard';
import PlanSummary from '@/components/PlanSummary';
import QuoteForm from '@/components/QuoteForm';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';

export default function BuildMyPlan() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  const { itemCount, discountPercentage, total } = usePlanStore();

  const filteredServices = useMemo(() => {
    return getServicesByCategory(activeCategory);
  }, [activeCategory]);

  const currentCategory = categories.find(c => c.id === activeCategory);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] bg-particles">
      {/* Header */}
      <header className="relative py-16 md:py-24 px-4 text-center overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-gradient-to-r from-[var(--accent-purple)]/10 via-[var(--accent-fuchsia)]/10 to-[var(--accent-pink)]/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-full"
          >
            <Sparkles className="w-4 h-4 text-[var(--accent-orange)]" />
            <span className="text-sm text-[var(--text-secondary)]">13 Services • 3 Tiers • Unlimited Possibilities</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif mb-4">
            Build Your{' '}
            <span className="gradient-text">Perfect Plan</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
            Select services, choose your tier, and build a custom package tailored to your needs.
            Bundle more to save more.
          </p>

          {/* Discount Teaser */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
              <Tag className="w-4 h-4 text-[var(--accent-purple)]" />
              <span className="text-sm text-[var(--text-secondary)]">3+ services:</span>
              <span className="text-sm font-semibold text-[var(--accent-purple)]">10% OFF</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)]">
              <Tag className="w-4 h-4 text-[var(--accent-pink)]" />
              <span className="text-sm text-[var(--text-secondary)]">5+ services:</span>
              <span className="text-sm font-semibold text-[var(--accent-pink)]">15% OFF</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] rounded-lg border border-[var(--accent-orange)]">
              <Tag className="w-4 h-4 text-[var(--accent-orange)]" />
              <span className="text-sm text-[var(--text-secondary)]">7+ services:</span>
              <span className="text-sm font-semibold text-[var(--accent-orange)]">20% OFF</span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[var(--text-secondary)] mb-8"
          >
            {currentCategory.description}
          </motion.p>
        )}

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services Grid */}
          <div className="lg:col-span-2">
            <motion.div
              layout
              className="grid md:grid-cols-2 gap-6"
            >
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </motion.div>
          </div>

          {/* Plan Summary Sidebar */}
          <div className="lg:col-span-1">
            <PlanSummary onRequestQuote={() => setIsQuoteFormOpen(true)} />
          </div>
        </div>
      </section>

      {/* Floating CTA (Mobile) */}
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg-elevated)]/95 backdrop-blur-lg border-t border-[var(--border-subtle)] lg:hidden z-40"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[var(--text-secondary)] text-sm">{itemCount} services selected</span>
              {discountPercentage > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] text-xs rounded-full">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>
            <div className="text-xl font-bold gradient-text">
              ${total.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => setIsQuoteFormOpen(true)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            Request Quote
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Quote Form Modal */}
      <QuoteForm isOpen={isQuoteFormOpen} onClose={() => setIsQuoteFormOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[var(--text-muted)] text-sm">
            &copy; {new Date().getFullYear()} SkyFynd. All rights reserved.
          </p>
          <p className="text-[var(--text-muted)] text-xs mt-2">
            Prices are starting points. Final pricing may vary based on project scope.
          </p>
        </div>
      </footer>
    </main>
  );
}
