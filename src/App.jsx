import { Routes, Route } from 'react-router-dom';
import LoginAnggota from './pages/LoginAnggota';
import DashboardAnggota from './pages/DashboardAnggota';

export default function App() {
  return (
    <div className="min-h-screen bg-[#004d24] font-poppins flex flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LoginAnggota />} />
          <Route path="/dashboard" element={<DashboardAnggota />} />
        </Routes>
      </main>
    </div>
  );
}