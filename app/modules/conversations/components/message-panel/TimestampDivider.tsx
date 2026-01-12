import { formatTimestamp } from "@/lib/utils";

interface TimestampDividerProps {
  timestamp: number;
}

export const TimestampDivider = ({ timestamp }: TimestampDividerProps): React.ReactElement | null => {
  const formatted = formatTimestamp(timestamp);
  if (!formatted) return null;

  return (
    <p className="py-3 text-center text-xs text-muted-foreground">
      {formatted}
    </p>
  );
};
