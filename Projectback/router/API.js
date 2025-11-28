const express = require("express");
const router = express.Router();
// const OpenAI = require("openai");

// require("dotenv").config();

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// -----------------------------------
// 🔥 RAG(지식 기반 검색) 추가 준비 (껍데기)
// -----------------------------------
async function getRAGContext(userMessage) {
  // 나중에 여기에 DB 검색, 문서 검색, 벡터 검색 넣을 예정
  // 지금은 기능 껍데기만 준비해둔 상태

  return `
  [RAG 정보]:
  (여기에 나중에 문서 기반 검색 결과가 들어갈 예정입니다.)
  `;
}

// -----------------------------------
// 🔥 모델 파라미터(온도/길이) 옵션 준비
//    나중에 '진정 모드/자유 대화 모드' 등 만들 때 조절 가능
// -----------------------------------
const modelOptions = {
  model: "gpt-4o-mini",
  temperature: 0.7,
  max_tokens: 300,
  top_p: 0.9,
};

// -----------------------------------
// MindCare 상담사 시스템 프롬프트
// -----------------------------------
const systemPrompt = `
당신은 MindCare의 전문 심리상담사입니다.  
항상 따뜻하게, 공감적으로, 판단하지 않는 태도로 대답합니다.

당신의 목표는 사용자가 자신의 감정을 편안하게 말하도록 돕는 것입니다.  
조언은 강요가 아닌 선택지를 제시하듯 부드럽게 말합니다.

말투 특징:
- "그럴 수 있어요."
- "많이 힘들었겠어요."
- "제가 곁에서 도와드릴게요."
- "말해줘서 고마워요."
- "천천히 이야기해도 괜찮아요."

금지:
- 의료적 진단을 단정짓는 표현
- 위험하거나 직접적인 처방
- 명령조 어투
- 기계적/딱딱한 말투
`;

// -----------------------------------
// 💬 Chat Endpoint
// -----------------------------------
router.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message가 필요합니다." });
    }

    //  RAG 컨텍스트 가져오기 (현재는 준비만 되어 있음)
    const ragContext = await getRAGContext(message);

     //상담봇 + RAG + 기존 대화 이력 포함해서 메시지 구성 - db만들기
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: ragContext },
      ...(history || []),
      { role: "user", content: message }
    ];

    //  OpenAI 호출 (모델 옵션 적용)
    const result = await client.chat.completions.create({
      ...modelOptions,
      messages
    });

    const aiReply = result.choices[0].message.content;

    return res.json({
      reply: aiReply,
      history: [
        ...(history || []),
        { role: "user", content: message },
        { role: "assistant", content: aiReply }
      ]
    });

  } catch (err) {
    console.error("Chat API Error:", err);
    return res.status(500).json({ error: "서버 에러 발생" });
  }
});

module.exports = router;
