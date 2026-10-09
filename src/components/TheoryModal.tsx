import React from 'react'

interface TheoryModalProps {
  onClose: () => void
}

export const TheoryModal: React.FC<TheoryModalProps> = ({ onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-wide modal-scrollable" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="badge-chip">OS REFERENCE</div>
            <h2>CPU Scheduling Theory, Algorithms & Formulas</h2>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="theory-content">
          <section className="theory-section">
            <h3>Fundamental Scheduling Formulas</h3>
            <div className="formula-cards-grid">
              <div className="formula-box">
                <span className="formula-title">Turnaround Time (TAT)</span>
                <code>TAT = Completion Time (CT) − Arrival Time (AT)</code>
                <p>The total elapsed time from process submission to its completion.</p>
              </div>

              <div className="formula-box">
                <span className="formula-title">Waiting Time (WT)</span>
                <code>WT = Turnaround Time (TAT) − Burst Time (BT)</code>
                <p>Total time spent waiting inside the Ready Queue before being executed.</p>
              </div>

              <div className="formula-box">
                <span className="formula-title">Response Time (RT)</span>
                <code>RT = Time of First CPU Allocation − Arrival Time (AT)</code>
                <p>Crucial metric for interactive and desktop systems evaluating responsiveness.</p>
              </div>

              <div className="formula-box">
                <span className="formula-title">CPU Utilization</span>
                <code>(Total Busy Execution Time / Total Schedule Time) × 100%</code>
                <p>Percentage of time the CPU was actively executing user processes.</p>
              </div>
            </div>
          </section>

          <section className="theory-section">
            <h3>Algorithms Comparison Breakdown</h3>
            <div className="algo-cards-grid">
              <div className="algo-card">
                <h4>1. First-Come, First-Served (FCFS)</h4>
                <p>
                  Non-preemptive algorithm that queues processes by arrival time. Simplest FIFO mechanism.
                </p>
                <div className="algo-pro-con">
                  <span className="text-pro">✔ Simple, no starvation</span>
                  <span className="text-con">✖ Convoy Effect (short jobs wait behind long jobs)</span>
                </div>
              </div>

              <div className="algo-card">
                <h4>2. Shortest Job First (SJF)</h4>
                <p>
                  Non-preemptive algorithm selecting the process with minimal burst duration. Provably optimal for minimizing average waiting time.
                </p>
                <div className="algo-pro-con">
                  <span className="text-pro">✔ Optimal minimum average waiting time</span>
                  <span className="text-con">✖ Starvation of long jobs, burst time hard to predict</span>
                </div>
              </div>

              <div className="algo-card">
                <h4>3. Shortest Remaining Time First (SRTF)</h4>
                <p>
                  Preemptive version of SJF. Checks remaining CPU burst at every arrival and switches if a shorter process arrives.
                </p>
                <div className="algo-pro-con">
                  <span className="text-pro">✔ Extremely fast turnaround for short tasks</span>
                  <span className="text-con">✖ High context switching overhead</span>
                </div>
              </div>

              <div className="algo-card">
                <h4>4. Round Robin (RR)</h4>
                <p>
                  Preemptive time-sliced scheduling. Every process in the circular ready queue receives at most <code>q</code> time units before context switching.
                </p>
                <div className="algo-pro-con">
                  <span className="text-pro">✔ Fair, excellent response time for interactive OS</span>
                  <span className="text-con">✖ Sensitive to time quantum choice (too high = FCFS, too low = switch thrashing)</span>
                </div>
              </div>

              <div className="algo-card">
                <h4>5. Priority Scheduling (NP & Preemptive)</h4>
                <p>
                  CPU is allocated to the process with the highest priority rank. Can be preemptive or non-preemptive.
                </p>
                <div className="algo-pro-con">
                  <span className="text-pro">✔ Critical system processes run first</span>
                  <span className="text-con">✖ Indefinite blocking (starvation). Solution: Aging</span>
                </div>
              </div>

              <div className="algo-card">
                <h4>6. Highest Response Ratio Next (HRRN)</h4>
                <p>
                  Non-preemptive algorithm calculating Response Ratio = <code>(Waiting Time + Burst Time) / Burst Time</code>. As waiting time grows, priority automatically increases!
                </p>
                <div className="algo-pro-con">
                  <span className="text-pro">✔ Completely prevents starvation, balances short vs long jobs</span>
                  <span className="text-con">✖ Burst time must still be estimated in advance</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
