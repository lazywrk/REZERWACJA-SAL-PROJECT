import { Link } from "react-router-dom";
import { useMemo } from "react";
import { CalendarClock } from "lucide-react";

import {
  formatDate,
  getBookingStatus
} from "../../../utils/bookings";

export default function UpcomingBookingsWidget({
  bookings,
  roomNameById
}) {

  const upcoming = useMemo(() => {

    const now = new Date();

    return bookings
      .filter(
        (b) =>
          getBookingStatus(b, now) === "upcoming"
      )
      .sort(
        (a, b) =>
          new Date(a.start_time).getTime() -
          new Date(b.start_time).getTime()
      )
      .slice(0, 5);

  }, [bookings]);

  return (
    <div className="
      rounded-3xl
      border
      border-slate-800
      bg-slate-900/70
      backdrop-blur-xl
      p-6
      sm:p-8
    ">

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
        mb-8
      ">

        <div className="flex items-center gap-3">

          <div className="
            w-12
            h-12
            rounded-2xl
            bg-cyan-500/10
            flex
            items-center
            justify-center
          ">
            <CalendarClock className="text-cyan-400" />
          </div>

          <div>
            <h2 className="
              text-2xl
              font-bold
            ">
              Nadchodzące rezerwacje
            </h2>

            <p className="text-slate-400 text-sm">
              Twoje najbliższe terminy
            </p>
          </div>

        </div>

        <Link
          to="/my-bookings"
          className="
            px-5
            py-2.5
            rounded-2xl
            border
            border-slate-700
            bg-slate-800/60
            hover:bg-slate-700
            transition-all
            text-sm
            text-center
          "
        >
          Wszystkie rezerwacje
        </Link>

      </div>

      {upcoming.length === 0 ? (

        <div className="
          border
          border-dashed
          border-slate-700
          rounded-3xl
          py-16
          text-center
        ">
          <p className="text-slate-400">
            Brak nadchodzących rezerwacji
          </p>
        </div>

      ) : (

        <div className="space-y-4">

          {upcoming.map((b) => {

            const roomName =
              roomNameById.get(b.room_id)
              || `Sala #${b.room_id}`;

            return (

              <div
                key={b.id}
                className="
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-800/50
                  p-5
                  hover:bg-slate-800
                  transition-all
                "
              >

                <div className="
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  md:justify-between
                  gap-4
                ">

                  <div>

                    <p className="
                      text-lg
                      font-semibold
                    ">
                      {roomName}
                    </p>

                    <p className="
                      text-slate-400
                      text-sm
                      mt-1
                    ">
                      {formatDate(b.start_time)}
                    </p>

                  </div>

                  <div className="
                    px-4
                    py-2
                    rounded-xl
                    bg-cyan-500/10
                    text-cyan-300
                    text-sm
                    font-medium
                    w-fit
                  ">
                    Zaplanowana
                  </div>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
}