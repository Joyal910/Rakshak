import React, { useState, useEffect } from 'react';
import { Shield, Users, Heart, AlertTriangle, ArrowRight, Phone, Menu, X, Map, Clock, Globe, MessageCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const PublicHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-slate-50/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200 w-full">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center group">
            <Shield className="h-8 w-8 text-indigo-600 transition-transform group-hover:scale-110 duration-300" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
              Rakshak
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href="/login" className="px-4 py-2 text-indigo-600 hover:text-indigo-700 transition-colors duration-200">
              Login
            </a>
            <a href="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg">
              Register
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-slate-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 bg-slate-50">
            <a href="/" className="block text-gray-700 hover:text-indigo-600 py-2">Home</a>
            <a href="/about" className="block text-gray-700 hover:text-indigo-600 py-2">About Us</a>
            <a href="/services" className="block text-gray-700 hover:text-indigo-600 py-2">Our Services</a>
            <a href="/impact" className="block text-gray-700 hover:text-indigo-600 py-2">Impact</a>
            <a href="/contact" className="block text-gray-700 hover:text-indigo-600 py-2">Contact</a>
            <div className="pt-4 space-y-4">
              <a href="/login" className="block w-full text-center px-4 py-2 text-indigo-600 hover:text-indigo-700 border border-indigo-600 rounded-md">
                Login
              </a>
              <a href="/register" className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Register
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};



const EmergencyMap = () => {
  const [activePoint, setActivePoint] = useState(null);

  const points = [
    { lat: 9.5916, lng: 76.5222, type: "Medical", color: "red" },
    { lat: 9.5941, lng: 76.5250, type: "Rescue", color: "yellow" },
    { lat: 9.5970, lng: 76.5200, type: "Supply", color: "green" }
  ];

  const createIcon = (color) =>
    L.divIcon({
      className: "relative",
      html: `
        <div style="
          position: relative;
          width: 16px;
          height: 16px;
          background-color: ${color};
          border-radius: 50%;
          box-shadow: 0 0 10px ${color};
          animation: pulse 1.5s infinite;
        ">
          <div style="
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: rgba(${color === 'red' ? '239, 68, 68' :
                             color === 'yellow' ? '234, 179, 8' :
                             '34, 197, 94'}, 0.3);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: pulse-ring 1.5s infinite;
          "></div>
        </div>
      `,
    });

  return (
    <div className="w-full h-[500px] relative rounded-lg overflow-hidden">
      <MapContainer 
        center={[9.5916, 76.5222]} 
        zoom={14} 
        className="w-full h-full"
        style={{ position: 'relative' }} // Changed from absolute to relative
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {points.map((point, index) => (
          <Marker
            key={index}
            position={[point.lat, point.lng]}
            icon={createIcon(point.color)}
            eventHandlers={{
              mouseover: () => setActivePoint(index),
              mouseout: () => setActivePoint(null),
            }}
          >
            <Popup>
              <strong>{point.type} Response Unit</strong> <br />
              Active and responding in the area
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {activePoint !== null && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900">
            {points[activePoint].type} Response Unit
          </h4>
          <p className="text-sm text-gray-600">Active and responding in the area</p>
        </div>
      )}
    </div>
  );
};
  
  const InteractiveStats = () => {
    const [hoveredStat, setHoveredStat] = useState(null);
    
    const stats = [
      { 
        icon: <Clock className="w-6 h-6" />,
        value: "15min",
        label: "Avg. Response Time",
        detail: "Our teams are strategically positioned to respond quickly"
      },
      {
        icon: <Users className="w-6 h-6" />,
        value: "500+",
        label: "Active Volunteers",
        detail: "Trained professionals ready to help 24/7"
      },
      {
        icon: <Globe className="w-6 h-6" />,
        value: "100+",
        label: "Communities",
        detail: "Supporting communities across the region"
      },
      {
        icon: <MessageCircle className="w-6 h-6" />,
        value: "24/7",
        label: "Support Available",
        detail: "Round-the-clock emergency assistance"
      }
    ];
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setHoveredStat(index)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
            
            {hoveredStat === index && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-indigo-600 text-white text-sm rounded-b-xl transition-all duration-300">
                {stat.detail}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  const LandingPage = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    
    const features = [
      {
        icon: <Shield className="w-12 h-12 text-indigo-600" />,
        title: "Rapid Response",
        description: "Swift and coordinated emergency response through our network of trained professionals."
      },
      {
        icon: <Users className="w-12 h-12 text-indigo-600" />,
        title: "Community First",
        description: "Building resilient communities through local support networks and preparedness training."
      },
      {
        icon: <Heart className="w-12 h-12 text-indigo-600" />,
        title: "Volunteer Network",
        description: "Join our dedicated team making real impact in crisis situations."
      }
    ];
  
    useEffect(() => {
      const timer = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }, 5000);
      return () => clearInterval(timer);
    }, []);
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <PublicHeader />
        
        {/* Hero Section */}
        <section className="relative w-full"> {/* Removed overflow-hidden */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-slate-50 opacity-70"></div>
          
          <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                    Protecting Communities
                  </span>
                  <br />
                  <span className="text-gray-900">When It Matters Most</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join Rakshak in building stronger, more resilient communities. We provide immediate assistance and empower volunteers to make a real difference.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/register"
                    className="group inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Join Our Mission
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="/about"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-all duration-300"
                  >
                    Learn More
                  </a>
                </div>
              </div>
             <div className="relative"> {/* Removed h-96 class */}
              <EmergencyMap />
            </div>
          </div>
        </div>
      </section>
  
        {/* Features Section */}
        <section className="py-20 bg-white w-full">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Making a difference through immediate response and community support
              </p>
            </div>
            <InteractiveStats />
          </div>
        </section>
  
        {/* Features Carousel */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50 w-full">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-indigo-600 text-white p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-6">{features[activeFeature].title}</h3>
                  <p className="text-lg text-indigo-100 mb-8">{features[activeFeature].description}</p>
                  <div className="flex space-x-2">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFeature(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === activeFeature ? 'bg-white' : 'bg-indigo-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="p-8 bg-white/10 rounded-full">
                    {features[activeFeature].icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Emergency Call Section */}
        <section className="bg-gradient-to-r from-rose-50 to-rose-100 py-12 w-full">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white rounded-xl shadow-xl border border-rose-200">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-4 bg-rose-100 rounded-full mr-6">
                  <AlertTriangle className="w-8 h-8 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Emergency Helpline</h3>
                  <p className="text-gray-600">24/7 support for immediate assistance</p>
                </div>
              </div>
              <a
                href="tel:+1234567890"
                className="group flex items-center px-8 py-4 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Phone className="w-6 h-6 mr-3" />
                <span className="text-lg font-semibold">Call Now</span>
              </a>
            </div>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 w-full">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-indigo-400" />
                  <span className="ml-2 text-xl font-bold">Rakshak</span>
                </div>
                <p className="text-gray-400">
                  Empowering communities through effective disaster management and relief operations.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                  <li><a href="/register" className="text-gray-400 hover:text-white transition-colors">Join Us</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                <div className="space-y-4">
                  <p className="text-gray-400">Follow us for updates and news</p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Rakshak. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };
  
  export default LandingPage;