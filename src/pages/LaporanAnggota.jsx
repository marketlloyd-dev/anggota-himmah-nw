import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default function LaporanAnggota() {
  const { currentAnggota, laporanList, saveLaporan } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ judul: '', deskripsi: '', tanggal: '' });
  const [sukses, setSukses] = useState(false);

  if (!currentAnggota) { navigate('/', { replace: true }); return null; }

  const handleSubmit = (e) => { e.preventDefault(); if (!form.judul || !form.deskripsi) return; saveLaporan({ id: Date.now(), ...form, nim: currentAnggota.nim, nama: currentAnggota.nama, divisi: currentAnggota.divisi, status: 'pending', timestamp: new Date().toISOString() }); setSukses(true); setForm({ judul: '', deskripsi: '', tanggal: '' }); setTimeout(() => setSukses(false), 3000); };
  const laporanSaya = laporanList.filter(l => l.nim === currentAnggota.nim);
  const getStatusBadge = (s) => s === 'approved' ? 'bg-green-500/20 text-green-300' : s === 'rejected' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300';

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div><h1 className="text-2xl sm:text-3xl font-playfair font-bold text-white">Laporan Kegiatan</h1><p className="text-green-300 mt-1">Kirim laporan untuk review</p></div>
          <button onClick={() => navigate('/dashboard')} className="text-green-300 hover:text-white text-sm">← Dashboard</button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><FileIcon /> Kirim Laporan</h3>
          {sukses && <p className="text-green-400 text-sm bg-green-500/10 p-3 rounded-lg mb-4">Laporan berhasil dikirim! Menunggu review.</p>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Judul Laporan" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" required />
            <textarea placeholder="Deskripsi Lengkap" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows="4" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white resize-none" required />
            <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
            <button type="submit" className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium flex items-center gap-2"><SendIcon /> Kirim Laporan</button>
          </form>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4">Riwayat Laporan ({laporanSaya.length})</h3>
          {laporanSaya.length === 0 ? <p className="text-green-300/60 text-sm">Belum ada laporan.</p> : (
            <div className="space-y-2">
              {laporanSaya.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(l => (
                <div key={l.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2"><h4 className="text-white font-medium">{l.judul}</h4><span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(l.status)}`}>{l.status === 'approved' ? 'Disetujui' : l.status === 'rejected' ? 'Ditolak' : 'Pending'}</span></div>
                  <p className="text-green-100/80 text-sm">{l.deskripsi}</p>
                  <div className="flex items-center gap-4 text-green-400/50 text-xs mt-2">{l.tanggal && <span className="flex items-center gap-1"><ClockIcon /> {l.tanggal}</span>}<span className="flex items-center gap-1"><ClockIcon /> {new Date(l.timestamp).toLocaleString('id-ID')}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}