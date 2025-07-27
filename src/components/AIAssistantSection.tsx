import React, { useState } from 'react';
import { Brain, Send, User, Bot, Sparkles, BookOpen, Target, Clock, Download, FileText } from 'lucide-react';
import SupportButton from './SupportButton';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantSectionProps {
  onPlanGenerated?: () => void;
}

export default function AIAssistantSection({ onPlanGenerated }: AIAssistantSectionProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '👋 Olá! Sou sua assistente de IA da Teacher Poli. \n\n🎯 **Por que criar seu plano personalizado é importante?**\n\n✅ A Teacher Poli se adapta ao SEU nível e objetivos\n✅ Você terá uma experiência única, feita especialmente para você\n✅ Sem seu plano, a IA não consegue te ajudar da melhor forma\n\n💡 **Vamos começar?** Me conte sobre seus objetivos de aprendizado e seu nível atual de inglês.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const studyPlanTemplates = [
    {
      title: 'Inglês Básico',
      description: 'Plano para iniciantes em inglês',
      duration: '30 dias',
      icon: BookOpen
    },
    {
      title: 'Inglês Intermediário',
      description: 'Aperfeiçoe suas habilidades',
      duration: '30 dias',
      icon: Target
    },
    {
      title: 'Inglês Avançado',
      description: 'Fluência e proficiência',
      duration: '30 dias',
      icon: Sparkles
    }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Perfeito! Com base nas suas informações, criei um plano de estudos personalizado para você. Você pode baixá-lo no painel ao lado.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      
      // Simulate plan generation
      setGeneratedPlan({
        title: 'Plano de Estudos Personalizado',
        level: 'Intermediário',
        objective: 'Conversação fluente',
        dailyTime: '45 minutos',
        generatedAt: new Date()
      });
      
      // Notify parent component that plan was generated
      if (onPlanGenerated) {
        onPlanGenerated();
        
        // Show success message
        setTimeout(() => {
          const message = `🎉 **PARABÉNS!** Seu plano foi gerado com sucesso!\n\n🔓 **ACESSO LIBERADO!** Agora você tem acesso completo a:\n\n✨ Teacher Poli (sua IA personalizada)\n🎁 Bônus Exclusivos\n👥 Comunidade WhatsApp\n⚙️ Todas as configurações\n\n🚀 **Próximo passo:** Clique na aba "Teacher Poli" para começar a conversar com sua assistente personalizada!`;
          alert(message);
        }, 500);
      }
      
      setIsLoading(false);
    }, 2000);
  };

  const handleTemplateSelect = (template: any) => {
    const message = `Gostaria de usar o template "${template.title}" como base para meu plano de estudos.`;
    setInputMessage(message);
  };

  const downloadPlan = () => {
    // In a real implementation, this would generate and download a PDF
    const element = document.createElement('a');
    const file = new Blob(['Plano de Estudos Personalizado - Teacher Poli\n\nEste é um exemplo de plano de estudos...'], 
      { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'plano-estudos-30-dias.pdf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Assistente de IA</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Crie seu plano de estudos personalizado com inteligência artificial</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {/* Templates */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Templates Rápidos</h3>
              <div className="space-y-3">
                {studyPlanTemplates.map((template, index) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{template.title}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{template.description}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {template.duration}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          
            {/* Generated Plan Download */}
            {generatedPlan && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Plano Gerado</h3>
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 mb-4">
                  <h4 className="text-base font-medium text-purple-900 dark:text-white mb-2">{generatedPlan.title}</h4>
                  <div className="text-sm text-purple-800 dark:text-gray-300 space-y-1">
                    <p>Nível: {generatedPlan.level}</p>
                    <p>Objetivo: {generatedPlan.objective}</p>
                    <p>Tempo diário: {generatedPlan.dailyTime}</p>
                  </div>
                </div>
                <button
                  onClick={downloadPlan}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-base font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Plano Completo
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Válido por 30 dias</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-[400px] sm:h-[500px] lg:h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Assistente IA</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Especialista em ensino de inglês</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] sm:max-w-xs lg:max-w-md ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-purple-600' 
                        : 'bg-purple-100'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div className={`rounded-lg px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2 items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="mt-6 sm:mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 sm:p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dúvidas sobre seu plano?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Fale conosco para otimizar seus estudos</p>
        <SupportButton position="inline" variant="primary" />
      </div>

      {/* Fixed Support Button */}
      <SupportButton />
    </div>
  );
}