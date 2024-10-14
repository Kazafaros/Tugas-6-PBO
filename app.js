const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Konfigurasi body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Konfigurasi koneksi MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'peminjaman_buku',
});

// Menghubungkan ke database MySQL
connection.connect((err) => {
  if (err) {
    console.error('Terjadi kesalahan dalam koneksi ke MySQL:', err.stack);
    return;
  }
  console.log('Koneksi MySQL Berhasil dengan id ' + connection.threadId);
});

// Halaman utama untuk menampilkan buku
app.get('/', (req, res) => {
  const query = 'SELECT * FROM buku';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.render('index', { buku: results });
  });
});

// Halaman untuk menambahkan buku baru
app.get('/tambah', (req, res) => {
  res.render('tambah');
});

// Menambahkan buku baru ke database
app.post('/tambah', (req, res) => {
  const { judul, pengarang, penerbit, tahun_terbit, jumlah_buku, kategori } = req.body;
  const query = 'INSERT INTO buku (judul, pengarang, penerbit, tahun_terbit, jumlah_buku, kategori) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [judul, pengarang, penerbit, tahun_terbit, jumlah_buku, kategori], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Halaman untuk mengedit buku
app.get('/edit/:id', (req, res) => {
  const query = 'SELECT * FROM buku WHERE id = ?';
  connection.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('edit', { buku: result[0] });
  });
});

// Update data buku
app.post('/edit/:id', (req, res) => {
  const { judul, pengarang, penerbit, tahun_terbit, jumlah_buku, kategori } = req.body;
  const query = 'UPDATE buku SET judul = ?, pengarang = ?, penerbit = ?, tahun_terbit = ?, jumlah_buku = ?, kategori = ? WHERE id = ?';
  connection.query(query, [judul, pengarang, penerbit, tahun_terbit, jumlah_buku, kategori, req.params.id], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Hapus buku
app.get('/hapus/:id', (req, res) => {
  const query = 'DELETE FROM buku WHERE id = ?';
  connection.query(query, [req.params.id], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Halaman peminjaman buku
app.get('/peminjaman', (req, res) => {
  const query = 'SELECT peminjaman.id, anggota.nama, buku.judul, peminjaman.tanggal_pinjam, peminjaman.tanggal_kembali FROM peminjaman JOIN anggota ON peminjaman.anggota_id = anggota.id JOIN buku ON peminjaman.buku_id = buku.id';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.render('peminjaman', { peminjaman: results });
  });
});

// Server berjalan di port 3000
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
