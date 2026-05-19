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
          setPengurus(json.pengurus || { 
            ketua: { nama: '' }, 
            sekretaris: { nama: '' }, 
            bendahara: { nama: '' } 
          });
          setPresensiList(json.presensiList || []);
          setPengumumanList(json.pengumumanList || []);
        }
      } catch (err) {
        console.warn('Gagal memuat data dari Blob:', err);
      }
      
      // Load presensi dan pengumuman dari localStorage
      const savedPresensi = localStorage.getItem('himmah_presensi');
      if (savedPresensi) setPresensiList(JSON.parse(savedPresensi));
      
      const savedPengumuman = localStorage.getItem('himmah_pengumuman');
      if (savedPengumuman) setPengumumanList(JSON.parse(savedPengumuman));
      
      setDataLoaded(true);
    };
    
    const savedLogin = localStorage.getItem('himmah_current_anggota');
    if (savedLogin) setCurrentAnggota(JSON.parse(savedLogin));
    
    loadData();
  }, []);

  const anggotaLogin = (anggota) => {
    setCurrentAnggota(anggota);
    localStorage.setItem('himmah_current_anggota', JSON.stringify(anggota));
  };
  
  const anggotaLogout = () => {
    setCurrentAnggota(null);
    localStorage.removeItem('himmah_current_anggota');
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

  const savePresensi = (data) => {
    const updated = [data, ...presensiList].slice(0, 500);
    setPresensiList(updated);
    localStorage.setItem('himmah_presensi', JSON.stringify(updated));
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

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#004d24]">
        <p className="text-white text-lg">Memuat data...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      anggotaList,
      saveAnggotaList,
      currentAnggota,
      anggotaLogin,
      anggotaLogout,
      beritaInternal,
      inviteCode,
      pengurus,
      presensiList,
      savePresensi,
      pengumumanList,
      savePengumuman,
      deletePengumuman,
      editProfil,
      profilEditSukses
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);