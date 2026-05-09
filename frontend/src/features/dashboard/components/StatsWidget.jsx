import { useMemo } from "react";
import {
  CalendarDays,
  Activity,
  Ban,
  ShieldCheck
} from "lucide-react";

import { getBookingStatus } from "../../../utils/bookings";

function StatsCard({
  icon,
  label,
  value,
  glow
}) {
  return (
    <div className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-slate-800
      bg-slate-900/70
      backdrop-blur-xl
      p-6
      hover:-translate-y-1
      transition-all
    ">

      <div className={`
        absolute
        inset-0
        opacity-10
        blur-2xl
        ${glow}
      `} />

      <div className="
        relative
        flex
        items-start
        justify-between
      ">

        <div>
          <p className="text-sm text-slate-400">
            {label}
          </p>

          <p className="
            text-4xl
            font-black
            mt-3
            tracking-tight
          ">
            {value}
          </p>
        </div>

        <div className="
          w-14
          h-14
          rounded-2xl
          bg-slate-800/80
          flex
          items-center
          justify-center
        ">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default function StatsWidget({
  bookings,
  user
}) {

  const {
    active,
    total,
    cancelled
  } = useMemo(() => {

    const now = new Date();

    let active = 0;
    let cancelled = 0;

    bookings.forEach((b) => {

      const status =
        getBookingStatus(b, now);

      if (status === "cancelled") {
        cancelled++;
      }

      if (status === "active") {
        active++;
      }

    });

    return {
      active,
      total: bookings.length,
      cancelled
    };

  }, [bookings]);

  return (
    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      xl:grid-cols-4
      gap-6
    ">

      <StatsCard
        label="Aktywne rezerwacje"
        value={active}
        glow="bg-cyan-500"
        icon={
          <Activity className="text-cyan-400" />
        }
      />

      <StatsCard
        label="Wszystkie rezerwacje"
        value={total}
        glow="bg-blue-500"
        icon={
          <CalendarDays className="text-blue-400" />
        }
      />

      <StatsCard
        label="Anulowane"
        value={cancelled}
        glow="bg-red-500"
        icon={
          <Ban className="text-red-400" />
        }
      />

      <StatsCard
        label="Typ konta"
        value={user?.role || "user"}
        glow="bg-emerald-500"
        icon={
          <ShieldCheck className="text-emerald-400" />
        }
      />

    </div>
  );
}