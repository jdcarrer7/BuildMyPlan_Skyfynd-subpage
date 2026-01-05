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
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {categories.map((category) => {
        const isActive = category.id === activeCategory;
        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              relative flex items-center gap-2 px-5 py-3 rounded-full
              font-medium text-sm transition-all duration-300
              ${isActive
                ? 'bg-[var(--accent-orange)] text-black'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-purple)] hover:text-white'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {categoryIcons[category.id]}
            <span>{category.name}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[var(--accent-orange)] rounded-full -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
