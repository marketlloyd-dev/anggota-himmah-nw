import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    // Gabungkan dengan data yang sudah ada (opsional, tapi lebih aman)
    const existingRes = await fetch('https://trwurgahpjquoqvn.public.blob.vercel-storage.com/data.json');
    let existingData = {};
    if (existingRes.ok) {
      existingData = await existingRes.json();
    }

    const mergedData = { ...existingData, ...data };

    await put('data.json', JSON.stringify(mergedData), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}