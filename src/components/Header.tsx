import React from 'react';
import { Users, Settings, Shield, MessageSquare } from 'lucide-react';
import { isAdmin } from '../utils/adminConfig';
import SupportButton from './SupportButton';

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
  const [showSupportModal, setShowSupportModal] = React.useState(false);

  return (
    <>
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
              
            <div className="flex items-center space-x-1">
              {isUserAdmin ? (
                /* Admin View */
                <button 
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Suporte"
                  onClick={() => setShowSupportModal(true)}
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
              ) : (
                /* Student View */
                <>
                  <button 
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Suporte"
                    onClick={() => setShowSupportModal(true)}
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
        </div>
      </header>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 lg:p-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
            <div className="text-center mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Precisa de Ajuda?</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Escolha a melhor forma de entrar em contato</p>
            </div>

            <div className="flex items-center space-x-1">
              <div className="space-y-3 mb-4 sm:mb-6">
                <button 
                  onClick={() => {
                    window.open('mailto:suporte@teacherpoli.com', '_blank');
                    setShowSupportModal(false);
                  }}
                  className="w-full flex items-center p-3 sm:p-4 rounded-lg text-white transition-colors bg-blue-500 hover:bg-blue-600"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 mr-3 sm:mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div className="text-left">
                    <div className="font-semibold text-base sm:text-lg text-white">Email</div>
                    <div className="text-xs sm:text-sm opacity-90 text-white">Resposta em até 24h</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => {
                    window.open('https://wa.me/5511999999999', '_blank');
                    setShowSupportModal(false);
                  }}
                  className="w-full flex items-center p-3 sm:p-4 rounded-lg text-white transition-colors bg-green-500 hover:bg-green-600"
                >
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 mr-3 sm:mr-4 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold text-base sm:text-lg text-white">WhatsApp</div>
                    <div className="text-xs sm:text-sm opacity-90 text-white">Suporte imediato</div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowSupportModal(false)}
                className="w-full py-2 sm:py-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
      )}
    </>
  );
}