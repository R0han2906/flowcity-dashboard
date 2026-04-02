import { RouteSegment } from '@/lib/types';
import { MODE_COLORS } from '@/lib/constants';

interface SegmentBarProps {
  segments: RouteSegment[];
  showLabels?: boolean;
}

const SegmentBar = ({ segments, showLabels = true }: SegmentBarProps) => {
  const total = segments.reduce((s, seg) => s + seg.duration, 0);

  return (
    <div>
      <div className="flex gap-[3px] w-full h-3">
        {segments.map((seg, i) => (
          <div
            key={i}
            className={`${MODE_COLORS[seg.mode]} h-full`}
            style={{ width: `${(seg.duration / total) * 100}%`, borderRadius: 0 }}
          />
        ))}
      </div>
      {showLabels && (
        <div className="flex gap-[3px] w-full mt-1">
          {segments.map((seg, i) => (
            <div
              key={i}
              className="font-mono-label text-[10px] text-text-muted-fc uppercase"
              style={{ width: `${(seg.duration / total) * 100}%` }}
            >
              {seg.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SegmentBar;
