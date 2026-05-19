import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export default function KalenderAnggota() {
  const { currentAnggota, kalenderKegiatan, rsvpEvent } = useApp();
  const navigate = useNavigate();
  const [selectedBulan, setSelectedBulan] = useState(new Date().getMonth());
  const [selectedTahun, setSelectedTahun] = useState(new Date().getFullYear());

  if (!currentAnggota) {
    navigate('/', { replace: true });
    return null;
  }

  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const kegiatanBulanIni = kalenderKegiatan.filter(k => {
    const tgl = new Date(k.tanggal);
    return tgl.getMonth() === selectedBulan && tgl.getFullYear() === selectedTahun;
  }).sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  const handleRSVP = (kegiatanId) => {
    rsvpEvent(kegiatanId, currentAnggota.nim);
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-white">Kalender Kegiatan</h1>
            <p className="text-green-300 mt-1">Agenda & RSVP Anggota</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-green-300 hover:text-white text-sm">← Dashboard</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="glass rounded-2xl p-4 mb-6 flex items-center justify-between">
          <button onClick={() => { if (selectedBulan === 0) { setSelectedBulan(11); setSelectedTahun(selectedTahun - 1); } else { setSelectedBulan(selectedBulan - 1); } }} className="px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/20">←</button>
          <h2 className="text-white font-bold text-lg">{bulan[selectedBulan]} {selectedTahun}</h2>
          <button onClick={() => { if (selectedBulan === 11) { setSelectedBulan(0); setSelectedTahun(selectedTahun + 1); } else { setSelectedBulan(selectedBulan + 1); } }} className="px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/20">→</button>
        </div>

        {kegiatanBulanIni.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <CalendarIcon />
            <p className="text-green-300/60 mt-3">Belum ada kegiatan bulan ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {kegiatanBulanIni.map(kegiatan => {
              const sudahRSVP = kegiatan.rsvpList?.includes(currentAnggota.nim);
              return (
                <div key={kegiatan.id} className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{kegiatan.judul}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-green-300/70 mt-2">
                        <span className="flex items-center gap-1"><CalendarIcon /> {kegiatan.tanggal}</span>
                        {kegiatan.waktu && <span className="flex items-center gap-1"><ClockIcon /> {kegiatan.waktu}</span>}
                        {kegiatan.lokasi && <span className="flex items-center gap-1"><MapPinIcon /> {kegiatan.lokasi}</span>}
                      </div>
                      {kegiatan.deskripsi && <p className="text-green-100/70 text-sm mt-3">{kegiatan.deskripsi}</p>}
                      <div className="flex items-center gap-4 mt-4">
                        <span className="flex items-center gap-1 text-green-400/60 text-xs"><UsersIcon /> {kegiatan.rsvpList?.length || 0} hadir</span>
                        <button onClick={() => handleRSVP(kegiatan.id)} className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${sudahRSVP ? 'bg-green-500/20 text-green-300' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                          <CheckIcon /> {sudahRSVP ? 'Anda Hadir' : 'RSVP'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}