import React from 'react'
import { AlgorithmId } from '../types'
import { ALGORITHM_DETAILS } from '../algorithms/scheduler'

interface NavbarProps {
  algorithm: AlgorithmId
  onSelectAlgorithm: (algo: AlgorithmId) => void
  onOpenTheory: () => void
  onOpenComparison: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  algorithm,
  onSelectAlgorithm,
  onOpenTheory,
  onOpenComparison,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <line x1="9" y1="1" x2="9" y2="4" />
              <line x1="15" y1="1" x2="15" y2="4" />
              <line x1="9" y1="20" x2="9" y2="23" />
              <line x1="15" y1="20" x2="15" y2="23" />
              <line x1="20" y1="9" x2="23" y2="9" />
              <line x1="20" y1="14" x2="23" y2="14" />
              <line x1="1" y1="9" x2="4" y2="9" />
              <line x1="1" y1="14" x2="4" y2="14" />
            </svg>
          </div>
          <div>
            <div className="brand-title">
              CORE<span>PULSE</span>
            </div>
            <div className="brand-subtitle">Operating System CPU Scheduler Simulator</div>
          </div>
        </div>

        <div className="navbar-algo-picker">
          <label htmlFor="algo-select">Algorithm:</label>
          <div className="select-wrapper">
            <select
              id="algo-select"
              value={algorithm}
              onChange={(e) => onSelectAlgorithm(e.target.value as AlgorithmId)}
            >
              {(Object.keys(ALGORITHM_DETAILS) as AlgorithmId[]).map((key) => (
                <option key={key} value={key}>
                  {ALGORITHM_DETAILS[key].tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="navbar-actions">
          <button className="btn-nav" onClick={onOpenComparison} title="Compare all algorithms side-by-side">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>Compare Algorithms</span>
          </button>

          <button className="btn-nav btn-nav-secondary" onClick={onOpenTheory} title="OS CPU Scheduling Theory & Formulas">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Theory & Formulas</span>
          </button>

          <a
            href="https://github.com/arunkumar-m07"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-nav btn-github"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>arunkumar-m07</span>
          </a>
        </div>
      </div>
    </header>
  )
}
