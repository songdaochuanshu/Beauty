import React from 'react';

interface Category {
  id: string;
  name: string;
  mode: string;
}

interface CategoryTabsProps {
  categories: Category[];
  currentId: string;
  onChange: (cat: Category) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, currentId, onChange }) => {
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-2 md:gap-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-xs tracking-widest uppercase transition-all duration-300 ${
            currentId === cat.id
              ? 'bg-neutral-800 text-white shadow-md'
              : 'bg-white text-neutral-400 hover:text-neutral-600 border border-neutral-100'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;