import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

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

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default function DashboardAnggota() {
  const { 
    currentAnggota, 
    anggotaLogout, 
    beritaInternal, 
    presensiList, 
    savePresensi, 
    pengumumanList, 
    editProfil, 
    profilEditSukses 
  } = useApp();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editForm, setEditForm] = useState({
    nama: currentAnggota?.nama || '',
    password: '',
    passwordBaru: '',
    jurusan: currentAnggota?.jurusan || '',
    angkatan: currentAnggota?.angkatan || '',
    divisi: currentAnggota?.divisi || '',
  });
  const [editError, setEditError] = useState('');

  if (!currentAnggota) {
    navigate('/', { replace: true });
    return null;
  }

  const handlePresensi = () => {
    const today = new Date().toISOString().slice(0, 10);
    const sudahPresensi = presensiList.find(
      p => p.nim === currentAnggota.nim && p.tanggal === today
    );
    
    if (sudahPresensi) {
      alert('Anda sudah presensi hari ini!');
      return;
    }
    
    const presensi = {
      id: Date.now(),
      nim: currentAnggota.nim,
      nama: currentAnggota.nama,
      divisi: currentAnggota.divisi,
      tanggal: today,
      waktu: new Date().toLocaleTimeString('id-ID'),
    };
    
    savePresensi(presensi);
    alert('Presensi berhasil! ✅');
  };

  const handleEditProfil = (e) => {
    e.preventDefault();
    
    if (editForm.passwordBaru && !editForm.password) {
      setEditError('Masukkan password lama untuk mengubah password');
      return;
    }
    
    if (editForm.passwordBaru && editForm.password !== currentAnggota.password) {
      setEditError('Password lama salah');
      return;
    }
    
    const updated = {
      ...currentAnggota,
      nama: editForm.nama,
      jurusan: editForm.jurusan,
      angkatan: editForm.angkatan,
      divisi: editForm.divisi,
    };
    
    if (editForm.passwordBaru) {
      updated.password = editForm.passwordBaru;
    }
    
    editProfil(updated);
    
    setEditForm({
      nama: updated.nama,
      password: '',
      passwordBaru: '',
      jurusan: updated.jurusan,
      angkatan: updated.angkatan,
      divisi: updated.divisi,
    });
    setEditError('');
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-white">
              Dashboard Anggota
            </h1>
            <p className="text-green-300 mt-1">Selamat datang, {currentAnggota.nama}</p>
          </div>
          <button
            onClick={() => { 
              anggotaLogout(); 
              navigate('/', { replace: true }); 
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors text-sm"
          >
            <LogoutIcon /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Tab Navigasi */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
              activeTab === 'dashboard' 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-green-300 hover:bg-white/20'
            }`}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('presensi')} 
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
              activeTab === 'presensi' 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-green-300 hover:bg-white/20'
            }`}
          >
            📋 Presensi
          </button>
          <button 
            onClick={() => setActiveTab('edit')} 
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
              activeTab === 'edit' 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-green-300 hover:bg-white/20'
            }`}
          >
            ✏️ Edit Profil
          </button>
        </div>

        {/* Tab Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profil + Tombol Presensi */}
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
              
              <button
                onClick={handlePresensi}
                className="mt-4 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                <CheckIcon /> Presensi Hari Ini
              </button>
              
              <p className="text-green-300/50 text-xs mt-2">
                Total presensi: {presensiList.filter(p => p.nim === currentAnggota.nim).length} kali
              </p>
            </div>

            {/* Pengumuman + Berita Internal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pengumuman */}
              {pengumumanList.length > 0 && (
                <div className="glass rounded-2xl p-6 border-l-4 border-yellow-500">
                  <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                    <BellIcon /> Pengumuman
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {pengumumanList.slice(0, 5).map((p) => (
                      <div key={p.id} className="bg-white/5 rounded-lg p-3">
                        <p className="text-white font-medium text-sm">{p.judul}</p>
                        <p className="text-green-300/70 text-xs mt-1">{p.isi}</p>
                        <p className="text-green-400/40 text-xs mt-1 flex items-center gap-1">
                          <ClockIcon /> {p.tanggal || '-'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Berita Internal */}
              <div className="glass rounded-2xl p-6">
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
        )}

        {/* Tab Presensi */}
        {activeTab === 'presensi' && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">📋 Riwayat Presensi Saya</h2>
            <p className="text-green-300/60 text-sm mb-4">
              Total kehadiran: {presensiList.filter(p => p.nim === currentAnggota.nim).length} kali
            </p>
            
            {presensiList.filter(p => p.nim === currentAnggota.nim).length === 0 ? (
              <p className="text-green-300/60 text-sm">Belum ada riwayat presensi.</p>
            ) : (
              <div className="space-y-2">
                {presensiList
                  .filter(p => p.nim === currentAnggota.nim)
                  .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
                  .map((p) => (
                    <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <p className="text-white text-sm font-medium">{p.tanggal}</p>
                        <p className="text-green-300/70 text-xs flex items-center gap-1">
                          <ClockIcon /> {p.waktu}
                        </p>
                      </div>
                      <span className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded-full">
                        Hadir
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Edit Profil */}
        {activeTab === 'edit' && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <EditIcon /> Edit Profil
            </h2>
            
            {profilEditSukses && (
              <p className="text-green-400 text-sm bg-green-500/10 p-3 rounded-lg mb-4">
                ✅ Profil berhasil diperbarui!
              </p>
            )}
            
            <form onSubmit={handleEditProfil} className="space-y-3 max-w-md">
              <div>
                <label className="text-green-300 text-xs">Nama Lengkap</label>
                <input
                  type="text"
                  value={editForm.nama}
                  onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                  required
                />
              </div>
              <div>
                <label className="text-green-300 text-xs">Jurusan</label>
                <input
                  type="text"
                  value={editForm.jurusan}
                  onChange={(e) => setEditForm({ ...editForm, jurusan: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                />
              </div>
              <div>
                <label className="text-green-300 text-xs">Angkatan</label>
                <input
                  type="text"
                  value={editForm.angkatan}
                  onChange={(e) => setEditForm({ ...editForm, angkatan: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                />
              </div>
              <div>
                <label className="text-green-300 text-xs">Divisi</label>
                <select
                  value={editForm.divisi}
                  onChange={(e) => setEditForm({ ...editForm, divisi: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
                >
                  <option value="" className="bg-gray-800">-- Pilih Divisi --</option>
                  <option value="Ketua Umum" className="bg-gray-800">Ketua Umum</option>
                  <option value="Sekretaris" className="bg-gray-800">Sekretaris</option>
                  <option value="Bendahara" className="bg-gray-800">Bendahara</option>
                  <option value="Divisi Dakwah & Keagamaan" className="bg-gray-800">Divisi Dakwah & Keagamaan</option>
                  <option value="Divisi Pendidikan & Pelatihan" className="bg-gray-800">Divisi Pendidikan & Pelatihan</option>
                  <option value="Divisi Sosial & Kemasyarakatan" className="bg-gray-800">Divisi Sosial & Kemasyarakatan</option>
                  <option value="Divisi Minat & Bakat" className="bg-gray-800">Divisi Minat & Bakat</option>
                </select>
              </div>
              
              <div className="border-t border-white/10 pt-4 mt-4">
                <p className="text-green-300 text-xs mb-2">Ganti Password (opsional)</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-green-300 text-xs">Password Lama</label>
                    <input
                      type="password"
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                      placeholder="Masukkan password lama"
                    />
                  </div>
                  <div>
                    <label className="text-green-300 text-xs">Password Baru</label>
                    <input
                      type="password"
                      value={editForm.passwordBaru}
                      onChange={(e) => setEditForm({ ...editForm, passwordBaru: e.target.value })}
                      className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                      placeholder="Masukkan password baru"
                    />
                  </div>
                </div>
              </div>
              
              {editError && (
                <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{editError}</p>
              )}
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}