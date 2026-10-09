import React, { useMemo } from 'react'
import { Process, AlgorithmId, SimulationResult } from '../types'
import { ALGORITHM_DETAILS, simulateScheduler } from '../algorithms/scheduler'

interface AlgorithmComparisonProps {
  processes: Process[]
  timeQuantum: number
  priorityLowerIsBetter: boolean
  onSelectAlgorithm: (id: AlgorithmId) => void
  onClose: () => void
}

export const AlgorithmComparison: React.FC<AlgorithmComparisonProps> = ({
  processes,
  timeQuantum,
  priorityLowerIsBetter,
  onSelectAlgorithm,
  onClose,
}) => {
  const comparisons: SimulationResult[] = useMemo(() => {
    const algos: AlgorithmId[] = ['FCFS', 'SJF', 'SRTF', 'RR', 'PRIORITY_NP', 'PRIORITY_P', 'HRRN']
    return algos.map((id) => simulateScheduler(processes, id, timeQuantum, priorityLowerIsBetter))
  }, [processes, timeQuantum, priorityLowerIsBetter])

  // Find lowest average waiting time
  const bestWT = useMemo(() => {
    if (comparisons.length === 0) return 0
    return Math.min(...comparisons.map((c) => c.avgWaitingTime))
  }, [comparisons])

  const maxWT = useMemo(() => {
    if (comparisons.length === 0) return 1
    return Math.max(...comparisons.map((c) => c.avgWaitingTime), 1)
  }, [comparisons])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="badge-chip">BENCHMARK</div>
            <h2>Side-by-Side Algorithm Comparison</h2>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className="modal-description">
          Evaluates all 7 CPU scheduling algorithms against your active set of {processes.length} processes.
        </p>

        {/* Visual Bar Comparison */}
        <div className="comparison-bars-section">
          <h3>Average Waiting Time Comparison (Lower is Better)</h3>
          <div className="bar-compare-list">
            {comparisons.map((item) => {
              const isBest = item.avgWaitingTime === bestWT
              const barWidth = Math.max(8, (item.avgWaitingTime / maxWT) * 100)

              return (
                <div key={item.algorithmId} className="bar-compare-row">
                  <div className="bar-row-label">
                    <span className="algo-tag">{ALGORITHM_DETAILS[item.algorithmId].tag}</span>
                    {isBest && <span className="winner-tag">★ Optimal</span>}
                  </div>
                  <div className="bar-track">
                    <div
                      className={`bar-fill ${isBest ? 'bar-fill-best' : ''}`}
                      style={{ width: `${barWidth}%` }}
                    />
                    <span className="bar-value-text">{item.avgWaitingTime} ms</span>
                  </div>
                  <button
                    className="btn-apply-algo"
                    onClick={() => {
                      onSelectAlgorithm(item.algorithmId)
                      onClose()
                    }}
                  >
                    Select
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="table-responsive modal-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Type</th>
                <th>Avg Turnaround</th>
                <th>Avg Waiting</th>
                <th>Avg Response</th>
                <th>CPU Utilization</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((c) => {
                const details = ALGORITHM_DETAILS[c.algorithmId]
                const isBest = c.avgWaitingTime === bestWT

                return (
                  <tr key={c.algorithmId} className={isBest ? 'best-row' : ''}>
                    <td>
                      <strong>{details.name}</strong>
                    </td>
                    <td>
                      <span className={`tag-type ${details.preemptive ? 'tag-preempt' : 'tag-nonpreempt'}`}>
                        {details.preemptive ? 'Preemptive' : 'Non-Preemptive'}
                      </span>
                    </td>
                    <td>{c.avgTurnaroundTime} ms</td>
                    <td>
                      <span className={isBest ? 'best-wt-badge' : ''}>{c.avgWaitingTime} ms</span>
                    </td>
                    <td>{c.avgResponseTime} ms</td>
                    <td>{c.cpuUtilization}%</td>
                    <td>
                      <button
                        className="btn-select-mini"
                        onClick={() => {
                          onSelectAlgorithm(c.algorithmId)
                          onClose()
                        }}
                      >
                        Load
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
