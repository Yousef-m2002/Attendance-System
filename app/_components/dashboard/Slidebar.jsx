"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaBars,
  FaTimes,
  FaBookOpen,
  FaUserMd,
  
  FaSignOutAlt,
  FaChevronRight,
  FaChevronLeft,
  FaUserCircle,
  FaUser ,
  FaUserGraduate 
} from 'react-icons/fa';
import { RiDashboardFill } from 'react-icons/ri';






  const handleLogout = () => {
    localStorage.clear();

  }

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/dashboard/profile', icon: <RiDashboardFill />, label: 'الملف الشخصي' },
    { path: '/dashboard/all-user', icon: <FaUser  />, label: 'المستخدمين' },
    { path: '/dashboard/all-doctors', icon: <FaUserMd />, label: 'الدكاتره' },
    { path: '/dashboard/all-student', icon: <FaUserGraduate  />, label: ' الطلاب' },
    { path: '/dashboard/subjects', icon: <FaBookOpen  />, label: ' المواد' },
   
  ];

  return (
    <div dir='rtl' className="font-sans">
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed right-6 top-6 p-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 z-50"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay (Mobile Only) */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div className="flex flex-row-reverse">
        {/* Modern Sidebar */}
        <aside
          className={`relative h-screen transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-20' : 'w-48'
          } flex-shrink-0 bg-gradient-to-b from-blue-900 to-indigo-900 text-white shadow-2xl ${
            isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header with User Profile */}
            <div className={`p-4 flex ${
              isCollapsed ? 'flex-col items-center py-6' : 'items-center justify-between'
            }`}>
              {!isCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-full">
                    <FaUserCircle className="text-2xl text-white/90" />
                  </div>
                  {/* <div>
                    <h2 className="text-xl font-bold">MedSys Pro</h2>
                    <p className="text-xs text-white/70">الإصدار 2.0</p>
                  </div> */}
                </div>
              )}
              <button
                onClick={toggleCollapse}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-all"
              >
                {isCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-2">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={closeSidebar}
                      className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                        pathname === item.path
                          ? 'bg-white/20 text-white shadow-md'
                          : 'hover:bg-white/10 text-white/90 hover:text-white'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <span className={`${isCollapsed ? '' : 'ml-3'} text-lg`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                      {isCollapsed && (
                        <span className="absolute left-0 ml-14 px-3 py-1 rounded-md bg-white text-indigo-900 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer with Notifications */}
            <div className="p-4 border-t border-white/10">
              
            <button
                onClick={handleLogout}>
                <Link
                    href="/auth/signin"
                    className={`flex items-center p-3 rounded-lg hover:bg-white/10 transition-all duration-200 ${
                      isCollapsed ? 'justify-center' : ''
                    }`}
                    title={isCollapsed ? "تسجيل الخروج" : ""}
                  >
                    
                    <span className={isCollapsed ? '' : 'ml-3'}>
                      <FaSignOutAlt className="text-lg" />
                    </span>
                    {!isCollapsed && <span className="font-medium">تسجيل الخروج</span>}
                  </Link>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 min-h-screen">
          {/* Your page content goes here */}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;