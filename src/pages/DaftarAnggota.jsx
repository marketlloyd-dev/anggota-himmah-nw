import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

export default function DaftarAnggota() {
  const { anggotaList, saveAnggotaList, inviteCode, pengurus } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    kode: '',
    nama: '',
    password: '',
    instansi: '',
    divisi: '',
  });
  const [error, setError] = useState('');
  const [sukses, setSukses] = useState(false);

  const handleDaftar = (e) => {
    e.preventDefault();
    if (!form.kode || !form.nama || !form.password || !form.instansi || !form.divisi) {
      setError('Semua kolom wajib diisi');
      return;
    }
    if (form.kode !== inviteCode) {
      setError('Kode undangan salah!');
      return;
    }
    // Cek duplikat berdasarkan nama (atau bisa kombinasi nama+instansi)
    if (anggotaList.find(a => a.nama.toLowerCase() === form.nama.toLowerCase() && a.instansi.toLowerCase() === form.instansi.toLowerCase())) {
      setError('Nama dan instansi sudah terdaftar');
      return;
    }

    // Validasi jabatan inti
    const divisiLower = form.divisi.toLowerCase();
    if (divisiLower === 'ketua umum' || divisiLower === 'ketua') {
      if (form.nama.toLowerCase() !== pengurus.ketua?.nama?.toLowerCase()) {
        setError(`Hanya ${pengurus.ketua?.nama || 'Ketua'} yang bisa mendaftar sebagai Ketua Umum.`);
        return;
      }
    } else if (divisiLower === 'sekretaris') {
      if (form.nama.toLowerCase() !== pengurus.sekretaris?.nama?.toLowerCase()) {
        setError(`Hanya ${pengurus.sekretaris?.nama || 'Sekretaris'} yang bisa mendaftar sebagai Sekretaris.`);
        return;
      }
    } else if (divisiLower === 'bendahara') {
      if (form.nama.toLowerCase() !== pengurus.bendahara?.nama?.toLowerCase()) {
        setError(`Hanya ${pengurus.bendahara?.nama || 'Bendahara'} yang bisa mendaftar sebagai Bendahara.`);
        return;
      }
    }

    const newAnggota = {
      nama: form.nama,
      password: form.password,
      instansi: form.instansi,
      divisi: form.divisi,
      foto: '',
    };
    saveAnggotaList([...anggotaList, newAnggota]);
    setSukses(true);
    setError('');
  };

  if (sukses) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#002b13] to-[#004d24]">
        <div className="glass p-8 rounded-2xl w-full max-w-md text-center">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-2xl font-playfair font-bold text-white">Pendaftaran Berhasil!</h2>
          <p className="text-green-300/60 text-sm mt-2">Akun Anda sudah aktif. Silakan login.</p>
          <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors">
            Ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#002b13] to-[#004d24]">
      <div className="glass p-8 rounded-2xl w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <UserPlusIcon />
        </div>
        <h2 className="text-2xl font-playfair font-bold text-white">Daftar Anggota</h2>
        <p className="text-green-300/60 text-sm mt-1">HIMMAH NW Komisariat STMIK</p>
        <form onSubmit={handleDaftar} className="mt-6 space-y-3 text-left">
          <div>
            <label className="text-green-300 text-sm font-medium">Kode Undangan *</label>
            <input
              type="text"
              value={form.kode}
              onChange={(e) => setForm({ ...form, kode: e.target.value })}
              className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
              placeholder="Masukkan kode undangan"
              required
            />
          </div>
          <div>
            <label className="text-green-300 text-sm font-medium">Nama Lengkap *</label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
          <div>
            <label className="text-green-300 text-sm font-medium">Password *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
              placeholder="Buat password"
              required
            />
          </div>
          <div>
            <label className="text-green-300 text-sm font-medium">Instansi (Nama Kampus) *</label>
            <input
              type="text"
              value={form.instansi}
              onChange={(e) => setForm({ ...form, instansi: e.target.value })}
              className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
              placeholder="Masukkan nama kampus"
              required
            />
          </div>
          <div>
            <label className="text-green-300 text-sm font-medium">Divisi *</label>
            <select
              value={form.divisi}
              onChange={(e) => setForm({ ...form, divisi: e.target.value })}
              className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400"
              required
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
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
          >
            Daftar
          </button>
        </form>
        <p className="text-green-300/50 text-xs mt-4">
          Sudah punya akun?{' '}
          <button onClick={() => navigate('/')} className="text-green-300 hover:underline">
            Login di sini
          </button>
        </p>
      </div>
    </div>
  );
}