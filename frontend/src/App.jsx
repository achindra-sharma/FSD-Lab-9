import AddUser from './components/AddUser';
import UserList from './components/UserList';

function App() {
  return (
    <div className="bg-slate-100 min-h-screen text-slate-800">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-sky-700">Online Course Management</h1>
          <p className="text-slate-500">User Registration System</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <AddUser />
        </div>
        <div className="md:col-span-2">
            <UserList />
        </div>
      </main>
    </div>
  );
}

export default App;