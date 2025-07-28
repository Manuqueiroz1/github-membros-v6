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
  onLockedTabClick,
  isMobile = false
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
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white dark:bg-gray-800 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
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
                      : activeTab === tab.id
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

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="grid grid-cols-4 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isLocked = lockedTabs.includes(tab.id);
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
                  isLocked
                    ? 'text-gray-400 dark:text-gray-500'
                    : isActive
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium truncate max-w-full px-1">
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-600 rounded-b-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}