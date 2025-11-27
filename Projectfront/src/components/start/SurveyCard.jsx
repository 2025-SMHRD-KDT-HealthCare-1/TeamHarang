const SurveyCard = ({ num, color, title, items }) => (
  <div
    style={{
      width: "350px",
      padding: "30px",
      borderRadius: "20px",
      background: "white",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
      textAlign: "left",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        background: color,
        borderRadius: "12px",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        marginBottom: "12px",
      }}
    >
      {num}
    </div>

    <h3 style={{ marginBottom: "10px", color }}>{title}</h3>

    <ul style={{ paddingLeft: "20px" }}>
      {items.map((it, idx) => (
        <li key={idx} style={{ marginBottom: "8px", opacity: 0.75 }}>
          {it}
        </li>
      ))}
    </ul>
  </div>
);

export default SurveyCard;
