'use client';

import { motion } from 'framer-motion';
import { Category } from '@/data/services';
import { Palette, Megaphone, Sparkles, FileText } from 'lucide-react';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'design-development': <Palette className="w-4 h-4" />,
  'marketing': <Megaphone className="w-4 h-4" />,
  'branding': <Sparkles className="w-4 h-4" />,
  'content': <FileText className="w-4 h-4" />,
};

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-2 md:justify-center mb-10 max-w-md md:max-w-none mx-auto">
      {categories.map((category) => {
        const isActive = category.id === activeCategory;
        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              relative flex items-center justify-center md:justify-start gap-2 md:gap-2.5 px-4 py-3 md:px-6 md:py-3.5 rounded-xl
              font-medium transition-all duration-400
              ${isActive
                ? 'text-white'
                : 'bg-transparent text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)]/60'
              }
            `}
            style={{ fontSize: '14px' }}
            whileHover={{ scale: isActive ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/20"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center">
              {categoryIcons[category.id]}
            </span>
            <span className="relative z-10">{category.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
