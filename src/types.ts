export type AlgorithmId =
  | 'FCFS'
  | 'SJF'
  | 'SRTF'
  | 'RR'
  | 'PRIORITY_NP'
  | 'PRIORITY_P'
  | 'HRRN'

export interface Process {
  id: string
  arrivalTime: number
  burstTime: number
  priority: number
  color: string
}

export interface GanttSegment {
  processId: string
  start: number
  end: number
  color: string
}

export interface ProcessResult {
  id: string
  arrivalTime: number
  burstTime: number
  priority: number
  completionTime: number
  turnaroundTime: number
  waitingTime: number
  responseTime: number
  color: string
}

export interface TimeStepSnapshot {
  time: number
  currentProcessId: string | null
  readyQueue: string[]
  completed: string[]
}

export interface SimulationResult {
  algorithmId: AlgorithmId
  algorithmName: string
  gantt: GanttSegment[]
  results: ProcessResult[]
  avgTurnaroundTime: number
  avgWaitingTime: number
  avgResponseTime: number
  cpuUtilization: number
  throughput: number
  totalTime: number
  snapshots: TimeStepSnapshot[]
}

export interface PresetWorkload {
  name: string
  description: string
  processes: Process[]
  recommendedAlgo?: AlgorithmId
  timeQuantum?: number
}
