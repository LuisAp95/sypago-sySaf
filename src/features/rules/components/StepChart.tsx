import React, { useState, useEffect } from 'react';
import type { RuleTimeBand } from '../types/rule.types';

// Helper to convert time string "HH:MM" to numeric decimal hour (0 - 24)
export const parseHour = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) + (m || 0) / 60;
};

// Helper to parse max amount string
export const parseAmountToMillion = (amtStr: string): number => {
  if (!amtStr) return 0;
  const lower = amtStr.toLowerCase();
  const num = parseFloat(amtStr.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
  if (lower.includes('mill') || lower.includes('millo')) {
    return num;
  } else if (lower.includes('mil')) {
    return num / 1000;
  }
  return num;
};

export const StepChart = ({
  ops,
  amount,
  subRules,
  maxOps = 10,
  maxAmt = 5,
}: {
  ops: { x: number; y: number }[];
  amount: { x: number; y: number }[];
  subRules?: RuleTimeBand[];
  maxOps?: number;
  maxAmt?: number;
}) => {
  const [currentTime, setCurrentTime] = useState<number>(() => {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.getHours() + now.getMinutes() / 60);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getPoints = (data: { x: number; y: number }[], maxY: number) => {
    if (!data || data.length === 0) return '';
    return data
      .map((p) => {
        const x = (p.x / 24) * 1000;
        const y = 160 - (Math.min(p.y, maxY) / (maxY || 1)) * 140;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const getLineSegments = () => {
    if (!subRules || subRules.length === 0) return { segments: [], connections: [] };
    
    const activeRules = subRules.filter(sr => sr.enabled);
    if (activeRules.length === 0) return { segments: [], connections: [] };

    const segments: {
      opsPoints: string;
      amtPoints: string;
      opsStartY: string;
      opsEndY: string;
      amtStartY: string;
      amtEndY: string;
      startX: string;
      endX: string;
      startHour: number;
      endHour: number;
    }[] = [];
    
    activeRules.forEach((rule) => {
      let start = parseHour(rule.startTime);
      let end = parseHour(rule.endTime);
      const opsVal = rule.opsPerMinute;
      const amtVal = parseAmountToMillion(rule.maxAmount);

      const getPt = (x: number, y: number, maxY: number, isAmount: boolean) => {
        const px = (x / 24) * 1000;
        let py = 160 - (Math.min(y, maxY) / (maxY || 1)) * 140;

        // Prevent perfect overlap by shifting the orange line (amount) slightly if it matches the blue line (ops)
        if (isAmount) {
          const opsPy = 160 - (Math.min(opsVal, maxOps) / (maxOps || 1)) * 140;
          if (Math.abs(py - opsPy) < 2) {
            py += 4; // Shift down slightly
          }
        }

        return { x: px.toFixed(1), y: py.toFixed(1) };
      };

      if (start > end) {
        // Overnight rule split into two segments
        const oS1 = getPt(start, opsVal, maxOps, false), oE1 = getPt(24, opsVal, maxOps, false);
        const aS1 = getPt(start, amtVal, maxAmt, true), aE1 = getPt(24, amtVal, maxAmt, true);
        segments.push({
          opsPoints: `${oS1.x},${oS1.y} ${oE1.x},${oE1.y}`,
          amtPoints: `${aS1.x},${aS1.y} ${aE1.x},${aE1.y}`,
          opsStartY: oS1.y, opsEndY: oE1.y, amtStartY: aS1.y, amtEndY: aE1.y,
          startX: oS1.x, endX: oE1.x,
          startHour: start, endHour: 24
        });

        const oS2 = getPt(0, opsVal, maxOps, false), oE2 = getPt(end, opsVal, maxOps, false);
        const aS2 = getPt(0, amtVal, maxAmt, true), aE2 = getPt(end, amtVal, maxAmt, true);
        segments.push({
          opsPoints: `${oS2.x},${oS2.y} ${oE2.x},${oE2.y}`,
          amtPoints: `${aS2.x},${aS2.y} ${aE2.x},${aE2.y}`,
          opsStartY: oS2.y, opsEndY: oE2.y, amtStartY: aS2.y, amtEndY: aE2.y,
          startX: oS2.x, endX: oE2.x,
          startHour: 0, endHour: end
        });
      } else {
        // Normal segment
        const oS = getPt(start, opsVal, maxOps, false), oE = getPt(end, opsVal, maxOps, false);
        const aS = getPt(start, amtVal, maxAmt, true), aE = getPt(end, amtVal, maxAmt, true);
        segments.push({
          opsPoints: `${oS.x},${oS.y} ${oE.x},${oE.y}`,
          amtPoints: `${aS.x},${aS.y} ${aE.x},${aE.y}`,
          opsStartY: oS.y, opsEndY: oE.y, amtStartY: aS.y, amtEndY: aE.y,
          startX: oS.x, endX: oE.x,
          startHour: start, endHour: end
        });
      }
    });

    const connections: {
      x: string;
      opsY1: string; opsY2: string;
      amtY1: string; amtY2: string;
    }[] = [];

    segments.forEach(curr => {
      segments.forEach(prev => {
        if (prev.endHour === curr.startHour) {
          connections.push({
            x: curr.startX,
            opsY1: prev.opsEndY, opsY2: curr.opsStartY,
            amtY1: prev.amtEndY, amtY2: curr.amtStartY
          });
        }
      });
    });

    return { segments, connections };
  };

  const { segments, connections } = getLineSegments();

  // Y-axis tick values (6 steps: 100%, 80%, 60%, 40%, 20%, 0%)
  const opsTicks = [maxOps, Math.round(maxOps * 0.8), Math.round(maxOps * 0.6), Math.round(maxOps * 0.4), Math.round(maxOps * 0.2), 0];
  const amtTicks = [maxAmt, (maxAmt * 0.8).toFixed(0), (maxAmt * 0.6).toFixed(0), (maxAmt * 0.4).toFixed(0), (maxAmt * 0.2).toFixed(0), 0];

  return (
    <div className="relative w-full h-full min-h-[170px] bg-[#1E1F20] rounded-xl border border-white/5 p-4 flex flex-col justify-between select-none">
      {/* Header with Title and Legend */}
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-300 font-medium text-xs">
          Limites operativos
        </span>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
            <span>Operaciones por min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
            <span>Monto máximos</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Area with Y-axes, Grid, SVG and Indicator */}
      <div className="relative flex-1 w-full min-h-[120px] my-1">
        {/* Left Y-axis (Opm/min) */}
        <div className="absolute left-0 top-1 bottom-6 w-14 flex flex-col justify-between text-[9px] text-gray-400 text-left font-mono pointer-events-none">
          {opsTicks.map((val, idx) => (
            <span key={idx}>{val} Opm/min</span>
          ))}
        </div>

        {/* Right Y-axis (Monto max) */}
        <div className="absolute right-0 top-1 bottom-6 w-14 flex flex-col justify-between text-[9px] text-gray-400 text-right font-mono pointer-events-none">
          {amtTicks.map((val, idx) => (
            <span key={idx}>{val} Millo Bs</span>
          ))}
        </div>

        {/* Horizontal Dashed Grid Lines */}
        <div className="absolute left-14 right-14 top-1 bottom-6 flex flex-col justify-between pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-b border-white/10 border-dashed w-full h-0"></div>
          ))}
        </div>

        {/* SVG Step Lines */}
        <svg
          className="absolute left-14 right-14 top-1 bottom-6 w-[calc(100%-7rem)] h-[calc(100%-1.75rem)] overflow-visible pointer-events-none"
          viewBox="0 0 1000 160"
          preserveAspectRatio="none"
        >
          {segments && segments.length > 0 ? (
            <>
              {connections && connections.map((conn, i) => (
                <React.Fragment key={`conn-${i}`}>
                  <line x1={conn.x} y1={conn.opsY1} x2={conn.x} y2={conn.opsY2} stroke="#38BDF8" strokeWidth="3" />
                  <line x1={conn.x} y1={conn.amtY1} x2={conn.x} y2={conn.amtY2} stroke="#F97316" strokeWidth="3" />
                </React.Fragment>
              ))}
              {segments.map((seg, i) => (
                <React.Fragment key={i}>
                  <polyline
                    points={seg.opsPoints}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                  <circle cx={seg.startX} cy={seg.opsStartY} r="4" fill="#38BDF8" />
                  <circle cx={seg.endX} cy={seg.opsEndY} r="4" fill="#38BDF8" />

                  <polyline
                    points={seg.amtPoints}
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                  <circle cx={seg.startX} cy={seg.amtStartY} r="4" fill="#F97316" />
                  <circle cx={seg.endX} cy={seg.amtEndY} r="4" fill="#F97316" />
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              <polyline
                points={getPoints(ops, maxOps)}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <polyline
                points={getPoints(amount, maxAmt)}
                fill="none"
                stroke="#F97316"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>

        {/* Current Time Indicator Line with Bottom Upward Triangle */}
        <div
          className="absolute top-1 bottom-6 pointer-events-none transition-all duration-300"
          style={{ left: `calc(3.5rem + (${currentTime} / 24) * (100% - 7rem))` }}
        >
          <div className="w-[1.5px] h-full bg-[#EAB308]/90 shadow-[0_0_6px_rgba(234,179,8,0.5)] relative">
            <div className="absolute -bottom-1 -left-[4px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent border-b-[#EAB308]"></div>
          </div>
        </div>

        {/* X Axis Time Labels */}
        <div className="absolute left-14 right-14 bottom-0 flex justify-between text-[10px] text-gray-400 font-mono">
          {[
            '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
            '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00',
          ].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

