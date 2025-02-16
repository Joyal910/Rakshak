import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Home,
  Eye,
  EyeOff,
  HeartPulse,
  X,
  Menu
} from "lucide-react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";

const HeaderLogo = () => (
  <div className="relative">
    <Shield className="h-6 w-6 text-red-500 transition-transform group-hover:rotate-12 duration-300" />
    <Home className="h-3 w-3 text-white absolute top-1.5 left-1.5 group-hover:scale-110 transition-transform duration-300" />
  </div>
);

const RegisterLogo = () => (
  <div className="relative group inline-block">
    <Shield className="h-20 w-20 text-red-500 animate-pulse relative z-10" />
    <div className="absolute inset-0 scale-110">
      <div className="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-10"></div>
      <div className="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-10 delay-300"></div>
      <div className="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-5 delay-500"></div>
    </div>
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
    phoneNumber: "",
    location: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (Object.values(formData).some(value => !value)) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      setError("Name must contain only letters and spaces.");
      setIsLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      setError("Please enter a valid Gmail address.");
      setIsLoading(false);
      return;
    }

    if (!/^[6-9]\d{8,9}$/.test(formData.phoneNumber)) {
      setError("Phone number must start with 6-9 and have 9-10 digits.");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.reEnterPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const userData = {
      ...formData,
      role: "User",
      userStatus: "active",
      created_at: new Date().toISOString()
    };

    try {
      await axios.post("http://localhost:8080/api/users", userData);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <PublicHeader/>
      <div className="container mx-auto px-4 h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white">Join Rakshak</h1>
            <p className="text-lg text-gray-400">India's Premier Disaster Management Portal</p>
          </div>

          <div className="backdrop-blur-xl bg-white/10 p-6 rounded-xl shadow-2xl border border-white/20">
            <div className="flex justify-center mb-6">
              <RegisterLogo />
            </div>

            {error && (
              <div className="mb-4 bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <label className="text-white/80 text-sm font-medium mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/30 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-white/80 text-sm font-medium mb-1 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/30 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="email@gmail.com"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-white/80 text-sm font-medium mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-white placeholder-white/30 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-white/40 hover:text-white/60"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-white/80 text-sm font-medium mb-1 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                    <input
                      name="reEnterPassword"
                      type={showRePassword ? "text" : "password"}
                      value={formData.reEnterPassword}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-white placeholder-white/30 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRePassword(!showRePassword)}
                      className="absolute right-3 top-3 text-white/40 hover:text-white/60"
                    >
                      {showRePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-white/80 text-sm font-medium mb-1 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                    <input
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/30 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-white/80 text-sm font-medium mb-1 block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                      <option value="" className="bg-slate-800">Select location</option>
                      <option value="Changanasserry" className="bg-slate-800">Changanasserry</option>
                      <option value="Chinganavanam" className="bg-slate-800">Chinganavanam</option>
                      <option value="Kumarakom" className="bg-slate-800">Kumarakom</option>
                      <option value="Mundakayam" className="bg-slate-800">Mundakayam</option>
                      <option value="Kanjirappally" className="bg-slate-800">Kanjirappally</option>
                      <option value="Karukachal" className="bg-slate-800">Karukachal</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg py-3 flex items-center justify-center space-x-2 hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Join Emergency Response Team</span>
                    <HeartPulse className="h-5 w-5 animate-pulse" />
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-white/60">
                  Already have an account?{' '}
                  <Link to="/login" className="text-red-400 hover:text-red-300">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;