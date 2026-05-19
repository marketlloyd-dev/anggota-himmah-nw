import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const DATA_BLOB_URL = 'https://trwurgahpjquoqvn.public.blob.vercel-storage.com/data.json';
  const [anggotaList, setAnggotaList] = useState([]);
  const [currentAnggota, setCurrentAnggota] = useState(null);
  const [beritaInternal, setBeritaInternal] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${DATA_BLOB_URL}?t=${Date.now()}`);
        if (res.ok) {
          const json = await res.json();
          setAnggotaList(json.anggotaList || []);
          setBeritaInternal(json.beritaInternal || []);
        }
      } catch (err) {
        console.warn('Gagal memuat data dari Blob:', err);
      }
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

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#004d24]">
        <p className="text-white text-lg">Memuat data...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ anggotaList, currentAnggota, anggotaLogin, anggotaLogout, beritaInternal }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);