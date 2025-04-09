
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TabProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: string;
}

const TabView: React.FC<TabProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  return (
    <div>
      <div className="mb-6 border-b border-border">
        <div className="flex space-x-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "transition-opacity",
              activeTab === tab.id ? "block" : "hidden"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabView;
