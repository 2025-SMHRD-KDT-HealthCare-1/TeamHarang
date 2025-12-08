// Projectback/router/HTP.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

// ====== 1. 업로드 설정 ======
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".png";
    const filename = `htp_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// ====== 2. 파이썬 경로/스크립트 경로 ======
const pythonPath =
  "C:\\Users\\SMHRD\\Desktop\\MyPro\\Projectback\\venv\\Scripts\\python.exe";
const scriptPath = path.join(__dirname, "..", "htp_yolo.py");

// ====== 3. 분석 API ======
// POST /htp/analyze
router.post("/analyze", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "이미지가 없습니다." });
    }

    const imagePath = path.join(uploadDir, req.file.filename);

    // 프론트에서 넘겨주는 메타데이터
    const totalTimeMs = req.body.totalTimeMs
      ? Number(req.body.totalTimeMs)
      : 0;

    let labelOrder = [];
    if (req.body.labelOrder) {
      try {
        labelOrder = JSON.parse(req.body.labelOrder);
      } catch {
        labelOrder = [];
      }
    }

    const selectedType = req.body.selectedType || "house"; // "house" | "tree" | "person"

    const py = spawn(pythonPath, [scriptPath, imagePath]);

    let dataBuffer = "";
    let errorBuffer = "";

    py.stdout.on("data", (data) => {
      dataBuffer += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorBuffer += data.toString();
    });

    py.on("close", (code) => {
      console.log("htp_yolo.py exit code:", code);
      if (errorBuffer) {
        console.error("python stderr:", errorBuffer);
      }

      let pyResult;
      try {
        pyResult = JSON.parse(dataBuffer);
      } catch (e) {
        console.error("JSON parse error:", e, dataBuffer);
        return res.status(500).json({
          success: false,
          message: "Python 결과를 해석할 수 없습니다.",
        });
      }

      if (!pyResult.success) {
        console.error("Python analyze error:", pyResult.error);
        return res.status(500).json({
          success: false,
          message: "이미지 분석 실패",
          detail: pyResult.error,
          trace: pyResult.trace || null,
        });
      }

      // 그냥 Python 결과 + 메타데이터를 그대로 내려준다.
      // 선택한 타입은 selectedType 으로 프론트에 돌려줌.
      return res.json({
        success: true,
        imagePath: pyResult.imagePath,
        totalTimeMs,
        labelOrder,
        selectedType,
        detections: pyResult.detections,
        abnormalFindings: pyResult.abnormalFindings,
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "서버 내부 오류",
    });
  }
});

module.exports = router;