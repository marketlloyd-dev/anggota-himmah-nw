// api/save-data.js (Portal Anggota) – versi tangguh tanpa localStorage
import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const newData = req.body;
    if (!newData || typeof newData !== 'object') {
      return res.status(400).json({ error: 'Data tidak valid' });
    }

    // 1. Ambil data terkini dari Blob
    let existingData = {};
    try {
      const existingRes = await fetch(
        'https://trwurgahpjquoqvn.public.blob.vercel-storage.com/data.json',
        { cache: 'no-store' }
      );
      if (existingRes.ok) {
        existingData = await existingRes.json();
      }
    } catch (e) {
      console.warn('Gagal fetch existing data, mulai dari kosong');
    }

    // 2. Gabungkan data baru dengan data yang sudah ada
    const mergedData = { ...existingData, ...newData };

    // 3. Tulis ulang ke Blob
    await put('data.json', JSON.stringify(mergedData), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error di save-data:', error.message || error);
    return res.status(500).json({ error: error.message || 'Kesalahan internal server' });
  }
}