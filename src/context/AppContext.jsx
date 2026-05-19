import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const DATA_BLOB_URL = 'https://trwurgahpjquoqvn.public.blob.vercel-storage.com/data.json';
  
  const [anggotaList, setAnggotaList] = useState([]);
  const [currentAnggota, setCurrentAnggota] = useState(null);
  const [beritaInternal, setBeritaInternal] = useState([]);
  const [inviteCode, setInviteCode] = useState('');
  const [pengurus, setPengurus] = useState({ 
    ketua: { nama: '' }, 
    sekretaris: { nama: '' }, 
    bendahara: { nama: '' } 
  });
  const [presensiList, setPresensiList] = useState([]);
  const [pengumumanList, setPengumumanList] = useState([]);
  const [kalenderKegiatan, setKalenderKegiatan] = useState([]);
  const [dokumenList, setDokumenList] = useState([]);
  const [forumMessages, setForumMessages] = useState([]);
  const [laporanList, setLaporanList] = useState([]);
  const [profilEditSukses, setProfilEditSukses] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${DATA_BLOB_URL}?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          setAnggotaList(json.anggotaList || []);
          setBeritaInternal(json.beritaInternal || []);
          setInviteCode(json.inviteCode || 'HIMMAH2024');
          setPengurus(json.pengurus || { ketua: { nama: '' }, sekretaris: { nama: '' }, bendahara: { nama: '' } });
          setPresensiList(json.presensiList || []);
          setPengumumanList(json.pengumumanList || []);
          setKalenderKegiatan(json.kalenderKegiatan || []);
          setDokumenList(json.dokumenList || []);
          setForumMessages(json.forumMessages || []);
          setLaporanList(json.laporanList || []);
        }
      } catch (err) {
        console.warn('Gagal memuat data dari Blob:', err);
      }
      
      const savedLogin = localStorage.getItem('himmah_current_anggota');
      if (savedLogin) {
        const parsed = JSON.parse(savedLogin);
        setCurrentAnggota(parsed);
      }
      
      setDataLoaded(true);
    };
    
    loadData();
  }, []);

  const anggotaLogin = (anggota) => {
    setCurrentAnggota(anggota);
    localStorage.setItem('himmah_current_anggota', JSON.stringify(anggota));
  };
  
  const anggotaLogout = () => {
    setCurrentAnggota(null);
    localStorage.removeItem('himmah_current_anggota');
    // Reset presensi state saat logout
    setPresensiList([]);
  };

  const saveAnggotaList = async (data) => {
    setAnggotaList(data);
    localStorage.setItem('himmah_anggota', JSON.stringify(data));
    try {
      await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anggotaList: data }),
      });
    } catch (err) {
      console.error('Gagal menyimpan ke Blob:', err);
    }
  };

  const editProfil = (data) => {
    const updated = anggotaList.map(a => a.nim === data.nim ? { ...a, ...data } : a);
    setAnggotaList(updated);
    localStorage.setItem('himmah_anggota', JSON.stringify(updated));
    
    if (currentAnggota && currentAnggota.nim === data.nim) {
      setCurrentAnggota({ ...currentAnggota, ...data });
      localStorage.setItem('himmah_current_anggota', JSON.stringify({ ...currentAnggota, ...data }));
    }
    
    setProfilEditSukses(true);
    setTimeout(() => setProfilEditSukses(false), 3000);
  };

const savePresensi = async (presensiBaru) => {
  // 1. Ambil seluruh data dari Blob
  let currentData = {};
  try {
    const res = await fetch(`${DATA_BLOB_URL}?t=${Date.now()}`);
    if (res.ok) {
      currentData = await res.json();
    }
  } catch (err) {
    console.warn('Gagal fetch data terbaru:', err);
  }

  // 2. Gabungkan presensi baru dengan data yang sudah ada
  const presensiLama = currentData.presensiList || [];
  const updatedPresensi = [presensiBaru, ...presensiLama].slice(0, 500);

  // 3. Simpan ke state lokal
  setPresensiList(updatedPresensi);
  localStorage.setItem('himmah_presensi', JSON.stringify(updatedPresensi));

  // 4. Kirim seluruh data (dengan presensi yang sudah diperbarui) ke Blob melalui API
  const updatedData = { ...currentData, presensiList: updatedPresensi };
  
  try {
    await fetch('/api/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData), // kirim semua data, bukan hanya presensi
    });
  } catch (err) {
    console.error('Gagal menyimpan presensi ke Blob:', err);
  }
};

  const savePengumuman = (pengumumanBaru) => {
    const updated = [pengumumanBaru, ...pengumumanList];
    setPengumumanList(updated);
    localStorage.setItem('himmah_pengumuman', JSON.stringify(updated));
  };

  const deletePengumuman = (id) => {
    const updated = pengumumanList.filter(p => p.id !== id);
    setPengumumanList(updated);
    localStorage.setItem('himmah_pengumuman', JSON.stringify(updated));
  };

  const rsvpEvent = (id, nim) => {
    const updated = kalenderKegiatan.map(k => {
      if (k.id === id) return { ...k, rsvpList: [...(k.rsvpList || []), nim] };
      return k;
    });
    setKalenderKegiatan(updated);
    localStorage.setItem('himmah_kalender', JSON.stringify(updated));
  };

  const saveDokumen = (d) => { 
    const updated = [d, ...dokumenList]; 
    setDokumenList(updated); 
    localStorage.setItem('himmah_dokumen', JSON.stringify(updated)); 
  };
  
  const deleteDokumen = (id) => { 
    const updated = dokumenList.filter(d => d.id !== id); 
    setDokumenList(updated); 
    localStorage.setItem('himmah_dokumen', JSON.stringify(updated)); 
  };
  
  const saveForumMessage = (msg) => { 
    const updated = [...forumMessages, msg]; 
    setForumMessages(updated); 
    localStorage.setItem('himmah_forum', JSON.stringify(updated)); 
  };
  
  const saveLaporan = (l) => { 
    const updated = [l, ...laporanList]; 
    setLaporanList(updated); 
    localStorage.setItem('himmah_laporan', JSON.stringify(updated)); 
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#004d24]">
        <p className="text-white text-lg">Memuat data...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      anggotaList, saveAnggotaList,
      currentAnggota, anggotaLogin, anggotaLogout,
      beritaInternal, inviteCode, pengurus,
      presensiList, savePresensi,
      pengumumanList, savePengumuman, deletePengumuman,
      kalenderKegiatan, rsvpEvent,
      dokumenList, saveDokumen, deleteDokumen,
      forumMessages, saveForumMessage,
      laporanList, saveLaporan,
      editProfil, profilEditSukses
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);