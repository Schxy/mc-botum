const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Botlar aktif! Çift char devrede.'));
app.listen(3000, () => console.log('Web sunucusu calisiyor'));

process.on('uncaughtException', (err) => {
  console.log('Yoksayilan hata:', err.message);
});

const hesaplar = [
  { username: 'AfkKralll', pass: 'Sifre12345' },
  { username: 'AfkKrallll', pass: 'Sifre12345' }
];

function createBot(hesap) {
  let isLogged = false;

  const bot = mineflayer.createBot({ 
    host: 'play.reborncraft.pw', 
    port: 25565, 
    username: hesap.username, 
    version: '1.16.5' 
  });
  
  bot.on('error', (err) => console.log(`[${hesap.username}] HATA:`, err.message));
  bot.on('kicked', (reason) => console.log(`[${hesap.username}] ATILDI:`, JSON.stringify(reason)));
  
  bot.on('spawn', () => {
    if (isLogged) return; 
    isLogged = true;
    
    console.log(`[${hesap.username}] Sunucuya katildi, bekliyor...`);
    
    setTimeout(() => {
      bot.chat('/login ' + hesap.pass);
      console.log(`[${hesap.username}] Sifre yazildi. Skyblock'a geciliyor...`);
      
      setTimeout(() => {
        bot.chat('/skyblock');
        console.log(`[${hesap.username}] /skyblock komutu atildi.`);
        
        setTimeout(() => {
          bot.chat('/tpa Schxy'); 
          console.log(`[${hesap.username}] TPA istegi gonderildi.`);
        }, 10000);
        
      }, 5000);
    }, 3000);
  });

  bot.on('message', (message) => {
    const msg = message.toString();
    const cleanMsg = msg.toLowerCase();
    
    // Yetkili isimleri belirle
    let komutuVeren = '';
    if (msg.includes('Schxy')) komutuVeren = 'Schxy';
    else if (msg.includes('BaI') || msg.includes('Bal')) komutuVeren = 'BaI';
    else if (msg.includes('aForse')) komutuVeren = 'aForse';
    
    // 1. ÖZEL REPLİK: Sadece AfkKralll söyler!
    if (hesap.username === 'AfkKralll') {
      if ((msg.includes('Schxy') || msg.includes('BaI') || msg.includes('Bal')) && 
          (cleanMsg.includes('kurban olduğum şuraları bi aydınlat hele') || (cleanMsg.includes('kurban') && cleanMsg.includes('aydınlat')))) {
        setTimeout(() => {
          bot.chat('yavusbaba31 diva mısın aşkım');
        }, 1000);
      }
    }

    // 2. TPA VE HAREKET KOMUTLARI
    if (komutuVeren !== '') {
      // !gel yazınca o kişiye tpa atar
      if (msg.includes('!gel')) {
        bot.chat('/tpa ' + komutuVeren);
      }
      
      // !kabul yazınca veya sizden biri bota tpa atarsa otomatik kabul eder
      if (msg.includes('!kabul') || cleanMsg.includes('istek') || cleanMsg.includes('tpaccept') || cleanMsg.includes('ışınlanmak')) {
        bot.chat('/tpaccept');
      }
      
      // Zıplama komutu
      if (msg.includes('!zıpla') || msg.includes('!zipla')) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 1500);
      }
    }
  });

  bot.on('end', () => setTimeout(() => createBot(hesap), 15000));
}

hesaplar.forEach((hesap, index) => {
  setTimeout(() => {
    console.log(`[BAŞLATILIYOR] ${hesap.username} oyuna sokuluyor...`);
    createBot(hesap);
  }, 10000 * index);
});
