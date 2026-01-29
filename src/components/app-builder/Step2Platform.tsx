'use client';

import { motion } from 'framer-motion';
import { useAppBuilderStore } from '@/hooks/useAppBuilderStore';
import { platformOptions } from '@/data/appBuilder';
import { Check } from 'lucide-react';

export default function Step2Platform() {
  const { platform, setPlatform } = useAppBuilderStore();

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          Which platforms do you need?
        </h2>
        <p className="text-[var(--text-secondary)]">
          Choose the platforms where your app will be available. Cross-platform options cost more but reach wider audiences.
        </p>
      </div>

      <div className="space-y-3">
        {platformOptions.map((option) => {
          const isSelected = platform === option.id;
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className={`
                  w-full p-4 rounded-lg text-left transition-all duration-300 flex items-center justify-between
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-white border border-[var(--border-subtle)]'
                  }
                `}
              >
                <button
                  onClick={() => setPlatform(option.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? 'border-white bg-white/20' : 'border-[var(--border-subtle)]'}
                  `}>
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{option.label}</span>
                      {option.recommended && (
                        <span className="text-xs px-2 py-0.5 bg-[var(--accent-orange)] text-black rounded-full font-semibold">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                      {option.description || option.tooltip}
                    </p>
                  </div>
                </button>
                <span className="font-bold text-lg ml-4">
                  {option.price === null ? 'Custom' : `$${option.price.toLocaleString()}`}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {platform && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg"
        >
          <p className="text-sm text-[var(--text-secondary)]">
            <span className="text-[var(--accent-blue)] font-medium">Tip: </span>
            {platformOptions.find(o => o.id === platform)?.id === 'cross-platform'
              ? 'Cross-platform is a cost-effective way to reach both iOS and Android users with a single codebase.'
              : platformOptions.find(o => o.id === platform)?.id === 'native-both'
              ? 'Native apps for both platforms offer the best performance and user experience, but require separate development.'
              : 'Single platform apps are faster to develop and perfect for testing your app concept.'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
