function Grid({ grid, onUpdate, tool }) {
  const cols = grid[0].length

  function updateCell(i, j, value) {
    if (tool) return

    const copy = grid.map(row => [...row])
    copy[i][j] = value === "" ? null : value
    onUpdate(copy)
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 60px)`,
          outline: "1.5px solid black"
        }}
      >
        {grid.map((row, i) =>
          row.map((val, j) => (
            <input
              key={`${i}-${j}`}
              value={val ?? ""}
              // onFocus={() => setActiveCell([i, j])}
              // onBlur={() => setActiveCell(null)}
              onChange={(e) => updateCell(i, j, e.target.value)}
              style={{
                width: "60px",
                height: "60px",
                border: "1px solid black",
                textAlign: "center",
                fontSize: "16px",
                boxSizing: "border-box",
                // backgroundColor: isActive ? "#d4f7d4" : "white"

              }}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Grid
