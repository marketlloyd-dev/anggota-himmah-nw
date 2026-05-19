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

          // 1. Ambil pengurus inti (Ketua, Sekretaris, Bendahara)
          const pengurusData = json.pengurus || { ketua: { nama: '' }, sekretaris: { nama: '' }, bendahara: { nama: '' } };
          setPengurus(pengurusData);

          // 2. Ambil semua anggota dari divisi
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

          // 3. Tambahkan pengurus inti ke daftar anggota (jika belum ada)
          if (pengurusData.ketua?.nama && pengurusData.ketua.nama.trim() !== '') {
            const sudahAda = anggotaDariDivisi.find(a => a.nama === pengurusData.ketua.nama);
            if (!sudahAda) {
              anggotaDariDivisi.push({
                nama: pengurusData.ketua.nama,
                divisi: 'Ketua Umum',
                jabatan: 'Ketua Umum',
                foto: pengurusData.ketua.foto || '',
                password: '1234',
                jurusan: '',
                angkatan: '',
              });
            }
          }
          if (pengurusData.sekretaris?.nama && pengurusData.sekretaris.nama.trim() !== '') {
            const sudahAda = anggotaDariDivisi.find(a => a.nama === pengurusData.sekretaris.nama);
            if (!sudahAda) {
              anggotaDariDivisi.push({
                nama: pengurusData.sekretaris.nama,
                divisi: 'Sekretaris',
                jabatan: 'Sekretaris',
                foto: pengurusData.sekretaris.foto || '',
                password: '1234',
                jurusan: '',
                angkatan: '',
              });
            }
          }
          if (pengurusData.bendahara?.nama && pengurusData.bendahara.nama.trim() !== '') {
            const sudahAda = anggotaDariDivisi.find(a => a.nama === pengurusData.bendahara.nama);
            if (!sudahAda) {
              anggotaDariDivisi.push({
                nama: pengurusData.bendahara.nama,
                divisi: 'Bendahara',
                jabatan: 'Bendahara',
                foto: pengurusData.bendahara.foto || '',
                password: '1234',
                jurusan: '',
                angkatan: '',
              });
            }
          }

          setAllAnggota(anggotaDariDivisi);
          setBeritaInternal(json.beritaInternal || []);
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
        setCurrentAnggota(JSON.parse(savedLogin));
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
  };

  const editProfil = async (data) => {
    const updated = allAnggota.map(a => {
      if (a.nama === data.nama) {
        return { ...a, jurusan: data.jurusan, angkatan: data.angkatan, foto: data.foto, password: data.password || a.password };
      }
      return a;
    });
    setAllAnggota(updated);
    if (currentAnggota && currentAnggota.nama === data.nama) {
      const updatedCurrent = { ...currentAnggota, jurusan: data.jurusan, angkatan: data.angkatan, foto: data.foto, password: data.password || currentAnggota.password };
      setCurrentAnggota(updatedCurrent);
      localStorage.setItem('himmah_current_anggota', JSON.stringify(updatedCurrent));
    }
    setProfilEditSukses(true);
    setTimeout(() => setProfilEditSukses(false), 3000);
    try {
      await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allAnggota: updated }),
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
    } catch (err) { console.warn('Gagal fetch data terbaru:', err); }
    const presensiLama = currentData.presensiList || [];
    const updatedPresensi = [presensiBaru, ...presensiLama].slice(0, 500);
    setPresensiList(updatedPresensi);
    localStorage.setItem('himmah_presensi', JSON.stringify(updatedPresensi));
    const updatedData = { ...currentData, presensiList: updatedPresensi };
    try {
      await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
    } catch (err) { console.error('Gagal menyimpan presensi ke Blob:', err); }
  };

  const savePengumuman = (p) => { const u = [p, ...pengumumanList]; setPengumumanList(u); localStorage.setItem('himmah_pengumuman', JSON.stringify(u)); };
  const deletePengumuman = (id) => { const u = pengumumanList.filter(p => p.id !== id); setPengumumanList(u); localStorage.setItem('himmah_pengumuman', JSON.stringify(u)); };
  const rsvpEvent = (id, nama) => { const u = kalenderKegiatan.map(k => k.id === id ? { ...k, rsvpList: [...(k.rsvpList || []), nama] } : k); setKalenderKegiatan(u); localStorage.setItem('himmah_kalender', JSON.stringify(u)); };
  const saveDokumen = (d) => { const u = [d, ...dokumenList]; setDokumenList(u); localStorage.setItem('himmah_dokumen', JSON.stringify(u)); };
  const deleteDokumen = (id) => { const u = dokumenList.filter(d => d.id !== id); setDokumenList(u); localStorage.setItem('himmah_dokumen', JSON.stringify(u)); };
  const saveForumMessage = (msg) => { const u = [...forumMessages, msg]; setForumMessages(u); localStorage.setItem('himmah_forum', JSON.stringify(u)); };
  const saveLaporan = (l) => { const u = [l, ...laporanList]; setLaporanList(u); localStorage.setItem('himmah_laporan', JSON.stringify(u)); };

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