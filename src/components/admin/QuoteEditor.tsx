'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import type { QuoteJSON, ResolvedServiceConfig, ResolvedStep } from '@/lib/types/admin';
import { Pencil, Save, X, StickyNote, Loader2 } from 'lucide-react';

/**
 * Deep-clone helper for QuoteJSON.
 */
function cloneQuote(q: QuoteJSON): QuoteJSON {
  return JSON.parse(JSON.stringify(q));
}

/**
 * Recalculate service totals from step prices, then recalculate quote totals.
 */
function recalcTotals(q: QuoteJSON, overriddenServices?: Set<number>): QuoteJSON {
  let oneTimeTotal = 0;
  let monthlyTotal = 0;

  for (let idx = 0; idx < q.services.length; idx++) {
    const svc = q.services[idx];

    // If this service has a manual price override, skip step-based calculation
    if (overriddenServices?.has(idx)) {
      oneTimeTotal += svc.oneTimeTotal;
      monthlyTotal += svc.monthlyTotal;
      continue;
    }

    let svcOneTime = 0;
    let svcMonthly = 0;

    const sumSteps = (steps: ResolvedStep[]) => {
      for (const step of steps) {
        if (step.priceImpact !== null && step.priceImpact > 0) {
          if (step.isRecurring) {
            svcMonthly += step.priceImpact;
          } else {
            svcOneTime += step.priceImpact;
          }
        }
        if (step.children) sumSteps(step.children);
      }
    };
    sumSteps(svc.steps);

    svc.oneTimeTotal = svcOneTime;
    svc.monthlyTotal = svcMonthly;
    oneTimeTotal += svcOneTime;
    monthlyTotal += svcMonthly;
  }

  q.totals.oneTimeTotal = oneTimeTotal;
  q.totals.monthlyTotal = monthlyTotal;

  // Re-apply discounts
  let totalSaved = 0;
  if (q.discounts) {
    // Service-level discounts
    for (const sd of q.discounts.serviceDiscounts) {
      const svc = q.services.find(s => s.serviceType === sd.serviceType);
      if (!svc) continue;
      if (sd.type === 'percentage') {
        if (sd.appliesTo === 'one-time' || sd.appliesTo === 'both') {
          totalSaved += svc.oneTimeTotal * (sd.value / 100);
        }
        if (sd.appliesTo === 'monthly' || sd.appliesTo === 'both') {
          totalSaved += svc.monthlyTotal * (sd.value / 100);
        }
      } else {
        totalSaved += sd.value;
      }
    }
    // Quote-level discount
    if (q.discounts.quoteDiscount) {
      const qd = q.discounts.quoteDiscount;
      const base = oneTimeTotal + monthlyTotal - totalSaved;
      if (qd.type === 'percentage') {
        totalSaved += base * (qd.value / 100);
      } else {
        totalSaved += qd.value;
      }
    }
    q.discounts.totalSaved = Math.round(totalSaved * 100) / 100;
  }

  q.totals.grandTotal = Math.max(0, Math.round((oneTimeTotal + monthlyTotal - totalSaved) * 100) / 100);
  if (totalSaved > 0 && (oneTimeTotal + monthlyTotal) > 0) {
    q.totals.discountPercentage = Math.round((totalSaved / (oneTimeTotal + monthlyTotal)) * 100);
  } else {
    q.totals.discountPercentage = 0;
  }

  return q;
}

// ── Editable Step Row ──

