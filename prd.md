# Tunceli Gezi Rehberi Web Sitesi - Ürün Gereksinim Belgesi (PRD)

## 1. Proje Özeti

Tunceli ilinde gezilecek yerler, yemek-içecek mekanları ve vakit geçirilebilecek alanları listeleyen ve kullanıcıların bu yerler hakkında yorum yapabileceği interaktif bir web sitesi.

## 2. Proje Hedefleri

- Tunceli ilinin turistik, tarihi, dini ve doğal güzelliklerini tanıtmak
- Yerel işletmeleri (restoran, kafe, çay bahçesi vb.) desteklemek
- Kullanıcıların deneyimlerini paylaşmasına olanak sağlamak
- Tunceli'yi ziyaret etmek isteyenlere rehberlik etmek

## 3. Kullanıcı Hikayeleri

### 3.1. Ziyaretçi Kullanıcı
- Tunceli'de gezilecek yerleri görmek ister
- Belirli bir kategoriye göre (tarihi, dini, doğal vb.) filtreleme yapmak ister
- Bir yer hakkında detaylı bilgi almak ister
- Diğer ziyaretçilerin yorumlarını okumak ister

### 3.2. Yorumcu Kullanıcı
- Ziyaret ettiği bir yer hakkında yorum yazmak ister
- Fotoğraf eklemek ister
- Yıldız puanı vermek ister
- Diğer kullanıcıların yorumlarını beğenmek/beğenmemek ister

## 4. Fonksiyonel Gereksinimler

### 4.1. Ana Sayfa
- Hoş geldin mesajı ve proje tanıtımı
- Kategori bazlı hızlı erişim linkleri
- Popüler yerler bölümü
- Son eklenen yorumlar önizlemesi

### 4.2. Yerler Listesi
- **Kategoriler:**
  - Tarihi Mekanlar
  - Dini Mekanlar
  - Doğal Mekanlar
  - Yemek & İçecek İşletmeleri
  

- **Liste Özellikleri:**
  - Kategoriye göre filtreleme
  - Arama özelliği
  - Sıralama seçenekleri (popülerlik, puan, alfabetik)
  - Sayfalama (pagination)
  - Her yer için önizleme kartı (resim, isim, kısa açıklama, ortalama puan)

### 4.3. Yer Detay Sayfası
- Yer hakkında detaylı bilgiler:
  - İsim
  - Kategori
  - Adres ve konum bilgisi
  - Açıklama
  - Fotoğraf galerisi
  - İletişim bilgileri (varsa)
  - Çalışma saatleri (varsa)
  - Harita entegrasyonu (Google Maps/OpenStreetMap)

- Yorumlar bölümü:
  - Tüm yorumların listelenmesi
  - Yorum sıralama (tarih, puan, beğeni)
  - Yorum yazma formu
  - Yorum beğenme/beğenmeme
  

### 4.4. Yorum Sistemi
- **Yorum Formu:**
  - Kullanıcı adı/email (giriş yapmadan da yorum yazılabilir veya kayıt gerekebilir)
  - Yıldız puanı (1-5)
  - Yorum metni
  - Tarih bilgisi (otomatik)

- **Yorum Özellikleri:**
  - Yorum düzenleme (sadece kendi yorumları)
  - Yorum silme (sadece kendi yorumları)
  - Spam/uygunsuz içerik raporlama
  - Yorum moderasyonu (admin onayı)

### 4.5. Kullanıcı Yönetimi (Opsiyonel)
- Kayıt olma
- Giriş yapma
- Profil sayfası
- Kendi yorumlarını görüntüleme/düzenleme

### 4.6. Admin Paneli (Opsiyonel)
- Yer ekleme/düzenleme/silme
- Yorum moderasyonu
- Kullanıcı yönetimi
- İstatistikler

## 5. Teknik Gereksinimler

### 5.1. Frontend
- Responsive tasarım (mobil uyumlu)
- Modern ve kullanıcı dostu arayüz
- Hızlı yükleme süreleri
- SEO optimizasyonu

