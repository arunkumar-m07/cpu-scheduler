import { Process, AlgorithmId, GanttSegment, ProcessResult, SimulationResult, TimeStepSnapshot, PresetWorkload } from '../types'

export const ALGORITHM_DETAILS: Record<
  AlgorithmId,
  { name: string; tag: string; description: string; preemptive: boolean }
> = {
  FCFS: {
    name: 'First-Come, First-Served',
    tag: 'FCFS',
    description: 'Executes processes strictly in order of their arrival. Simple, but vulnerable to the convoy effect.',
    preemptive: false,
  },
  SJF: {
    name: 'Shortest Job First',
    tag: 'SJF (Non-Preemptive)',
    description: 'Selects the ready process with the smallest total burst time. Minimizes average waiting time for non-preemptive setups.',
    preemptive: false,
  },
  SRTF: {
    name: 'Shortest Remaining Time First',
    tag: 'SRTF (Preemptive SJF)',
    description: 'Preempts currently running job if a newly arrived process has shorter remaining execution time.',
    preemptive: true,
  },
  RR: {
    name: 'Round Robin',
    tag: 'Round Robin',
    description: 'Allocates a fixed time slice (quantum) cyclically across all active processes. Optimal for interactive multi-user systems.',
    preemptive: true,
  },
  PRIORITY_NP: {
    name: 'Priority (Non-Preemptive)',
    tag: 'Priority (NP)',
    description: 'Executes highest priority job to completion. May lead to starvation of low-priority tasks.',
    preemptive: false,
  },
  PRIORITY_P: {
    name: 'Priority (Preemptive)',
    tag: 'Priority (Preemptive)',
    description: 'Immediately interrupts the current process if a higher priority process enters the ready queue.',
    preemptive: true,
  },
  HRRN: {
    name: 'Highest Response Ratio Next',
    tag: 'HRRN',
    description: 'Prioritizes jobs by response ratio = (Wait Time + Burst Time) / Burst Time. Solves starvation dynamically.',
    preemptive: false,
  },
}

function calculateMetrics(
  processes: Process[],
  gantt: GanttSegment[],
  firstResponseTime: Record<string, number>,
  snapshots: TimeStepSnapshot[],
  algorithmId: AlgorithmId
): SimulationResult {
  const n = processes.length
  if (n === 0 || gantt.length === 0) {
    return {
      algorithmId,
      algorithmName: ALGORITHM_DETAILS[algorithmId].name,
      gantt: [],
      results: [],
      avgTurnaroundTime: 0,
      avgWaitingTime: 0,
      avgResponseTime: 0,
      cpuUtilization: 0,
      throughput: 0,
      totalTime: 0,
      snapshots: [],
    }
  }

  const completionTimes: Record<string, number> = {}
  gantt.forEach((seg) => {
    if (seg.processId !== 'IDLE') {
      completionTimes[seg.processId] = seg.end
    }
  })

  const results: ProcessResult[] = processes.map((p) => {
    const ct = completionTimes[p.id] ?? p.arrivalTime
    const tat = ct - p.arrivalTime
    const wt = tat - p.burstTime
    const rt = (firstResponseTime[p.id] ?? p.arrivalTime) - p.arrivalTime
    return {
      id: p.id,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      priority: p.priority,
      completionTime: ct,
      turnaroundTime: tat,
      waitingTime: wt >= 0 ? wt : 0,
      responseTime: rt >= 0 ? rt : 0,
      color: p.color,
    }
  })

  const totalTime = gantt[gantt.length - 1].end
  const busyTime = gantt
    .filter((s) => s.processId !== 'IDLE')
    .reduce((sum, s) => sum + (s.end - s.start), 0)

  const cpuUtilization = totalTime > 0 ? (busyTime / totalTime) * 100 : 0
  const throughput = totalTime > 0 ? (n / totalTime) : 0

  const sumTAT = results.reduce((acc, r) => acc + r.turnaroundTime, 0)
  const sumWT = results.reduce((acc, r) => acc + r.waitingTime, 0)
  const sumRT = results.reduce((acc, r) => acc + r.responseTime, 0)

  return {
    algorithmId,
    algorithmName: ALGORITHM_DETAILS[algorithmId].name,
    gantt,
    results,
    avgTurnaroundTime: Number((sumTAT / n).toFixed(2)),
    avgWaitingTime: Number((sumWT / n).toFixed(2)),
    avgResponseTime: Number((sumRT / n).toFixed(2)),
    cpuUtilization: Number(cpuUtilization.toFixed(1)),
    throughput: Number(throughput.toFixed(3)),
    totalTime,
    snapshots,
  }
}

