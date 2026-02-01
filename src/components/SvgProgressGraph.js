import React from 'react';

/**
 * SvgProgressGraph - A custom, self-contained SVG line chart component
 */
const SvgProgressGraph = ({ data, title }) => {
  if (!data || data.length < 2) {
    return (
      <div>
        <h3 className="text-center font-semibold text-gray-700">{title}</h3>
        <div className="text-center text-gray-500 p-8 h-[300px] flex items-center justify-center">
          Not enough data to display graph.
        </div>
      </div>
    );
  }

  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const minTime = data[0].time.getTime();
  const maxTime = data[data.length - 1].time.getTime();
  const timeRange = maxTime - minTime;

  // Y-axis is 0-100%
  const yScale = (value) => yMax - (value / 100) * yMax;

  // X-axis is based on time
  const xScale = (time) => timeRange > 0 ? ((time.getTime() - minTime) / timeRange) * xMax : 0;

  const path = data.map((d, i) =>
    `${i === 0 ? 'M' : 'L'} ${xScale(d.time)} ${yScale(d.percentComplete)}`
  ).join(' ');

  // Generate X-axis ticks every 20 minutes
  const ticks = [];
  if (timeRange > 0) {
    const twentyMinutes = 20 * 60 * 1000;
    let tickTime = Math.floor(minTime / twentyMinutes) * twentyMinutes;
    while (tickTime <= maxTime + twentyMinutes) {
      if (tickTime >= minTime) {
        ticks.push(new Date(tickTime));
      }
      tickTime += twentyMinutes;
    }
  }

  return (
    <div>
      <h3 className="text-center font-semibold text-gray-700">{title}</h3>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines and axes */}
          <line x1="0" y1="0" x2="0" y2={yMax} stroke="#ccc" />
          <line x1="0" y1={yMax} x2={xMax} y2={yMax} stroke="#ccc" />

          {/* Y-axis labels and grid lines */}
          {[0, 25, 50, 75, 100].map(val => (
            <g key={val}>
              <line
                x1={0}
                x2={xMax}
                y1={yScale(val)}
                y2={yScale(val)}
                stroke="#e0e0e0"
                strokeDasharray="3 3"
              />
              <text x="-10" y={yScale(val) + 4} textAnchor="end" fontSize="10">
                {val}%
              </text>
            </g>
          ))}

          {/* X-axis labels (ticks) */}
          {ticks.map((tick, i) => (
            <g key={i} transform={`translate(${xScale(tick)}, 0)`}>
              <line y1={yMax} y2={yMax + 5} stroke="#333" />
              <text y={yMax + 20} textAnchor="middle" fontSize="10">
                {tick.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </text>
            </g>
          ))}
          <text
            x={xMax / 2}
            y={yMax + 40}
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
          >
            Time
          </text>

          {/* Data line and points */}
          <path d={path} fill="none" stroke="#8884d8" strokeWidth="2" />
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(d.time)}
              cy={yScale(d.percentComplete)}
              r="4"
              fill="#8884d8"
            >
              <title>
                {`Item: ${d.itemId}\nTime: ${d.time.toLocaleTimeString()}\nComplete: ${d.percentComplete.toFixed(1)}%`}
              </title>
            </circle>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default SvgProgressGraph;
