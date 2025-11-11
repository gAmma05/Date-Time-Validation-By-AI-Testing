import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { askGemini } from "../ai/geminiClient.js"; // Giả sử bạn đã có file này

// --- Thiết lập đường dẫn và đọc file (giống code của bạn) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "formats.json");

// Tạo file mặc định nếu chưa có
if (!fs.existsSync(configPath)) {
  const defaultFormats = {
    formats: [
      {
        name: "YYYY-MM-DD",
        regex: "^\\d{4}-\\d{2}-\\d{2}$",
      },
      {
        name: "YYYY-MM-DDTHH:mm:ssZ",
        regex: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$",
      },
    ],
  };
  fs.writeFileSync(configPath, JSON.stringify(defaultFormats, null, 2));
}

// Đọc danh sách format (dạng object)
let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
let formats = config.formats;

// -----------------------------------------------------------------
// HÀM VALIDATE CHÍNH (ĐÃ NÂNG CẤP)
// -----------------------------------------------------------------

/**
 * Validate một chuỗi, và tự động học định dạng mới bằng AI nếu thất bại.
 * Hàm này giờ là ASYNC.
 */
export async function validateDateTime(str) {
  // 1. Thử tất cả các format đã biết
  for (const fmt of formats) {
    if (matchFormat(str, fmt)) {
      return true; // Khớp!
    }
  }

  // 2. ❗ Nếu không khớp -> Kích hoạt AI self-healing
  // Chúng ta dùng `await` vì hàm này sẽ gọi API
  const healed = await selfHealWithAI(str);

  // 3. Nếu AI học được định dạng mới, nó sẽ trả về true
  return healed;
}

/**
 * Hàm matchFormat mới:
 * Giờ nó nhận một object {name, regex} và chạy regex.
 */
function matchFormat(str, fmtObj) {
  try {
    // Tạo RegExp từ chuỗi regex trong file JSON
    const re = new RegExp(fmtObj.regex);
    return re.test(str);
  } catch (e) {
    console.error(`Lỗi regex với format "${fmtObj.name}": ${e.message}`);
    return false;
  }
}

// -----------------------------------------------------------------
// HÀM SELF-HEAL BẰNG AI (MỚI)
// -----------------------------------------------------------------

/**
 * Hàm này thay thế hoàn toàn hàm selfHeal cũ.
 * Nó gọi Gemini để phân tích chuỗi lỗi và đề xuất định dạng mới.
 */
async function selfHealWithAI(str) {
  console.log(`⚠️ Unknown format detected: ${str}. Asking AI...`);

  // Lấy danh sách tên format đã biết để AI không tạo trùng
  const knownFormatNames = formats.map((f) => f.name).join(", ");

  // Đây là trái tim của hệ thống: Prompt yêu cầu AI trả về JSON
  const prompt = `
    Một chuỗi date/time "${str}" không khớp với bất kỳ định dạng nào đã biết.
    Các định dạng đã biết là: ${knownFormatNames}.

    Nhiệm vụ của bạn:
    1. Phân tích chuỗi "${str}".
    2. Nếu nó là một định dạng date/time hợp lệ MỚI, hãy tạo ra một tên định dạng (ví dụ: "YYYY.MM.DD") và một biểu thức chính quy (JavaScript REGEX) để xác thực nó.
    3. Trả lời CHỈ BẰNG một đối tượng JSON.

    Nếu hợp lệ và là định dạng mới, trả lời:
    {
      "isNewFormat": true,
      "formatName": "YYYY.MM.DD",
      "regex": "^\\d{4}\\.\\d{2}\\.\\d{2}$"
    }
    (LƯU Ý QUAN TRỌNG: Mọi dấu '\\' trong regex PHẢI được escape, ví dụ: '\\d' -> '\\\\d')

    Nếu không hợp lệ hoặc không thể xác định:
    {
      "isNewFormat": false,
      "reason": "Chuỗi không phải là định dạng ngày tháng hợp lệ."
    }
  `;

  // Tái sử dụng logic retry và parse JSON từ hàm generateDateTimeTests của bạn
  const aiResponse = await askGeminiAndParseJson(prompt);

  if (aiResponse && aiResponse.isNewFormat && aiResponse.formatName && aiResponse.regex) {
    const newFormat = {
      name: aiResponse.formatName,
      regex: aiResponse.regex,
    };

    // Tự kiểm tra lại: Regex AI trả về có khớp với chuỗi đầu vào không?
    if (matchFormat(str, newFormat)) {
      console.log(`🤖 AI Self-healing: Adding new format "${newFormat.name}"`);
      formats.push(newFormat);
      // Lưu lại vào file json
      fs.writeFileSync(
        configPath,
        JSON.stringify({ formats }, null, 2)
      );
      // Nếu AI đã học thành công, coi như lần validate này là TRUE
      return true;
    } else {
      console.log(`❌ AI suggested a format, but it failed self-validation. Discarding.`);
      return false;
    }
  } else {
    console.log(`❌ AI could not determine a new format. Reason: ${aiResponse?.reason || "Unknown"}`);
    return false;
  }
}

/**
 * HÀM HỖ TRỢ:
 * Logic này bạn đã có trong `generateDateTimeTests`,
 * chúng ta tách ra để dùng chung.
 */
async function askGeminiAndParseJson(prompt) {
  for (let i = 0; i < 3; i++) { // Tối đa 3 lần thử
    try {
      const text = await askGemini(prompt);
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn(`⚠️ Attempt ${i + 1} failed to parse AI output. Retrying...`);
    }
  }
  console.error("❌ AI failed to return valid JSON after 3 attempts.");
  return null;
}