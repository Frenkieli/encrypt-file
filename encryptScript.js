const fs = require("fs");
const path = require("path");
const CryptoJS = require("crypto-js");
const ProgressBar = require("progress");

const allowedExtensions = ["jpeg", "jpg", "png", "ts", "m3u8"];

const secretKeyHex =
  "6650416142484b477630426575566c6c5078526d343042586534376c35507730";
const ivHex = "4d7952616e646f6d4956313233343536";

function encryptData(buffer) {
  const secretKey = CryptoJS.enc.Hex.parse(secretKeyHex);
  const iv = CryptoJS.enc.Hex.parse(ivHex);

  const wordArray = CryptoJS.lib.WordArray.create(buffer);
  const encrypted = CryptoJS.AES.encrypt(wordArray, secretKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // 將加密數據轉換為 Uint8Array
  // const encryptedBytes = CryptoJS.enc.Base64.parse(encrypted.toString()).words;
  // console.log(encryptedBytes);
  // const uint8Array = new Uint8Array(encryptedBytes.length * 4);
  // for (let i = 0; i < encryptedBytes.length; i++) {
  //   uint8Array[i * 4] = (encryptedBytes[i] >> 24) & 0xff;
  //   uint8Array[i * 4 + 1] = (encryptedBytes[i] >> 16) & 0xff;
  //   uint8Array[i * 4 + 2] = (encryptedBytes[i] >> 8) & 0xff;
  //   uint8Array[i * 4 + 3] = encryptedBytes[i] & 0xff;
  // }

  // return uint8Array;
  return encrypted.toString();
}

function encryptFile(inputPath, outputPath) {
  const fileBuffer = fs.readFileSync(inputPath);
  const encryptedData = encryptData(fileBuffer);
  fs.writeFileSync(outputPath, encryptedData);
}

function encryptDirectory(directory, outputDirectory) {
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  const files = fs.readdirSync(directory);
  // 在格式字符串中添加自定義的文件名變量
  const bar = new ProgressBar(":bar :current/:total :fileName", {
    total: files.length,
    width: 20,
  });

  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (allowedExtensions.includes(ext.toLowerCase().replace(".", ""))) {
        const outputPath = path.join(outputDirectory, file);
        encryptFile(fullPath, outputPath);

        // 更新進度條並設置文件名
        bar.tick({ fileName: file });
      }
    }
  });
}

const inputDirectory = "./inputFolder"; // 指定要加密的資料夾路徑
const outputDirectory = "./encryptedFiles"; // 指定加密後的文件存儲路徑
try {
  encryptDirectory(inputDirectory, outputDirectory);
} catch (err) {
  console.error(err);
  process.exit(1);
}
