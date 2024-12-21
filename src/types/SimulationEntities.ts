export interface SimulationEntity {
  id: string
  label: string
}

export interface Point extends SimulationEntity {
  position: [number, number, number],
  availability: [Date, Date]
}

export interface Line extends SimulationEntity {
  positions: [number, number, number][],
  availability: [Date, Date]
}

export interface Area extends SimulationEntity {
  positions: [number, number, number][],
  availability: [Date, Date]
}
