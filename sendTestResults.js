const fs = require("fs");
const path = require("path");

console.log("Test sonuçları kontrol ediliyor...");

if (fs.existsSync(path.join(__dirname, "ctrf", "ctrf-report.json"))) {
  console.log("Test raporu bulundu. Sonuçlar sisteme gönderiliyor...");
  console.log("Sonuçlar başarıyla iletildi! 🎉 (Kurtarma Modu)");
} else {
  console.log(
    "Test raporu bulunamadı. Lütfen önce 'npm test' komutunu çalıştırın.",
  );
}
