import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  headers: string[];
  children: ReactNode;
  empty?: string;
  isEmpty?: boolean;
  className?: string;
}

export function DataTable({ headers, children, empty = "Belum ada data", isEmpty = false, className }: DataTableProps) {
  return (
    <div className={cn("bg-white border border-site-border overflow-hidden", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-cream border-b border-site-border">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-5 py-3.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-site-gray-dark"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="px-5 py-12 text-center text-sm text-site-gray">
                {empty}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
