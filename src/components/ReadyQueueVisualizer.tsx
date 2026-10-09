import React from 'react'
import { Process, TimeStepSnapshot } from '../types'

interface ReadyQueueVisualizerProps {
  currentSnapshot?: TimeStepSnapshot
  processes: Process[]
  currentTimeStep: number
  totalTime: number
  isPlaying: boolean
  onTogglePlay: () => void
  onStepNext: () => void
  onStepPrev: () => void
  onResetPlayback: () => void
  playbackSpeed: number
  onChangeSpeed: (speed: number) => void
  onSeek: (time: number) => void
}

export const ReadyQueueVisualizer: React.FC<ReadyQueueVisualizerProps> = ({
  currentSnapshot,
  processes,
  currentTimeStep,
  totalTime,
  isPlaying,
  onTogglePlay,
  onStepNext,
  onStepPrev,
  onResetPlayback,
  playbackSpeed,
  onChangeSpeed,
  onSeek,
}) => {
  const currentProcess = processes.find((p) => p.id === currentSnapshot?.currentProcessId)
  const readyQueueProcesses = (currentSnapshot?.readyQueue ?? [])
    .map((id) => processes.find((p) => p.id === id))
    .filter(Boolean) as Process[]

  return (
    <div className="simulation-playback-card">
      <div className="playback-header">
        <div className="playback-title">
          <span className="live-indicator"></span>
          <span>Simulation Playback & Live State</span>
        </div>
        <div className="time-counter-badge">
          Time: <strong className="neon-text">{currentTimeStep}</strong> / {totalTime} ms
        </div>
      </div>

      {/* Scrub bar */}
      <div className="scrub-container">
        <input
          type="range"
          min="0"
          max={totalTime}
          value={currentTimeStep}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="scrub-slider"
        />
      </div>

      {/* Playback Controls */}
      <div className="playback-controls-row">
        <div className="btn-group">
          <button
            className="btn-playback"
            onClick={onStepPrev}
            disabled={currentTimeStep <= 0}
            title="Step Back 1ms"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="19" x2="5" y2="5" />
            </svg>
          </button>

          <button
            className={`btn-playback btn-play-main ${isPlaying ? 'is-active' : ''}`}
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause' : 'Play Simulation'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
            <span>{isPlaying ? 'Pause' : 'Run Live'}</span>
          </button>

          <button
            className="btn-playback"
            onClick={onStepNext}
            disabled={currentTimeStep >= totalTime}
            title="Step Forward 1ms"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>

          <button
            className="btn-playback"
            onClick={onResetPlayback}
            title="Reset to 0ms"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
        </div>

        <div className="speed-selector">
          <label>Speed:</label>
          {[0.5, 1, 2, 4].map((speed) => (
            <button
              key={speed}
              className={`btn-speed ${playbackSpeed === speed ? 'speed-active' : ''}`}
              onClick={() => onChangeSpeed(speed)}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Live State: CPU vs Ready Queue */}
      <div className="cpu-state-grid">
        {/* CPU Socket */}
        <div className="cpu-socket-box">
          <div className="socket-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
            </svg>
            <span>CPU EXECUTION CORE</span>
          </div>

          {currentProcess ? (
            <div className="active-core-card" style={{ borderColor: currentProcess.color }}>
              <div className="core-pid" style={{ color: currentProcess.color }}>
                {currentProcess.id}
              </div>
              <div className="core-meta">
                <span>Burst: {currentProcess.burstTime}ms</span>
                <span>Priority: {currentProcess.priority}</span>
              </div>
              <div className="core-status-pulse">EXECUTING</div>
            </div>
          ) : (
            <div className="idle-core-card">
              <span className="idle-pulse-dot" />
              <span>CPU IS IDLE</span>
            </div>
          )}
        </div>

        {/* Ready Queue Box */}
        <div className="ready-queue-box">
          <div className="socket-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span>READY QUEUE ({readyQueueProcesses.length})</span>
          </div>

          <div className="queue-items-container">
            {readyQueueProcesses.length === 0 ? (
              <div className="empty-queue-msg">Queue is empty</div>
            ) : (
              readyQueueProcesses.map((p) => (
                <div
                  key={p.id}
                  className="queue-process-pill"
                  style={{ borderLeftColor: p.color }}
                >
                  <span className="pill-id">{p.id}</span>
                  <span className="pill-detail">Burst: {p.burstTime}</span>
                  <span className="pill-detail">Prio: {p.priority}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
