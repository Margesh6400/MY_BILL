import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookUp , BookDown, UserSearch, Package, ReceiptText } from 'lucide-react';

function Navbar({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: "/", label: "Home", icon: <Home />, hoverColor: "hover:bg-blue-300 hover:text-blue-700" },
    { to: "/udharchallan", label: "ઉધાર ચલણ",icon: <BookUp />, hoverColor: "hover:bg-red-300 hover:text-red-700" },
    { to: "/jamachallan", label: "જમા ચલણ", icon: <BookDown />, hoverColor: "hover:bg-green-300 hover:text-green-700" },
    { to: "/khatawahi", label: "ખાતાવહી", icon: <UserSearch />, hoverColor: "hover:bg-blue-300 hover:text-blue-700" },
    { to: "/rojmel", label: "રોજમેલ(સ્ટોક)", icon:<Package/>, hoverColor: "hover:bg-purple-300 hover:text-purple-700" },
    { to: "/bills", label: "બિલ", icon: <ReceiptText />, hoverColor: "hover:bg-teal-300 hover:text-teal-700" }
    // 
  ];

  const handleToggle = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={handleToggle}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
        >
          {isExpanded ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={handleToggle}
        />
      )}

      {/* Navbar */}
      <nav
        className={`
          ${isMobile ? 'fixed' : 'sticky top-0'}
          bg-white shadow-lg z-40 h-screen
          transition-all duration-300 ease-in-out
          ${isMobile ? (isExpanded ? 'translate-x-0' : '-translate-x-full') : ''}
          ${!isMobile && (isExpanded ? 'w-64' : 'w-16')}
        `}
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
      >
        <ul className="flex flex-col h-full pt-16 md:pt-4">
          {navItems.map((item, index) => (
            <li key={index} className="w-full px-2">
              <Link
                to={item.to}
                onClick={handleLinkClick}
                className={`
                  flex items-center
                  ${isExpanded ? 'justify-start px-4' : 'justify-center'}
                  py-3
                  ${item.hoverColor}
                  transition-all duration-300 ease-in-out
                  rounded-lg md:rounded-l-full
                  my-1
                  ${isActive(item.to) ? 'bg-gray-100 font-semibold' : ''}
                  ${isActive(item.to) ? item.hoverColor.split(' ')[1] : ''}
                `}
              >
                <span className={`text-xl mr-3 transition-transform duration-300 ${isActive(item.to) ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span
                  className={`
                    whitespace-nowrap
                    overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-w-full opacity-100' : 'max-w-0 opacity-0'}
                  `}
                >
                  {item.label}
                </span>
                {!isExpanded && !isMobile && isActive(item.to) && (
                  <div className="absolute left-14 bg-white px-3 py-1 rounded-md shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.label}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isMobile && isExpanded ? 'opacity-50' : ''}`}>
        {children}
      </main>
    </div>
  );
}

export default Navbar;