import { useState, useEffect, useRef } from "react"
import Grid from "./components/Grid"
import { parseInput } from "./utils/parseInput"

function App() {
  const [text, setText] = useState("")
  const [grids, setGrids] = useState([])
  const [error, setError] = useState("")

  // null = arrow, pen, eraser
  const [tool, setTool] = useState(null)

  const [penSize, setPenSize] = useState(2)
  const [eraserSize, setEraserSize] = useState(24)

  const canvasRef = useRef(null)
  const drawingRef = useRef(false)

  useEffect(() => {
    try {
      const parsed = parseInput(text)
      setGrids(parsed)
      setError("")
    } catch {
      setError("Please enter the array in a valid format.")
      setGrids([])
    }
  }, [text])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    canvas.width = parent.clientWidth
    canvas.height = parent.clientHeight
  }, [grids])

  function getCtx() {
    return canvasRef.current.getContext("2d")
  }

  function startDraw(e) {
    if (!tool) return
    drawingRef.current = true
    draw(e)
  }

  function stopDraw() {
    drawingRef.current = false
    getCtx().beginPath()
  }

  function draw(e) {
    if (!drawingRef.current || !tool) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ctx = getCtx()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (tool === "pen") {
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = "black"
      ctx.lineWidth = penSize
    }

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineWidth = eraserSize
    }

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function updateGrid(gridIndex, newGrid) {
    setGrids(prev => {
      const updated = [...prev]
      updated[gridIndex] = newGrid
      setText(updated.map(g => JSON.stringify(g)).join("\n"))
      return updated
    })
  }

  function toggleTool(name) {
    setTool(prev => (prev === name ? null : name))
  }

  return (
    <>
      {/* HEADER */}
      <div
        style={{
          padding: "14px 20px",
          background: "white",
          borderBottom: "1px solid #ddd",
          fontSize: "24px",
          fontWeight: "600"
        }}
      >
        Grid Visualizer
      </div>

      <div style={{ height: "calc(100vh - 60px)", display: "flex" }}>
        {/* LEFT */}
        <div
          style={{
            width: "50%",
            padding: "16px",
            borderRight: "2px solid #ddd",
            boxSizing: "border-box",
            overflow: "hidden"   
          }}
        >
          <h4>Input</h4>

          <textarea
            style={{
              width: "100%",
              height: "150px",
              fontSize: "18px",
              fontFamily: "monospace",
              boxSizing: "border-box",
              padding: "10px",
              resize: "none"
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter array like: [[1,2,3],[4,5,6]]"
          />

          {/* TOOLS */}
          <div style={{ marginTop: "12px" }}>
            {/* PEN */}
            <div style={{ marginBottom: "12px" ,display: "flex", alignItems: "center", gap: "10px"}}>
              <button
                onClick={() => toggleTool("pen")}
                style={{
                  background: tool === "pen" ? "#222" : "#eee",
                  color: tool === "pen" ? "#fff" : "#000",
                  padding: "6px 14px"
                }}
              >
                Pen
              </button>
              <button onClick={() => setPenSize(s => s + 1)}>+</button>
              <button onClick={() => setPenSize(s => Math.max(1, s - 1))}>-</button>
            </div>

            {/* ERASER */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => toggleTool("eraser")}
                style={{
                  background: tool === "eraser" ? "#222" : "#eee",
                  color: tool === "eraser" ? "#fff" : "#000",
                  padding: "6px 14px"
                }}
              >
                Eraser
              </button>
              <div style={{ display: "flex", gap: "6px" }}></div>
              <button onClick={() => setEraserSize(s => s + 5)}>+</button>
              <button onClick={() => setEraserSize(s => Math.max(5, s - 5))}>-</button>
            </div>
          </div>

          {error && <p style={{ color: "#555" }}>{error}</p>}
        </div>

        {/* RIGHT WHITEBOARD */}
        <div style={{ width: "50%", position: "relative", overflow: "hidden" ,overflowY: "auto"}}>
          <div style={{ padding: "16px",paddingBottom: "200px"}}>
            {grids.map((grid, i) => (
              <Grid
                key={i}
                grid={grid}
                tool={tool}
                onUpdate={(g) => updateGrid(i, g)}
              />
            ))}
          </div>

          {/* CANVAS */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: tool ? "auto" : "none",
              cursor:
              tool === "pen"
                ? "url(\"data:image/svg+xml;utf8,\
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>\
            <path d='M2 22l4-1 12-12-3-3L3 18z' fill='black'/>\
            </svg>\") 2 22, auto"
                : tool === "eraser"
                ? "url(\"data:image/svg+xml;utf8,\
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'>\
            <rect x='3' y='6' width='18' height='10' rx='2' fill='gray'/>\
            </svg>\") 12 12, auto"
                : "default"            
            }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
          />
        </div>
      </div>
    </>
  )
}

export default App
