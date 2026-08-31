import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar/Sidebar';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen bg-primary text-gray-200 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Area */}
      <main className="flex-1 overflow-y-auto p-4 rounded-l-4xl md:p-6 bg-secondary">
        <Outlet />
      </main>
    </div>
  );
};
