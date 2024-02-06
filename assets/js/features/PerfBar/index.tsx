import React from "react";

import { usePerfBarData } from "./usePerfBarData";
import { useMe } from "@/graphql/Me";

export function PerfBar() {
  const meData = useMe();
  const data = usePerfBarData();

  if (meData?.loading) return null;
  if (meData?.error) return null;
  if (meData?.data?.me?.companyRole !== "admin") return null;

  const pageLoadColor = data.pageLoad < 500 ? "text-green-500" : "text-red-500";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white-1 p-1 text-sm font-mono">
      <div className="flex justify-between">
        <div className="text-green-500">PERFBAR</div>
        <div className="flex items-center gap-8">
          <div>
            Page Load: <span className={pageLoadColor}>{data.pageLoad.toFixed(0)}ms</span>
          </div>

          <div>
            Network Requests: <span className="text-green-500">{data.networkRequests}</span>
          </div>
        </div>
      </div>
    </div>
  );
}