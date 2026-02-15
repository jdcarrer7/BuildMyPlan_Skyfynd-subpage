'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  targetLabel: string;
  currentDiscount?: { type: 'percentage' | 'fixed'; value: number; appliesTo: 'one-time' | 'monthly' | 'both' };
  saving: boolean;
  onSave: (type: 'percentage' | 'fixed', value: number, appliesTo: 'one-time' | 'monthly' | 'both') => void;
  onRemove: () => void;
  onClose: () => void;
}

export default function DiscountModal({ targetLabel, currentDiscount, saving, onSave, onRemove, onClose }: Props) {
  const [type, setType] = useState<'percentage' | 'fixed'>(currentDiscount?.type || 'percentage');
  const [value, setValue] = useState(currentDiscount?.value?.toString() || '');
  const [appliesTo, setAppliesTo] = useState<'one-time' | 'monthly' | 'both'>(currentDiscount?.appliesTo || 'both');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return;
    onSave(type, num, appliesTo);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#FAFAFA] font-serif">
            Discount: {targetLabel}
          </h3>
          <button onClick={onClose} className="text-[#71717A] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Discount Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('percentage')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  type === 'percentage'
                    ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-[#60A5FA]'
                    : 'border-white/[0.06] text-[#71717A] hover:border-white/[0.15]'
                }`}
              >
                Percentage (%)
              </button>
              <button
                type="button"
                onClick={() => setType('fixed')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  type === 'fixed'
                    ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-[#60A5FA]'
                    : 'border-white/[0.06] text-[#71717A] hover:border-white/[0.15]'
                }`}
              >
                Fixed ($)
              </button>
            </div>
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Value</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]">
                {type === 'percentage' ? '%' : '$'}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={value}
                onChange={e => setValue(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-[#0A0A0B] border border-white/[0.06] rounded-lg text-white focus:outline-none focus:border-[#3B82F6]"
                placeholder="Enter value"
                required
              />
            </div>
          </div>

          {/* Applies to */}
          <div>
            <label className="block text-sm font-medium text-[#A1A1AA] mb-2">Applies To</label>
            <div className="flex gap-2">
              {(['one-time', 'monthly', 'both'] as const).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAppliesTo(opt)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                    appliesTo === opt
                      ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-[#60A5FA]'
                      : 'border-white/[0.06] text-[#71717A] hover:border-white/[0.15]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-lg font-semibold text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)' }}
            >
              {saving ? 'Saving...' : 'Apply Discount'}
            </button>
            {currentDiscount && (
              <button
                type="button"
                onClick={onRemove}
                disabled={saving}
                className="px-4 py-3 rounded-lg text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
