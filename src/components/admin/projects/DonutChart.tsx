'use client';

interface DonutChartProps {
  completed: number;
  inProgress: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export default function DonutChart({
  completed,
  inProgress,
  total,
  size = 120,
  strokeWidth = 10,
  showLabel = true,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const completedFrac = total > 0 ? completed / total : 0;
  const inProgressFrac = total > 0 ? inProgress / total : 0;

  const completedLength = circumference * completedFrac;
  const inProgressLength = circumference * inProgressFrac;
  const todoLength = circumference - completedLength - inProgressLength;

  // Offsets: each segment starts after the previous one
  // We start from the top (-90deg rotation on the SVG group)
  const completedOffset = 0;
  const inProgressOffset = completedLength;
  const todoOffset = completedLength + inProgressLength;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${center} ${center})`}>
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />

          {/* Todo segment (subtle) */}
          {todoLength > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${todoLength} ${circumference - todoLength}`}
              strokeDashoffset={-todoOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease' }}
            />
          )}

          {/* In Progress segment (amber) */}
          {inProgressLength > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#F59E0B"
              strokeWidth={strokeWidth}
              strokeDasharray={`${inProgressLength} ${circumference - inProgressLength}`}
              strokeDashoffset={-inProgressOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease' }}
            />
          )}

          {/* Completed segment (teal) */}
          {completedLength > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#3B82F6"
              strokeWidth={strokeWidth}
              strokeDasharray={`${completedLength} ${circumference - completedLength}`}
              strokeDashoffset={-completedOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease' }}
            />
          )}
        </g>
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-[#FAFAFA]">{progress}%</span>
          {size >= 100 && (
            <span className="text-[10px] text-[#71717A]">completed</span>
          )}
        </div>
      )}
    </div>
  );
}

// Mini version for sidebar cards
export function MiniDonut({ completed, total, size = 28 }: { completed: number; total: number; size?: number }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const progress = total > 0 ? completed / total : 0;
  const dashLength = circumference * progress;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${center} ${center})`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {dashLength > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#3B82F6"
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeLinecap="round"
          />
        )}
      </g>
    </svg>
  );
}
