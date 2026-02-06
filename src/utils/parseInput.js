const MAX = 100
const MAX_GRIDS = 20
export function parseInput(input) {
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

  
  if (Array.isArray(data) && !Array.isArray(data[0])) {
    if (data.length > MAX) throw new Error("Grid too large")
    return [normalizeRow(data, data.length)]
  }

  if (!Array.isArray(data)) {
    throw new Error("Invalid grid")
  }

  if (data.length > MAX) throw new Error("Grid too large")

  const maxCols = Math.max(...data.map(r => r.length || 0))
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
