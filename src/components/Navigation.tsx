import React from 'react';
import { Home, Target, GraduationCap, Gift } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lockedTabs?: string[];
  onLockedTabClick?: (tabId: string) => void;
}

export default function Navigation({ 
  activeTab, 
  onTabChange, 
  lockedTabs = [], 
  onLockedTabClick
}: NavigationProps) {
  const tabs = [
    { id: 'onboarding', label: 'Início', icon: Home },
    { id: 'ai-assistant', label: 'Meu Plano', icon: Target },
    { id: 'teacher-poli', label: 'Teacher Poli', icon: GraduationCap },
    { id: 'resources', label: 'Bônus', icon: Gift }
  ];

  const handleTabClick = (tabId: string) => {
    if (lockedTabs.includes(tabId)) {
      onLockedTabClick?.(tabId);
    } else {
      onTabChange(tabId);
    }
  };

  return (
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isLocked = lockedTabs.includes(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors min-w-0 ${
                    isLocked
                      ? 'border-transparent text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300'
                      :
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
  );
}