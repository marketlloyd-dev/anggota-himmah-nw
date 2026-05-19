import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock } from 'lucide-react';
import SEO from '../components/SEO';

export default function LoginAnggota() {
  const { anggotaList, anggotaLogin, currentAnggota } = useApp();
  const navigate = useNavigate();
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Jika sudah login, langsung ke dashboard
  if (currentAnggota) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    const found = anggotaList.find(a => a.nim === nim && a.password === password);
    if (found) {
      anggotaLogin(found);
      navigate('/dashboard', { replace: true });
    } else {
      setError('NIM atau password salah!');
    }
  };

  return (
    <>
      <SEO title="Login Anggota" description="Masuk ke portal anggota HIMMAH NW Komisariat STMIK." />
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#002b13] to-[#004d24]">
        <div className="glass p-8 rounded-2xl w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-playfair font-bold text-white">Portal Anggota</h2>
          <p className="text-green-300/60 text-sm mt-1">HIMMAH NW Komisariat STMIK</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
            <div>
              <label className="text-green-300 text-sm font-medium">NIM</label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                placeholder="Masukkan NIM"
                required
              />
            </div>
            <div>
              <label className="text-green-300 text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                placeholder="Masukkan password"
                required
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </>
  );
}