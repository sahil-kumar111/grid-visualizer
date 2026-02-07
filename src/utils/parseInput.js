// const MAX = 100
// const MAX_GRIDS = 20
// export function parseInput(input) {
//   if (!input.trim()) return []

//   const gridStrings = input
//     .split("\n")
//     .map(s => s.trim())
//     .filter(Boolean)

//   if (gridStrings.length > MAX_GRIDS) {
//     throw new Error("Too many grids")
//   }

//   return gridStrings.map(parseSingleGrid)
// }

// function parseSingleGrid(str) {
//   let data
//   try {
//     const sanitized = str
//       .replace(/\[,/g, "[null,")
//       .replace(/,\]/g, ",null]")
//       .replace(/\[\]/g, "[null]")

//     data = eval(sanitized)
//   } catch {
//     throw new Error("Invalid grid")
//   }

  
//   if (Array.isArray(data) && !Array.isArray(data[0])) {
//     if (data.length > MAX) throw new Error("Grid too large")
//     return [normalizeRow(data, data.length)]
//   }

//   if (!Array.isArray(data)) {
//     throw new Error("Invalid grid")
//   }

//   if (data.length > MAX) throw new Error("Grid too large")

//   const maxCols = Math.max(...data.map(r => r.length || 0))
//   if (maxCols > MAX) throw new Error("Grid too large")

//   return data.map(row => normalizeRow(row, maxCols))
// }

// function normalizeRow(row, size) {
//   const out = []
//   for (let i = 0; i < size; i++) {
//     out.push(row?.[i] ?? null)
//   }
//   return out
// }



const MAX = 100
const MAX_GRIDS = 20

export function parseArrayInput(input) {
  if (!input.trim()) return []

  const gridStrings = input
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean)

  if (gridStrings.length > MAX_GRIDS) {
    throw new Error("Too many grids")
  }

  return gridStrings.map(parseSingleGrid)
}

function parseSingleGrid(str) {
  let data
  try {
    const sanitized = str
      .replace(/\[,/g, "[null,")
      .replace(/,\]/g, ",null]")
      .replace(/\[\]/g, "[null]")

    data = eval(sanitized)
  } catch {
    throw new Error("Invalid grid")
  }

  // 1D array → convert to single-row grid
  if (Array.isArray(data) && !Array.isArray(data[0])) {
    if (data.length > MAX) throw new Error("Grid too large")
    return [normalizeRow(data, data.length)]
  }

  if (!Array.isArray(data)) {
    throw new Error("Invalid grid")
  }

  if (data.length > MAX) throw new Error("Grid too large")

  const maxCols = Math.max(...data.map(r => r?.length || 0))
  if (maxCols > MAX) throw new Error("Grid too large")

  return data.map(row => normalizeRow(row, maxCols))
}

function normalizeRow(row, size) {
  const out = []
  for (let i = 0; i < size; i++) {
    out.push(row?.[i] ?? null)
  }
  return out
}

export function parseSpaceGridInput(input) {
  if (!input || !input.trim()) return []

  const lines = input.split("\n")

  const blocks = []
  let current = []
  let depth = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.includes("[")) depth++
    if (depth > 0) current.push(trimmed)
    if (trimmed.includes("]")) depth--

    if (depth === 0 && current.length > 0) {
      blocks.push(current.join("\n"))
      current = []
    }
  }
  if (depth !== 0) return []

  if (blocks.length > MAX_GRIDS) return []

  const grids = []

  for (const block of blocks) {
    if (!block.startsWith("[") || !block.endsWith("]")) return []

    const content = block.slice(1, -1).trim()

    if (!content) {
      grids.push([[null]])
      continue
    }

    const rows = content
      .split("\n")
      .map(r => r.replace(/,/g, "").trim())
      .filter(Boolean)

    const grid = rows.map(row =>
      row
        .split(/\s+/)
        .filter(Boolean)
        .map(v => (!isNaN(v) ? Number(v) : v))
    )

    const maxCols = Math.max(...grid.map(r => r.length))
    grids.push(grid.map(r => normalizeRow(r, maxCols)))
  }

  return grids
}
