import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Calendar, Newspaper } from 'lucide-react';
import SEO from '../components/SEO';

export default function DashboardAnggota() {
  const { currentAnggota, anggotaLogout, beritaInternal } = useApp();
  const navigate = useNavigate();

  if (!currentAnggota) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <>
      <SEO title="Dashboard Anggota" description="Dashboard anggota HIMMAH NW Komisariat STMIK." />
      <div className="min-h-screen pb-16">
        <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-white">
                Dashboard Anggota
              </h1>
              <p className="text-green-300 mt-1">Selamat datang, {currentAnggota.nama}</p>
            </div>
            <button
              onClick={() => { anggotaLogout(); navigate('/', { replace: true }); }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profil Anggota */}
            <div className="glass rounded-2xl p-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-green-400/50 mb-4">
                <img
                  src={
                    currentAnggota.foto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      currentAnggota.nama
                    )}&background=004d24&color=fff&size=150`
                  }
                  alt={currentAnggota.nama}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white font-bold text-lg">{currentAnggota.nama}</h3>
              <p className="text-green-300/70 text-sm">NIM: {currentAnggota.nim}</p>
              <p className="text-green-300/70 text-sm">{currentAnggota.jurusan || '-'}</p>
              <p className="text-green-300/70 text-sm">Angkatan {currentAnggota.angkatan || '-'}</p>
              {currentAnggota.divisi && (
                <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                  {currentAnggota.divisi}
                </span>
              )}
            </div>

            {/* Berita Internal */}
            <div className="lg:col-span-2 glass rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Newspaper size={20} className="text-green-400" /> Berita Internal
              </h2>
              {beritaInternal.length === 0 ? (
                <p className="text-green-300/60 text-sm">Belum ada berita internal.</p>
              ) : (
                <div className="space-y-4">
                  {beritaInternal.map((item) => (
                    <div key={item.id} className="bg-white/5 rounded-xl p-4">
                      <h3 className="text-white font-medium">{item.judul}</h3>
                      <p className="text-green-300/70 text-xs mt-1 flex items-center gap-1">
                        <Calendar size={12} /> {item.tanggal}
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
    </>
  );
}