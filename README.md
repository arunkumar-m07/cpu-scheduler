# CorePulse — CPU Scheduling Simulator & Visualizer ⚡

An interactive, high-performance web application designed to simulate, visualize, and benchmark operating system CPU scheduling algorithms in real-time.

Built with **React**, **TypeScript**, and **Vite** with dark glassmorphism UI.

---

## 🚀 Key Features

- **7 Supported Scheduling Algorithms**:
  - **FCFS** (First-Come, First-Served)
  - **SJF** (Shortest Job First - Non-Preemptive)
  - **SRTF** (Shortest Remaining Time First - Preemptive SJF)
  - **Round Robin (RR)** with configurable time quantum
  - **Priority (Non-Preemptive)** with configurable priority order
  - **Priority (Preemptive)**
  - **HRRN** (Highest Response Ratio Next - dynamic starvation prevention)
- **Live Interactive Gantt Chart**:
  - Color-coded process blocks with exact start/end millisecond timestamps.
  - Identification of CPU Idle intervals.
  - Interactive playhead scrubber with animation controls.
- **Simulation Playback & Ready Queue Visualizer**:
  - Step forward / backward, pause, run live, and adjust simulation speeds (0.5x, 1x, 2x, 4x).
  - Live inspection of active CPU Core execution and real-time ready queue states.
- **Side-by-Side Algorithm Benchmark**:
  - Comparative bar graphs and metrics table evaluating all 7 algorithms simultaneously against your active workload to discover the optimal algorithm.
- **Interactive Process Manager**:
  - Add, edit arrival time, burst time, and priority on the fly.
  - Preset workloads (Standard OS Mix, Convoy Effect, Short Jobs Bursts, Starvation Demo).
  - One-click random process workload generator.
- **Metrics Breakdown**:
  - Turnaround Time (TAT)
  - Waiting Time (WT)
  - Response Time (RT)
  - CPU Utilization % & Throughput
  - Export simulation results to CSV spreadsheet.
- **Built-in OS Theory & Formulas Reference Guide**.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Bundler**: Vite
- **Styling**: Modern Vanilla CSS (Design system with Plus Jakarta Sans & JetBrains Mono)

---

## 💻 Local Development

1. Clone or open the repository:
   ```bash
   git clone https://github.com/arunkumar-m07/cpu-scheduler.git
   cd cpu-scheduler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to Vercel

1. Push this repository to your GitHub account (`arunkumar-m07`).
2. Log into [Vercel](https://vercel.com/arunkumar-m07).
3. Click **"Add New Project"** -> **"Import Git Repository"**.
4. Select `cpu-scheduler`.
5. Vercel automatically detects Vite with:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**!
