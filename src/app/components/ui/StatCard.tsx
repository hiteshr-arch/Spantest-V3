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
            <p
              className="font-['Bricolage_Grotesque',sans-serif] text-[#8b87a0] text-[10.5px] tracking-[0.84px] uppercase"
              style={{ fontWeight: 700 }}
            >
              {label}
            </p>
            <div className="flex flex-col gap-[6px]">
              <p
                className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[34px] leading-[34px] tracking-[-1.02px]"
                style={{ fontWeight: 800 }}
              >
                {value}
              </p>
              <p className="font-['DM_Sans',sans-serif] text-[#8b87a0] text-[12px]">
                {subtitle}
              </p>
            </div>
          </div>
          {extra}
        </div>
      </div>
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl border-l-3 border-solid"
        style={{
          borderColor,
          boxShadow: "0px 1px 4px 0px rgba(124,58,237,0.06), 0px 1px 2px 0px rgba(0,0,0,0.04)",
        }}
      />
    </div>
  );
}
