// src/context/AppContext.jsx (Portal Anggota) – tanpa localStorage untuk presensi
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

  // Muat semua data dari Blob saat mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${DATA_BLOB_URL}?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          // Bangun daftar anggota dari divisi + pengurus
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
          // Tambahkan pengurus inti jika belum ada
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

      // Muat sesi anggota yang tersimpan
      const savedLogin = localStorage.getItem('himmah_current_anggota');
      if (savedLogin) setCurrentAnggota(JSON.parse(savedLogin));

      setDataLoaded(true);
    };
    loadData();
  }, []);

  // Login / Logout
  const anggotaLogin = (anggota) => {
    setCurrentAnggota(anggota);
    localStorage.setItem('himmah_current_anggota', JSON.stringify(anggota));
  };
  const anggotaLogout = () => {
    setCurrentAnggota(null);
    localStorage.removeItem('himmah_current_anggota');
  };

  // Edit profil anggota (disimpan ke Blob)
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
      await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allAnggota: updated }),
      });
    } catch (err) {
      console.error('Gagal menyimpan profil:', err);
    }
  };

  // ========== INI FUNGSI PENTING: savePresensi murni ke Blob ==========
  const savePresensi = async (presensiBaru) => {
    // 1. Ambil data terbaru dari Blob
    let currentData = {};
    try {
      const res = await fetch(`${DATA_BLOB_URL}?t=${Date.now()}`);
      if (res.ok) currentData = await res.json();
    } catch (err) {
      console.warn('Gagal fetch data terbaru:', err);
    }

    // 2. Gabungkan presensi baru dengan yang sudah ada
    const presensiLama = currentData.presensiList || [];
    const updatedPresensi = [presensiBaru, ...presensiLama].slice(0, 500);

    // 3. Gabungkan kembali ke seluruh data
    const mergedData = { ...currentData, presensiList: updatedPresensi };

    // 4. Simpan ke Blob melalui API (pastikan API mengembalikan response)
    const response = await fetch('/api/save-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mergedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Gagal menyimpan presensi ke server');
    }

    // 5. Update state lokal
    setPresensiList(updatedPresensi);
  };

  // Fungsi‑fungsi lain (pengumuman, kalender, dokumen, forum, laporan)
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