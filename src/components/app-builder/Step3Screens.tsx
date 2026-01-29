'use client';

import { motion } from 'framer-motion';
import { useAppBuilderStore } from '@/hooks/useAppBuilderStore';
import { screenOptions } from '@/data/appBuilder';
import { Check, Layers } from 'lucide-react';

export default function Step3Screens() {
  const { screens, setScreens } = useAppBuilderStore();

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          How many screens does your app need?
        </h2>
        <p className="text-[var(--text-secondary)]">
          Estimate the number of unique screens in your app. This includes all pages, modals, and views.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {screenOptions.map((option) => {
          const isSelected = screens === option.id;
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`
                  w-full p-5 rounded-lg text-left transition-all duration-300 h-full
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-white border border-[var(--border-subtle)]'
                  }
                `}
              >
                <button
                  onClick={() => setScreens(option.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Layers className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[var(--accent-blue)]'}`} />
                      <span className="font-semibold text-lg">{option.label}</span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className={`text-sm mb-3 ${isSelected ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                    {option.description || option.tooltip}
                  </p>
                  <div className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-[var(--accent-blue)]'}`}>
                    {option.price === null ? 'Custom Quote' : `$${option.price.toLocaleString()}`}
                  </div>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {screens && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg"
        >
          <div className="flex items-start gap-3">
            <Layers className="w-5 h-5 text-[var(--accent-blue)] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white font-medium mb-1">What counts as a screen?</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Examples: Login, Home, Profile, Settings, Item List, Item Detail, Search, Notifications, etc.
                Modal dialogs and popups typically don&apos;t count as separate screens.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
