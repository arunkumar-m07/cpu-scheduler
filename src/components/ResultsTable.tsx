import React from 'react'
import { ProcessResult } from '../types'

interface ResultsTableProps {
  results: ProcessResult[]
  avgTurnaroundTime: number
  avgWaitingTime: number
  avgResponseTime: number
  algorithmName: string
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  avgTurnaroundTime,
  avgWaitingTime,
  avgResponseTime,
  algorithmName,
}) => {
  const exportCSV = () => {
    const headers = ['Process ID', 'Arrival Time', 'Burst Time', 'Priority', 'Completion Time', 'Turnaround Time', 'Waiting Time', 'Response Time']
    const rows = results.map((r) => [
      r.id,
      r.arrivalTime,
      r.burstTime,
      r.priority,
      r.completionTime,
      r.turnaroundTime,
      r.waitingTime,
      r.responseTime,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `cpu_schedule_${algorithmName.toLowerCase().replace(/\s+/g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div className="panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <span>Process Execution Results Breakdown</span>
        </div>

        <button className="btn-secondary" onClick={exportCSV} title="Export current results as CSV spreadsheet">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export CSV</span>
        </button>
      </div>

      <div className="table-responsive">
        <table className="results-table">
          <thead>
            <tr>
              <th>Process</th>
              <th>Arrival (AT)</th>
              <th>Burst (BT)</th>
              <th>Completion (CT)</th>
              <th>Turnaround (TAT)</th>
              <th>Waiting (WT)</th>
              <th>Response (RT)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td>
                  <span className="table-pid-badge" style={{ color: r.color }}>
                    {r.id}
                  </span>
                </td>
                <td>{r.arrivalTime} ms</td>
                <td>{r.burstTime} ms</td>
                <td className="highlight-cell">{r.completionTime} ms</td>
                <td>
                  <span className="badge-cyan">{r.turnaroundTime} ms</span>
                </td>
                <td>
                  <span className="badge-violet">{r.waitingTime} ms</span>
                </td>
                <td>
                  <span className="badge-emerald">{r.responseTime} ms</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="tfoot-summary">
              <td colSpan={4}>
                <strong>AVERAGE METRICS</strong>
              </td>
              <td>
                <strong className="text-cyan">{avgTurnaroundTime} ms</strong>
              </td>
              <td>
                <strong className="text-violet">{avgWaitingTime} ms</strong>
              </td>
              <td>
                <strong className="text-emerald">{avgResponseTime} ms</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
