# FlowScale - Distributed Rate Limiter & System Design Simulator Studio

![FlowScale](https://img.shields.io/badge/FlowScale-v1.0-06b6d4) ![System Design](https://img.shields.io/badge/System%20Design-Rate%20Limiter-emerald) ![React](https://img.shields.io/badge/React-18.2-blue) ![License](https://img.shields.io/badge/License-MIT-purple)

FlowScale is an interactive System Design simulation lab for benchmarking API Gateway rate-limiting algorithms, measuring request throughput up to 10,000 RPS, and profiling Redis RAM state overhead.

---

## ⚡ Features

- **Interactive Network Packet Topology Graph**: Visualizes animated request flow from Client IP pools through API Gateway rate limiters to Backend Microservices vs 429 Throttle Sinks.
- **4 Core Rate Limiting Algorithms**:
  1. **Token Bucket**: $O(1)$ memory efficiency for bursty traffic.
  2. **Leaky Bucket**: FIFO queue strategy for constant rate smoothing.
  3. **Sliding Window Log**: Timestamp array precision filtering.
  4. **Sliding Window Counter**: Low-overhead memory approximation.
- **Real-Time Traffic Telemetry**: Sub-100ms request telemetry tracking allowed vs dropped requests.
- **Redis Memory Profiler**: Benchmarks per-client RAM footprint across 10,000 concurrent IPs, highlighting the 92% RAM savings of Token Bucket vs Sliding Window Log.

---

## 🛠️ Tech Stack

- **Frontend**: ReactJS, Custom SVG/Canvas dynamic topology animation, CSS Glassmorphism tokens.
- **Simulation Engine**: Custom JavaScript algorithmic engines for rate limiting math and concurrency profiling.

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+) & npm

### Installation & Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/ashishRedd9/flowscale-simulator.git
   cd flowscale-simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3001` in your browser.

---

## 👤 Author

**Moole Asish Reddy**
- GitHub: [@ashishRedd9](https://github.com/ashishRedd9)
- Email: ashishreddy731@gmail.com
