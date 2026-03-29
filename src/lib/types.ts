export type CounterState = 'red' | 'grey' | null

export interface CellState {
  [id: string]: CounterState
}

export interface Terms {
  x: string
  y: string
  m: string
}
