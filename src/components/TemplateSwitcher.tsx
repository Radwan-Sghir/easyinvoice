import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Sparkles, Minimize2, Table } from 'lucide-react';

export type TemplateType = 'classic' | 'modern' | 'minimal' | 'excel';

interface Props {
  currentTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

const templates = [
  { id: 'classic', name: 'Classic', icon: Layout },
  { id: 'modern', name: 'Modern', icon: Sparkles },
  { id: 'minimal', name: 'Minimal', icon: Minimize2 },
  { id: 'excel', name: 'Excel', icon: Table },
] as const;

export default function TemplateSwitcher({ currentTemplate, onTemplateChange }: Props) {
  return (
    <div className="flex justify-center gap-4 mb-6 flex-wrap">
      {templates.map(({ id, name, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTemplateChange(id as TemplateType)}
          className={`
            relative px-4 py-2 rounded-lg flex items-center gap-2
            ${currentTemplate === id
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }
          `}
        >
          {currentTemplate === id && (
            <motion.div
              layoutId="activeTemplate"
              className="absolute inset-0 bg-indigo-600 rounded-lg"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative">
            <Icon className="h-4 w-4" />
          </span>
          <span className="relative font-medium">{name}</span>
        </button>
      ))}
    </div>
  );
}