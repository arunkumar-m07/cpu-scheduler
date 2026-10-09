import React from 'react'
import { GanttSegment } from '../types'

interface GanttChartProps {
  segments: GanttSegment[]
  totalTime: number
  currentTimeStep?: number
  isPlaying?: boolean
}

export const GanttChart: React.FC<GanttChartProps> = ({
  segments,
  totalTime,
  currentTimeStep,
}) => {
  if (segments.length === 0 || totalTime === 0) {
    return (
      <div className="empty-gantt">
        <p>No processes executed. Add processes or load a preset to generate the Gantt chart.</p>
      </div>
    )
  }

  // Calculate percentage markers for time axis
  // Generate distinct ticks
  const ticks = Array.from(new Set([0, ...segments.map((s) => s.end)])).sort((a, b) => a - b)

  return (
    <div className="gantt-container">
      <div className="gantt-header">
        <div className="gantt-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span>Visual Execution Gantt Chart</span>
        </div>
        <div className="gantt-legend">
          <span className="legend-item">
            <span className="legend-color idle-color" /> Idle CPU
          </span>
          <span className="legend-item">
            <span className="legend-color running-color" /> Active Process
          </span>
        </div>
      </div>

      <div className="gantt-chart-wrapper">
        <div className="gantt-bar-track">
          {segments.map((seg, idx) => {
            const duration = seg.end - seg.start
            const widthPercent = (duration / totalTime) * 100
            const isIdle = seg.processId === 'IDLE'
            const isCurrentlyActive =
              currentTimeStep !== undefined &&
              currentTimeStep >= seg.start &&
              currentTimeStep < seg.end

            return (
              <div
                key={idx}
                className={`gantt-segment ${isIdle ? 'segment-idle' : ''} ${
                  isCurrentlyActive ? 'segment-active-pulse' : ''
                }`}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: isIdle ? undefined : seg.color,
                }}
                title={`${seg.processId}: [${seg.start}ms → ${seg.end}ms] (${duration}ms)`}
              >
                <div className="segment-label">
                  <span className="pid-badge">{seg.processId}</span>
                  <span className="duration-badge">{duration}ms</span>
                </div>
              </div>
            )
          })}

          {/* Interactive Playhead indicator */}
          {currentTimeStep !== undefined && (
            <div
              className="gantt-playhead"
              style={{
                left: `${Math.min(100, (currentTimeStep / totalTime) * 100)}%`,
              }}
            >
              <div className="playhead-line" />
              <div className="playhead-tag">t={currentTimeStep}</div>
            </div>
          )}
        </div>

        {/* Time Scale Markers */}
        <div className="gantt-timeline-ticks">
          {ticks.map((t) => {
            const leftPercent = (t / totalTime) * 100
            return (
              <div
                key={t}
                className="gantt-tick"
                style={{ left: `${leftPercent}%` }}
              >
                <span className="tick-line" />
                <span className="tick-number">{t}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
