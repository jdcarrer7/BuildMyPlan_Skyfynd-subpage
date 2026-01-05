import { create } from 'zustand';
import { getServiceById } from '@/data/services';

export interface PlanItem {
  serviceId: string;
  tierId: 'essential' | 'pro' | 'enterprise';
  quantity: number;
  addOns: string[];
  subtotal: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
  notes: string;
}

interface PlanState {
  items: PlanItem[];
  customerInfo: CustomerInfo;

  // Computed values
  subtotal: number;
  discount: number;
  discountPercentage: number;
  total: number;
  itemCount: number;

  // Actions
  addItem: (serviceId: string, tierId: 'essential' | 'pro' | 'enterprise') => void;
  removeItem: (serviceId: string) => void;
  updateTier: (serviceId: string, tierId: 'essential' | 'pro' | 'enterprise') => void;
  toggleAddOn: (serviceId: string, addOnId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  setCustomerInfo: (info: Partial<CustomerInfo>) => void;
  clearPlan: () => void;
  isServiceInPlan: (serviceId: string) => boolean;
  getItemByServiceId: (serviceId: string) => PlanItem | undefined;
}

// Bundle discount tiers
const getDiscountPercentage = (itemCount: number): number => {
  if (itemCount >= 7) return 20;
  if (itemCount >= 5) return 15;
  if (itemCount >= 3) return 10;
  return 0;
};

const calculateItemSubtotal = (item: PlanItem): number => {
  const service = getServiceById(item.serviceId);
  if (!service) return 0;

  const tier = service.tiers.find(t => t.id === item.tierId);
  if (!tier) return 0;

  let subtotal = tier.price * item.quantity;

  // Add add-on prices
  item.addOns.forEach(addOnId => {
    const addOn = service.addOns.find(a => a.id === addOnId);
    if (addOn) {
      subtotal += addOn.price;
    }
  });

  return subtotal;
};

const calculateTotals = (items: PlanItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.length;
  const discountPercentage = getDiscountPercentage(itemCount);
  const discount = Math.round(subtotal * (discountPercentage / 100));
  const total = subtotal - discount;

  return { subtotal, discount, discountPercentage, total, itemCount };
};

const initialCustomerInfo: CustomerInfo = {
  name: '',
  email: '',
  company: '',
  phone: '',
  notes: '',
};

export const usePlanStore = create<PlanState>((set, get) => ({
  items: [],
  customerInfo: initialCustomerInfo,
  subtotal: 0,
  discount: 0,
  discountPercentage: 0,
  total: 0,
  itemCount: 0,

  addItem: (serviceId, tierId) => {
    const state = get();

    // Check if service already in plan
    if (state.items.some(item => item.serviceId === serviceId)) {
      // Update tier instead
      state.updateTier(serviceId, tierId);
      return;
    }

    const service = getServiceById(serviceId);
    if (!service) return;

    const tier = service.tiers.find(t => t.id === tierId);
    if (!tier) return;

    const newItem: PlanItem = {
      serviceId,
      tierId,
      quantity: 1,
      addOns: [],
      subtotal: tier.price,
    };

    const newItems = [...state.items, newItem];
    const totals = calculateTotals(newItems);

    set({
      items: newItems,
      ...totals,
    });
  },

  removeItem: (serviceId) => {
    const state = get();
    const newItems = state.items.filter(item => item.serviceId !== serviceId);
    const totals = calculateTotals(newItems);

    set({
      items: newItems,
      ...totals,
    });
  },

  updateTier: (serviceId, tierId) => {
    const state = get();
    const newItems = state.items.map(item => {
      if (item.serviceId === serviceId) {
        const updatedItem = { ...item, tierId };
        updatedItem.subtotal = calculateItemSubtotal(updatedItem);
        return updatedItem;
      }
      return item;
    });

    const totals = calculateTotals(newItems);

    set({
      items: newItems,
      ...totals,
    });
  },

  toggleAddOn: (serviceId, addOnId) => {
    const state = get();
    const newItems = state.items.map(item => {
      if (item.serviceId === serviceId) {
        const addOns = item.addOns.includes(addOnId)
          ? item.addOns.filter(id => id !== addOnId)
          : [...item.addOns, addOnId];
        const updatedItem = { ...item, addOns };
        updatedItem.subtotal = calculateItemSubtotal(updatedItem);
        return updatedItem;
      }
      return item;
    });

    const totals = calculateTotals(newItems);

    set({
      items: newItems,
      ...totals,
    });
  },

  updateQuantity: (serviceId, quantity) => {
    if (quantity < 1) return;

    const state = get();
    const newItems = state.items.map(item => {
      if (item.serviceId === serviceId) {
        const updatedItem = { ...item, quantity };
        updatedItem.subtotal = calculateItemSubtotal(updatedItem);
        return updatedItem;
      }
      return item;
    });

    const totals = calculateTotals(newItems);

    set({
      items: newItems,
      ...totals,
    });
  },

  setCustomerInfo: (info) => {
    set((state) => ({
      customerInfo: { ...state.customerInfo, ...info },
    }));
  },

  clearPlan: () => {
    set({
      items: [],
      customerInfo: initialCustomerInfo,
      subtotal: 0,
      discount: 0,
      discountPercentage: 0,
      total: 0,
      itemCount: 0,
    });
  },

  isServiceInPlan: (serviceId) => {
    return get().items.some(item => item.serviceId === serviceId);
  },

  getItemByServiceId: (serviceId) => {
    return get().items.find(item => item.serviceId === serviceId);
  },
}));
