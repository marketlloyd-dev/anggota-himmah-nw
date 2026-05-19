import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const newData = req.body;
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return res.status(500).json({ error: 'Token Blob tidak ditemukan di server' });
    }

    // 1. Ambil data existing dari Blob
    let existingData = {};
    try {
      const response = await fetch(
        'https://trwurgahpjquoqvn.public.blob.vercel-storage.com/data.json',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        existingData = await response.json();
      }
    } catch (e) {
      console.warn('Gagal fetch data existing, buat baru');
    }

    // 2. Gabungkan
    const mergedData = { ...existingData, ...newData };

    // 3. Simpan
    await put('data.json', JSON.stringify(mergedData), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      token,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving data:', error);
    return res.status(500).json({ error: error.message });
  }
}