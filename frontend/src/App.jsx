import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import StudentPanel from './pages/StudentPanel';
import EnhancedLoading from './pages/Loading';
import { authAPI, userAPI, scoreAPI } from './utils/api';

export default function App() {
  const [currentView, setCurrentView] = useState('loading');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Initial app load - fetch users and show loading
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing application...');
        setLoading(true);
        setError('');
        
        // Simulate minimum loading time for better UX
        const startTime = Date.now();
        const minLoadTime = 2000; // 2 seconds minimum
        
        // Fetch initial data
        const usersData = await userAPI.getAll();
        console.log('✅ Users loaded:', usersData.length);
        setUsers(usersData);
        
        // Ensure minimum loading time
        const elapsed = Date.now() - startTime;
        if (elapsed < minLoadTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsed));
        }
        
        setInitialLoadComplete(true);
        setCurrentView('home');
        console.log('✅ App initialization complete');
        
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        setError(`Failed to connect to server: ${error.message}`);
        setCurrentView('error');
      } finally {
        setLoading(false);
      }
    };

    if (!initialLoadComplete) {
      initializeApp();
    }
  }, [initialLoadComplete]);

  // Fetch all scores for admin view
  const fetchAllScores = async () => {
    try {
      console.log('📊 Fetching all scores...');
      const allScores = await scoreAPI.getAllScores();
      const scoresGrouped = {};
      
      allScores.forEach(score => {
        const userId = score.user.id;
        if (!scoresGrouped[userId]) {
          scoresGrouped[userId] = [];
        }
        scoresGrouped[userId].push({
          score: score.score,
          total: score.totalQuestions,
          date: new Date(score.attemptDate).toLocaleDateString(),
          time: new Date(score.attemptDate).toLocaleTimeString(),
          percentage: Math.round((score.score / score.totalQuestions) * 100)
        });
      });
      
      setScores(scoresGrouped);
      console.log('✅ Scores loaded for', Object.keys(scoresGrouped).length, 'users');
    } catch (error) {
      console.error('❌ Error fetching scores:', error);
    }
  };

  // Fetch scores when user is admin or when user changes
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchAllScores();
    }
  }, [user]);

  const handleLogin = async (loginForm, expectedRole = null) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔐 Attempting login for:', loginForm.username);
      
      const response = await authAPI.login(loginForm);
      console.log('🔐 Login response:', response);
      
      if (response.success && response.user) {
        const loggedInUser = response.user;
        
        // Check if the user role matches the expected login type
        if (expectedRole && loggedInUser.role !== expectedRole) {
          console.log('❌ Role mismatch. Expected:', expectedRole, 'Got:', loggedInUser.role);
          return { 
            success: false, 
            message: `This is ${expectedRole.toLowerCase()} login. Please use the correct portal.` 
          };
        }
        
        console.log('✅ Login successful for user:', loggedInUser.username, 'Role:', loggedInUser.role);
        setUser(loggedInUser);
        setCurrentView(loggedInUser.role === 'ADMIN' ? 'admin' : 'student');
        return { success: true };
      } else {
        console.log('❌ Login failed:', response.message);
        return { 
          success: false, 
          message: response.message || 'Invalid username or password' 
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Better error handling - distinguish between server errors and auth errors
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          return { 
            success: false, 
            message: 'Invalid username or password' 
          };
        } else {
          return { 
            success: false, 
            message: `Server error: ${error.response.status}` 
          };
        }
      } else if (error.request) {
        // Request was made but no response received
        return { 
          success: false, 
          message: 'Unable to connect to server. Please check your connection.' 
        };
      } else {
        // Something else happened
        return { 
          success: false, 
          message: 'An unexpected error occurred. Please try again.' 
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('👋 User logged out');
    setUser(null);
    setCurrentView('home');
    setScores({});
    setError('');
  };

  const saveScore = async (score, totalQuestions) => {
    try {
      console.log('💾 Saving score:', score, '/', totalQuestions, 'for user:', user.id);
      
      const scoreData = {
        userId: user.id,
        score: score,
        totalQuestions: totalQuestions
      };

      const savedScore = await scoreAPI.save(scoreData);
      console.log('✅ Score saved successfully:', savedScore);
      
      // Update local scores state for immediate UI update
      const newScore = {
        score: score,
        total: totalQuestions,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        percentage: Math.round((score / totalQuestions) * 100)
      };

      // Update scores for the current user
      setScores(prev => {
        const updated = { ...prev };
        if (!updated[user.id]) {
          updated[user.id] = [];
        }
        updated[user.id] = [...updated[user.id], newScore];
        return updated;
      });

      // If admin is logged in, refresh all scores
      if (user.role === 'ADMIN') {
        setTimeout(() => fetchAllScores(), 500); // Small delay to ensure DB is updated
      }

      return savedScore;

    } catch (error) {
      console.error('❌ Error saving score:', error);
      throw new Error('Failed to save score. Please try again.');
    }
  };

  // Show loading screen during initial app load
  if (currentView === 'loading' || (!initialLoadComplete && loading)) {
    return <EnhancedLoading />;
  }

  // Show error screen
  if (currentView === 'error' || (error && !initialLoadComplete)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <div className="text-4xl text-white">⚠️</div>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Connection Error</h2>
          <div className="text-red-600 text-lg mb-6">{error}</div>
          <div className="text-sm text-red-500 mb-6">
            Please ensure:
            <ul className="list-disc list-inside mt-2 text-left">
              <li>Your Spring Boot server is running on port 8080</li>
              <li>XAMPP MySQL is running</li>
              <li>Database connection is configured correctly</li>
            </ul>
          </div>
          <button 
            onClick={() => {
              setError('');
              setInitialLoadComplete(false);
              setCurrentView('loading');
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Main render logic
  if (currentView === 'home') {
    return <Home onNavigate={setCurrentView} />;
  }
  
  if (currentView === 'login-admin' || currentView === 'login-student') {
    const expectedRole = currentView === 'login-admin' ? 'ADMIN' : 'STUDENT';
    return (
      <Login 
        type={currentView === 'login-admin' ? 'admin' : 'student'}
        onLogin={(loginForm) => handleLogin(loginForm, expectedRole)}
        onNavigate={setCurrentView}
        loading={loading}
      />
    );
  }
  
  if (currentView === 'admin' && user?.role === 'ADMIN') {
    return (
      <AdminPanel 
        user={user}
        users={users}
        scores={scores}
        onLogout={handleLogout}
        onRefreshData={fetchAllScores}
      />
    );
  }
  
  if (currentView === 'student' && user?.role === 'STUDENT') {
    return (
      <StudentPanel 
        user={user}
        scores={scores[user.id] || []} // Pass only current user's scores
        onSaveScore={saveScore}
        onLogout={handleLogout}
      />
    );
  }
  
  // Fallback to home if no valid state
  console.log('⚠️ Fallback to home view. Current state:', { currentView, user: user?.role });
  return <Home onNavigate={setCurrentView} />;
}