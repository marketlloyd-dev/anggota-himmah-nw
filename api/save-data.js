import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const newData = req.body;
    if (!newData || Object.keys(newData).length === 0) {
      return res.status(400).json({ error: 'Data kosong' });
    }

    // 1. Ambil data existing dari Blob
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
      console.warn('Gagal fetch data existing, buat baru');
    }

    // 2. Gabungkan data baru ke data existing
    const mergedData = { ...existingData, ...newData };

    // 3. Simpan kembali ke Blob
    await put('data.json', JSON.stringify(mergedData), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error di save-data:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}