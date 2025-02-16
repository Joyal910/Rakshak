import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({
  navItems,
  currentPage,
  setCurrentPage,
  isOpen,
  setIsOpen,
}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-indigo-700 transform transition-all duration-300 ease-in-out lg:translate-x-0 shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-indigo-600">
          <h1 className="text-white text-2xl font-bold">Disaster Response</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-full hover:bg-indigo-600 text-white transition-colors duration-200"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="py-4 px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isHovered = hoveredItem === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    flex items-center px-4 py-3 cursor-pointer
                    rounded-lg transition-all duration-200
                    transform ${isHovered ? 'scale-102' : 'scale-100'}
                    ${
                      isActive
                        ? 'bg-[#4E44A6] text-white shadow-md'
                        : 'text-gray-200 hover:bg-[#4E44A6] hover:text-white'
                    }
                  `}
                >
                  <Icon
                    size={20}
                    className={`mr-3 flex-shrink-0 transition-transform duration-200 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                    strokeWidth={1.5}
                  />
                  <span className="font-medium truncate">{item.label}</span>
                </div>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Toggle Button for large screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 p-2 rounded-full bg-indigo-700 text-white shadow-lg hover:bg-[#4E44A6] transition-colors duration-200 lg:hidden"
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>
    </>
  );
}