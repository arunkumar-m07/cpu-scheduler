import React from 'react'
import { Process, AlgorithmId } from '../types'
import { PRESET_WORKLOADS } from '../algorithms/scheduler'

interface ProcessInputTableProps {
  processes: Process[]
  algorithm: AlgorithmId
  timeQuantum: number
  priorityLowerIsBetter: boolean
  onChangeTimeQuantum: (val: number) => void
  onChangePriorityOrder: (val: boolean) => void
  onAddProcess: () => void
  onDeleteProcess: (id: string) => void
  onUpdateProcess: (id: string, field: keyof Process, val: number) => void
  onLoadPreset: (idx: number) => void
  onGenerateRandom: () => void
  onClearAll: () => void
}

export const ProcessInputTable: React.FC<ProcessInputTableProps> = ({
  processes,
  algorithm,
  timeQuantum,
  priorityLowerIsBetter,
  onChangeTimeQuantum,
  onChangePriorityOrder,
  onAddProcess,
  onDeleteProcess,
  onUpdateProcess,
  onLoadPreset,
  onGenerateRandom,
  onClearAll,
}) => {
  const showQuantum = algorithm === 'RR'
  const showPriority = algorithm === 'PRIORITY_NP' || algorithm === 'PRIORITY_P'

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div className="panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>Process Workload Config</span>
        </div>

        {/* Action presets */}
        <div className="panel-actions-row">
          <div className="preset-dropdown-wrapper">
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value !== '') {
                  onLoadPreset(Number(e.target.value))
                  e.target.value = ''
                }
              }}
              className="select-preset"
            >
              <option value="" disabled>
                Load Preset Scenario...
              </option>
              {PRESET_WORKLOADS.map((p, idx) => (
                <option key={idx} value={idx}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-secondary" onClick={onGenerateRandom} title="Generate random process mix">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Randomize</span>
          </button>

          <button className="btn-danger-outline" onClick={onClearAll} title="Clear all processes">
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Algorithm-specific parameter bar */}
      <div className="algo-tuning-bar">
        {showQuantum && (
          <div className="tuning-item">
            <label htmlFor="quantum-input">Time Quantum (q):</label>
            <div className="number-stepper">
              <input
                id="quantum-input"
                type="number"
                min="1"
                max="20"
                value={timeQuantum}
                onChange={(e) => onChangeTimeQuantum(Math.max(1, Number(e.target.value)))}
              />
              <span className="unit-tag">ms</span>
            </div>
          </div>
        )}

        {showPriority && (
          <div className="tuning-item">
            <label>Priority Convention:</label>
            <button
              className="btn-toggle-prio"
              onClick={() => onChangePriorityOrder(!priorityLowerIsBetter)}
            >
              {priorityLowerIsBetter
                ? '⚡ 1 = Highest Priority (Lower # higher)'
                : '⚡ 10 = Highest Priority (Higher # higher)'}
            </button>
          </div>
        )}
      </div>

      {/* Processes Table */}
      <div className="table-responsive">
        <table className="workload-table">
          <thead>
            <tr>
              <th>Color</th>
              <th>Process ID</th>
              <th>Arrival Time (AT)</th>
              <th>Burst Time (BT)</th>
              {showPriority && <th>Priority</th>}
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.id}>
                <td>
                  <span
                    className="color-dot"
                    style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }}
                  />
                </td>
                <td>
                  <span className="table-pid-badge" style={{ color: p.color }}>
                    {p.id}
                  </span>
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="input-num"
                    value={p.arrivalTime}
                    onChange={(e) =>
                      onUpdateProcess(p.id, 'arrivalTime', Math.max(0, Number(e.target.value)))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="input-num"
                    value={p.burstTime}
                    onChange={(e) =>
                      onUpdateProcess(p.id, 'burstTime', Math.max(1, Number(e.target.value)))
                    }
                  />
                </td>
                {showPriority && (
                  <td>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      className="input-num"
                      value={p.priority}
                      onChange={(e) =>
                        onUpdateProcess(p.id, 'priority', Math.max(1, Number(e.target.value)))
                      }
                    />
                  </td>
                )}
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn-delete-row"
                    onClick={() => onDeleteProcess(p.id)}
                    title={`Delete ${p.id}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer-actions">
        <button className="btn-add-process" onClick={onAddProcess}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add Process</span>
        </button>
        <span className="process-count-info">{processes.length} Processes Configured</span>
      </div>
    </div>
  )
}
