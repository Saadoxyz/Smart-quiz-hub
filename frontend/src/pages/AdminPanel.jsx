import { useState, useEffect } from 'react';
import { Settings, LogOut, Users, Plus, Trash2, RefreshCw, AlertCircle, BarChart3, BookOpen, Trophy, Clock } from 'lucide-react';
import { questionAPI } from '../utils/api';

export default function AdminPanel({ user, users, scores, onLogout, onRefreshData }) {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '', 
    optionA: '', 
    optionB: '', 
    optionC: '', 
    optionD: '', 
    correctAnswer: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch questions from backend
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      const questionsData = await questionAPI.getAll();
      setQuestions(questionsData || []);
      console.log('Admin - Questions loaded:', questionsData?.length || 0);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Log scores data for debugging
  useEffect(() => {
    console.log('Admin - Scores data:', scores);
    console.log('Admin - Users data:', users);
  }, [scores, users]);

  const showMessage = (message, isError = false) => {
    if (isError) {
      setError(message);
      setSuccessMessage('');
    } else {
      setSuccessMessage(message);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccessMessage('');
    }, 3000);
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    
    if (!Object.values(newQuestion).every(val => val.trim())) {
      showMessage('Please fill in all fields', true);
      return;
    }

    const options = [newQuestion.optionA, newQuestion.optionB, newQuestion.optionC, newQuestion.optionD];
    if (!options.includes(newQuestion.correctAnswer)) {
      showMessage('Correct answer must match exactly one of the options', true);
      return;
    }

    try {
      setLoading(true);
      await questionAPI.create(newQuestion);
      setNewQuestion({
        question: '', 
        optionA: '', 
        optionB: '', 
        optionC: '', 
        optionD: '', 
        correctAnswer: ''
      });
      await fetchQuestions();
      showMessage('Question added successfully!');
    } catch (error) {
      console.error('Error adding question:', error);
      showMessage('Failed to add question. Please try again.', true);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      setLoading(true);
      await questionAPI.delete(id);
      await fetchQuestions();
      showMessage('Question deleted successfully!');
    } catch (error) {
      console.error('Error deleting question:', error);
      showMessage('Failed to delete question. Please try again.', true);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchQuestions(), onRefreshData()]);
      showMessage('Data refreshed successfully!');
    } catch (error) {
      showMessage('Failed to refresh data', true);
    } finally {
      setLoading(false);
    }
  };

  // Safely calculate statistics
  const studentUsers = users ? users.filter(u => u.role === 'STUDENT') : [];
  const totalAttempts = scores ? Object.values(scores).reduce((sum, userScores) => sum + (userScores?.length || 0), 0) : 0;
  
  // Calculate average score more safely
  let avgScore = 0;
  if (totalAttempts > 0) {
    const allScores = Object.values(scores).flat().filter(score => score && typeof score.percentage === 'number');
    if (allScores.length > 0) {
      avgScore = Math.round(allScores.reduce((sum, score) => sum + score.percentage, 0) / allScores.length);
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'questions', label: 'Questions', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm">Management & Analytics Suite</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user?.name || user?.username}</div>
                <div className="text-xs text-gray-500">System Administrator</div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-xl shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-3" />
              {error}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-r-xl shadow-lg">
            <div className="flex items-center">
              <div className="w-5 h-5 mr-3 text-green-500">✓</div>
              {successMessage}
            </div>
          </div>
        )}

        {/* Debug Information */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-6 py-4 rounded-r-xl shadow-lg">
            <div className="text-sm">
              <strong>Debug Info:</strong> 
              {` Students: ${studentUsers.length}, Total Attempts: ${totalAttempts}, Scores Keys: ${Object.keys(scores).length}`}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="w-8 h-8 opacity-80" />
                  <div className="text-3xl font-bold">{questions.length}</div>
                </div>
                <div className="text-blue-100 font-medium">Total Questions</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 opacity-80" />
                  <div className="text-3xl font-bold">{studentUsers.length}</div>
                </div>
                <div className="text-green-100 font-medium">Active Students</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-8 h-8 opacity-80" />
                  <div className="text-3xl font-bold">{totalAttempts}</div>
                </div>
                <div className="text-purple-100 font-medium">Quiz Attempts</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-8 h-8 opacity-80" />
                  <div className="text-3xl font-bold">{avgScore}%</div>
                </div>
                <div className="text-orange-100 font-medium">Average Score</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-blue-500" />
                Recent Student Activity
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {studentUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <div className="text-gray-500">No student activity yet</div>
                  </div>
                ) : (
                  studentUsers.slice(0, 5).map(student => {
                    const studentScores = scores[student.id] || [];
                    const recentScore = studentScores[studentScores.length - 1];
                    
                    return (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {(student.name || student.username).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{student.name || student.username}</div>
                            <div className="text-sm text-gray-500">{studentScores.length} attempts</div>
                          </div>
                        </div>
                        {recentScore ? (
                          <div className="text-right">
                            <div className="font-bold text-lg">{recentScore.percentage}%</div>
                            <div className="text-xs text-gray-500">{recentScore.date}</div>
                          </div>
                        ) : (
                          <div className="text-right">
                            <div className="text-gray-400 text-sm">No attempts</div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Question Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-6 h-6 mr-3 text-green-500" />
                Add New Question
              </h2>
              <form onSubmit={addQuestion} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Question *
                  </label>
                  <textarea
                    placeholder="Enter your question here..."
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                    rows="3"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['A', 'B', 'C', 'D'].map(option => (
                    <div key={option}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Option {option} *
                      </label>
                      <input
                        type="text"
                        placeholder={`Option ${option}`}
                        value={newQuestion[`option${option}`]}
                        onChange={(e) => setNewQuestion({...newQuestion, [`option${option}`]: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                        disabled={loading}
                      />
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Correct Answer *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the correct answer (must match one of the options exactly)"
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Must exactly match one of the options above
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding Question...
                    </div>
                  ) : (
                    'Add Question'
                  )}
                </button>
              </form>
            </div>

            {/* Questions List */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Question Bank</h2>
                <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full font-medium">
                  {questions.length} questions
                </div>
              </div>
              
              {loading && questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
                  <div className="text-gray-600">Loading questions...</div>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <div className="text-gray-500 mb-2">No questions found</div>
                  <p className="text-sm text-gray-400">Add your first question using the form</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto space-y-4">
                  {questions.map((q, index) => (
                    <div key={q.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            {index + 1}. {q.question}
                          </h3>
                          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 mb-3">
                            {['A', 'B', 'C', 'D'].map(option => (
                              <div key={option} className="flex items-center">
                                <span className="font-medium mr-2 text-gray-800">{option}:</span>
                                <span>{q[`option${option}`]}</span>
                              </div>
                            ))}
                          </div>
                          <div className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-lg inline-block">
                            ✓ {q.correctAnswer}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 disabled:opacity-50 flex items-center transform hover:scale-105 shadow-lg"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-blue-500" />
              Student Performance Analytics
            </h2>
            <div className="space-y-6">
              {studentUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <div className="text-gray-500">No students found</div>
                </div>
              ) : (
                studentUsers.map(student => {
                  const studentScores = scores[student.id] || [];
                  const bestScore = studentScores.length > 0 
                    ? Math.max(...studentScores.map(s => s.percentage || 0))
                    : 0;
                  const avgScore = studentScores.length > 0
                    ? Math.round(studentScores.reduce((sum, s) => sum + (s.percentage || 0), 0) / studentScores.length)
                    : 0;
                  
                  return (
                    <div key={student.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {(student.name || student.username).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {student.name || student.username}
                            </h3>
                            <p className="text-gray-500">{studentScores.length} quiz attempts</p>
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{bestScore}%</div>
                            <div className="text-xs text-gray-500">Best Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{avgScore}%</div>
                            <div className="text-xs text-gray-500">Average</div>
                          </div>
                        </div>
                      </div>
                      
                      {studentScores.length > 0 ? (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-700 mb-3">Recent Attempts</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-32 overflow-y-auto">
                            {studentScores.slice(-6).reverse().map((score, index) => (
                              <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">{score.date}</span>
                                  <span className={`font-bold ${
                                    score.percentage >= 80 ? 'text-green-600' :
                                    score.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {score.percentage}%
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {score.score}/{score.total} correct
                                </div>
                                {score.time && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    {score.time}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-gray-500">No quiz attempts yet</div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}