"use client";

import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "neutral";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "neutral",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-navy-dark/60 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-site-white w-full max-w-md p-7 border border-site-border shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-[22px] font-semibold text-navy mb-2">{title}</h3>
        <p className="text-sm text-site-gray-dark mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            className={variant === "danger" ? "bg-[#b91c1c] text-white hover:bg-[#991b1b]" : ""}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
