# Pin Atlas

[English](README.md) · [Türkçe](README.tr.md)

[Canlı site](https://zaryob.github.io/pin-atlas/?lang=tr) · [Doğrulama kaydı](docs/VERIFICATION.tr.md) · [Pin bazında karşılaştırma](sources/pin-verification.csv)

Üretici belgelerinden derlenen, İngilizce öncelikli ve Türkçe destekli pin rehberi. Fiziksel pin düzenini, alternatif işlevleri ve bağlantı planlarını aynı çalışma alanında gösterir. Arayüz, çizimler ve uygulama kodu bu proje için hazırlanmıştır. Konsol teması kişisel sitemin ortak temasıdır.

## Kartlar

- Raspberry Pi Pico, Pico W, Pico 2 ve Pico 2 W: model başına 40 fiziksel pin ve 26 GPIO. Pico / Pico W, RP2040; Pico 2 / Pico 2 W, RP2350A işlevlerini kullanır. Kablosuz donanım yalnızca W modellerinde gösterilir.
- Raspberry Pi 40-pin GPIO: B+, A+, Pi 2/3/4/5, Zero ailesi ve 400/500 için ortak fiziksel bağlantılar. Bu profil GPIO, güç ve toprağı içerir; işlemciye özgü alternatif işlevler ayrı model profillerindedir. 26-pin kartlar ve Compute Module dahil değildir.
- Raspberry Pi 4 Model B: J8 üzerinde 40 fiziksel pin; 26 proje GPIO’su ve HAT EEPROM için ayrılmış 2 hat. Alternatif işlevler BCM2711’e aittir; Pi 5 için geçerli olduğu iddia edilmez.
- RP2350A: QFN-60, 30 Bank 0 GPIO.
- RP2350B: QFN-80, 48 Bank 0 GPIO.

Sekiz profil boyunca toplam 380 fiziksel pin kaydı ve 2.011 pin/alternatif işlev kaydı bulunur. RP2350 paketlerinin merkez GND pedi çevre pin sayısına dahil değildir. Çizimler şematiktir; mekanik CAD yerleşimi veya gerçek komponent konumları olarak kullanılmaz.

## Kullanım

Pin seçimi, arayüz filtreleri, metin araması, tablo, aynalama, 180° döndürme, özel etiketler, karta özel bağlantı planları, JSON aktarımı ve bağlantıyla paylaşım desteklenir. Filtreler VEYA mantığıyla çalışır. Haritada ilk iki eşleşen işlev, tabloda tüm eşleşen işlevler görünür.

Her pinin detayında, fiziksel bağlantıyı ve alternatif işlevlerini destekleyen **resmî belge, PDF sayfası ve tablo/şekil numarası** bulunur. `F0…F11` RP2350 işlev seçicilerini, `ALT0…ALT5` BCM2711 seçicilerini belirtir. ADC kaydı bir dijital işlev seçici değildir. `GPIO` seçeneği uygulamanın genel giriş/çıkış planlama etiketidir; ayrıca bir üretici seçici numarası olarak sayılmaz.

Filtreler başlangıçta kapalıdır. Pin detayında ilgili işlevler öne çıkarılır; diğer işlevler ve kaynaklar açılır bölümlerdedir. Planın ayrı sekmesi vardır. Küçük ekranlarda pine dokunmak, kaydetme düğmesi sabit kalan bir detay paneli açar.

Planlar tarayıcıda `pin-atlas:plans:v1` anahtarında saklanır. Paylaşım bağlantısı kaydedilmiş planı URL fragment içinde taşır; açılması ilgili kartın yerel planını günceller. GPIO0/GPIO1 (Pi 4 fiziksel 27/28) HAT EEPROM için ayrıldığı için normal proje planına eklenmez. Uygulama elektriksel tasarım veya firmware doğrulaması yapmaz.

## Yerel çalıştırma

```sh
git clone https://github.com/Zaryob/pin-atlas.git
cd pin-atlas
npm run dev
# http://127.0.0.1:4173
npm run check
```

Uygulamanın çalışması için paket kurulumu veya build gerekmez. Yayımlanacak dosyalar `dist/` içindedir. Fontlar yereldir. Açık/koyu/sistem teması ve TR/EN dil tercihi `zaryob.github.io` ile paylaşılır. İngilizce arayüz `?lang=en`, Türkçe arayüz `?lang=tr` ile doğrudan açılabilir. Dil değiştiğinde açık kart, filtreler ve bağlantı planı korunur.

## Üretici belgelerinden tekrar doğrulama

```sh
python3 -m pip install -r requirements-source-verification.txt
python3 scripts/verify-official-sources.py
```

Bu komut on kilitli kaynağı üreticinin sunucusundan indirir, SHA-256 değerlerini kontrol eder, PDF ve kaynak tablolarını yeniden okur ve yayımlanan veriyle karşılaştırır. Kaynaklar `.cache/primary-sources/` altında tutulur; PDF’ler depoda dağıtılmaz. Bir hash veya pin kaydı değişirse kontrol başarısız olur.

Şekil olarak yayımlanan ve metin hücresi içermeyen fiziksel pinler, `sources/manual-observations.json` içindeki açıkça işaretlenmiş görsel gözlemlerle kontrol edilir. Bu bölüm otomatik OCR veya bağımsız donanım ölçümü olarak sunulmaz. RP2350 Release 8 içindeki IOVDD tablo/şekil tutarsızlığı da aynı kayıtta gerekçelendirilir. Tam yöntem [doğrulama kaydında](docs/VERIFICATION.tr.md).

Kaynak incelemesinden sonra bilinçli bir güncelleme yapmak için:

```sh
python3 scripts/verify-official-sources.py --write
npm run check
```

`--write`, geçerli üretici girdilerinden `dist/data/boards.json`, `evidence.json`, `verification.json` ve pin bazındaki CSV’yi yeniden üretir. Kaynak revizyonunu değiştirmek önce üretici belgesini yeniden incelemeyi, manifest hash’lerini ve ilgili görsel gözlemleri güncellemeyi gerektirir.

## Yeni kart ekleme

STM32 henüz kütüphaneye dahil değildir. Yeni kart eklerken üretici/model/revizyon, fiziksel bağlantılar, alternatif işlevler ve bunların resmî belge konumları birlikte eklenmelidir. Mevcut profillerin üretilmiş JSON dosyasını tek başına elle değiştirmek kaynak doğrulamasından geçmez; veri üreticisini ve ilgili kaynak kayıtlarını birlikte güncelleyin.

Çizici türleri `pico`, `header`, `qfn` ve `custom` olarak ayrılır. `custom` kartlar yerel bir SVG tuvali ve `pins[].position` koordinatları ile tanımlanabilir. SVG yolu uygulamanın tabanına göre çözülür; `/pin-atlas/` gibi bir alt yol desteklenir. Pin koordinatları bağlantı merkezini, `side` etiket yönünü, `angle` isteğe bağlı dönüşü belirtir.

## GitHub Pages

`main` dalına gönderilen değişiklikler önce üretici belgeleriyle karşılaştırılır, ardından statik dosya kontrolleri çalıştırılır. Yalnızca kontroller başarılıysa `dist/` GitHub Pages’e yayımlanır. İş akışı `.github/workflows/pages.yml` içindedir.

## Lisans

Uygulama GPL-3.0-or-later lisanslıdır. Ortak tema ve IBM Plex Mono için gerçek yazılım/font bildirimleri `THIRD_PARTY_NOTICES.md` içindedir. Donanım doğrulamasında kullanılan üretici belgeleri ise ayrı olarak `sources/manifest.json` ve `docs/VERIFICATION.tr.md` içinde belgelenir.
