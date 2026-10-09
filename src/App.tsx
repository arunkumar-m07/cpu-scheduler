import React, { useState, useMemo, useEffect } from 'react'
import { Process, AlgorithmId } from './types'
import {
  ALGORITHM_DETAILS,
  PRESET_WORKLOADS,
  simulateScheduler,
} from './algorithms/scheduler'
import { Navbar } from './components/Navbar'
import { MetricsOverview } from './components/MetricsOverview'
import { GanttChart } from './components/GanttChart'
import { ReadyQueueVisualizer } from './components/ReadyQueueVisualizer'
import { ProcessInputTable } from './components/ProcessInputTable'
import { ResultsTable } from './components/ResultsTable'
import { AlgorithmComparison } from './components/AlgorithmComparison'
import { TheoryModal } from './components/TheoryModal'

const PALETTE = [
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#f43f5e', // Rose
  '#a855f7', // Purple
  '#6366f1', // Indigo
]

export const App: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>(PRESET_WORKLOADS[0].processes)
  const [algorithm, setAlgorithm] = useState<AlgorithmId>('RR')
  const [timeQuantum, setTimeQuantum] = useState<number>(3)
  const [priorityLowerIsBetter, setPriorityLowerIsBetter] = useState<boolean>(true)

  // Simulation playback state
  const [currentTimeStep, setCurrentTimeStep] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)

  // Modals
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false)
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false)

  // Run simulation computation
  const simulation = useMemo(() => {
    return simulateScheduler(processes, algorithm, timeQuantum, priorityLowerIsBetter)
  }, [processes, algorithm, timeQuantum, priorityLowerIsBetter])

  // Reset time step when processes or algorithm changes
  useEffect(() => {
    setCurrentTimeStep(0)
    setIsPlaying(false)
  }, [processes, algorithm, timeQuantum, priorityLowerIsBetter])

  // Animation playhead loop
  useEffect(() => {
    let timer: number | null = null

    if (isPlaying) {
      const intervalMs = Math.max(100, Math.floor(1000 / playbackSpeed))
      timer = window.setInterval(() => {
        setCurrentTimeStep((prev) => {
          if (prev >= simulation.totalTime) {
            setIsPlaying(false)
            return simulation.totalTime
          }
          return prev + 1
        })
      }, intervalMs)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isPlaying, playbackSpeed, simulation.totalTime])

  // Process management handlers
  const handleAddProcess = () => {
    const nextIdx = processes.length + 1
    const color = PALETTE[(nextIdx - 1) % PALETTE.length]
    const maxArrival = processes.reduce((max, p) => Math.max(max, p.arrivalTime), 0)

    const newProc: Process = {
      id: `P${nextIdx}`,
      arrivalTime: maxArrival + 1,
      burstTime: Math.floor(Math.random() * 6) + 2,
      priority: Math.floor(Math.random() * 4) + 1,
      color,
    }

    setProcesses([...processes, newProc])
  }

  const handleDeleteProcess = (id: string) => {
    setProcesses(processes.filter((p) => p.id !== id))
  }

  const handleUpdateProcess = (id: string, field: keyof Process, val: number) => {
    setProcesses(
      processes.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: val }
        }
        return p
      })
    )
  }

  const handleLoadPreset = (idx: number) => {
    const preset = PRESET_WORKLOADS[idx]
    if (preset) {
      setProcesses(preset.processes)
      if (preset.recommendedAlgo) {
        setAlgorithm(preset.recommendedAlgo)
      }
      if (preset.timeQuantum) {
        setTimeQuantum(preset.timeQuantum)
      }
    }
  }

  const handleGenerateRandom = () => {
    const count = Math.floor(Math.random() * 3) + 4 // 4 to 6 processes
    const newProcs: Process[] = []

    for (let i = 1; i <= count; i++) {
      newProcs.push({
        id: `P${i}`,
        arrivalTime: Math.floor(Math.random() * 7),
        burstTime: Math.floor(Math.random() * 9) + 2,
        priority: Math.floor(Math.random() * 5) + 1,
        color: PALETTE[(i - 1) % PALETTE.length],
      })
    }

    setProcesses(newProcs)
  }

  const handleClearAll = () => {
    setProcesses([])
  }

  const currentSnapshot = simulation.snapshots.find((s) => s.time === currentTimeStep)

  return (
    <div className="app-layout">
      <Navbar
        algorithm={algorithm}
        onSelectAlgorithm={(algo) => setAlgorithm(algo)}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onOpenComparison={() => setIsComparisonOpen(true)}
      />

      <main className="main-content">
        {/* Top algorithm header banner */}
        <section className="algo-header-banner">
          <div className="banner-badge-row">
            <span className="badge-primary">{ALGORITHM_DETAILS[algorithm].tag}</span>
            <span className={`badge-pill ${ALGORITHM_DETAILS[algorithm].preemptive ? 'badge-preempt' : 'badge-nonpreempt'}`}>
              {ALGORITHM_DETAILS[algorithm].preemptive ? 'Preemptive' : 'Non-Preemptive'}
            </span>
            {algorithm === 'RR' && <span className="badge-pill badge-quantum">Quantum: {timeQuantum}ms</span>}
          </div>
          <h1 className="banner-title">{ALGORITHM_DETAILS[algorithm].name}</h1>
          <p className="banner-subtitle">{ALGORITHM_DETAILS[algorithm].description}</p>
        </section>

        {/* High impact metrics cards */}
        <MetricsOverview result={simulation} />

        {/* Live execution Gantt chart */}
        <GanttChart
          segments={simulation.gantt}
          totalTime={simulation.totalTime}
          currentTimeStep={currentTimeStep}
          isPlaying={isPlaying}
        />

        {/* Simulation Playback & Ready Queue Live State */}
        <ReadyQueueVisualizer
          currentSnapshot={currentSnapshot}
          processes={processes}
          currentTimeStep={currentTimeStep}
          totalTime={simulation.totalTime}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onStepNext={() => setCurrentTimeStep((prev) => Math.min(simulation.totalTime, prev + 1))}
          onStepPrev={() => setCurrentTimeStep((prev) => Math.max(0, prev - 1))}
          onResetPlayback={() => {
            setIsPlaying(false)
            setCurrentTimeStep(0)
          }}
          playbackSpeed={playbackSpeed}
          onChangeSpeed={(spd) => setPlaybackSpeed(spd)}
          onSeek={(time) => setCurrentTimeStep(time)}
        />

        {/* Side-by-side Grid: Workload Config & Results Breakdown */}
        <div className="panels-split-grid">
          <ProcessInputTable
            processes={processes}
            algorithm={algorithm}
            timeQuantum={timeQuantum}
            priorityLowerIsBetter={priorityLowerIsBetter}
            onChangeTimeQuantum={setTimeQuantum}
            onChangePriorityOrder={setPriorityLowerIsBetter}
            onAddProcess={handleAddProcess}
            onDeleteProcess={handleDeleteProcess}
            onUpdateProcess={handleUpdateProcess}
            onLoadPreset={handleLoadPreset}
            onGenerateRandom={handleGenerateRandom}
            onClearAll={handleClearAll}
          />

          <ResultsTable
            results={simulation.results}
            avgTurnaroundTime={simulation.avgTurnaroundTime}
            avgWaitingTime={simulation.avgWaitingTime}
            avgResponseTime={simulation.avgResponseTime}
            algorithmName={simulation.algorithmName}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-bar">
        <div className="footer-content">
          <div>
            <strong>CorePulse CPU Scheduler</strong> — Operating System Process Scheduling Simulation Engine
          </div>
          <div className="footer-links">
            <span>Built by Arun Kumar M.</span>
            <a href="https://github.com/arunkumar-m07" target="_blank" rel="noopener noreferrer">
              github.com/arunkumar-m07
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isTheoryOpen && <TheoryModal onClose={() => setIsTheoryOpen(false)} />}
      {isComparisonOpen && (
        <AlgorithmComparison
          processes={processes}
          timeQuantum={timeQuantum}
          priorityLowerIsBetter={priorityLowerIsBetter}
          onSelectAlgorithm={(algo) => setAlgorithm(algo)}
          onClose={() => setIsComparisonOpen(false)}
        />
      )}
    </div>
  )
}

export default App
