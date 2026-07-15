import { useEffect, useMemo, useState } from "react";
import { Clock3, Tag } from "lucide-react";
import clsx from "clsx";
import { useAdminStore } from "../../store/adminStore";
import type { Promotion } from "../../types";

const themeClasses: Record<Promotion["theme"], string> = {
  lime: "bg-kala-lime text-kala-ink",
  mango: "bg-kala-mango text-kala-ink",
  chili: "bg-kala-chili text-kala-cream",
  purple: "bg-kala-purple text-white",
  mint: "bg-kala-mint text-kala-ink",
  pink: "bg-kala-pink text-kala-ink",
};

function getRemaining(endAt?: string) {
  if (!endAt) return null;
  const milliseconds = new Date(endAt).getTime() - Date.now();
  if (Number.isNaN(milliseconds) || milliseconds <= 0) return null;
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export function useActivePromotion() {
  const promotions = useAdminStore((state) => state.promotions);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const hasTimedPromotion = promotions.some((promotion) => promotion.active && promotion.endAt);
    if (!hasTimedPromotion) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [promotions]);

  return useMemo(
    () =>
      promotions.find((promotion) => {
        if (!promotion.active) return false;
        if (!promotion.endAt) return true;
        return new Date(promotion.endAt).getTime() > now;
      }) ?? null,
    [promotions, now]
  );
}

export function useTopBarVisible() {
  const promotion = useActivePromotion();
  const announcementEnabled = useAdminStore((state) => state.experience.announcement.enabled);
  return Boolean(promotion || announcementEnabled);
}

export function PromoBar() {
  const promotion = useActivePromotion();
  const announcement = useAdminStore((state) => state.experience.announcement);
  const [remaining, setRemaining] = useState(() => getRemaining(promotion?.endAt));

  useEffect(() => {
    setRemaining(getRemaining(promotion?.endAt));
    if (!promotion?.endAt) return;
    const timer = window.setInterval(
      () => setRemaining(getRemaining(promotion.endAt)),
      1000
    );
    return () => window.clearInterval(timer);
  }, [promotion?.id, promotion?.endAt]);

  if (!promotion && !announcement.enabled) return null;

  if (!promotion) {
    return (
      <div className="fixed inset-x-0 top-0 z-[65] flex min-h-10 items-center justify-center bg-kala-lime px-4 py-2 text-center text-xs font-bold text-kala-ink shadow-sm sm:text-sm">
        <span>{announcement.text}</span>
        {announcement.linkLabel && (
          <a href={announcement.linkHref || "#boutique"} className="ml-3 underline decoration-2 underline-offset-2">
            {announcement.linkLabel}
          </a>
        )}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "fixed inset-x-0 top-0 z-[65] flex min-h-10 items-center justify-center px-4 py-2 text-center text-xs font-bold shadow-sm sm:text-sm",
        themeClasses[promotion.theme]
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1.5">
          <Tag size={14} /> {promotion.title}
        </span>
        <span className="font-medium opacity-80">{promotion.description}</span>
        {promotion.code && (
          <span className="rounded-full border border-current/25 px-2 py-0.5 font-black tracking-wide">
            {promotion.code}
          </span>
        )}
        {remaining && (
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Clock3 size={13} />
            {remaining.days > 0 && `${remaining.days}j `}
            {String(remaining.hours).padStart(2, "0")}:
            {String(remaining.minutes).padStart(2, "0")}:
            {String(remaining.seconds).padStart(2, "0")}
          </span>
        )}
      </div>
    </div>
  );
}
