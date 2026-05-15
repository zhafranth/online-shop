import { Article } from "@/types/magazine";

const UNSPLASH = "https://images.unsplash.com";

const img = (id: string, w = 1200) =>
  `${UNSPLASH}/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const ARTICLES: Article[] = [
  {
    slug: "capsule-wardrobe-musim-hujan-jakarta",
    title: "Capsule Wardrobe untuk Musim Hujan Jakarta",
    excerpt:
      "Tujuh potong pakaian yang bisa diolah jadi dua puluh lima padu padan. Cara berpakaian rapi tanpa khawatir cipratan air dan kelembapan.",
    category: "Fashion News",
    categorySlug: "fashion-news",
    cover: img("photo-1490481651871-ab68de25d43d", 1600),
    coverCaption: "Foto: Tania Wijaya · Lokasi: Senopati",
    author: "Andini Prameswari",
    authorBio:
      "Editor mode dengan minat khusus pada streetwear lokal dan slow fashion.",
    date: "12 Mei 2026",
    readTime: 5,
    featured: true,
    body: [
      {
        type: "paragraph",
        text: "Musim hujan Jakarta selalu menjadi ujian terberat bagi lemari pakaian — antara ingin tampil rapi dan realitas trotoar yang basah, kita sering kehilangan kompas mode. Tahun ini kami mencoba pendekatan berbeda: capsule wardrobe yang ringkas, kalem, dan sangat fungsional.",
      },
      {
        type: "paragraph",
        text: "Konsep capsule wardrobe sederhana — investasikan pada beberapa potongan berkualitas yang bisa saling melengkapi. Hasilnya bukan sekadar lemari yang lebih rapi, tetapi pola pikir berpakaian yang lebih tenang.",
      },
      {
        type: "heading",
        text: "Mulai dari Material yang Tepat",
      },
      {
        type: "paragraph",
        text: "Pilih bahan yang cepat kering dan tidak mudah kusut. Twill katun, linen blend, dan teknikal stretch adalah teman terbaik untuk minggu-minggu basah. Hindari sutra murni atau wol tipis pada minggu paling lembap.",
      },
      {
        type: "image",
        src: img("photo-1483985988355-763728e1935b", 1400),
        caption: "Lapisan tipis selalu menjadi pemenang di musim transisi.",
      },
      {
        type: "quote",
        text: "Pakaian terbaik adalah pakaian yang membuat Anda lupa sedang memakainya.",
        attribution: "Yves Saint Laurent",
      },
      {
        type: "heading",
        text: "Tujuh Potong yang Wajib Ada",
      },
      {
        type: "paragraph",
        text: "Blazer netral oversize, kaus putih tebal, kemeja oxford gelap, celana wide-leg, denim selvedge, sepasang loafer kulit, dan trench coat ringan. Tujuh item ini menjadi tulang punggung dari lebih dari dua puluh padu padan.",
      },
      {
        type: "paragraph",
        text: "Kuncinya bukan jumlah, tapi konsistensi palet. Pegang tiga warna saja — hitam, krem, dan satu aksen — maka semua potongan akan berbicara dalam bahasa yang sama.",
      },
    ],
  },
  {
    slug: "cara-padukan-blazer-oversize-cuaca-tropis",
    title: "Cara Padukan Blazer Oversize di Cuaca Tropis",
    excerpt:
      "Tetap tegas dan sejuk. Tiga trik memakai blazer berukuran besar tanpa kepanasan di tengah hari.",
    category: "Tips Mix & Match",
    categorySlug: "tips-mix-match",
    cover: img("photo-1551803091-e20673f15770", 1400),
    author: "Bagas Hidayat",
    authorBio: "Stylist freelance, kontributor tetap Magazine.",
    date: "8 Mei 2026",
    readTime: 4,
    body: [
      {
        type: "paragraph",
        text: "Blazer oversize sering dianggap musuh iklim tropis. Padahal dengan pemilihan bahan yang tepat dan teknik layering yang cermat, potongan ini bisa jadi senjata utama lemari Anda.",
      },
      {
        type: "heading",
        text: "Pilih Linen atau Wol Tropis",
      },
      {
        type: "paragraph",
        text: "Linen lokal kualitas baik atau wol tropis impor adalah dua bahan favorit kami. Keduanya jatuh dengan indah dan membiarkan udara mengalir lewat serat.",
      },
      {
        type: "image",
        src: img("photo-1490481651871-ab68de25d43d", 1400),
        caption: "Linen ber-finish matte memberi tampilan lebih kalem.",
      },
      {
        type: "paragraph",
        text: "Padukan dengan kaus polos berbahan ringan dan celana lipat. Sederhana, tapi sangat efektif untuk situasi semi-formal di siang hari Jakarta.",
      },
    ],
  },
  {
    slug: "materi-kain-wajib-diketahui",
    title: "Materi Kain yang Wajib Diketahui Sebelum Belanja",
    excerpt:
      "Panduan singkat membaca label: katun, linen, viscose, polyester. Mana yang awet, mana yang sebaiknya dilewati.",
    category: "Education",
    categorySlug: "education",
    cover: img("photo-1469334031218-e382a71b716b", 1400),
    author: "Tania Wijaya",
    authorBio: "Peneliti tekstil, alumni Institut Teknologi Bandung.",
    date: "3 Mei 2026",
    readTime: 6,
    body: [
      {
        type: "paragraph",
        text: "Membaca label pakaian seharusnya tidak lebih sulit dari membaca menu kopi. Tapi industri mode senang membuat istilah-istilah yang membingungkan. Mari kita sederhanakan.",
      },
      {
        type: "heading",
        text: "Katun: Raja Sehari-hari",
      },
      {
        type: "paragraph",
        text: "Pilih katun combed 24s atau 30s untuk kaus harian. Lebih halus, lebih awet, dan lebih nyaman saat cuaca panas.",
      },
      {
        type: "heading",
        text: "Linen: Premium yang Berkembang dengan Pemiliknya",
      },
      {
        type: "paragraph",
        text: "Linen butuh perawatan, tapi balasannya sepadan. Setiap kerutan adalah karakter, setiap cucian menambah kelembutan.",
      },
    ],
  },
  {
    slug: "tren-streetwear-lokal-2026",
    title: "Tren Streetwear Lokal 2026: Antara Folklor dan Tech-wear",
    excerpt:
      "Brand-brand lokal mulai mencampur motif tradisional dengan siluet techwear. Inilah para nama yang patut diperhatikan.",
    category: "Fashion News",
    categorySlug: "fashion-news",
    cover: img("photo-1496747611176-843222e1e57c", 1400),
    author: "Reza Mahendra",
    authorBio: "Penulis mode, fokus pada subkultur urban Asia Tenggara.",
    date: "28 April 2026",
    readTime: 7,
    body: [
      {
        type: "paragraph",
        text: "Tahun 2026 menandai gelombang baru streetwear lokal yang lebih percaya diri. Para perancang muda tidak lagi menengok Tokyo atau Seoul sebagai referensi tunggal — mereka melirik ke arsip nusantara.",
      },
      {
        type: "paragraph",
        text: "Hasilnya: jaket dengan siluet teknikal yang dipadu cetakan batik kawung, atau celana kargo yang mengadopsi pola tenun ikat. Hibrida yang terasa sangat hari-ini.",
      },
    ],
  },
  {
    slug: "rahasia-padu-padan-monokrom",
    title: "Rahasia Padu Padan Monokrom Tanpa Terlihat Membosankan",
    excerpt:
      "Monokrom bukan berarti datar. Bermain dengan tekstur, siluet, dan proporsi adalah kuncinya.",
    category: "Tips Mix & Match",
    categorySlug: "tips-mix-match",
    cover: img("photo-1521572163474-6864f9cf17ab", 1400),
    author: "Andini Prameswari",
    authorBio:
      "Editor mode dengan minat khusus pada streetwear lokal dan slow fashion.",
    date: "22 April 2026",
    readTime: 4,
    body: [
      {
        type: "paragraph",
        text: "Monokrom adalah pilihan paling aman sekaligus paling sulit. Aman karena tidak akan salah; sulit karena tidak ada warna untuk dijadikan kambing hitam saat outfit terasa datar.",
      },
      {
        type: "heading",
        text: "Main di Tekstur, Bukan Warna",
      },
      {
        type: "paragraph",
        text: "Padukan wol kasar dengan satin halus. Linen kusut dengan kulit licin. Pertentangan tekstur menghidupkan palet seragam tanpa perlu menambahkan warna kedua.",
      },
    ],
  },
  {
    slug: "sejarah-kemeja-oxford",
    title: "Sejarah Singkat Kemeja Oxford dan Mengapa Ia Tak Pernah Pergi",
    excerpt:
      "Dari lapangan polo Oxford hingga ruang rapat Jakarta. Perjalanan satu potong yang selalu kembali.",
    category: "Education",
    categorySlug: "education",
    cover: img("photo-1485231183945-fffde7cc051e", 1400),
    author: "Tania Wijaya",
    authorBio: "Peneliti tekstil, alumni Institut Teknologi Bandung.",
    date: "15 April 2026",
    readTime: 5,
    body: [
      {
        type: "paragraph",
        text: "Kemeja oxford tidak pernah benar-benar keluar dari panggung mode. Sejak diciptakan untuk pemain polo di Oxford pada akhir abad ke-19, ia terus menemukan jalan kembali ke lemari setiap dekade.",
      },
      {
        type: "paragraph",
        text: "Rahasianya ada pada tenunan basket-weave yang lembut tapi kokoh — cukup formal untuk kantor, cukup santai untuk akhir pekan.",
      },
    ],
  },
  {
    slug: "outerwear-untuk-perjalanan-bisnis",
    title: "Outerwear yang Bisa Dipakai untuk Tiga Iklim Berbeda",
    excerpt:
      "Satu jaket, tiga kota. Bagaimana memilih lapisan luar yang siap menghadapi Jakarta, Singapura, dan Tokyo.",
    category: "Tips Mix & Match",
    categorySlug: "tips-mix-match",
    cover: img("photo-1503342217505-b0a15ec3261c", 1400),
    author: "Bagas Hidayat",
    authorBio: "Stylist freelance, kontributor tetap Magazine.",
    date: "8 April 2026",
    readTime: 5,
    body: [
      {
        type: "paragraph",
        text: "Bepergian antar iklim membutuhkan strategi berpakaian yang berbeda. Idealnya, satu potong outerwear utama bisa menjawab semua kebutuhan tanpa membebani koper.",
      },
      {
        type: "paragraph",
        text: "Trench coat ringan dari bahan tahan air adalah jawaban kami. Cukup tebal untuk Tokyo musim gugur, cukup tipis untuk Singapura ber-AC.",
      },
    ],
  },
  {
    slug: "kolaborasi-thickapparel-perajin-lokal",
    title: "Kolaborasi ThickApparel dengan Perajin Lokal Yogyakarta",
    excerpt:
      "Koleksi kapsul terbatas dengan tenun tradisional. Hasil kerja enam bulan bersama lima keluarga perajin.",
    category: "Fashion News",
    categorySlug: "fashion-news",
    cover: img("photo-1483985988355-763728e1935b", 1400),
    author: "Reza Mahendra",
    authorBio: "Penulis mode, fokus pada subkultur urban Asia Tenggara.",
    date: "2 April 2026",
    readTime: 6,
    body: [
      {
        type: "paragraph",
        text: "Selama enam bulan, tim desain kami tinggal bergantian di Yogyakarta untuk bekerja langsung dengan lima keluarga perajin tenun. Hasilnya adalah koleksi kapsul yang akan dirilis pertengahan tahun ini.",
      },
      {
        type: "paragraph",
        text: "Setiap potong membawa cerita — bukan sekadar motif yang dicetak, tapi tenunan tangan yang membutuhkan tiga sampai lima hari untuk diselesaikan.",
      },
    ],
  },
  {
    slug: "panduan-merawat-pakaian-premium",
    title: "Panduan Merawat Pakaian Premium agar Berumur Panjang",
    excerpt:
      "Cuci dengan benar, simpan dengan benar, perbaiki dengan benar. Tiga prinsip yang akan menyelamatkan koleksi Anda.",
    category: "Education",
    categorySlug: "education",
    cover: img("photo-1525507119028-ed4c629a60a3", 1400),
    author: "Tania Wijaya",
    authorBio: "Peneliti tekstil, alumni Institut Teknologi Bandung.",
    date: "25 Maret 2026",
    readTime: 6,
    body: [
      {
        type: "paragraph",
        text: "Pakaian premium tidak harus mahal untuk dirawat. Tapi cara Anda merawatnya akan menentukan apakah ia bertahan lima tahun atau lima belas tahun.",
      },
      {
        type: "heading",
        text: "Cuci Lebih Sedikit, Angin Lebih Banyak",
      },
      {
        type: "paragraph",
        text: "Sebagian besar pakaian tidak perlu dicuci setelah satu kali pakai. Anginkan di tempat sejuk, dan biarkan serat kain pulih sendiri.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return ARTICLES.slice(0, limit);
  const sameCategory = ARTICLES.filter(
    (a) => a.slug !== slug && a.category === current.category
  );
  const others = ARTICLES.filter(
    (a) => a.slug !== slug && a.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}
