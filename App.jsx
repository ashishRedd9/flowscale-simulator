import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import TrafficControls from './components/TrafficControls';
import VisualTopology from './components/VisualTopology';
import LiveTelemetry from './components/LiveTelemetry';
import MemoryProfiler from './components/MemoryProfiler';
import { 
  TokenBucketLimiter, 
  LeakyBucketLimiter, 
  SlidingWindowLogLimiter, 
  SlidingWindowCounterLimiter 
} from './algorithms/rateLimiters';

export default function App() {
  const [algorithm, setAlgorithm] = useState('token');
  const [targetRps, setTargetRps] = useState(1200);
  const [capacity, setCapacity] = useState(50);
  const [refillRate, setRefillRate] = useState(25);
  const [isRunning, setIsRunning] = useState(true);

  // Stats State
  const [passedCount, setPassedCount] = useState(0);
  const [droppedCount, setDroppedCount] = useState(0);
  const [currentTokens, setCurrentTokens] = useState(capacity);
  const [history, setHistory] = useState(Array(30).fill({ passed: 0, dropped: 0 }));

  // Instantiated Limiter Engine Instance
  const limiterRef = useRef(new TokenBucketLimiter(capacity, refillRate));

  // Re-instantiate when algo or params change
  useEffect(() => {
    switch (algorithm) {
      case 'token':
        limiterRef.current = new TokenBucketLimiter(capacity, refillRate);
        break;
      case 'leaky':
        limiterRef.current = new LeakyBucketLimiter(capacity, refillRate);
        break;
      case 'sliding-log':
        limiterRef.current = new SlidingWindowLogLimiter(capacity, 1000);
        break;
      case 'sliding-counter':
        limiterRef.current = new SlidingWindowCounterLimiter(capacity, 1000);
        break;
      default:
        limiterRef.current = new TokenBucketLimiter(capacity, refillRate);
    }
  }, [algorithm, capacity, refillRate]);

  // Main Simulation Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Simulate batch of requests based on targetRps / 10 (since interval runs every 100ms)
      const batchSize = Math.max(1, Math.round(targetRps / 10));
      let localPassed = 0;
      let localDropped = 0;
      let lastTokenCount = capacity;

      for (let i = 0; i < batchSize; i++) {
        const res = limiterRef.current.allowRequest();
        if (res.allowed) {
          localPassed++;
        } else {
          localDropped++;
        }
        lastTokenCount = res.remainingTokens;
      }

      setPassedCount(prev => prev + localPassed);
      setDroppedCount(prev => prev + localDropped);
      setCurrentTokens(lastTokenCount);

      setHistory(prev => {
        const next = [...prev.slice(1), { passed: localPassed, dropped: localDropped }];
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, targetRps, capacity]);

  const handleBurstTrigger = () => {
    setTargetRps(10000);
    setTimeout(() => {
      setTargetRps(1200);
    }, 3000);
  };

  const memoryInfo = limiterRef.current.getMemoryOverhead(10000);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header 
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
      />

      <main style={{
        flex: 1,
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <TrafficControls 
          targetRps={targetRps}
          setTargetRps={setTargetRps}
          capacity={capacity}
          setCapacity={setCapacity}
          refillRate={refillRate}
          setRefillRate={setRefillRate}
          onBurstTrigger={handleBurstTrigger}
        />

        <VisualTopology 
          algorithmName={algorithm.toUpperCase()}
          passedCount={passedCount}
          droppedCount={droppedCount}
          currentTokens={currentTokens}
          maxCapacity={capacity}
          rps={targetRps}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <LiveTelemetry history={history} />
          <MemoryProfiler memoryInfo={memoryInfo} algorithm={algorithm} />
        </div>
      </main>

      <footer style={{
        padding: '20px 28px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        background: 'rgba(7, 9, 14, 0.95)'
      }}>
        <div>
          Built by <strong>Moole Asish Reddy</strong> &bull; Showcase Portfolio Project 2
        </div>
        <div>
          System Design & Distributed Rate Limiting Lab
        </div>
      </footer>
    </div>
  );
}
