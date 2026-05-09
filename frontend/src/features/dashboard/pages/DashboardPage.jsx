import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowRight,
  CalendarDays,
  Building2
} from "lucide-react";

import { useAuth } from "../../auth/hooks/useAuth";

import UpcomingBookingsWidget from "../components/UpcomingBookingsWidget";
import StatsWidget from "../components/StatsWidget";

import { useDashboardData } from "../hooks/useDashboardData";

function DashboardPage() {

  const { user } = useAuth();

  const {
    bookings,
    roomNameById,
    loading
  } = useDashboardData();

  if (loading) {
    return (
      <div className="py-24 text-center">
        Ładowanie dashboardu...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <motion.section
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.5 }}
        className="
          relative
          overflow-hidden
          rounded-[32px]
          border
          border-slate-800
          bg-gradient-to-br
          from-slate-900
          via-slate-950
          to-cyan-950/40
          p-8
          md:p-12
        "
      >

        <div className="
          absolute
          top-0
          right-0
          w-[300px]
          h-[300px]
          bg-cyan-500/10
          blur-3xl
          rounded-full
        " />

        <div className="
          relative
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-10
        ">

          <div className="max-w-2xl">

            <div className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-cyan-500/10
              border
              border-cyan-500/20
              text-cyan-300
              text-sm
              mb-6
            ">
              <CalendarDays size={16} />
              Centrum zarządzania rezerwacjami
            </div>

            <h1 className="
              text-4xl
              md:text-6xl
              font-black
              tracking-tight
              leading-tight
              mb-6
            ">
              Witaj,
              <span className="
                block
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                bg-clip-text
                text-transparent
              ">
                {user?.email}
              </span>
            </h1>

            <p className="
              text-slate-400
              text-lg
              leading-relaxed
              max-w-xl
            ">
              Zarządzaj rezerwacjami,
              sprawdzaj harmonogramy
              i organizuj sale uczelniane
              w jednym miejscu.
            </p>

          </div>

          <div className="
            flex
            flex-col
            sm:flex-row
            gap-4
            w-full
            xl:w-auto
          ">

            <Link
              to="/rooms"
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-2
                px-7
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                text-white
                font-semibold
                hover:scale-[1.02]
                transition-all
                shadow-2xl
                shadow-cyan-500/20
              "
            >
              Przeglądaj sale

              <ArrowRight
                size={18}
                className="
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </Link>

            <Link
              to="/my-bookings"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-7
                py-4
                rounded-2xl
                border
                border-slate-700
                bg-slate-900/70
                hover:bg-slate-800
                transition-all
                font-medium
              "
            >
              <Building2 size={18} />
              Moje rezerwacje
            </Link>

          </div>

        </div>

      </motion.section>

      <StatsWidget
        bookings={bookings}
        user={user}
      />

      <UpcomingBookingsWidget
        bookings={bookings}
        roomNameById={roomNameById}
      />

    </div>
  );
}

export default DashboardPage;