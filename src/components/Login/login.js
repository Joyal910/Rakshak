import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  HeartPulse,
  Home,
  Menu,
  X,
  Phone,
  Ambulance
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const HeaderLogo = () => (
  <div className="relative">
    <Shield className="h-8 w-8 text-red-500 transition-transform group-hover:rotate-12 duration-300" />
    <Home className="h-4 w-4 text-white absolute top-2 left-2 group-hover:scale-110 transition-transform duration-300" />
  </div>
);

const PulsingCircle = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-10"></div>
    <div className="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-10 delay-300"></div>
    <div className="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-5 delay-500"></div>
  </div>
);

const LoginLogo = () => (
  <div className="relative group inline-block">
    <Shield className="h-16 w-16 text-red-500 animate-pulse relative z-10" />
    <PulsingCircle />
  </div>
);

const TransitionOverlay = ({ isActive, onComplete }) => {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent transform -skew-x-12 animate-[flash_1.5s_ease-in-out_infinite]"></div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full">
        <div className="relative">
          <div className="h-16 bg-gray-700 w-full absolute bottom-0">
            <div className="h-1 bg-yellow-400 w-full absolute top-1/2 -translate-y-1/2 animate-[dashedLine_1s_linear_infinite]"></div>
          </div>
          <div className="absolute left-0 transform -translate-y-8 animate-[driveRight_2s_ease-in-out_forwards]">
            <div className="relative">
              <Ambulance className="h-16 w-16 text-red-500" />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-[flash_0.5s_ease-in-out_infinite]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-[flash_0.5s_ease-in-out_infinite_0.25s]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublicHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`backdrop-blur-md sticky top-0 z-50 border-b border-white/10 w-full transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/90 shadow-lg' : 'bg-transparent'
    }`}>
      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-pulse"/>
        
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center group">
            <HeaderLogo />
            <div className="ml-2">
              <span className="text-xl font-bold text-white">
                Rakshak
              </span>
              <span className="ml-2 text-sm text-gray-400 hidden sm:inline">
                24/7 Emergency Response
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-red-500">
              <Phone className="h-4 w-4 animate-bounce" />
              <span className="text-sm font-semibold">Emergency: 112</span>
            </div>
            <Link to="/register" className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200 transform hover:scale-105">
              Register
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 bg-slate-900/90">
            <Link to="/" className="block text-white hover:text-red-500 py-2">Home</Link>
            <Link to="/register" className="block text-white hover:text-red-500 py-2">Register</Link>
            <div className="pt-4">
              <div className="flex items-center space-x-2 text-red-500">
                <Phone className="h-4 w-4" />
                <span className="text-sm font-semibold">Emergency: 112</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const existingUserId = sessionStorage.getItem('userId') || Cookies.get('userId');
    const existingUserRole = sessionStorage.getItem('userRole') || Cookies.get('userRole');

    if (existingUserId && existingUserRole) {
      switch (existingUserRole) {
        case 'Admin':
          navigate('/Admin');
          break;
        case 'Volunteer':
          navigate('/volunteer/home');
          break;
        case 'User':
          navigate('/home');
          break;
        default:
          // Clear invalid role data
          sessionStorage.clear();
          Cookies.remove('userId');
          Cookies.remove('userRole');
          break;
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      setIsLoading(false);
      return;
    }

    // Clear existing session data
    sessionStorage.clear();
    Cookies.remove('userId');
    Cookies.remove('userRole');

    const userData = { email, password };

    try {
      const res = await axios.post("http://localhost:8080/api/login", userData);
      if (res.data.success) {
        const { userid: userId, role: userRole, name: userName } = res.data;

        if (userId && userRole) {
          // Set session and cookie data
          sessionStorage.setItem('userId', userId);
          sessionStorage.setItem('userRole', userRole);
          sessionStorage.setItem('userName', userName);
          Cookies.set('userId', userId, { expires: 1, path: '/' });
          Cookies.set('userRole', userRole, { expires: 1, path: '/' });
          Cookies.set('userName', userName, { expires: 1, path: '/' });

          setShowTransition(true);
        } else {
          setError("Invalid user data received from server");
          setIsLoading(false);
        }
      } else {
        setError(res.data.message || "Login Failed");
        setIsLoading(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login Failed");
      setIsLoading(false);
    }
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    const userRole = sessionStorage.getItem('userRole');
    
    switch (userRole) {
      case 'Admin':
        navigate('/Admin');
        break;
      case 'Volunteer':
        navigate('/volunteer/home');
        break;
      case 'User':
        navigate('/home');
        break;
      default:
        setError("Invalid user role");
        break;
    }
  };

  return (
    <>
      <TransitionOverlay 
        isActive={showTransition} 
        onComplete={handleTransitionComplete} 
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <PublicHeader />
        
        <div className="container mx-auto px-4 pt-20 pb-12">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-4xl font-bold text-white">Welcome to Rakshak</h1>
              <p className="text-xl text-gray-400">India's Premier Disaster Management Portal</p>
            </div>

            <div className="w-full max-w-md relative">
              <div className="relative backdrop-blur-xl bg-white/10 p-8 rounded-xl shadow-2xl border border-white/20">
                <div className="flex justify-center mb-6">
                  <LoginLogo />
                </div>

                {error && (
                  <div className="mb-4 bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative group">
                      <label className="text-white/80 text-sm font-medium">Email</label>
                      <div className="mt-1 relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-white/40 group-hover:text-white/60 transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-white/30 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="emergency@response.com"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="text-white/80 text-sm font-medium">Password</label>
                      <div className="mt-1 relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-white/40 group-hover:text-white/60 transition-colors" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-10 text-white placeholder-white/30 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-white/40 hover:text-white/60 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/20 bg-white/10 text-red-500 focus:ring-red-500"
                      />
                      <label className="ml-2 text-white/80">Remember me</label>
                    </div>
                    <Link to="/forgotpassword" className="text-red-400 hover:text-red-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg py-3 flex items-center justify-center space-x-2 hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Access Emergency Portal</span>
                        <HeartPulse className="h-5 w-5 animate-pulse" />
                      </>
                    )}
                  </button>

                  <div className="text-center space-y-2">
                  <p className="text-white/60">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-red-400 hover:text-red-300">
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes driveRight {
          0% {
            transform: translateX(-100%) translateY(-8px);
          }
          100% {
            transform: translateX(100vw) translateY(-8px);
          }
        }
        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
    </>
  );
};

export default Login;