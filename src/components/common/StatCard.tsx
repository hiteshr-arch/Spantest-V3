import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  subtitle: string;
  borderColor: string;
  extra?: ReactNode;
}

export function StatCard({ label, value, subtitle, borderColor, extra }: StatCardProps) {
  return (
    <div className="stat-card bg-white flex-1 min-w-0 rounded-2xl relative">
      <div className="overflow-hidden rounded-[inherit] size-full">
        <div className="flex gap-3 items-start px-6 py-[14px] w-full">
          <div className="stat-card__content flex-1 flex flex-col gap-3 min-w-0">
            <p className="stat-card__label">
              {label}
            </p>
            <div className="flex flex-col gap-[6px]">
              <p className="stat-card__value">
                {value}
              </p>
              <p className="stat-card__subtitle">
                {subtitle}
              </p>
            </div>
          </div>
          {extra}
        </div>
      </div>
      <div
        className="stat-card__border-overlay"
        style={{ borderColor }}
      />
    </div>
  );
}
