'use client';

import { motion } from 'framer-motion';
import { useAppBuilderStore } from '@/hooks/useAppBuilderStore';
import { appAdditionalServices } from '@/data/appBuilder';
import { Check, Plus } from 'lucide-react';

export default function Step9Services() {
  const { selectedServices, toggleService, isServiceSelected } = useAppBuilderStore();

  // Separate one-time and recurring services
  const oneTimeServices = appAdditionalServices.filter(s => !s.recurring);
  const recurringServices = appAdditionalServices.filter(s => s.recurring);

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          Additional Services
        </h2>
        <p className="text-[var(--text-secondary)]">
          Enhance your app with professional support services.
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      {/* One-time Services */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wide">
          One-Time Services
        </h3>
        <div className="space-y-2">
          {oneTimeServices.map((service) => {
            const isSelected = isServiceSelected(service.id);
            return (
              <motion.button
                key={service.id}
                onClick={() => toggleService(service.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`
                  w-full p-4 rounded-lg text-left transition-all duration-300 flex items-center justify-between
                  ${isSelected
                    ? 'bg-[var(--accent-blue)]/20 border border-[var(--accent-blue)]'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                    ${isSelected
                      ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]'
                      : 'border-[var(--border-subtle)]'
                    }
                  `}>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                  </div>
                  <div>
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                      {service.label}
                    </span>
                    <p className="text-sm text-[var(--text-muted)]">{service.description || service.tooltip}</p>
                  </div>
                </div>
                <span className={`font-semibold ${isSelected ? 'text-[var(--accent-blue)]' : 'text-white'}`}>
                  ${service.price.toLocaleString()}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Recurring Services */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wide">
          Monthly Services
        </h3>
        <div className="space-y-2">
          {recurringServices.map((service) => {
            const isSelected = isServiceSelected(service.id);
            return (
              <motion.button
                key={service.id}
                onClick={() => toggleService(service.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`
                  w-full p-4 rounded-lg text-left transition-all duration-300 flex items-center justify-between
                  ${isSelected
                    ? 'bg-[var(--accent-teal)]/20 border border-[var(--accent-teal)]'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-teal)]/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                    ${isSelected
                      ? 'border-[var(--accent-teal)] bg-[var(--accent-teal)]'
                      : 'border-[var(--border-subtle)]'
                    }
                  `}>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-[var(--text-muted)]" />
                    )}
                  </div>
                  <div>
                    <span className={`font-medium ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                      {service.label}
                    </span>
                    <p className="text-sm text-[var(--text-muted)]">{service.description || service.tooltip}</p>
                  </div>
                </div>
                <span className={`font-semibold ${isSelected ? 'text-[var(--accent-teal)]' : 'text-white'}`}>
                  ${service.price.toLocaleString()}/mo
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
