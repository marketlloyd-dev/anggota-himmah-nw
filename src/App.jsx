import { Routes, Route } from 'react-router-dom';
import LoginAnggota from './pages/LoginAnggota';
import DashboardAnggota from './pages/DashboardAnggota';
import DaftarAnggota from './pages/DaftarAnggota';

export default function App() {
  return (
    <div className="min-h-screen bg-[#004d24] font-poppins flex flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LoginAnggota />} />
          <Route path="/dashboard" element={<DashboardAnggota />} />
          <Route path="/daftar" element={<DaftarAnggota />} />
        </Routes>
      </main>
    </div>
  );
}