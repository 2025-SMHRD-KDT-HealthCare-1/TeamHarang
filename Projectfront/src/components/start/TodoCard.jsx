const TodoCard = ({ icon, title, desc }) => (
  <div
    style={{
      width: "260px",
      padding: "30px",
      background: "white",
      borderRadius: "20px",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
      //   0   → X축 이동 (가로 그림자 위치) → 0이면 좌우로 이동 없음
      //   6px → Y축 이동 (세로 그림자 위치) → 아래로 6px 떨어진 위치에 그림자
      //   20px → blur 값 (그림자의 흐림 정도) → 숫자가 클수록 부드럽고 크게 퍼짐
      // rgba(0,0,0,0.12) → 그림자 색상 (12% 투명한 검정색)
      textAlign: "center",
    }}
  >
    <img src={icon} style={{ width: "45px", marginBottom: "15px" }} />
    <h3 style={{ marginBottom: "10px", color: "#2f73ff" }}>{title}</h3>
    <p style={{ fontSize: "14px", opacity: 0.7 }}>{desc}</p>
  </div>
);

export default TodoCard;
