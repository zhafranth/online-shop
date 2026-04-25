import { OrderStatus } from "@/types/admin";

const styles: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending:    { bg: "bg-[#fef3c7]", text: "text-[#92400e]", label: "Pending" },
  processing: { bg: "bg-[#dbeafe]", text: "text-[#1e40af]", label: "Processing" },
  shipped:    { bg: "bg-[#e0e7ff]", text: "text-[#3730a3]", label: "Shipped" },
  delivered:  { bg: "bg-[#dcfce7]", text: "text-[#166534]", label: "Delivered" },
  cancelled:  { bg: "bg-[#fee2e2]", text: "text-[#991b1b]", label: "Cancelled" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const s = styles[status];
  return (
    <span
      className={`inline-block text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  );
}
