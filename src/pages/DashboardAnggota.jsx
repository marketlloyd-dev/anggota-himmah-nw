import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Ikon SVG inline
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const NewspaperIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11a9 9 0 0 1 9 9"></path>
    <path d="M4 4a16 16 0 0 1 16 16"></path>
    <circle cx="5" cy="19" r="1"></circle>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default function DashboardAnggota() {
  const { currentAnggota, anggotaLogout, beritaInternal } = useApp();
  const navigate = useNavigate();

  if (!currentAnggota) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-white">Dashboard Anggota</h1>
            <p className="text-green-300 mt-1">Selamat datang, {currentAnggota.nama}</p>
          </div>
          <button onClick={() => { anggotaLogout(); navigate('/', { replace: true }); }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors text-sm">
            <LogoutIcon /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-green-400/50 mb-4">
              <img src={currentAnggota.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentAnggota.nama)}&background=004d24&color=fff&size=150`}
                alt={currentAnggota.nama} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-white font-bold text-lg">{currentAnggota.nama}</h3>
            <p className="text-green-300/70 text-sm">NIM: {currentAnggota.nim}</p>
            <p className="text-green-300/70 text-sm">{currentAnggota.jurusan || '-'}</p>
            <p className="text-green-300/70 text-sm">Angkatan {currentAnggota.angkatan || '-'}</p>
            {currentAnggota.divisi && (
              <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">{currentAnggota.divisi}</span>
            )}
          </div>

          <div className="lg:col-span-2 glass rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <NewspaperIcon /> Berita Internal
            </h2>
            {beritaInternal.length === 0 ? (
              <p className="text-green-300/60 text-sm">Belum ada berita internal.</p>
            ) : (
              <div className="space-y-4">
                {beritaInternal.map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-medium">{item.judul}</h3>
                    <p className="text-green-300/70 text-xs mt-1 flex items-center gap-1">
                      <CalendarIcon /> {item.tanggal}
                    </p>
                    <p className="text-green-100/80 text-sm mt-2">{item.isi}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}