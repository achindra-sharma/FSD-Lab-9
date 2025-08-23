import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import AddUser from './components/AddUser';
import UserList from './components/UserList';

const App = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                EduFlow Academy
              </h1>
              <p className="text-slate-700 font-medium text-base">Student Management System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1">
            <AddUser onUserAdded={handleUserAdded} />
          </div>
          <div className="xl:col-span-2">
            <UserList key={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
