import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const DATA_BLOB_URL = 'https://trwurgahpjquoqvn.public.blob.vercel-storage.com/data.json';

  const [allAnggota, setAllAnggota] = useState([]);
  const [currentAnggota, setCurrentAnggota] = useState(null);
  const [beritaInternal, setBeritaInternal] = useState([]);
  const [pengurus, setPengurus] = useState({ ketua: { nama: '' }, sekretaris: { nama: '' }, bendahara: { nama: '' } });
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
          const anggotaDariDivisi = [];
          if (json.divisi) {
            json.divisi.forEach(div => {
              if (div.anggota) {
                div.anggota.forEach(a => {
                  if (a.nama && a.nama.trim() !== '') {
                    anggotaDariDivisi.push({
                      nama: a.nama,
                      divisi: div.nama,
                      jabatan: a.jabatan || 'Anggota',
                      foto: a.foto || '',
                      password: '1234',
                      jurusan: '',
                      angkatan: '',
                    });
                  }
                });
              }
            });
          }
          const p = json.pengurus || { ketua: {}, sekretaris: {}, bendahara: {} };
          ['ketua', 'sekretaris', 'bendahara'].forEach(jabatan => {
            const nama = p[jabatan]?.nama;
            if (nama && nama.trim() !== '') {
              if (!anggotaDariDivisi.find(a => a.nama === nama)) {
                anggotaDariDivisi.push({
                  nama,
                  divisi: jabatan === 'ketua' ? 'Ketua Umum' : jabatan.charAt(0).toUpperCase() + jabatan.slice(1),
                  jabatan: jabatan.charAt(0).toUpperCase() + jabatan.slice(1),
                  foto: p[jabatan]?.foto || '',
                  password: '1234',
                  jurusan: '',
                  angkatan: '',
                });
              }
            }
          });

          setAllAnggota(anggotaDariDivisi);
          setBeritaInternal(json.beritaInternal || []);
          setPengurus(p);
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
      if (savedLogin) setCurrentAnggota(JSON.parse(savedLogin));

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
  };

  const editProfil = async (data) => {
    const updated = allAnggota.map(a =>
      a.nama === data.nama ? { ...a, jurusan: data.jurusan, angkatan: data.angkatan, foto: data.foto, password: data.password || a.password } : a
    );
    setAllAnggota(updated);
    if (currentAnggota && currentAnggota.nama === data.nama) {
      const updatedCurrent = { ...currentAnggota, jurusan: data.jurusan, angkatan: data.angkatan, foto: data.foto, password: data.password || currentAnggota.password };
      setCurrentAnggota(updatedCurrent);
      localStorage.setItem('himmah_current_anggota', JSON.stringify(updatedCurrent));
    }
    setProfilEditSukses(true);
    setTimeout(() => setProfilEditSukses(false), 3000);
    try {
      let currentData = {};
      const res = await fetch(`${DATA_BLOB_URL}?t=${Date.now()}`);
      if (res.ok) currentData = await res.json();
      const mergedData = { ...currentData, allAnggota: updated };
      await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergedData),
      });
    } catch (err) {
      console.error('Gagal menyimpan profil:', err);
    }
  };

  const savePresensi = async (presensiBaru) => {
    let currentData = {};
    try {
      const res = await fetch(`${DATA_BLOB_URL}?t=${Date.now()}`);
      if (res.ok) currentData = await res.json();
    } catch (err) {
      console.warn('Gagal fetch data terbaru:', err);
    }
    const presensiLama = currentData.presensiList || [];
    const updatedPresensi = [presensiBaru, ...presensiLama].slice(0, 500);
    const mergedData = { ...currentData, presensiList: updatedPresensi };
    const response = await fetch('/api/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mergedData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Gagal menyimpan presensi ke server');
    }
    setPresensiList(updatedPresensi);
  };

  const savePengumuman = (p) => { const u = [p, ...pengumumanList]; setPengumumanList(u); };
  const deletePengumuman = (id) => { const u = pengumumanList.filter(p => p.id !== id); setPengumumanList(u); };
  const rsvpEvent = (id, nama) => { const u = kalenderKegiatan.map(k => k.id === id ? { ...k, rsvpList: [...(k.rsvpList || []), nama] } : k); setKalenderKegiatan(u); };
  const saveDokumen = (d) => { const u = [d, ...dokumenList]; setDokumenList(u); };
  const deleteDokumen = (id) => { const u = dokumenList.filter(d => d.id !== id); setDokumenList(u); };
  const saveForumMessage = (msg) => { const u = [...forumMessages, msg]; setForumMessages(u); };
  const saveLaporan = (l) => { const u = [l, ...laporanList]; setLaporanList(u); };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#004d24]">
        <p className="text-white text-lg">Memuat data...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      allAnggota, currentAnggota, anggotaLogin, anggotaLogout,
      beritaInternal, pengurus,
      presensiList, savePresensi,
      pengumumanList, savePengumuman, deletePengumuman,
      kalenderKegiatan, rsvpEvent,
      dokumenList, saveDokumen, deleteDokumen,
      forumMessages, saveForumMessage,
      laporanList, saveLaporan,
      editProfil, profilEditSukses,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);