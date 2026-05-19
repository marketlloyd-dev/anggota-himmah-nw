import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9z"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 9 18 9z"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
);

const MedalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
);

export default function PoinAnggota() {
  const { currentAnggota, presensiList, anggotaList } = useApp();
  const navigate = useNavigate();

  if (!currentAnggota) { navigate('/', { replace: true }); return null; }

  const poinSaya = presensiList.filter(p => p.nim === currentAnggota.nim).length;
  const leaderboard = anggotaList.map(a => ({ ...a, poin: presensiList.filter(p => p.nim === a.nim).length })).sort((a, b) => b.poin - a.poin).slice(0, 10);
  const myRank = leaderboard.findIndex(a => a.nim === currentAnggota.nim) + 1;
  const getMedali = (rank) => { if (rank === 1) return '🥇'; if (rank === 2) return '🥈'; if (rank === 3) return '🥉'; return `#${rank}`; };

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div><h1 className="text-2xl sm:text-3xl font-playfair font-bold text-white">Sistem Poin</h1><p className="text-green-300 mt-1">Poin & Leaderboard</p></div>
          <button onClick={() => navigate('/dashboard')} className="text-green-300 hover:text-white text-sm">← Dashboard</button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="glass rounded-2xl p-6 mb-6 text-center">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center justify-center gap-2"><StarIcon /> Poin Saya</h2>
          <p className="text-6xl font-bold text-yellow-400">{poinSaya}</p>
          <p className="text-green-300/70 text-sm mt-2">poin dari presensi</p>
          {myRank > 0 && <p className="text-green-400/60 text-sm mt-1">Peringkat #{myRank} dari {anggotaList.length} anggota</p>}
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><TrophyIcon /> Leaderboard Top 10</h2>
          {leaderboard.length === 0 ? <p className="text-green-300/60 text-sm">Belum ada data.</p> : (
            <div className="space-y-2">
              {leaderboard.map((a, i) => (
                <div key={a.nim} className={`flex items-center justify-between p-3 rounded-xl ${a.nim === currentAnggota.nim ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'}`}>
                  <div className="flex items-center gap-3"><span className="text-xl">{getMedali(i + 1)}</span><div><p className="text-white font-medium text-sm">{a.nama}</p><p className="text-green-400/40 text-xs">{a.divisi || '-'}</p></div></div>
                  <div className="flex items-center gap-2"><MedalIcon /><span className="text-yellow-400 font-bold">{a.poin} poin</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}