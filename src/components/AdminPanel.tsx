import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Settings, 
  BookOpen, 
  Video, 
  MessageSquare, 
  Plus,
  Edit3,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  Shield,
  Bell,
  Globe,
  Database,
  Zap,
  TrendingUp,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';
import { isAdmin, hasPermission } from '../utils/adminConfig';
import { 
  addStudent, 
  getStudents, 
  removeStudent, 
  updateStudentStatus, 
  getStudentStats,
  searchStudents,
  type ManualStudent 
} from '../utils/studentManager';
import { 
  getOnboardingVideos, 
  saveOnboardingVideos, 
  getPopupContents, 
  savePopupContents,
  type OnboardingVideo,
  type PopupContent 
} from '../data/onboardingData';
import { bonusResources } from '../data/bonusData';

interface AdminPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  userEmail: string;
}

type AdminTab = 'dashboard' | 'students' | 'content' | 'bonuses' | 'settings' | 'analytics';

export default function AdminPanel({ isVisible, onToggle, userEmail }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [students, setStudents] = useState<ManualStudent[]>([]);
  const [studentStats, setStudentStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    addedThisMonth: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', notes: '' });
  const [onboardingVideos, setOnboardingVideos] = useState<OnboardingVideo[]>([]);
  const [popupContents, setPopupContents] = useState<PopupContent[]>([]);
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [editingPopup, setEditingPopup] = useState<string | null>(null);

  // Verificar se usuário é admin
  if (!isAdmin(userEmail)) {
    return null;
  }

  // Carregar dados iniciais
  useEffect(() => {
    if (isVisible) {
      loadStudents();
      loadStats();
      loadOnboardingData();
    }
  }, [isVisible]);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const stats = await getStudentStats();
      setStudentStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadOnboardingData = () => {
    setOnboardingVideos(getOnboardingVideos());
    setPopupContents(getPopupContents());
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email) {
      alert('Nome e email são obrigatórios');
      return;
    }

    try {
      setIsLoading(true);
      await addStudent({
        name: newStudent.name,
        email: newStudent.email,
        notes: newStudent.notes,
        added_by: userEmail
      });
      
      setNewStudent({ name: '', email: '', notes: '' });
      setShowAddStudent(false);
      await loadStudents();
      await loadStats();
      alert('Aluno adicionado com sucesso!');
    } catch (error) {
      alert('Erro ao adicionar aluno: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm('Tem certeza que deseja remover este aluno?')) return;

    try {
      setIsLoading(true);
      await removeStudent(studentId);
      await loadStudents();
      await loadStats();
      alert('Aluno removido com sucesso!');
    } catch (error) {
      alert('Erro ao remover aluno: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStudentStatus = async (studentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      setIsLoading(true);
      await updateStudentStatus(studentId, newStatus);
      await loadStudents();
      await loadStats();
    } catch (error) {
      alert('Erro ao atualizar status: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadStudents();
      return;
    }

    try {
      setIsLoading(true);
      const results = await searchStudents(searchQuery);
      setStudents(results);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveVideoChanges = (videoId: string, updates: Partial<OnboardingVideo>) => {
    const updatedVideos = onboardingVideos.map(video =>
      video.id === videoId ? { ...video, ...updates } : video
    );
    setOnboardingVideos(updatedVideos);
    saveOnboardingVideos(updatedVideos);
    setEditingVideo(null);
    window.dispatchEvent(new Event('onboardingDataUpdated'));
    alert('Vídeo atualizado com sucesso!');
  };

  const savePopupChanges = (popupId: string, updates: Partial<PopupContent>) => {
    const updatedPopups = popupContents.map(popup =>
      popup.id === popupId ? { ...popup, ...updates } : popup
    );
    setPopupContents(updatedPopups);
    savePopupContents(updatedPopups);
    setEditingPopup(null);
    window.dispatchEvent(new Event('popupDataUpdated'));
    alert('Pop-up atualizado com sucesso!');
  };

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Alunos', icon: Users },
    { id: 'content', label: 'Conteúdo', icon: BookOpen },
    { id: 'bonuses', label: 'Bônus', icon: Video },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Painel Administrativo</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Teacher Poli - Gestão Completa</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h2>
                  <p className="text-gray-600 dark:text-gray-300">Visão geral da plataforma</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total de Alunos</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentStats.total}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Alunos Ativos</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentStats.active}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Novos Este Mês</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentStats.addedThisMonth}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Recursos Ativos</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{bonusResources.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ações Rápidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab('students')}
                      className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <Plus className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-600">Adicionar Aluno</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('content')}
                      className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <Edit3 className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-600">Editar Conteúdo</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-purple-600">Ver Analytics</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Students Management */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Alunos</h2>
                    <p className="text-gray-600 dark:text-gray-300">Adicione e gerencie alunos manualmente</p>
                  </div>
                  <button
                    onClick={() => setShowAddStudent(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Aluno</span>
                  </button>
                </div>

                {/* Search */}
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nome ou email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Buscar
                  </button>
                </div>

                {/* Students Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Aluno
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Adicionado em
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {student.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {student.email}
                                </div>
                                {student.notes && (
                                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {student.notes}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                student.status === 'active'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {student.status === 'active' ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(student.added_at).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleToggleStudentStatus(student.id, student.status)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    student.status === 'active'
                                      ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                      : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                  }`}
                                  title={student.status === 'active' ? 'Desativar' : 'Ativar'}
                                >
                                  {student.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                                <button
                                  onClick={() => handleRemoveStudent(student.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Remover"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {students.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Nenhum aluno encontrado</p>
                    </div>
                  )}
                </div>

                {/* Add Student Modal */}
                {showAddStudent && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Adicionar Aluno</h3>
                          <button
                            onClick={() => setShowAddStudent(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Nome *
                            </label>
                            <input
                              type="text"
                              value={newStudent.name}
                              onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Nome completo do aluno"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Email *
                            </label>
                            <input
                              type="email"
                              value={newStudent.email}
                              onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="email@exemplo.com"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Observações
                            </label>
                            <textarea
                              value={newStudent.notes}
                              onChange={(e) => setNewStudent(prev => ({ ...prev, notes: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              rows={3}
                              placeholder="Observações opcionais sobre o aluno"
                            />
                          </div>
                        </div>
                        
                        <div className="flex space-x-3 mt-6">
                          <button
                            onClick={() => setShowAddStudent(false)}
                            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleAddStudent}
                            disabled={isLoading || !newStudent.name || !newStudent.email}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isLoading ? 'Adicionando...' : 'Adicionar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Content Management */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Conteúdo</h2>
                  <p className="text-gray-600 dark:text-gray-300">Edite vídeos de onboarding e pop-ups</p>
                </div>

                {/* Onboarding Videos */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vídeos de Onboarding</h3>
                  <div className="space-y-4">
                    {onboardingVideos.map((video) => (
                      <div key={video.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        {editingVideo === video.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              defaultValue={video.title}
                              onChange={(e) => {
                                const updatedVideos = onboardingVideos.map(v =>
                                  v.id === video.id ? { ...v, title: e.target.value } : v
                                );
                                setOnboardingVideos(updatedVideos);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Título do vídeo"
                            />
                            <textarea
                              defaultValue={video.description}
                              onChange={(e) => {
                                const updatedVideos = onboardingVideos.map(v =>
                                  v.id === video.id ? { ...v, description: e.target.value } : v
                                );
                                setOnboardingVideos(updatedVideos);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              rows={2}
                              placeholder="Descrição do vídeo"
                            />
                            <input
                              type="text"
                              defaultValue={video.embedUrl}
                              onChange={(e) => {
                                const updatedVideos = onboardingVideos.map(v =>
                                  v.id === video.id ? { ...v, embedUrl: e.target.value } : v
                                );
                                setOnboardingVideos(updatedVideos);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="URL do vídeo (YouTube embed)"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => saveVideoChanges(video.id, onboardingVideos.find(v => v.id === video.id)!)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                <Save className="h-4 w-4 inline mr-1" />
                                Salvar
                              </button>
                              <button
                                onClick={() => setEditingVideo(null)}
                                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{video.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{video.description}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Duração: {video.duration}</p>
                            </div>
                            <button
                              onClick={() => setEditingVideo(video.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pop-ups */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pop-ups do Sistema</h3>
                  <div className="space-y-4">
                    {popupContents.map((popup) => (
                      <div key={popup.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        {editingPopup === popup.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              defaultValue={popup.title}
                              onChange={(e) => {
                                const updatedPopups = popupContents.map(p =>
                                  p.id === popup.id ? { ...p, title: e.target.value } : p
                                );
                                setPopupContents(updatedPopups);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Título do pop-up"
                            />
                            <input
                              type="text"
                              defaultValue={popup.subtitle}
                              onChange={(e) => {
                                const updatedPopups = popupContents.map(p =>
                                  p.id === popup.id ? { ...p, subtitle: e.target.value } : p
                                );
                                setPopupContents(updatedPopups);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Subtítulo do pop-up"
                            />
                            <textarea
                              defaultValue={popup.description}
                              onChange={(e) => {
                                const updatedPopups = popupContents.map(p =>
                                  p.id === popup.id ? { ...p, description: e.target.value } : p
                                );
                                setPopupContents(updatedPopups);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              rows={3}
                              placeholder="Descrição do pop-up"
                            />
                            <input
                              type="text"
                              defaultValue={popup.buttonText}
                              onChange={(e) => {
                                const updatedPopups = popupContents.map(p =>
                                  p.id === popup.id ? { ...p, buttonText: e.target.value } : p
                                );
                                setPopupContents(updatedPopups);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              placeholder="Texto do botão"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => savePopupChanges(popup.id, popupContents.find(p => p.id === popup.id)!)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                <Save className="h-4 w-4 inline mr-1" />
                                Salvar
                              </button>
                              <button
                                onClick={() => setEditingPopup(null)}
                                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{popup.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{popup.subtitle}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tipo: {popup.type}</p>
                            </div>
                            <button
                              onClick={() => setEditingPopup(popup.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs placeholder */}
            {(activeTab === 'bonuses' || activeTab === 'settings' || activeTab === 'analytics') && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {activeTab === 'bonuses' && 'Gerenciamento de Bônus'}
                  {activeTab === 'settings' && 'Configurações do Sistema'}
                  {activeTab === 'analytics' && 'Analytics e Relatórios'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Esta seção está em desenvolvimento e será implementada em breve.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}