import { Routes, Route } from 'react-router-dom';
import LoginAnggota from './pages/LoginAnggota';
import DashboardAnggota from './pages/DashboardAnggota';
import DaftarAnggota from './pages/DaftarAnggota';
import KalenderAnggota from './pages/KalenderAnggota';
import DokumenAnggota from './pages/DokumenAnggota';
import ForumAnggota from './pages/ForumAnggota';
import KartuAnggota from './pages/KartuAnggota';
import PoinAnggota from './pages/PoinAnggota';
import LaporanAnggota from './pages/LaporanAnggota';

export default function App() {
  return (
    <div className="min-h-screen bg-[#004d24] font-poppins flex flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LoginAnggota />} />
          <Route path="/dashboard" element={<DashboardAnggota />} />
          <Route path="/daftar" element={<DaftarAnggota />} />
          <Route path="/kalender" element={<KalenderAnggota />} />
          <Route path="/dokumen" element={<DokumenAnggota />} />
          <Route path="/forum" element={<ForumAnggota />} />
          <Route path="/kartu" element={<KartuAnggota />} />
          <Route path="/poin" element={<PoinAnggota />} />
          <Route path="/laporan" element={<LaporanAnggota />} />
        </Routes>
      </main>
    </div>
  );
}