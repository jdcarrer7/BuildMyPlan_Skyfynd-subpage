'use client';

import { motion } from 'framer-motion';
import { useAppBuilderStore } from '@/hooks/useAppBuilderStore';
import { designOptions } from '@/data/appBuilder';
import { Check, Palette } from 'lucide-react';

export default function Step4Design() {
  const { design, setDesign } = useAppBuilderStore();

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          Design Complexity
        </h2>
        <p className="text-[var(--text-secondary)]">
          Choose the level of design sophistication for your app. Higher complexity means more custom animations, interactions, and visual polish.
        </p>
      </div>

      <div className="space-y-4">
        {designOptions.map((option) => {
          const isSelected = design === option.id;
          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className={`
                  w-full p-4 rounded-lg text-left transition-all duration-300
                  ${isSelected
                    ? 'bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-white border border-[var(--border-subtle)]'
                  }
                `}
              >
                <button
                  onClick={() => setDesign(option.id)}
                  className="w-full flex items-center gap-4"
                >
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${isSelected ? 'bg-white/20' : 'bg-[var(--accent-blue)]/20'}
                  `}>
                    <Palette className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[var(--accent-blue)]'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{option.label}</span>
                      {option.popular && (
                        <span className="text-xs px-2 py-0.5 bg-[var(--accent-orange)] text-black rounded-full font-semibold">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                      {option.description || option.tooltip}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xl">
                      ${option.price.toLocaleString()}
                    </span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
