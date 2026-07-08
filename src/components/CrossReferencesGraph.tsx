import { useState, useMemo } from 'react';
import { type CrossReference, BOOK_NAMES } from '../lib/crossReferences';
import { getLocalVerse } from '../lib/localBible';

interface EnrichedReference extends CrossReference {
  text?: string;
  isParallel?: boolean;
  testament: 'ot' | 'nt';
}

interface CrossReferencesGraphProps {
  book: string;
  chapter: number;
  verse: number;
  references: EnrichedReference[];
  onNavigate?: (book: string, chapter: number, verse: number) => void;
}

export default function CrossReferencesGraph({
  book,
  references,
  onNavigate
}: CrossReferencesGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<EnrichedReference | null>(null);
  const [hoveredText, setHoveredText] = useState<string>('Loading verse text...');

  // SVG dimensions
  const width = 360;
  const height = 360;
  const cx = width / 2;
  const cy = height / 2;

  // Filter to top 18 references to keep the graph clean and readable
  const graphNodes = useMemo(() => {
    return [...references]
      .sort((a, b) => (b.votes || 0) - (a.votes || 0))
      .slice(0, 18);
  }, [references]);

  // Separate OT and NT for orbit distribution
  const otNodes = useMemo(() => graphNodes.filter((n) => n.testament === 'ot'), [graphNodes]);
  const ntNodes = useMemo(() => graphNodes.filter((n) => n.testament === 'nt'), [graphNodes]);

  // Radius definitions for orbits
  const r1 = 80;  // NT orbit radius (inner)
  const r2 = 135; // OT orbit radius (outer)

  // Calculate coordinates for a node given orbit radius and index/total
  const getNodeCoords = (radius: number, index: number, total: number) => {
    if (total === 0) return { x: cx, y: cy };
    // Offset angle to start at top (12 o'clock)
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };
  };

  // Build final nodes list with position coordinates
  const positionedNodes = useMemo(() => {
    const nodes: Array<EnrichedReference & { x: number; y: number }> = [];

    ntNodes.forEach((node, idx) => {
      const coords = getNodeCoords(r1, idx, ntNodes.length);
      nodes.push({ ...node, ...coords });
    });

    otNodes.forEach((node, idx) => {
      const coords = getNodeCoords(r2, idx, otNodes.length);
      nodes.push({ ...node, ...coords });
    });

    return nodes;
  }, [otNodes, ntNodes]);

  const handleNodeHover = async (node: EnrichedReference) => {
    setHoveredNode(node);
    
    if (node.text) {
      setHoveredText(node.text);
      return;
    }

    setHoveredText('Loading verse text...');

    try {
      const verseData = await getLocalVerse('kjv', node.book, node.chapter, node.verseStart);
      if (verseData) {
        setHoveredText(verseData.text);
        node.text = verseData.text; // cache it
      } else {
        setHoveredText('Verse text not found locally.');
      }
    } catch (e) {
      setHoveredText('Error loading verse text.');
    }
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  const handleNodeClick = (node: EnrichedReference) => {
    const bookName = BOOK_NAMES[node.book] || node.book;
    onNavigate?.(bookName, node.chapter, node.verseStart);
  };

  if (references.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-gray-400 dark:text-gray-500 text-sm">
        No connections available to visualize.
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center bg-gray-50/50 dark:bg-gray-900/30 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
      <svg width={width} height={height} className="overflow-visible select-none">
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </radialGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Orbit Guideline Circles */}
        {ntNodes.length > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={r1}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeDasharray="4,6"
            className="dark:stroke-gray-850"
          />
        )}
        {otNodes.length > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={r2}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeDasharray="4,6"
            className="dark:stroke-gray-850"
          />
        )}

        {/* Connection Paths (Curves) */}
        {positionedNodes.map((node, i) => {
          const isHovered = hoveredNode === node;
          // Curved path for premium feeling
          const qx = (cx + node.x) / 2 - (node.y - cy) * 0.15;
          const qy = (cy + node.y) / 2 + (node.x - cx) * 0.15;
          const pathD = `M ${cx} ${cy} Q ${qx} ${qy} ${node.x} ${node.y}`;

          return (
            <path
              key={`link-${i}`}
              d={pathD}
              fill="none"
              stroke={
                isHovered
                  ? '#6366f1'
                  : node.testament === 'ot'
                  ? '#f59e0b40'
                  : '#10b98140'
              }
              strokeWidth={isHovered ? '2.5' : '1.5'}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Center Node Glow */}
        <circle cx={cx} cy={cy} r="35" fill="url(#centerGlow)" />

        {/* Active Verse Center Node */}
        <g className="cursor-default">
          <circle
            cx={cx}
            cy={cy}
            r="16"
            fill="#4f46e5"
            stroke="#ffffff"
            strokeWidth="2.5"
            filter="url(#shadow)"
          />
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10"
            fontWeight="bold"
          >
            {book.substring(0, 3)}
          </text>
        </g>

        {/* Outer Reference Nodes */}
        {positionedNodes.map((node, i) => {
          const isHovered = hoveredNode === node;
          const isOT = node.testament === 'ot';
          const nodeColor = isOT ? '#f59e0b' : '#10b981';

          return (
            <g
              key={`node-${i}`}
              className="cursor-pointer"
              onMouseEnter={() => handleNodeHover(node)}
              onMouseLeave={handleNodeLeave}
              onClick={() => handleNodeClick(node)}
            >
              {/* Outer stroke glow on hover */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? '12' : '8'}
                fill={nodeColor}
                fillOpacity={isHovered ? '0.2' : '0'}
                className="transition-all duration-300"
              />
              {/* Core Node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? '7' : '5'}
                fill={nodeColor}
                stroke="#ffffff"
                strokeWidth="1.5"
                filter="url(#shadow)"
                className="transition-all duration-300"
              />
              {/* Text Label next to node */}
              <text
                x={node.x + (node.x > cx ? 9 : -9)}
                y={node.y + 4}
                textAnchor={node.x > cx ? 'start' : 'end'}
                fill={isHovered ? '#4f46e5' : '#64748b'}
                fontSize="9"
                fontWeight={isHovered ? 'bold' : 'normal'}
                className="dark:fill-gray-400 select-none transition-all duration-200"
              >
                {node.book} {node.chapter}:{node.verseStart}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Info Label */}
      <span className="text-[10px] text-gray-400 dark:text-gray-550 mb-1 select-none">
        OT links (orange, outer) • NT links (green, inner) • Showing top {graphNodes.length}
      </span>

      {/* Dynamic Hover Tooltip Card */}
      <div className="w-full mt-2 h-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-150 dark:border-gray-700 p-3 shadow-inner overflow-y-auto flex flex-col justify-center">
        {hoveredNode ? (
          <div className="animate-fade-in text-left">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {BOOK_NAMES[hoveredNode.book] || hoveredNode.book} {hoveredNode.chapter}:{hoveredNode.verseStart}
              </span>
              <span className="text-[10px] font-medium text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/30 px-1.5 py-0.5 rounded">
                {hoveredNode.votes || 0} votes
              </span>
            </div>
            <p className="text-[11px] text-gray-650 dark:text-gray-300 line-clamp-2 leading-relaxed">
              {hoveredText}
            </p>
          </div>
        ) : (
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 italic py-2 select-none">
            Hover over a node to preview scripture content
          </div>
        )}
      </div>
    </div>
  );
}
