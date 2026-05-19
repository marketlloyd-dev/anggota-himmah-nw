import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default function ForumAnggota() {
  const { currentAnggota, forumMessages, saveForumMessage } = useApp();
  const navigate = useNavigate();
  const [pesan, setPesan] = useState('');
  const [selectedDivisi, setSelectedDivisi] = useState('umum');

  if (!currentAnggota) { navigate('/', { replace: true }); return null; }

  const handleKirim = (e) => {
    e.preventDefault();
    if (!pesan.trim()) return;
    saveForumMessage({ id: Date.now(), nim: currentAnggota.nim, nama: currentAnggota.nama, divisi: currentAnggota.divisi, pesan: pesan.trim(), targetDivisi: selectedDivisi, timestamp: new Date().toISOString() });
    setPesan('');
  };

  const messages = selectedDivisi === 'umum' ? forumMessages.filter(m => !m.targetDivisi || m.targetDivisi === 'umum') : forumMessages.filter(m => m.targetDivisi === selectedDivisi);

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div><h1 className="text-2xl sm:text-3xl font-playfair font-bold text-white">Forum Diskusi</h1><p className="text-green-300 mt-1">Ruang obrolan anggota</p></div>
          <button onClick={() => navigate('/dashboard')} className="text-green-300 hover:text-white text-sm">← Dashboard</button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="glass rounded-2xl p-4 mb-4 flex flex-wrap gap-2">
          {['umum', 'Divisi Dakwah & Keagamaan', 'Divisi Pendidikan & Pelatihan', 'Divisi Sosial & Kemasyarakatan', 'Divisi Minat & Bakat'].map(div => (
            <button key={div} onClick={() => setSelectedDivisi(div)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${selectedDivisi === div ? 'bg-green-500 text-white' : 'bg-white/10 text-green-300 hover:bg-white/20'}`}>{div === 'umum' ? 'Umum' : div.replace('Divisi ', '')}</button>
          ))}
        </div>
        <div className="glass rounded-2xl p-6 mb-4">
          <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
            {messages.length === 0 ? <p className="text-green-300/60 text-sm text-center py-8">Belum ada pesan.</p> : messages.map(msg => (
              <div key={msg.id} className={`p-3 rounded-xl ${msg.nim === currentAnggota.nim ? 'bg-green-500/10 ml-8' : 'bg-white/5 mr-8'}`}>
                <div className="flex items-center gap-2 mb-1"><UserIcon /><p className="text-white font-medium text-sm">{msg.nama}</p><span className="text-green-400/40 text-xs">{msg.divisi}</span></div>
                <p className="text-green-100/80 text-sm">{msg.pesan}</p>
                <p className="text-green-400/40 text-xs mt-1">{new Date(msg.timestamp).toLocaleTimeString('id-ID')}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleKirim} className="flex gap-2">
            <input type="text" value={pesan} onChange={(e) => setPesan(e.target.value)} placeholder="Tulis pesan..." className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400" />
            <button type="submit" className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl"><SendIcon /></button>
          </form>
        </div>
      </div>
    </div>
  );
}