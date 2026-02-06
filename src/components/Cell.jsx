function Cell({ value }) {
  return (
    <div
      style={{
        width: "60px",
        height: "60px",
        border: "1.5px solid black",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: value === null ? "#fafafa" : "white",
        fontSize: "16px"
      }}
    >
      {value ?? ""}
    </div>
  )
}

export default Cell
