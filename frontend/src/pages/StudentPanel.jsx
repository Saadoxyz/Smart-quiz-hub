import { useState, useEffect, useCallback } from 'react';
import { BookOpen, LogOut, Trophy, RefreshCw, AlertCircle, Clock, Target, Play, CheckCircle, Award, TrendingUp, Calendar } from 'lucide-react';
import { questionAPI, scoreAPI } from '../utils/api';

export default function StudentPanel({ user, scores: initialScores, onSaveScore, onLogout }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentScore, setCurrentScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userScores, setUserScores] = useState([]);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [activeTab, setActiveTab] = useState('quiz');

  const fetchUserScores = useCallback(async () => {
    try {
      console.log('Fetching scores for user:', user.id);
      const scoresData = await scoreAPI.getUserScores(user.id);
      console.log('Received scores data:', scoresData);
      
      const formattedScores = scoresData.map(score => ({
        score: score.score,
        total: score.totalQuestions,
        date: new Date(score.attemptDate).toLocaleDateString(),
        time: new Date(score.attemptDate).toLocaleTimeString(),
        percentage: Math.round((score.score / score.totalQuestions) * 100)
      }));
      
      setUserScores(formattedScores);
      console.log('Formatted scores:', formattedScores);
    } catch (error) {
      console.error('Error fetching user scores:', error);
    }
  }, [user.id]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      const questionsData = await questionAPI.getAll();
      setQuestions(questionsData);
      if (questionsData.length === 0) {
        setError('No questions available. Please contact your administrator.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions from database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchUserScores();
  }, [fetchUserScores]);

  // Update userScores when initialScores changes (from parent component)
  useEffect(() => {
    if (initialScores && initialScores.length > 0) {
      setUserScores(initialScores);
    }
  }, [initialScores]);

  useEffect(() => {
    let interval;
    if (quizStartTime && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - quizStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStartTime, showResults]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });

    if (!quizStartTime) {
      setQuizStartTime(Date.now());
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length < questions.length) {
      if (!window.confirm("You haven't answered all questions. Submit anyway?")) return;
    }

    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score++;
    });

    setCurrentScore(score);
    setShowResults(true);

    try {
      // Save score to backend and update parent state
      await onSaveScore(score, questions.length);
      
      // Update local userScores immediately for better UX
      const newScore = {
        score: score,
        total: questions.length,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        percentage: Math.round((score / questions.length) * 100)
      };
      
      setUserScores(prevScores => [...prevScores, newScore]);
      
      // Refresh scores from backend to ensure consistency
      setTimeout(() => {
        fetchUserScores();
      }, 1000);
      
    } catch (error) {
      console.error('Error saving score:', error);
      // Still show results even if save failed
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentScore(null);
    setShowResults(false);
    setQuizStartTime(null);
    setTimeElapsed(0);
    setError('');
    setActiveTab('quiz');
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = (percentage) => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🥇';
    if (percentage >= 70) return '🥈';
    if (percentage >= 60) return '🥉';
    return '📚';
  };

  const bestScore = userScores.length > 0
    ? Math.max(...userScores.map(s => s.percentage))
    : 0;

  const averageScore = userScores.length > 0
    ? Math.round(userScores.reduce((acc, s) => acc + s.percentage, 0) / userScores.length)
    : 0;

  const tabs = [
    { id: 'quiz', label: 'Take Quiz', icon: Play },
    { id: 'results', label: 'My Results', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Learning Dashboard</h1>
                <p className="text-gray-600 text-sm">Your Personal Assessment Hub</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {quizStartTime && !showResults && (
                <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-mono font-semibold shadow-lg">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeElapsed)}</span>
                </div>
              )}
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user.name || user.username}</div>
                <div className="text-xs text-gray-500">Student Portal</div>
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
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-xl shadow-lg animate-slideIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-3" />
                {error}
              </div>
              <button
                onClick={fetchQuestions}
                className="flex items-center text-red-600 hover:text-red-800 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded-lg transition-colors duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">{bestScore}%</div>
            </div>
            <div className="text-blue-100 font-medium">Best Score</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">{averageScore}%</div>
            </div>
            <div className="text-green-100 font-medium">Average Score</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 opacity-80" />
              <div className="text-3xl font-bold">{userScores.length}</div>
            </div>
            <div className="text-purple-100 font-medium">Attempts</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        {!showResults && (
          <div className="flex space-x-2 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content Based on State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl mb-6 shadow-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <div className="text-xl text-gray-700 font-semibold mb-2">Loading Assessment</div>
            <div className="text-gray-500">Preparing your personalized quiz experience...</div>
          </div>
        ) : showResults ? (
          // Results View
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <div className="text-8xl mb-6">
                {getScoreEmoji(Math.round((currentScore / questions.length) * 100))}
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Assessment Complete!</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {currentScore}/{questions.length}
                  </div>
                  <div className="text-blue-700 font-medium">Final Score</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(Math.round((currentScore / questions.length) * 100))}`}>
                    {Math.round((currentScore / questions.length) * 100)}%
                  </div>
                  <div className="text-green-700 font-medium">Percentage</div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">
                    {formatTime(timeElapsed)}
                  </div>
                  <div className="text-yellow-700 font-medium">Duration</div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetQuiz}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Take Another Quiz
                </button>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setActiveTab('analytics');
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'quiz' ? (
          // Quiz View
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <Target className="w-8 h-8 mr-3 text-blue-500" />
                Assessment Questions
              </h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">
                  {questions.length} Questions
                </div>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold">
                  Progress: {Object.keys(answers).length}/{questions.length}
                </div>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <div className="text-xl text-gray-500 mb-2">No questions available</div>
                <p className="text-gray-400">Please contact your administrator</p>
              </div>
            ) : (
              <div className="space-y-8">
                {questions.map((q, index) => (
                  <div key={q.id} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-200 transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold mr-3">
                          {index + 1}
                        </span>
                        {q.question}
                      </h3>
                      {answers[q.id] && (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['A', 'B', 'C', 'D'].map(option => {
                        const optionValue = q[`option${option}`];
                        const isSelected = answers[q.id] === optionValue;
                        
                        return (
                          <label 
                            key={option} 
                            className={`group flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                              isSelected 
                                ? 'bg-blue-50 border-blue-300 shadow-lg' 
                                : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={optionValue}
                              checked={isSelected}
                              onChange={() => handleAnswerChange(q.id, optionValue)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                              isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 group-hover:border-gray-400'
                            }`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className="text-gray-800 font-medium">
                              <span className="text-blue-600 font-bold mr-2">{option}.</span>
                              {optionValue}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="text-center pt-8">
                  <button
                    onClick={submitQuiz}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-2xl"
                    disabled={Object.keys(answers).length === 0}
                  >
                    Submit Assessment ({Object.keys(answers).length}/{questions.length} completed)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'results' ? (
          // Results History View
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
              Performance History
            </h2>
            
            {userScores.length === 0 ? (
              <div className="text-center py-16">
                <Award className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <div className="text-xl text-gray-500 mb-2">No attempts yet</div>
                <p className="text-gray-400">Take your first quiz to see results here</p>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Take Your First Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userScores.slice().reverse().map((score, index) => (
                  <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        #{userScores.length - index}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{score.date}</div>
                        <div className="text-sm text-gray-500">{score.time || 'Time not recorded'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(score.percentage)}`}>
                        {score.percentage}%
                      </div>
                      <div className="text-sm text-gray-500">{score.score}/{score.total} correct</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Analytics View
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <TrendingUp className="w-8 h-8 mr-3 text-green-500" />
              Performance Analytics
            </h2>
            
            {userScores.length === 0 ? (
              <div className="text-center py-16">
                <TrendingUp className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <div className="text-xl text-gray-500 mb-2">No data available</div>
                <p className="text-gray-400 mb-6">Complete some quizzes to see your analytics</p>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Your First Quiz
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-4">Overall Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Best Score:</span>
                        <span className="font-bold text-blue-900">{bestScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Average Score:</span>
                        <span className="font-bold text-blue-900">{averageScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Total Attempts:</span>
                        <span className="font-bold text-blue-900">{userScores.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Improvement:</span>
                        <span className="font-bold text-blue-900">
                          {userScores.length >= 2 
                            ? `${userScores[userScores.length - 1].percentage - userScores[0].percentage >= 0 ? '+' : ''}${userScores[userScores.length - 1].percentage - userScores[0].percentage}%`
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <h3 className="font-bold text-green-900 mb-4">Recent Progress</h3>
                    <div className="space-y-2">
                      {userScores.slice(-3).reverse().map((score, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-green-700 text-sm">{score.date}</span>
                          <span className={`font-semibold ${getScoreColor(score.percentage)}`}>
                            {score.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <h3 className="font-bold text-purple-900 mb-4">Performance Breakdown</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Excellent (90-100%)', count: userScores.filter(s => s.percentage >= 90).length, color: 'bg-green-500' },
                        { label: 'Good (80-89%)', count: userScores.filter(s => s.percentage >= 80 && s.percentage < 90).length, color: 'bg-blue-500' },
                        { label: 'Average (70-79%)', count: userScores.filter(s => s.percentage >= 70 && s.percentage < 80).length, color: 'bg-yellow-500' },
                        { label: 'Below Average (<70%)', count: userScores.filter(s => s.percentage < 70).length, color: 'bg-red-500' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                            <span className="text-purple-700 text-sm">{item.label}</span>
                          </div>
                          <span className="font-bold text-purple-900">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                    <h3 className="font-bold text-orange-900 mb-4">Study Insights</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-orange-700">
                          {averageScore >= 80 
                            ? "Excellent work! You're consistently performing well."
                            : averageScore >= 60 
                            ? "Good progress! Focus on areas where you scored lower."
                            : "Keep practicing! Review the material and try again."
                          }
                        </span>
                      </div>
                      {userScores.length >= 3 && (
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-orange-700">
                            {userScores.slice(-3).every((score, i, arr) => i === 0 || score.percentage >= arr[i-1].percentage)
                              ? "Great trend! Your scores are improving consistently."
                              : "Mixed results. Try reviewing topics from lower-scoring attempts."
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}