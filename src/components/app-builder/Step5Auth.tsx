'use client';

import { motion } from 'framer-motion';
import { useAppBuilderStore } from '@/hooks/useAppBuilderStore';
import { authOptions } from '@/data/appBuilder';
import { Check, Shield } from 'lucide-react';

export default function Step5Auth() {
  const { auth, setAuth } = useAppBuilderStore();

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          Authentication & User Management
        </h2>
        <p className="text-[var(--text-secondary)]">
          How will users log in to your app? Choose the authentication method that fits your needs.
        </p>
      </div>

      <div className="space-y-3">
        {authOptions.map((option) => {
          const isSelected = auth === option.id;
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
                  onClick={() => setAuth(option.id)}
                  className="w-full flex items-center gap-4"
                >
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${isSelected ? 'bg-white/20' : 'bg-[var(--accent-blue)]/20'}
                  `}>
                    <Shield className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[var(--accent-blue)]'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold">{option.label}</span>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                      {option.description || option.tooltip}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">
                      {option.price === null ? 'Custom' : option.price === 0 ? 'Free' : `$${option.price.toLocaleString()}`}
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

      {auth && auth !== 'none' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[var(--accent-blue)] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white font-medium mb-1">Security Note</p>
              <p className="text-sm text-[var(--text-secondary)]">
                All authentication implementations include secure password hashing, session management, and protection against common attacks.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