function EditableStepRow({
  step,
  depth = 0,
  onChange,
  path,
}: {
  step: ResolvedStep;
  depth?: number;
  onChange: (path: number[], field: keyof ResolvedStep, value: string | number | boolean | null) => void;
  path: number[];
}) {
  const hasChildren = step.children && step.children.length > 0;

  return (
    <>
      <tr className="border-b border-white/[0.04]">
        <td className="py-2 px-3 text-sm text-[#A1A1AA]" style={{ paddingLeft: `${12 + depth * 16}px` }}>
          {step.stepName}
        </td>
        <td className="py-2 px-3">
          <input
            type="text"
            value={step.selectedLabel}
            onChange={(e) => onChange(path, 'selectedLabel', e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#3B82F6]"
          />
        </td>
        <td className="py-2 px-3">
          {step.isCustomQuote ? (
            <span className="text-[#F59E0B] text-sm">Custom</span>
          ) : (
            <input
              type="number"
              value={step.priceImpact ?? ''}
              onChange={(e) => onChange(path, 'priceImpact', e.target.value === '' ? null : Number(e.target.value))}
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded px-2 py-1 text-sm text-white text-right focus:outline-none focus:border-[#3B82F6] tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
          )}
        </td>
      </tr>
      {hasChildren && step.children!.map((child, i) => (
        <EditableStepRow
          key={i}
          step={child}
          depth={depth + 1}
          onChange={onChange}
          path={[...path, i]}
        />
      ))}
    </>
  );
}

// ── Main QuoteEditor Component ──

export default function QuoteEditor({
  externalEditTrigger,
  externalSaveTrigger,
  externalCancelTrigger,
  onEditingChange,
  onSavingChange,
  onSaveResult,
}: {
  externalEditTrigger?: number;
  externalSaveTrigger?: number;
  externalCancelTrigger?: number;
  onEditingChange?: (editing: boolean) => void;
  onSavingChange?: (saving: boolean) => void;
  onSaveResult?: (result: { success: boolean; message: string } | null) => void;
}) {
  const { selectedQuote, adminNotes, quoteEdited, saveQuoteEdit } = useAdminStore();
  const [isEditing, _setIsEditing] = useState(false);

  const setIsEditing = useCallback((v: boolean) => {
    _setIsEditing(v);
    onEditingChange?.(v);
  }, [onEditingChange]);
  const [draft, setDraft] = useState<QuoteJSON | null>(null);
  const [notesValue, setNotesValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);
  const [overriddenServices, setOverriddenServices] = useState<Set<number>>(new Set());
  const [grandTotalOverride, setGrandTotalOverride] = useState<number | null>(null);

  const startEditing = useCallback(() => {
    if (!selectedQuote) return;
    const clone = cloneQuote(selectedQuote);

    // Detect services whose stored totals don't match step-calculated totals.
    // These were previously manually overridden and must stay marked as such.
    const preOverridden = new Set<number>();
    for (let idx = 0; idx < clone.services.length; idx++) {
      const svc = clone.services[idx];
      let stepsOneTime = 0;
      let stepsMonthly = 0;
      const sumSteps = (steps: ResolvedStep[]) => {
        for (const step of steps) {
          if (step.priceImpact !== null && step.priceImpact > 0) {
            if (step.isRecurring) stepsMonthly += step.priceImpact;
            else stepsOneTime += step.priceImpact;
          }
          if (step.children) sumSteps(step.children);
        }
      };
      sumSteps(svc.steps);
      // If the service total doesn't match what steps add up to, it was manually set
      if (svc.oneTimeTotal !== stepsOneTime || svc.monthlyTotal !== stepsMonthly) {
        preOverridden.add(idx);
      }
    }

    setDraft(clone);
    setNotesValue(adminNotes);
    setOverriddenServices(preOverridden);
    setGrandTotalOverride(null);
    setIsEditing(true);
    setSaveResult(null);
    onSaveResult?.(null);
  }, [selectedQuote, adminNotes, setIsEditing, onSaveResult]);

  // Allow parent to trigger edit mode via a counter prop
  const lastTriggerRef = useRef(0);
  useEffect(() => {
    if (externalEditTrigger && externalEditTrigger !== lastTriggerRef.current) {
      lastTriggerRef.current = externalEditTrigger;
      startEditing();
    }
  }, [externalEditTrigger, startEditing]);

  const cancelEditing = useCallback(() => {
    setDraft(null);
    setIsEditing(false);
    setOverriddenServices(new Set());
    setGrandTotalOverride(null);
    setSaveResult(null);
    onSaveResult?.(null);
  }, [setIsEditing, onSaveResult]);

  // Allow parent to trigger cancel
  const cancelTriggerRef = useRef(0);
  useEffect(() => {
    if (externalCancelTrigger && externalCancelTrigger !== cancelTriggerRef.current) {
      cancelTriggerRef.current = externalCancelTrigger;
      cancelEditing();
    }
  }, [externalCancelTrigger, cancelEditing]);

  const handleSave = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    onSavingChange?.(true);
    setSaveResult(null);
    const finalQuote = recalcTotals(cloneQuote(draft), overriddenServices);
    if (grandTotalOverride !== null) {
      finalQuote.totals.grandTotal = grandTotalOverride;
    }
    const result = await saveQuoteEdit(finalQuote, notesValue);
    setSaving(false);
    onSavingChange?.(false);
    if (result.success) {
      setIsEditing(false);
      setDraft(null);
      const r = { success: true, message: 'Changes saved' };
      setSaveResult(r);
      onSaveResult?.(r);
      setTimeout(() => { setSaveResult(null); onSaveResult?.(null); }, 3000);
    } else {
      const r = { success: false, message: result.error || 'Failed to save' };
      setSaveResult(r);
      onSaveResult?.(r);
    }
  }, [draft, notesValue, saveQuoteEdit, setIsEditing, onSavingChange, onSaveResult]);

  // Allow parent to trigger save
  const saveTriggerRef = useRef(0);
  useEffect(() => {
    if (externalSaveTrigger && externalSaveTrigger !== saveTriggerRef.current) {
      saveTriggerRef.current = externalSaveTrigger;
      handleSave();
    }
  }, [externalSaveTrigger, handleSave]);

  const updateCustomer = useCallback((field: keyof QuoteJSON['customer'], value: string) => {
    if (!draft) return;
    const next = cloneQuote(draft);
    next.customer[field] = value;
    setDraft(next);
  }, [draft]);

  const updateStep = useCallback((serviceIndex: number, stepPath: number[], field: keyof ResolvedStep, value: string | number | boolean | null) => {
    if (!draft) return;
    const next = cloneQuote(draft);

    // Navigate to the step
    let target: ResolvedStep = next.services[serviceIndex].steps[stepPath[0]];
    for (let i = 1; i < stepPath.length; i++) {
      target = target.children![stepPath[i]];
    }

    // Update field
    (target as unknown as Record<string, unknown>)[field] = value;

    // Recalculate (respecting any manual overrides)
    setDraft(recalcTotals(next, overriddenServices));
  }, [draft, overriddenServices]);

  const updateServicePrice = useCallback((serviceIndex: number, field: 'oneTimeTotal' | 'monthlyTotal', value: number) => {
    if (!draft) return;
    const next = cloneQuote(draft);
    next.services[serviceIndex][field] = value;

    // Zero out all step prices when the service total is manually overridden
    const zeroSteps = (steps: ResolvedStep[]) => {
      for (const step of steps) {
        if (step.priceImpact !== null) step.priceImpact = 0;
        if (step.children) zeroSteps(step.children);
      }
    };
    if (!overriddenServices.has(serviceIndex)) {
      zeroSteps(next.services[serviceIndex].steps);
    }

    // Mark this service as manually overridden so recalcTotals won't recalculate it from steps
    const nextOverrides = new Set(overriddenServices);
    nextOverrides.add(serviceIndex);
    setOverriddenServices(nextOverrides);
    setDraft(recalcTotals(next, nextOverrides));
  }, [draft, overriddenServices]);

  if (!selectedQuote) return null;

  const quote = isEditing && draft ? draft : selectedQuote;

  return (
    <div className="relative space-y-6">
      {/* Status badges (edited indicator + save result) */}
      {!isEditing && (quoteEdited || saveResult) && (
        <div className="flex justify-end items-center gap-2">
          {quoteEdited && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
              Edited
            </span>
          )}
          {saveResult && (
            <span className={`text-sm ${saveResult.success ? 'text-[#10B981]' : 'text-red-400'}`}>
              {saveResult.message}
            </span>
          )}
        </div>
      )}

      {/* Customer Info — Editable */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-[#71717A] uppercase tracking-wide mb-4">Client Information</h3>
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            {(['name', 'email', 'phone', 'company'] as const).map(field => (
              <div key={field}>
                <label className="block text-xs text-[#52525B] mb-1 capitalize">{field}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={quote.customer[field]}
                  onChange={(e) => updateCustomer(field, e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors"
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs text-[#52525B] mb-1">Customer Notes</label>
              <textarea
                value={quote.customer.notes}
                onChange={(e) => updateCustomer('notes', e.target.value)}
                rows={2}
                className="w-full bg-[#0A0A0B] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3B82F6] transition-colors resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-[#52525B]">Name:</span> <span className="text-white ml-2">{quote.customer.name}</span></div>
            <div><span className="text-[#52525B]">Email:</span> <span className="text-white ml-2">{quote.customer.email}</span></div>
            <div><span className="text-[#52525B]">Phone:</span> <span className="text-white ml-2">{quote.customer.phone || '—'}</span></div>
            <div><span className="text-[#52525B]">Company:</span> <span className="text-white ml-2">{quote.customer.company || '—'}</span></div>
            {quote.customer.notes && (
              <div className="col-span-2 mt-2 pt-3 border-t border-white/[0.06]">
                <span className="text-[#52525B] text-xs block mb-1">Notes:</span>
                <span className="text-[#A1A1AA]">{quote.customer.notes}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Service Breakdown — Editable */}
      {quote.services.map((svc, svcIndex) => (
        <div key={svc.serviceType} className="card overflow-hidden">
          {/* Service Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
            <h3 className="text-lg font-semibold text-[#FAFAFA] font-serif">{svc.serviceLabel}</h3>
            {isEditing ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-white text-sm">$</span>
                  <input
                    type="number"
                    value={svc.oneTimeTotal}
                    onChange={(e) => updateServicePrice(svcIndex, 'oneTimeTotal', Number(e.target.value) || 0)}
                    className="w-24 bg-white/[0.04] border border-white/[0.1] rounded px-2 py-1 text-sm text-white text-right font-medium focus:outline-none focus:border-[#3B82F6] tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                {svc.monthlyTotal > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[#3B82F6] text-sm">$</span>
                    <input
                      type="number"
                      value={svc.monthlyTotal}
                      onChange={(e) => updateServicePrice(svcIndex, 'monthlyTotal', Number(e.target.value) || 0)}
                      className="w-24 bg-white/[0.04] border border-[#3B82F6]/30 rounded px-2 py-1 text-sm text-[#3B82F6] text-right font-medium focus:outline-none focus:border-[#3B82F6] tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-[#3B82F6] text-sm">/mo</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4 text-sm">
                {svc.oneTimeTotal > 0 && (
                  <span className="text-white font-medium">${svc.oneTimeTotal.toLocaleString()}</span>
                )}
                {svc.monthlyTotal > 0 && (
                  <span className="text-[#3B82F6] font-medium">${svc.monthlyTotal.toLocaleString()}/mo</span>
                )}
              </div>
            )}
          </div>

          {/* Steps Table */}
          <table className="w-full" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="py-2 px-3 text-left text-xs font-medium text-[#71717A] uppercase" style={{ width: '40%' }}>Step</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-[#71717A] uppercase" style={{ width: '40%' }}>
                  {isEditing ? 'Value' : 'Selected'}
                </th>
                <th className="py-2 px-3 text-right text-xs font-medium text-[#71717A] uppercase" style={{ width: '20%' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {isEditing ? (
                svc.steps.map((step, stepIndex) => (
                  <EditableStepRow
                    key={stepIndex}
                    step={step}
                    onChange={(path, field, value) => updateStep(svcIndex, path, field, value)}
                    path={[stepIndex]}
                  />
                ))
              ) : (
                svc.steps.map((step, i) => (
                  <ReadOnlyStepRow key={i} step={step} />
                ))
              )}
            </tbody>
          </table>

          {/* Subtotals */}
          <div className="p-4 border-t border-white/[0.06] flex items-center justify-end">
            <div className="text-right">
              {svc.oneTimeTotal > 0 && (
                <div className="text-sm text-white">One-time: <span className="font-semibold">${svc.oneTimeTotal.toLocaleString()}</span></div>
              )}
              {svc.monthlyTotal > 0 && (
                <div className="text-sm text-[#3B82F6]">Monthly: <span className="font-semibold">${svc.monthlyTotal.toLocaleString()}/mo</span></div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Totals Summary */}
      <div className="card p-5">
        <h3 className="text-lg font-semibold text-[#FAFAFA] font-serif mb-4">Quote Totals</h3>
        <div className="space-y-3">
          {quote.totals.oneTimeTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#A1A1AA]">One-Time Total</span>
              <span className="text-white font-medium">${quote.totals.oneTimeTotal.toLocaleString()}</span>
            </div>
          )}
          {quote.totals.monthlyTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#A1A1AA]">Monthly Total</span>
              <span className="text-[#3B82F6] font-medium">${quote.totals.monthlyTotal.toLocaleString()}/mo</span>
            </div>
          )}
          {quote.discounts && quote.discounts.totalSaved > 0 && (
            <div className="border-t border-white/[0.06] pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#10B981]">Discount ({quote.totals.discountPercentage}%)</span>
                <span className="text-[#10B981] font-medium">-${quote.discounts.totalSaved.toLocaleString()}</span>
              </div>
            </div>
          )}
          <div className="border-t border-white/[0.06] pt-3">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">Grand Total</span>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <span className="text-white text-xl font-bold">$</span>
                  <input
                    type="number"
                    value={grandTotalOverride !== null ? grandTotalOverride : quote.totals.grandTotal}
                    onChange={(e) => setGrandTotalOverride(Number(e.target.value) || 0)}
                    className="w-32 bg-white/[0.04] border border-white/[0.1] rounded px-2 py-1 text-xl text-white text-right font-bold focus:outline-none focus:border-[#3B82F6] tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              ) : (
                <span className="text-xl font-bold text-white">${quote.totals.grandTotal.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Notes */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-[#FAFAFA] flex items-center gap-2 mb-3">
          <StickyNote className="w-4 h-4 text-[#F59E0B]" />
          Admin Notes
        </h3>
        {isEditing ? (
          <textarea
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
            rows={4}
            placeholder="Add internal notes about this quote..."
            className="w-full bg-[#0A0A0B] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white placeholder-[#52525B] focus:outline-none focus:border-[#3B82F6] transition-colors resize-none"
          />
        ) : adminNotes ? (
          <p className="text-sm text-[#A1A1AA] whitespace-pre-wrap">{adminNotes}</p>
        ) : (
          <p className="text-sm text-[#52525B] italic">No admin notes. Click &ldquo;Edit Quote&rdquo; to add notes.</p>
        )}
      </div>
    </div>
  );
}

// ── Read-Only Step Row (for view mode) ──

function ReadOnlyStepRow({ step, depth = 0 }: { step: ResolvedStep; depth?: number }) {
  const hasChildren = step.children && step.children.length > 0;

  return (
    <>
      <tr className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
        <td className="py-2 px-3 text-sm text-[#A1A1AA]" style={{ paddingLeft: `${12 + depth * 16}px` }}>
          {step.stepName}
        </td>
        <td className="py-2 px-3 text-sm text-white truncate">{step.selectedLabel}</td>
        <td className="py-2 px-3 text-sm text-right tabular-nums">
          {step.isCustomQuote ? (
            <span className="text-[#F59E0B]">Custom</span>
          ) : step.priceImpact !== null && step.priceImpact > 0 ? (
            <span className="text-white">
              ${step.priceImpact.toLocaleString()}{step.isRecurring ? '/mo' : ''}
            </span>
          ) : (
            <span className="text-[#71717A]">&mdash;</span>
          )}
        </td>
      </tr>
      {hasChildren && step.children!.map((child, i) => (
        <ReadOnlyStepRow key={i} step={child} depth={depth + 1} />
      ))}
    </>
  );
}