// Merge adjacent identical gantt segments
function compressGantt(segments: GanttSegment[]): GanttSegment[] {
  if (segments.length === 0) return []
  const compressed: GanttSegment[] = []
  let curr = { ...segments[0] }

  for (let i = 1; i < segments.length; i++) {
    const s = segments[i]
    if (s.processId === curr.processId && s.start === curr.end) {
      curr.end = s.end
    } else {
      compressed.push(curr)
      curr = { ...s }
    }
  }
  compressed.push(curr)
  return compressed
}

export function simulateScheduler(
  processesInput: Process[],
  algorithm: AlgorithmId,
  timeQuantum: number = 2,
  priorityLowerIsBetter: boolean = true
): SimulationResult {
  if (processesInput.length === 0) {
    return calculateMetrics([], [], {}, [], algorithm)
  }

  // Clone processes
  const processes = processesInput.map((p) => ({ ...p }))
  const totalProcesses = processes.length

  const firstResponseTime: Record<string, number> = {}
  const rawGantt: GanttSegment[] = []
  const snapshots: TimeStepSnapshot[] = []

  let currentTime = 0
  let completedCount = 0
  const completedIds = new Set<string>()

  // Helper comparator for priority
  const comparePriority = (p1: Process, p2: Process) => {
    if (p1.priority === p2.priority) return p1.arrivalTime - p2.arrivalTime
    return priorityLowerIsBetter ? p1.priority - p2.priority : p2.priority - p1.priority
  }

  if (algorithm === 'FCFS') {
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
    for (const p of sorted) {
      if (currentTime < p.arrivalTime) {
        rawGantt.push({
          processId: 'IDLE',
          start: currentTime,
          end: p.arrivalTime,
          color: '#334155',
        })
        currentTime = p.arrivalTime
      }
      firstResponseTime[p.id] = currentTime
      rawGantt.push({
        processId: p.id,
        start: currentTime,
        end: currentTime + p.burstTime,
        color: p.color,
      })
      currentTime += p.burstTime
      completedIds.add(p.id)
    }
  } else if (algorithm === 'SJF') {
    const remaining = [...processes]
    while (completedCount < totalProcesses) {
      const available = remaining.filter((p) => p.arrivalTime <= currentTime && !completedIds.has(p.id))
      if (available.length === 0) {
        const nextArrival = Math.min(...remaining.filter((p) => !completedIds.has(p.id)).map((p) => p.arrivalTime))
        rawGantt.push({
          processId: 'IDLE',
          start: currentTime,
          end: nextArrival,
          color: '#334155',
        })
        currentTime = nextArrival
        continue
      }

      available.sort((a, b) => (a.burstTime === b.burstTime ? a.arrivalTime - b.arrivalTime : a.burstTime - b.burstTime))
      const chosen = available[0]
      firstResponseTime[chosen.id] = currentTime
      rawGantt.push({
        processId: chosen.id,
        start: currentTime,
        end: currentTime + chosen.burstTime,
        color: chosen.color,
      })
      currentTime += chosen.burstTime
      completedIds.add(chosen.id)
      completedCount++
    }
  } else if (algorithm === 'SRTF') {
    const remainingTime: Record<string, number> = {}
    processes.forEach((p) => (remainingTime[p.id] = p.burstTime))

    while (completedCount < totalProcesses) {
      const available = processes.filter((p) => p.arrivalTime <= currentTime && remainingTime[p.id] > 0)

      if (available.length === 0) {
        const unarrived = processes.filter((p) => remainingTime[p.id] > 0)
        const nextArrival = Math.min(...unarrived.map((p) => p.arrivalTime))
        rawGantt.push({
          processId: 'IDLE',
          start: currentTime,
          end: nextArrival,
          color: '#334155',
        })
        currentTime = nextArrival
        continue
      }

      available.sort((a, b) => {
        if (remainingTime[a.id] === remainingTime[b.id]) return a.arrivalTime - b.arrivalTime
        return remainingTime[a.id] - remainingTime[b.id]
      })

      const chosen = available[0]
      if (!(chosen.id in firstResponseTime)) {
        firstResponseTime[chosen.id] = currentTime
      }

      // Run 1 time unit
      rawGantt.push({
        processId: chosen.id,
        start: currentTime,
        end: currentTime + 1,
        color: chosen.color,
      })

      remainingTime[chosen.id] -= 1
      currentTime += 1

      if (remainingTime[chosen.id] === 0) {
        completedIds.add(chosen.id)
        completedCount++
      }
    }
  } else if (algorithm === 'RR') {
    const remainingTime: Record<string, number> = {}
    processes.forEach((p) => (remainingTime[p.id] = p.burstTime))

    const readyQueue: string[] = []
    const inQueue = new Set<string>()

    const checkArrivals = (time: number) => {
      processes
        .filter((p) => p.arrivalTime <= time && remainingTime[p.id] > 0 && !inQueue.has(p.id))
        .sort((a, b) => a.arrivalTime - b.arrivalTime)
        .forEach((p) => {
          readyQueue.push(p.id)
          inQueue.add(p.id)
        })
    }

    checkArrivals(currentTime)

    while (completedCount < totalProcesses) {
      if (readyQueue.length === 0) {
        const pending = processes.filter((p) => remainingTime[p.id] > 0)
        if (pending.length === 0) break
        const nextArrival = Math.min(...pending.map((p) => p.arrivalTime))
        rawGantt.push({
          processId: 'IDLE',
          start: currentTime,
          end: nextArrival,
          color: '#334155',
        })
        currentTime = nextArrival
        checkArrivals(currentTime)
        continue
      }

      const pId = readyQueue.shift()!
      inQueue.delete(pId)
      const p = processes.find((item) => item.id === pId)!

      if (!(pId in firstResponseTime)) {
        firstResponseTime[pId] = currentTime
      }

      const execTime = Math.min(timeQuantum, remainingTime[pId])
      rawGantt.push({
        processId: pId,
        start: currentTime,
        end: currentTime + execTime,
        color: p.color,
      })

      currentTime += execTime
      remainingTime[pId] -= execTime

      // Newly arrived processes during execution get added first
      checkArrivals(currentTime)

      if (remainingTime[pId] > 0) {
        readyQueue.push(pId)
        inQueue.add(pId)
      } else {
        completedIds.add(pId)
        completedCount++
      }
    }
  } else if (algorithm === 'PRIORITY_NP') {
    while (completedCount < totalProcesses) {
      const available = processes.filter((p) => p.arrivalTime <= currentTime && !completedIds.has(p.id))
      if (available.length === 0) {
        const nextArrival = Math.min(...processes.filter((p) => !completedIds.has(p.id)).map((p) => p.arrivalTime))
        rawGantt.push({
          processId: 'IDLE',
          start: currentTime,
          end: nextArrival,
          color: '#334155',
        })
        currentTime = nextArrival
        continue
      }

      available.sort(comparePriority)
      const chosen = available[0]
      firstResponseTime[chosen.id] = currentTime
      rawGantt.push({
        processId: chosen.id,
        start: currentTime,
        end: currentTime + chosen.burstTime,
        color: chosen.color,
      })
      currentTime += chosen.burstTime
      completedIds.add(chosen.id)
      completedCount++
    }
  } else if (algorithm === 'PRIORITY_P') {
    const remainingTime: Record<string, number> = {}
    processes.forEach((p) => (remainingTime[p.id] = p.burstTime))

    while (completedCount < totalProcesses) {
      const available = processes.filter((p) => p.arrivalTime <= currentTime && remainingTime[p.id] > 0)

      if (available.length === 0) {
        const unarrived = processes.filter((p) => remainingTime[p.id] > 0)
        const nextArrival = Math.min(...unarrived.map((p) => p.arrivalTime))
        rawGantt.push({
          processId: 'IDLE',
          start: currentTime,
          end: nextArrival,
          color: '#334155',
        })
        currentTime = nextArrival
        continue
      }

      available.sort(comparePriority)
      const chosen = available[0]

      if (!(chosen.id in firstResponseTime)) {
        firstResponseTime[chosen.id] = currentTime
      }

      rawGantt.push({
        processId: chosen.id,
        start: currentTime,
        end: currentTime + 1,
        color: chosen.color,
      })

      remainingTime[chosen.id] -= 1
      currentTime += 1

      if (remainingTime[chosen.id] === 0) {
        completedIds.add(chosen.id)
        completedCount++
      }
    }
  } else if (algorithm === 'HRRN') {
    while (completedCount < totalProcesses) {
      const available = processes.filter((p) => p.arrivalTime <= currentTime && !completedIds.has(p.id))

      if (available.length === 0) {
        const nextArrival = Math.min(...processes.filter((p) => !completedIds.has(p.id)).map((p) => p.arrivalTime))
        rawGantt.push({
          processId: 'IDLE',
          start: currentTime,
          end: nextArrival,
          color: '#334155',
        })
        currentTime = nextArrival
        continue
      }

      // Calculate Response Ratio = (W + S) / S = 1 + W / S
      available.sort((a, b) => {
        const waitA = currentTime - a.arrivalTime
        const waitB = currentTime - b.arrivalTime
        const ratioA = (waitA + a.burstTime) / a.burstTime
        const ratioB = (waitB + b.burstTime) / b.burstTime
        if (ratioA === ratioB) return a.arrivalTime - b.arrivalTime
        return ratioB - ratioA // Highest ratio first
      })

      const chosen = available[0]
      firstResponseTime[chosen.id] = currentTime
      rawGantt.push({
        processId: chosen.id,
        start: currentTime,
        end: currentTime + chosen.burstTime,
        color: chosen.color,
      })
      currentTime += chosen.burstTime
      completedIds.add(chosen.id)
      completedCount++
    }
  }

  // Compress adjacent slices
  const gantt = compressGantt(rawGantt)

  // Build time step snapshots for playback
  const maxTime = gantt.length > 0 ? gantt[gantt.length - 1].end : 0
  for (let t = 0; t <= maxTime; t++) {
    const activeSeg = gantt.find((s) => t >= s.start && t < s.end)
    const currentPid = activeSeg && activeSeg.processId !== 'IDLE' ? activeSeg.processId : null

    // Ready queue are arrived processes that haven't completed
    const completedAtT = new Set(
      gantt
        .filter((s) => s.end <= t && s.processId !== 'IDLE')
        .map((s) => s.processId)
    )

    const readyAtT = processes
      .filter((p) => p.arrivalTime <= t && !completedAtT.has(p.id) && p.id !== currentPid)
      .map((p) => p.id)

    snapshots.push({
      time: t,
      currentProcessId: currentPid,
      readyQueue: readyAtT,
      completed: Array.from(completedAtT),
    })
  }

  return calculateMetrics(processesInput, gantt, firstResponseTime, snapshots, algorithm)
}

