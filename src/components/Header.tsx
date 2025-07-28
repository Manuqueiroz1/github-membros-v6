import React from 'react';
import { Users, Settings, Shield, MessageSquare } from 'lucide-react';
import { isAdmin } from '../utils/adminConfig';

interface HeaderProps {
  userName: string;
  userEmail?: string;
  onLogout: () => void;
  onCommunityClick: () => void;
  onSettingsClick: () => void;
  onAdminPanel?: () => void;
}

export default function Header({ userName, userEmail, onLogout, onCommunityClick, onSettingsClick, onAdminPanel }: HeaderProps) {
  const isUserAdmin = userEmail && isAdmin(userEmail);

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
                {isUserAdmin ? 'Teacher Poli - Admin' : 'Teacher Poli'}
              </h1>
            </div>
          </div>
            {isUserAdmin ? (
              /* Admin View */
              <button 
                className="hidden lg:block p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Suporte"
                onClick={() => {
                  // Trigger support modal
                  const event = new CustomEvent('openSupport');
                  window.dispatchEvent(event);
                }}
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            ) : (
              /* Student View */
              <>
                <button 
                  className="hidden lg:block p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Suporte"
                  onClick={() => {
                    // Trigger support modal
                    const event = new CustomEvent('openSupport');
                    window.dispatchEvent(event);
                  }}
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
                
                <button 
                  onClick={onCommunityClick}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Comunidade"
                >
                  <Users className="h-5 w-5" />
                </button>
                
                <button 
                  onClick={onSettingsClick}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Configurações"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
    </header>
  );
}