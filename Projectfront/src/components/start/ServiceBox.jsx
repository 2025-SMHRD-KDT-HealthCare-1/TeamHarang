const ServiceBox = ({ icon, title, desc }) => (
  <div style={{ width: "220px", textAlign: "center" }}>
    <div
      style={{
        width: "90px",
        height: "90px",
        borderRadius: "20px",
        background: "rgba(0, 120, 255, 0.1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto 15px",
      }}
    >
      <img src={icon} style={{ width: "45px" }} />
    </div>

    <h3 style={{ color: "#0066ff", marginBottom: "10px" }}>{title}</h3>
    <p style={{ fontSize: "14px", opacity: 0.75 }}>{desc}</p>
  </div>
);

export default ServiceBox;
