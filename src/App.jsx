import { useState, useEffect, useRef } from "react"
import Grid from "./components/Grid"
import githubLogo from "./assets/github.png"
import { parseArrayInput, parseSpaceGridInput } from "./utils/parseInput"

function App() {
  const [text, setText] = useState("")
  const [grids, setGrids] = useState([])
  const [error, setError] = useState("")

  // NEW: input format type
  const [inputType, setInputType] = useState("array") 

  // null = arrow, pen, eraser
  const [tool, setTool] = useState(null)

  const [penSize, setPenSize] = useState(2)
  const [eraserSize, setEraserSize] = useState(24)

  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const iconButtonStyle = {
    padding: "6px 10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#5bc0de",
    color: "#ffffff",
    fontSize: "14px"
  }
  useEffect(() => {
    try {
      const parsed =
        inputType === "array"
          ? parseArrayInput(text)
          : parseSpaceGridInput(text)

      setGrids(parsed)
      setError("")
    } catch {
      setError("Please enter the input in the selected format.")
      setGrids([])
    }
  }, [text, inputType])

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
            overflow: "hidden",
            position: "relative"
          }}
        >
          <h4>Input</h4>

          {/* 🔹 NEW DROPDOWN
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            style={{ marginBottom: "10px", padding: "6px" }}
          >
            <option value="array">Array format [ [1, 2] , [3, 4] ]</option>
            <option value="space">Space grid format [1 2 3, 4 5 6]</option>
          </select> */}
          {/* INPUT FORMAT TOGGLE */}
<div
  style={{
    display: "inline-flex",
    background: "#0f172a",
    borderRadius: "8px",
    padding: "4px",
    marginBottom: "10px"
  }}
>
  <button
    onClick={() => setInputType("array")}
    style={{
      padding: "6px 14px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      background: inputType === "array" ? "#1e293b" : "transparent",
      color: "#fff",
      fontSize: "14px"
    }}
  >
    Array Format
  </button>

  <button
    onClick={() => setInputType("space")}
    style={{
      padding: "6px 14px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      background: inputType === "space" ? "#1e293b" : "transparent",
      color: "#fff",
      fontSize: "14px"
    }}
  >
    Space Grid
  </button>
</div>


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
            placeholder={
              inputType === "array"
                ? "Enter array like: [[1,2,3],[4,5,6]]"
                : "Enter grid like:\n[1 2 3,\n4 5 6]"
            }
          />

          {/* TOOLS */}
<div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "14px",width:"fit-content" }}>

  {/* PEN TOOL */}
  <div
    style={{
      display: "flex",
      // background: "#373f53ff",
      // borderRadius: "8px",
      // padding: "4px",
      gap: "8px",
      alignItems: "center"
    }}
  >
    <button
      onClick={() => toggleTool("pen")}
      style={{
        padding: "6px 14px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        background: tool === "pen" ? "#81b684ff" : "#4f8f5f",
        color: "#ffffff",
        fontSize: "14px"
      }}
    >
      Pen
    </button>

    <button
      onClick={() => setPenSize(s => s + 1)}
      style={iconButtonStyle}
    >
      +
    </button>

    <button
      onClick={() => setPenSize(s => Math.max(1, s - 1))}
      style={iconButtonStyle}
    >
      −
    </button>
  </div>

  {/* ERASER TOOL */}
  <div
    style={{
      display: "flex",
      marginTop: "12px",
      // background: "#0f172a",
      // borderRadius: "8px",
      // padding: "4px",
      gap: "8px",
      alignItems: "center"
    }}
  >
    <button
      onClick={() => toggleTool("eraser")}
      style={{
        padding: "6px 14px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        background: tool === "eraser" ? "#81b684ff" : "#4f8f5f",
        color: "#ffffff",
        fontSize: "14px"
      }}
    >
      Eraser
    </button>

    <button
      onClick={() => setEraserSize(s => s + 5)}
      style={iconButtonStyle}
    >
      +
    </button>

    <button
      onClick={() => setEraserSize(s => Math.max(5, s - 5))}
      style={iconButtonStyle}
    >
      −
    </button>
  </div>
</div>

          {error && <p style={{ color: "#555" }}>{error}</p>}

          {/* GITHUB LOGO */}
          <a
            href="https://github.com/sahil-kumar111/grid-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute",
              bottom: "14px",
              left: "14px",
              width: "42px",
              height: "42px",
              cursor: "pointer"
            }}
          >
            <img
              src={githubLogo}
              alt="GitHub"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </a>
        </div>

        {/* RIGHT WHITEBOARD */}
        <div style={{ width: "50%", position: "relative", overflowY: "auto" }}>
          <div style={{ padding: "16px", paddingBottom: "200px" }}>
            {grids.map((grid, i) => (
              <Grid
                key={i}
                grid={grid}
                tool={tool}
                onUpdate={(g) => updateGrid(i, g)}
              />
            ))}
          </div>

        {/*<canvas */}
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
