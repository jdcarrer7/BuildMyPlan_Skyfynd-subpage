'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import type { MasterLeadRow } from '@/lib/types/admin';

interface Props {
  leadRow: MasterLeadRow;
}

export default function CustomerToggle({ leadRow }: Props) {
  const [isCustomer, setIsCustomer] = useState(leadRow.isCustomer);
  const [serviceStarted, setServiceStarted] = useState(leadRow.serviceStarted || '');
  const [serviceEnded, setServiceEnded] = useState(leadRow.serviceEnded || '');
  const [showServiceEnded, setShowServiceEnded] = useState(!!leadRow.serviceEnded);
  const [saving, setSaving] = useState(false);
  const toggleCustomer = useAdminStore(s => s.toggleCustomer);

  useEffect(() => {
    setIsCustomer(leadRow.isCustomer);
    setServiceStarted(leadRow.serviceStarted || '');
    setServiceEnded(leadRow.serviceEnded || '');
    setShowServiceEnded(!!leadRow.serviceEnded);
  }, [leadRow]);

  const handleToggle = async (checked: boolean) => {
    setIsCustomer(checked);
    setSaving(true);
    const started = checked && !serviceStarted ? new Date().toISOString().split('T')[0] : serviceStarted;
    if (checked && !serviceStarted) setServiceStarted(started);

    await toggleCustomer(leadRow.qrNumber, checked, started, serviceEnded);
    setSaving(false);
  };

  const handleDateChange = async (field: 'started' | 'ended', value: string) => {
    if (field === 'started') setServiceStarted(value);
    else setServiceEnded(value);

    setSaving(true);
    await toggleCustomer(
      leadRow.qrNumber,
      isCustomer,
      field === 'started' ? value : serviceStarted,
      field === 'ended' ? value : serviceEnded
    );
    setSaving(false);
  };

  return (
    <div className="bg-[#1c1825] rounded-xl border border-[#2a2435] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Customer Status</h3>
        {saving && <span className="text-xs text-[#8b5cf6]">Saving...</span>}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isCustomer}
            onChange={e => handleToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-[#2a2435] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8b5cf6]"></div>
        </label>
        <span className="text-sm text-[#a0a0a0]">
          {isCustomer ? 'Current Customer' : 'Not a Customer'}
        </span>
      </div>

      {isCustomer && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#888] mb-1">Service Started</label>
            <input
              type="date"
              value={serviceStarted}
              onChange={e => handleDateChange('started', e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2435] rounded-lg text-white text-sm focus:outline-none focus:border-[#8b5cf6]"
            />
          </div>
          {showServiceEnded ? (
            <div>
              <label className="block text-xs text-[#888] mb-1">Service Ended</label>
              <input
                type="date"
                value={serviceEnded}
                onChange={e => handleDateChange('ended', e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2435] rounded-lg text-white text-sm focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowServiceEnded(true)}
              className="text-xs text-[#888] hover:text-[#8b5cf6] transition-colors"
            >
              + Add Service End Date
            </button>
          )}
        </div>
      )}
    </div>
  );
}
