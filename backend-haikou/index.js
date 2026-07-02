const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Link database MongoDB kamu
const MONGO_URI = 'mongodb+srv://mario:mario12310@cluster0.vyatvbz.mongodb.net/?appName=Cluster0';

// Menghubungkan server ke Database Cloud MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Sukses terhubung ke Database Cloud MongoDB Atlas!'))
  .catch(err => console.error('Gagal konek ke database:', err));

// Membuat struktur penyimpanan ulasan
const ulasanSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  komentar: String
});

const Ulasan = mongoose.model('Ulasan', ulasanSchema);

// Jalur 1: Mengambil ulasan dari cloud database
app.get('/api/ulasan', async (req, res) => {
  try {
    const dataUlasan = await Ulasan.find();
    res.json(dataUlasan);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data dari database cloud." });
  }
});

// Jalur 2: Menyimpan ulasan baru ke cloud database
app.post('/api/ulasan', async (req, res) => {
  try {
    const { nama, rating, komentar } = req.body;
    const ulasanBaru = new Ulasan({ name: nama, rating, komentar });
    
    await ulasanBaru.save(); 
    console.log("Data berhasil disimpan ke Cloud Database:", ulasanBaru);
    
    res.status(201).json({ message: "Ulasan berhasil disimpan ke Cloud!", data: ulasanBaru });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengirim ulasan ke database cloud." });
  }
});

app.listen(PORT, () => {
  console.log(`Server Backend jalan di http://localhost:${PORT}`);
});
