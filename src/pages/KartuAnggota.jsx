import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

export default function KartuAnggota() {
  const { currentAnggota } = useApp();
  const navigate = useNavigate();
  const kartuRef = useRef(null);

  if (!currentAnggota) { navigate('/', { replace: true }); return null; }

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400; canvas.height = 250;
    ctx.fillStyle = '#004d24'; ctx.fillRect(0, 0, 400, 250);
    ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 3; ctx.strokeRect(10, 10, 380, 230);
    const logo = new Image();
    logo.src = '/img/logo.png';
    logo.onload = () => {
      ctx.drawImage(logo, 30, 30, 60, 60);
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 18px Poppins'; ctx.fillText('HIMMAH NW KOMISARIAT STMIK', 110, 50);
      ctx.font = '12px Poppins'; ctx.fillStyle = '#86efac'; ctx.fillText('Kartu Anggota Digital', 110, 70);
      if (currentAnggota.foto) {
        const foto = new Image(); foto.crossOrigin = 'anonymous'; foto.src = currentAnggota.foto;
        foto.onload = () => { ctx.beginPath(); ctx.arc(330, 90, 40, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(foto, 290, 50, 80, 80); drawInfo(); };
      } else { drawInfo(); }
    };
    const drawInfo = () => {
      ctx.fillStyle = '#ffffff'; ctx.font = '14px Poppins';
      ctx.fillText('Nama: ' + currentAnggota.nama, 30, 120);
      ctx.fillText('NIM: ' + currentAnggota.nim, 30, 145);
      ctx.fillText('Divisi: ' + (currentAnggota.divisi || '-'), 30, 170);
      ctx.fillText('Angkatan: ' + (currentAnggota.angkatan || '-'), 30, 195);
      ctx.fillStyle = '#86efac'; ctx.font = '10px Poppins'; ctx.fillText('Berlaku sejak: ' + new Date().toLocaleDateString('id-ID'), 30, 220);
      const link = document.createElement('a'); link.download = `Kartu_Anggota_${currentAnggota.nim}.png`; link.href = canvas.toDataURL(); link.click();
    };
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div><h1 className="text-2xl sm:text-3xl font-playfair font-bold text-white">Kartu Anggota</h1><p className="text-green-300 mt-1">Identitas resmi</p></div>
          <button onClick={() => navigate('/dashboard')} className="text-green-300 hover:text-white text-sm">← Dashboard</button>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 -mt-8 relative z-10">
        <div ref={kartuRef} className="glass rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-green-500"></div>
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-green-400/50 mb-4">
            <img src={currentAnggota.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentAnggota.nama)}&background=004d24&color=fff&size=150`} alt={currentAnggota.nama} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-white font-bold text-xl">{currentAnggota.nama}</h3>
          <p className="text-green-300 text-sm mt-1">NIM: {currentAnggota.nim}</p>
          <div className="mt-4 space-y-1"><p className="text-green-300/80 text-sm">Jurusan: {currentAnggota.jurusan || '-'}</p><p className="text-green-300/80 text-sm">Angkatan: {currentAnggota.angkatan || '-'}</p><p className="text-green-300/80 text-sm">Divisi: {currentAnggota.divisi || '-'}</p></div>
          <div className="mt-4 pt-4 border-t border-white/10"><p className="text-green-400/50 text-xs">Kartu Anggota Digital</p><p className="text-green-400/50 text-xs">HIMMAH NW Komisariat STMIK</p></div>
        </div>
        <div className="mt-4 flex justify-center">
          <button onClick={handleDownload} className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium flex items-center gap-2"><DownloadIcon /> Download PNG</button>
        </div>
      </div>
    </div>
  );
}