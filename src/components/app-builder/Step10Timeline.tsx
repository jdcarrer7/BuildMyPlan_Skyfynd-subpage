'use client';

import { motion } from 'framer-motion';
import { useAppBuilderStore } from '@/hooks/useAppBuilderStore';
import { appTimelineOptions } from '@/data/appBuilder';
import { Check, Clock, AlertTriangle, Zap, Calendar } from 'lucide-react';

const timelineIcons: Record<string, React.ReactNode> = {
  'rush': <Zap className="w-5 h-5" />,
  'fast': <AlertTriangle className="w-5 h-5" />,
  'standard': <Clock className="w-5 h-5" />,
  'flexible': <Calendar className="w-5 h-5" />,
};

export default function Step10Timeline() {
  const { timeline, setTimeline, oneTimeSubtotal, timelineMultiplier } = useAppBuilderStore();

  const rushFee = timeline && timeline !== 'flexible'
    ? Math.round(oneTimeSubtotal * (timelineMultiplier - 1))
    : 0;

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white font-serif mb-2">
          Project Timeline
        </h2>
        <p className="text-[var(--text-secondary)]">
          How soon do you need your app? Faster timelines may include rush fees.
        </p>
      </div>

      <div className="space-y-3">
        {appTimelineOptions.map((option) => {
          const isSelected = timeline === option.id;
          const icon = timelineIcons[option.id] || <Clock className="w-5 h-5" />;
          const fee = option.multiplier > 1
            ? Math.round(oneTimeSubtotal * (option.multiplier - 1))
            : 0;

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
                  onClick={() => setTimeline(option.id)}
                  className="w-full flex items-center gap-4"
                >
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    ${isSelected ? 'bg-white/20' : 'bg-[var(--accent-blue)]/20'}
                    ${option.id === 'rush' ? 'text-[var(--accent-orange)]' : ''}
                  `}>
                    {icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{option.label}</span>
                      {option.recommended && (
                        <span className="text-xs px-2 py-0.5 bg-[var(--accent-orange)] text-black rounded-full font-semibold">
                          Best Value
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${isSelected ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                      {option.tooltip}
                    </p>
                  </div>
                  <div className="text-right">
                    {option.multiplier > 1 ? (
                      <div>
                        <span className="text-[var(--accent-orange)] font-semibold">
                          +{Math.round((option.multiplier - 1) * 100)}%
                        </span>
                        <p className={`text-xs ${isSelected ? 'text-white/60' : 'text-[var(--text-muted)]'}`}>
                          +${fee.toLocaleString()} rush fee
                        </p>
                      </div>
                    ) : (
                      <span className="text-green-400 font-semibold">No Fee</span>
                    )}
                    {isSelected && (
                      <div className="mt-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center ml-auto">
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

      {timeline && rushFee > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[var(--accent-orange)]/10 border border-[var(--accent-orange)]/30 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[var(--accent-orange)] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white font-medium">Rush Fee Applied</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                A rush fee of <span className="text-[var(--accent-orange)] font-semibold">${rushFee.toLocaleString()}</span> will be added to expedite your project.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