### 5.2. Backend
- Veritabanı yapısı:
  - Yerler tablosu
  - Kategoriler tablosu
  - Yorumlar tablosu
  - Kullanıcılar tablosu (opsiyonel)
  - Fotoğraflar tablosu

### 5.3. Özellikler
- Harita entegrasyonu
- Fotoğraf yükleme ve depolama
- Arama ve filtreleme
- Yorum sistemi
- Responsive tasarım

## 6. Tasarım Gereksinimleri

- Tunceli'nin doğal güzelliklerini yansıtan renk paleti
- Temiz ve modern arayüz
- Kolay navigasyon
- Mobil öncelikli tasarım
- Erişilebilirlik standartlarına uyum

## 7. İçerik Gereksinimleri

- Tunceli'deki tarihi mekanların listesi ve açıklamaları
- Dini mekanların bilgileri
- Doğal güzelliklerin tanıtımı
- Yemek-içecek işletmelerinin bilgileri
- Vakit geçirilebilecek alanların listesi
- Her yer için en az bir fotoğraf

## 8. Güvenlik Gereksinimleri

- XSS (Cross-Site Scripting) koruması
- SQL Injection koruması
- Spam yorum koruması
- Dosya yükleme güvenliği
- HTTPS kullanımı

## 9. Performans Gereksinimleri

- Sayfa yükleme süresi < 3 saniye
- Mobil uyumluluk
- Görsel optimizasyonu (lazy loading, compression)
- Veritabanı sorgu optimizasyonu

## 10. Yapılanlar



## 11. Yapılacaklar

### Faz 1: Temel Yapı (MVP)
- [ ] Proje planlaması
- [ ] PRD dokümantasyonu
- [ ] Teknik mimari tasarımı
- [ ] Veritabanı şeması tasarımı
- [ ] Frontend geliştirme
- [ ] Backend geliştirme
- [ ] Yorum sistemi entegrasyonu
- [ ] Harita entegrasyonu
- [ ] Test ve hata düzeltmeleri
- [ ] Deployment
- [ ] Proje kurulumu ve teknoloji stack seçimi
- [ ] Veritabanı şeması oluşturma
- [ ] Ana sayfa tasarımı ve geliştirme
- [ ] Yerler listesi sayfası
- [ ] Yer detay sayfası
- [ ] Temel yorum sistemi
- [ ] Responsive tasarım

### Faz 2: Gelişmiş Özellikler
- [ ] Arama ve filtreleme özellikleri
- [ ] Harita entegrasyonu
- [ ] Fotoğraf yükleme sistemi
- [ ] Yorum beğenme/beğenmeme
- [ ] Kullanıcı kayıt/giriş sistemi
- [ ] Admin paneli (temel)

### Faz 3: Optimizasyon ve İyileştirmeler
- [ ] SEO optimizasyonu
- [ ] Performans iyileştirmeleri
- [ ] Güvenlik güncellemeleri
- [ ] İçerik ekleme (Tunceli yerleri)
- [ ] Kullanıcı testleri
- [ ] Hata düzeltmeleri

### Faz 4: Yayınlama
- [ ] Production ortamı hazırlığı
- [ ] Domain ve hosting ayarları
- [ ] SSL sertifikası
- [ ] Final testler
- [ ] Canlıya alma

## 12. Başarı Metrikleri

- Aylık aktif kullanıcı sayısı
- Yorum sayısı
- Ortalama yorum puanı
- Sayfa görüntüleme sayısı
- Kullanıcı geri bildirimleri

## 13. Notlar

- Proje açık kaynak olarak geliştirilebilir
- İçerik toplama için Tunceli Belediyesi veya turizm ofisi ile işbirliği yapılabilir
- Yerel işletmelerle iletişime geçilerek güncel bilgiler alınabilir
- Kullanıcıların ekleyebileceği yerler özelliği gelecekte eklenebilir