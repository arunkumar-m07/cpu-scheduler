import React from 'react'
import { SimulationResult } from '../types'

interface MetricsOverviewProps {
  result: SimulationResult
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ result }) => {
  return (
    <div className="metrics-grid">
      <div className="metric-card metric-card-cyan">
        <div className="metric-header">
          <span className="metric-label">Avg Turnaround Time</span>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
        <div className="metric-value">
          {result.avgTurnaroundTime}
          <span className="metric-unit">ms</span>
        </div>
        <div className="metric-formula">TAT = Completion - Arrival</div>
      </div>

      <div className="metric-card metric-card-violet">
        <div className="metric-header">
          <span className="metric-label">Avg Waiting Time</span>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
        </div>
        <div className="metric-value">
          {result.avgWaitingTime}
          <span className="metric-unit">ms</span>
        </div>
        <div className="metric-formula">WT = TAT - Burst Time</div>
      </div>

      <div className="metric-card metric-card-emerald">
        <div className="metric-header">
          <span className="metric-label">Avg Response Time</span>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
        </div>
        <div className="metric-value">
          {result.avgResponseTime}
          <span className="metric-unit">ms</span>
        </div>
        <div className="metric-formula">RT = 1st Execution - Arrival</div>
      </div>

      <div className="metric-card metric-card-amber">
        <div className="metric-header">
          <span className="metric-label">CPU Utilization</span>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
        </div>
        <div className="metric-value">
          {result.cpuUtilization}
          <span className="metric-unit">%</span>
        </div>
        <div className="metric-progress-track">
          <div
            className="metric-progress-fill"
            style={{ width: `${Math.min(100, result.cpuUtilization)}%` }}
          />
        </div>
      </div>

      <div className="metric-card metric-card-rose">
        <div className="metric-header">
          <span className="metric-label">Throughput</span>
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
        </div>
        <div className="metric-value">
          {result.throughput}
          <span className="metric-unit">proc/ms</span>
        </div>
        <div className="metric-formula">Total: {result.totalTime} ms timeline</div>
      </div>
    </div>
  )
}
