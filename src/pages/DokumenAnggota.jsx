import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || 'd38a3d8176a2d4c0ba339b0f340d1c12';

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);

async function uploadFileToImgBB(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', base64);
      formData.append('name', file.name);
      const response = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) resolve({ url: result.data.url, name: file.name });
      else reject(new Error(result.error?.message || 'Upload gagal'));
    };
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
}

export default function DokumenAnggota() {
  const { currentAnggota, dokumenList, saveDokumen, deleteDokumen } = useApp();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [deskripsi, setDeskripsi] = useState('');
  const fileRef = useRef(null);

  if (!currentAnggota) { navigate('/', { replace: true }); return null; }

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File terlalu besar. Maksimal 10MB.'); return; }
    setUploading(true);
    try {
      const result = await uploadFileToImgBB(file);
      saveDokumen({ id: Date.now(), url: result.url, nama: result.name, deskripsi: deskripsi || file.name, nim: currentAnggota.nim, namaAnggota: currentAnggota.nama, divisi: currentAnggota.divisi, tanggal: new Date().toISOString() });
      setDeskripsi('');
      if (fileRef.current) fileRef.current.value = '';
      alert('Dokumen berhasil diupload!');
    } catch (err) { alert('Gagal upload: ' + err.message); }
    setUploading(false);
  };

  const dokumenSaya = dokumenList.filter(d => d.nim === currentAnggota.nim);

  return (
    <div className="min-h-screen pb-16">
      <div className="bg-gradient-to-br from-[#003d1c] to-[#004d24] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div><h1 className="text-2xl sm:text-3xl font-playfair font-bold text-white">Upload Dokumen</h1><p className="text-green-300 mt-1">Unggah file tugas, laporan, atau dokumen</p></div>
          <button onClick={() => navigate('/dashboard')} className="text-green-300 hover:text-white text-sm">← Dashboard</button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><UploadIcon /> Upload Dokumen Baru</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Deskripsi dokumen (opsional)" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-400" />
            <div className="flex items-center gap-3">
              <input type="file" ref={fileRef} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png" onChange={handleUpload} disabled={uploading} className="text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-500 file:text-white" />
              {uploading && <span className="text-green-300 text-sm">Mengupload...</span>}
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4">Dokumen Saya ({dokumenSaya.length})</h3>
          {dokumenSaya.length === 0 ? <p className="text-green-300/60 text-sm">Belum ada dokumen.</p> : (
            <div className="space-y-2">
              {dokumenSaya.map(dok => (
                <div key={dok.id} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3"><FileIcon /><div><p className="text-white font-medium text-sm">{dok.deskripsi || dok.nama}</p><p className="text-green-400/50 text-xs">{new Date(dok.tanggal).toLocaleDateString('id-ID')}</p></div></div>
                  <div className="flex items-center gap-2">
                    <a href={dok.url} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg" download={dok.nama}><DownloadIcon /></a>
                    <button onClick={() => { if (window.confirm('Hapus?')) deleteDokumen(dok.id); }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><TrashIcon /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}