export const PRESET_WORKLOADS: PresetWorkload[] = [
  {
    name: 'Standard OS Mix',
    description: 'Realistic mix of varied arrival times and CPU burst durations.',
    recommendedAlgo: 'RR',
    timeQuantum: 3,
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2, color: '#06b6d4' },
      { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1, color: '#8b5cf6' },
      { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 4, color: '#10b981' },
      { id: 'P4', arrivalTime: 3, burstTime: 6, priority: 3, color: '#f59e0b' },
    ],
  },
  {
    name: 'Convoy Effect (FCFS Flaw)',
    description: 'A heavy job arrives first, holding back lightweight interactive jobs.',
    recommendedAlgo: 'FCFS',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 24, priority: 3, color: '#ef4444' },
      { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1, color: '#06b6d4' },
      { id: 'P3', arrivalTime: 2, burstTime: 3, priority: 2, color: '#10b981' },
    ],
  },
  {
    name: 'Interactive Short Bursts',
    description: 'Multiple short CPU bursts showing the superiority of SJF & SRTF.',
    recommendedAlgo: 'SRTF',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 7, priority: 3, color: '#3b82f6' },
      { id: 'P2', arrivalTime: 2, burstTime: 4, priority: 1, color: '#ec4899' },
      { id: 'P3', arrivalTime: 4, burstTime: 1, priority: 2, color: '#10b981' },
      { id: 'P4', arrivalTime: 5, burstTime: 4, priority: 4, color: '#f59e0b' },
    ],
  },
  {
    name: 'Priority & Starvation Demo',
    description: 'High-priority processes keep arriving, showing potential starvation and HRRN mitigation.',
    recommendedAlgo: 'PRIORITY_P',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 10, priority: 4, color: '#6366f1' },
      { id: 'P2', arrivalTime: 1, burstTime: 2, priority: 1, color: '#10b981' },
      { id: 'P3', arrivalTime: 3, burstTime: 3, priority: 2, color: '#06b6d4' },
      { id: 'P4', arrivalTime: 5, burstTime: 2, priority: 1, color: '#ec4899' },
    ],
  },
]
