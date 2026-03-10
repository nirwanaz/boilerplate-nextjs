import { useQuery } from "@tanstack/react-query";
import type { ActivityLogWithUser } from "../entities/activity-log";

export function useActivityLogs(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ["activity-logs", limit, offset],
    queryFn: async () => {
      const res = await fetch(`/api/admin/logs?limit=${limit}&offset=${offset}`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      return res.json() as Promise<ActivityLogWithUser[]>;
    },
  });
}
