'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills';
  fullWidth?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  fullWidth = false,
}) => {
  const [activeTab, setActiveTab] = useState(
    defaultTab || tabs[0]?.id || '',
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  const variantStyles = {
    default: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      button:
        'px-4 py-2 border-b-2 font-medium transition-colors focus:outline-none',
      active:
        'border-primary-500 text-primary-600 dark:text-primary-400',
      inactive:
        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
    },
    pills: {
      container: 'space-x-2',
      button:
        'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none',
      active:
        'bg-primary-500 text-white',
      inactive:
        'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="w-full">
      <div
        className={cn(
          'flex',
          styles.container,
          fullWidth && 'w-full',
        )}
        role="tablist"
        aria-label="Tabs"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              styles.button,
              activeTab === tab.id ? styles.active : styles.inactive,
              tab.disabled && 'opacity-50 cursor-not-allowed',
              fullWidth && 'flex-1',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="mt-6"
      >
        {activeTabContent}
      </div>
    </div>
  );
};

export default Tabs;