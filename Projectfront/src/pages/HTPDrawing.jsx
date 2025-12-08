import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

export default function HTPDrawing() {
  const canvasRef = useRef(null);

  // 현재 선택한 그리기 대상: "house" | "tree" | "person"
  const [selectedType, setSelectedType] = useState("house");

  const [isDrawing, setIsDrawing] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [totalTimeMs, setTotalTimeMs] = useState(null);

  // (옵션) H/T/P 순서 기록 – 지금 화면에는 쓰지 않지만 보존
  const [labelOrder, setLabelOrder] = useState([]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 캔버스 기본 세팅
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
  }, []);

  // 마우스 좌표 변환
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e);

    // 첫 시작 시각
    if (!startTime) {
      setStartTime(Date.now());
      setTotalTimeMs(null);
    }

    // H/T/P 순서 기록
    setLabelOrder((prev) => {
      if (prev.length === 0 || prev[prev.length - 1] !== selectedType) {
        return [...prev, selectedType];
      }
      return prev;
    });

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";

    setIsDrawing(false);
    setStartTime(null);
    setTotalTimeMs(null);
    setLabelOrder([]);
    setResult(null);
    setErrorMsg("");
  };

  const formatMs = (ms) => {
    if (!ms) return "-";
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const remain = sec % 60;
    return `${min}분 ${remain}초`;
  };

  const typeToKo = (t) => {
    if (t === "house") return "집";
    if (t === "tree") return "나무";
    if (t === "person") return "사람";
    return t;
  };

  const handleAnalyze = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 그린 시간 계산
    let duration = totalTimeMs;
    if (startTime) {
      duration = Date.now() - startTime;
      setTotalTimeMs(duration);
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    const currentType = selectedType; // 분석 시점 선택값 고정

    canvas.toBlob(
      async (blob) => {
        try {
          const formData = new FormData();
          formData.append("image", blob, "htp_drawing.png");
          formData.append("totalTimeMs", duration || 0);
          formData.append("labelOrder", JSON.stringify(labelOrder));
          formData.append("selectedType", currentType);

          const res = await axios.post(
            "http://localhost:3001/htp/analyze",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          if (!res.data.success) {
            setErrorMsg(res.data.message || "분석에 실패했습니다.");
          } else {
            setResult(res.data);
          }
        } catch (err) {
          console.error(err);
          setErrorMsg("서버 요청 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      },
      "image/png",
      1.0
    );
  };

  // ===== 결과 필터링 =====
  const activeType =
    result && result.selectedType ? result.selectedType : selectedType;

  const filteredDetections =
    result && result.detections
      ? result.detections.filter((d) => d.category === activeType)
      : [];

  const filteredAbnormals =
    result && result.abnormalFindings
      ? result.abnormalFindings.filter((a) => a.category === activeType)
      : [];

  // ===== 라벨 기준 "그린 순서" 텍스트 만들기 =====
  // (실제 그린 순서는 아니고, 탐지된 라벨 이름 나열)
  const drawOrderText =
    filteredDetections.length > 0
      ? filteredDetections.map((d) => d.label).join(" → ")
      : "-";

  // ===== 특이사항 문장 만들기 (전체 라벨 제외 + 크기 기준) =====
  const WHOLE_LABELS = ["집전체", "나무전체", "사람전체"];

  let specialNote = "특별히 두드러지는 요소는 감지되지 않았습니다.";
  if (filteredDetections.length > 0) {
    // 집전체/나무전체/사람전체 같은 '전체 요소'는 제외하고 본다
    const partOnly = filteredDetections.filter(
      (d) => !WHOLE_LABELS.includes(d.label)
    );

    if (partOnly.length > 0) {
      const withArea = partOnly.map((d) => {
        const { x1, y1, x2, y2 } = d.bbox || {};
        const w = x2 - x1;
        const h = y2 - y1;
        const area = w * h;
        return { ...d, _area: area };
      });

      const sortedByArea = withArea.sort(
        (a, b) => (b._area || 0) - (a._area || 0)
      );
      const biggest = sortedByArea[0];

      if (biggest && biggest._area > 0) {
        const koType = typeToKo(biggest.category);
        const topLabel = biggest.label;
        specialNote = `${koType} 그림에서 '${topLabel}' 요소가 다른 부분에 비해 크게 표현되었습니다.`;
      }
    }
  }

  return (
    <div style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
        HTP 그림 검사 - 객체 탐지
      </h2>

      {/* 유형 선택 버튼 */}
      <div style={{ marginBottom: "12px" }}>
        <span style={{ marginRight: "8px" }}>현재 그리고 있는 대상:</span>
        {[
          { id: "house", label: "집" },
          { id: "tree", label: "나무" },
          { id: "person", label: "사람" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedType(item.id)}
            style={{
              marginRight: "8px",
              padding: "6px 12px",
              borderRadius: "6px",
              border:
                selectedType === item.id ? "2px solid #333" : "1px solid #aaa",
              background: selectedType === item.id ? "#eee" : "white",
              cursor: "pointer",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 캔버스 */}
      <div
        style={{
          border: "1px solid #ccc",
          display: "inline-block",
          marginBottom: "12px",
        }}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={{ cursor: "crosshair" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* 버튼들 */}
      <div style={{ marginBottom: "12px" }}>
        <button
          type="button"
          onClick={handleClear}
          style={{
            marginRight: "8px",
            padding: "6px 12px",
          }}
        >
          초기화
        </button>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            padding: "6px 12px",
          }}
        >
          {loading ? "분석 중..." : "분석하기"}
        </button>
      </div>

      {/* 요약 정보 */}
      <div style={{ marginBottom: "16px" }}>
        <div>소요시간 : {formatMs(totalTimeMs)}</div>
        <div>그린 순서 : {drawOrderText}</div>
        <div style={{ marginTop: "4px" }}>
          분석 대상 : <strong>{typeToKo(activeType)}</strong>
        </div>
      </div>

      {/* 에러 메시지 */}
      {errorMsg && (
        <div style={{ color: "red", marginBottom: "12px" }}>{errorMsg}</div>
      )}

      {/* 결과 영역 */}
      {result && (
        <div style={{ marginTop: "16px" }}>
          {/* 특이사항 */}
          <h3 style={{ marginBottom: "4px" }}>특이사항</h3>
          <p style={{ marginBottom: "16px" }}>{specialNote}</p>

          {/* 탐지된 라벨의 상징 */}
          <h3 style={{ marginBottom: "4px" }}>탐지된 라벨의 상징</h3>
          {filteredAbnormals.length === 0 && (
            <div>등록된 상징 해석이 있는 라벨은 없습니다.</div>
          )}
          {filteredAbnormals.length > 0 && (
            <ul style={{ paddingLeft: "20px" }}>
              {filteredAbnormals.map((a, idx) => (
                <li key={idx} style={{ marginBottom: "6px" }}>
                  <strong>{a.label}</strong> — {a.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
