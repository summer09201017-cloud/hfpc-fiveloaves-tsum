// 烤曉臻(zh-TW-HsiaoChenNeural)語音三句 → voice/*.mp3(逐句落盤,重跑到「新產 0」即完成)
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require2 = createRequire('C:/Users/HFP/Downloads/hfpc-git/hfpc-paul-game/node_modules/');
const { MsEdgeTTS, OUTPUT_FORMAT } = require2('msedge-tts');

const OUT = path.resolve(import.meta.dirname, '..', 'voice');
fs.mkdirSync(OUT, { recursive: true });
const LINES = [
  ['intro', '在這裡有一個孩童,帶著五個大麥餅、兩條魚,只是分給這許多人還算甚麼呢?'],
  ['bless', '耶穌望著天祝福,擘開餅,遞給門徒,門徒又遞給眾人。'],
  ['win', '他們都吃,並且吃飽了;把剩下的零碎收拾起來,裝滿了十二個籃子。吃的人,除了婦女孩子,約有五千。馬太福音十四章,二十至二十一節。']
];
let made = 0;
for (const [name, text] of LINES) {
  const file = path.join(OUT, name + '.mp3');
  if (fs.existsSync(file) && fs.statSync(file).size > 2000) continue;
  const tts = new MsEdgeTTS();
  await tts.setMetadata('zh-TW-HsiaoChenNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = await tts.toStream(text);
  const chunks = [];
  await new Promise((res, rej) => {
    audioStream.on('data', c => chunks.push(c));
    audioStream.on('end', res);
    audioStream.on('error', rej);
  });
  fs.writeFileSync(file, Buffer.concat(chunks));
  made++;
  console.log('baked', name, fs.statSync(file).size, 'bytes');
}
console.log('done, 新產', made);
process.exit(0);
