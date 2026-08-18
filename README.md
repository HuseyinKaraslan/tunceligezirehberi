# 🗺️ Tunceli Gezi Rehberi

Tunceli Gezi Rehberi, Tunceli'nin tarihi, doğal ve turistik noktalarını kullanıcıların kolayca keşfedebilmesini sağlayan web tabanlı bir gezi rehberi uygulamasıdır.

Proje, **Munzur Üniversitesi Bilgisayar Mühendisliği** bölümü kapsamında geliştirilen bir bitirme projesidir. Uygulama içerisinde Tunceli'deki çeşitli gezi noktaları kategorilere ayrılarak kullanıcıların ilgilendikleri mekanlara kolayca ulaşabilmeleri amaçlanmıştır.

Kullanıcılar mekanları inceleyebilir, puanlayabilir ve deneyimlerini yorum olarak paylaşabilir.

---

## ✨ Özellikler

* 📍 Tunceli'deki turistik ve gezilecek yerleri listeleme
* 🗂️ Gezi noktalarını kategorilere göre görüntüleme
* ⭐ Mekanlara puan verme
* 💬 Mekanlar hakkında yorum yapabilme
* 👥 Kullanıcı etkileşimi
* 📊 Kullanıcı puanlarının ve yorumlarının saklanması
* 🔥 Firebase NoSQL veritabanı entegrasyonu
* 📱 Farklı ekran boyutlarına uyumlu kullanıcı arayüzü
* 🖼️ Gezi noktalarına ait görsel ve açıklamaların görüntülenmesi

---

## 🛠️ Kullanılan Teknolojiler

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend / Database

* Firebase
* Firebase NoSQL / Cloud Firestore

### Diğer

* Responsive Web Design
* Git / GitHub
* UI/UX Design

---

## 🏗️ Proje Yapısı

Projenin temel çalışma mantığı aşağıdaki yapı üzerine kurulmuştur:

```text
Kullanıcı
   │
   ▼
Web Arayüzü
   │
   ├── Kategoriler
   │      └── Gezi Noktaları
   │
   ├── Mekan Detayları
   │      ├── Görseller
   │      ├── Açıklama
   │      ├── Puan
   │      └── Yorumlar
   │
   └── Kullanıcı Etkileşimi
          ├── Puan Verme
          └── Yorum Yapma
                 │
                 ▼
          Firebase NoSQL
```

---

## 📂 Temel Sayfalar

Projede kullanıcı deneyimini kolaylaştırmak amacıyla farklı işlevlere sahip sayfalar bulunmaktadır.

| Sayfa              | Açıklama                                           |
| ------------------ | -------------------------------------------------- |
| 🏠 Ana Sayfa       | Tunceli ve proje hakkında genel bilgiler           |
| 🗺️ Gezi Noktaları | Tunceli'deki gezilecek yerlerin listesi            |
| 🗂️ Kategoriler    | Gezi noktalarının kategorilere ayrılmış hali       |
| 📄 Mekan Detayı    | Seçilen mekan hakkında detaylı bilgiler            |
| ⭐ Puanlama         | Kullanıcıların mekanlara puan vermesi              |
| 💬 Yorumlar        | Kullanıcı yorumlarının görüntülenmesi ve eklenmesi |

---

## 🔥 Firebase Entegrasyonu

Uygulamada kullanıcıların oluşturduğu verilerin saklanması için **Firebase NoSQL** altyapısından yararlanılmıştır.

Firebase üzerinde temel olarak aşağıdaki veriler tutulmaktadır:

```text
Gezi Noktaları
├── Mekan Adı
├── Açıklama
├── Kategori
├── Konum
├── Görsel
├── Puan
└── Yorumlar
```

Bu yapı sayesinde kullanıcıların gerçekleştirdiği puanlama ve yorum işlemleri dinamik olarak sisteme aktarılabilmektedir.

---

## 🎯 Projenin Amacı

Projenin temel amacı, Tunceli'nin sahip olduğu doğal güzellikleri, tarihi alanları ve turistik noktaları **tek bir platform üzerinden erişilebilir hale getirmektir**.

Geleneksel gezi araştırmalarında farklı platformlardan bilgi toplamak yerine, kullanıcıların Tunceli'deki gezilecek yerleri kategoriler üzerinden inceleyebilmesi ve diğer kullanıcıların deneyimlerinden faydalanabilmesi hedeflenmiştir.

Aynı zamanda proje kapsamında modern web teknolojileri, veritabanı yönetimi ve kullanıcı etkileşimi konularında uygulamalı deneyim kazanılması amaçlanmıştır.

---

https://tunceligezirehberi.vercel.app

## 🧑‍💻 Geliştirici

**Hüseyin Can Karaslan**

🎓 Munzur Üniversitesi — Bilgisayar Mühendisliği

💻 İlgi Alanları:

* Web Programlama
* Veritabanı Yönetim Sistemleri
* Yazılım Geliştirme
* UI/UX
* Mobil ve Web Uygulamaları




© 2026 Hüseyin Can Karaslan — Tunceli Gezi Rehberi
