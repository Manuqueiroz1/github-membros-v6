import React from 'react';
import { User, Settings } from 'lucide-react';
import { isAdmin } from '../utils/adminConfig';

interface HeaderProps {
  userName: string;
  userEmail?: string;
  onLogout: () => void;
  onAdminPanel?: () => void;
}

export default function Header({ userName, userEmail, onLogout, onAdminPanel }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 min-h-[64px]">
          <div className="flex items-center flex-1">            
            <img 
              src="/WhatsApp Image 2025-06-02 at 10.53.02.jpeg" 
              alt="Teacher Poli" 
              className="h-8 sm:h-10 w-auto flex-shrink-0"
            />
            <div className="ml-2 sm:ml-4 min-w-0 flex-1">
              <h1 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">
                Teacher Poli
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* User Icon */}
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <User className="h-5 w-5" />
            </button>
            
            {/* Settings Button */}
            <button 
              onClick={userEmail && isAdmin(userEmail) ? onAdminPanel : undefined}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Settings className="h-5 w-5" />
            </button>
            
            {/* Admin Panel Button - Only visible for admins on desktop */}
            {userEmail && isAdmin(userEmail) && onAdminPanel && (
              <button 
                onClick={onAdminPanel}
                className="hidden lg:flex items-center space-x-1 px-2 py-2 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                title="Painel Admin"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}