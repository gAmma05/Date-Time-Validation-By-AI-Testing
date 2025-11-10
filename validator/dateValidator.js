import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// ✅ Lấy đường dẫn đúng trên Windows
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "formats.json");

// ✅ Nếu file chưa tồn tại → tự tạo mặc định
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(
    configPath,
    JSON.stringify(
      { formats: ["YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ssZ"] },
      null,
      2
    )
  );
}

// ✅ Đọc danh sách format hiện có
let formats = JSON.parse(fs.readFileSync(configPath, "utf-8")).formats;

export function validateDateTime(str) {
  for (const fmt of formats) {
    if (matchFormat(str, fmt)) return true;
  }

  // ❗ Nếu không khớp format nào — kích hoạt self-healing
  selfHeal(str);
  return false;
}

// -----------------------------

function matchFormat(str, fmt) {
  switch (fmt) {
    case "YYYY-MM-DD":
      return /^\d{4}-\d{2}-\d{2}$/.test(str);
    case "YYYY-MM-DDTHH:mm:ssZ":
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(str);
    case "YYYY/MM/DD":
      return /^\d{4}\/\d{2}\/\d{2}$/.test(str);
    case "YYYY-MM-DD HH:mm:ss":
      return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str);
    default:
      return false;
  }
}

// -----------------------------

function selfHeal(str) {
  console.log(`⚠️ Unknown date format detected: ${str}`);

  // Phát hiện pattern mới bằng regex đơn giản
  let detectedFmt = null;
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(str)) detectedFmt = "YYYY/MM/DD";
  else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str))
    detectedFmt = "YYYY-MM-DD HH:mm:ss";
  else if (/^\d{2}-\d{2}-\d{4}$/.test(str))
    detectedFmt = "DD-MM-YYYY";
  else if (/^\d{4}\.\d{2}\.\d{2}$/.test(str))
    detectedFmt = "YYYY.MM.DD";

  if (detectedFmt && !formats.includes(detectedFmt)) {
    console.log(`🤖 Self-healing: adding new format "${detectedFmt}"`);
    formats.push(detectedFmt);
    fs.writeFileSync(configPath, JSON.stringify({ formats }, null, 2));
  } else {
    console.log("❌ Unable to infer new format automatically.");
  }
}
