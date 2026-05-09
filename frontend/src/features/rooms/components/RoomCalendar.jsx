import {
  useEffect,
  useState,
  useMemo
} from "react";

import {
  useNavigate
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock3
} from "lucide-react";

import { toast } from "sonner";

import { useAuth }
from "../../auth/hooks/useAuth";

import {
  getRoomCalendar
} from "../services/roomService";

import {
  createBooking
} from "../../bookings/services/bookingService";

function buildWeek(startDate) {

  const days = [];

  const base = new Date(startDate);

  for (let i = 0; i < 7; i++) {

    const d = new Date(base);

    d.setDate(base.getDate() + i);

    days.push(
      d.toISOString().split("T")[0]
    );

  }

  return days;
}

function formatDay(date) {

  return new Date(date).toLocaleDateString(
    "pl-PL",
    {
      weekday: "short",
      day: "numeric",
      month: "short"
    }
  );
}

function isToday(date) {

  const today = new Date();

  return (
    new Date(date).toDateString() ===
    today.toDateString()
  );
}

function isPast(day, slot) {

  const now = new Date();

  const slotDate =
    new Date(`${day}T${slot.start}:00`);

  return slotDate < now;
}

function RoomCalendar({ roomId }) {

  const navigate = useNavigate();

  const { user } = useAuth();

  const [weekStart, setWeekStart] =
    useState(() => {

      const now = new Date();

      now.setHours(0, 0, 0, 0);

      return now;
    });

  const [selectedDate, setSelectedDate] =
    useState("");

  const days = useMemo(
    () => buildWeek(weekStart),
    [weekStart]
  );

  const [calendar, setCalendar] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [bookingLoading, setBookingLoading] =
    useState(null);

  useEffect(() => {

    async function fetchAllDays() {

      setLoading(true);

      try {

        const results =
          await Promise.all(
            days.map(day =>
              getRoomCalendar(roomId, day)
            )
          );

        const map = {};

        days.forEach((day, index) => {

          map[day] =
            results[index]?.slots
            || results[index]
            || [];

        });

        setCalendar(map);

      } catch (error) {

        console.error(error);

        toast.error(
          "Nie udało się załadować kalendarza"
        );

      } finally {

        setLoading(false);

      }

    }

    fetchAllDays();

  }, [roomId, days]);

  const timeSlots = useMemo(() => {

    const firstDay = days[0];

    return calendar[firstDay] || [];

  }, [calendar, days]);

  async function handleBooking(day, slot) {

    if (!user) {

      toast.info(
        "Zaloguj się, aby zarezerwować salę"
      );

      navigate("/login", {
        state: {
          from: window.location.pathname
        }
      });

      return;
    }

    if (isPast(day, slot)) {

      toast.error(
        "Nie można rezerwować terminów z przeszłości"
      );

      return;
    }

    try {

      setBookingLoading(
        `${day}-${slot.start}`
      );

      await createBooking({
        room_id: Number(roomId),
        start_time: `${day}T${slot.start}:00`,
        end_time: `${day}T${slot.end}:00`
      });

      const updated =
        await getRoomCalendar(roomId, day);

      setCalendar(prev => ({
        ...prev,
        [day]:
          updated.slots || updated
      }));

      toast.success(
        "Sala została pomyślnie zarezerwowana"
      );

    } catch (error) {

      toast.error(
        error?.response?.data?.error
        || "Błąd podczas rezerwacji"
      );

    } finally {

      setBookingLoading(null);

    }

  }

  function prevWeek() {

    setWeekStart(prev => {

      const d = new Date(prev);

      d.setDate(d.getDate() - 7);

      return d;
    });
  }

  function nextWeek() {

    setWeekStart(prev => {

      const d = new Date(prev);

      d.setDate(d.getDate() + 7);

      return d;
    });
  }

  return (

    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:.5 }}
      className="
        glass
        rounded-[32px]
        border
        border-slate-800
        p-5
        md:p-8
      "
    >

      <div className="
        flex
        flex-col
        xl:flex-row
        xl:items-center
        xl:justify-between
        gap-6
        mb-8
      ">

        <div>

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
            mb-4
          ">
            <CalendarDays size={16} />
            System rezerwacji
          </div>

          <h2 className="
            text-3xl
            md:text-4xl
            font-black
            tracking-tight
          ">
            Kalendarz sali
          </h2>

        </div>

        <div className="
          flex
          flex-col
          sm:flex-row
          gap-4
        ">

          <div className="flex gap-3">

            <button
              onClick={prevWeek}
              className="
                w-12
                h-12
                rounded-2xl
                bg-slate-900/70
                border
                border-slate-800
                flex
                items-center
                justify-center
                hover:bg-slate-800
                hover:border-slate-700
                transition-all
              "
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextWeek}
              className="
                w-12
                h-12
                rounded-2xl
                bg-slate-900/70
                border
                border-slate-800
                flex
                items-center
                justify-center
                hover:bg-slate-800
                hover:border-slate-700
                transition-all
              "
            >
              <ChevronRight size={18} />
            </button>

          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {

              const value =
                e.target.value;

              setSelectedDate(value);

              if (value) {

                const d =
                  new Date(value);

                setWeekStart(d);

              }

            }}
            className="
              h-12
              px-4
              rounded-2xl
              border
              border-slate-800
              bg-slate-900/70
              text-slate-200
              outline-none
            "
          />

        </div>

      </div>

      {loading ? (

        <div className="
          py-24
          text-center
          text-slate-400
        ">
          Ładowanie kalendarza...
        </div>

      ) : (

        <div className="
          overflow-x-auto
          rounded-3xl
          border
          border-slate-800
        ">

          <div className="
            min-w-[920px]
          ">

            <div className="
              grid
              grid-cols-[90px_repeat(7,1fr)]
              bg-slate-900/80
              border-b
              border-slate-800
            ">

              <div className="
                p-4
                border-r
                border-slate-800
                flex
                items-center
                justify-center
              ">
                <Clock3
                  size={18}
                  className="text-cyan-400"
                />
              </div>

              {days.map(day => (

                <div
                  key={day}
                  className={`
                    p-4
                    text-center
                    border-r
                    border-slate-800
                    transition-all
                    ${isToday(day)
                      ? "bg-cyan-500/10"
                      : ""
                    }
                  `}
                >

                  <div className="
                    text-sm
                    text-slate-400
                    mb-1
                  ">
                    {isToday(day)
                      ? "Dzisiaj"
                      : ""
                    }
                  </div>

                  <div className="
                    font-semibold
                  ">
                    {formatDay(day)}
                  </div>

                </div>

              ))}

            </div>

            {timeSlots.map(slot => (

              <div
                key={slot.start}
                className="
                  grid
                  grid-cols-[90px_repeat(7,1fr)]
                  border-b
                  border-slate-800
                "
              >

                <div className="
                  p-4
                  border-r
                  border-slate-800
                  bg-slate-950/60
                  text-sm
                  text-slate-300
                  font-medium
                  flex
                  items-center
                  justify-center
                ">
                  {slot.start}
                </div>

                {days.map(day => {

                  const daySlots =
                    calendar[day] || [];

                  const current =
                    daySlots.find(
                      s =>
                        s.start === slot.start
                    );

                  const isAvailable =
                    current?.available;

                  const past =
                    isPast(day, slot);

                  const isLoading =
                    bookingLoading ===
                    `${day}-${slot.start}`;

                  return (

                    <div
                      key={day}
                      className={`
                        p-3
                        border-r
                        border-slate-800
                        flex
                        items-center
                        justify-center
                        transition-all
                        min-h-[88px]

                        ${
                          past
                          ? "bg-slate-950/40"
                          : isAvailable
                          ? "bg-emerald-500/5"
                          : "bg-rose-500/5"
                        }
                      `}
                    >

                      {isAvailable && !past ? (

                        <button
                          disabled={isLoading}
                          onClick={() =>
                            handleBooking(
                              day,
                              slot
                            )
                          }
                          className="
                            w-full
                            py-3
                            rounded-2xl
                            bg-gradient-to-r
                            from-cyan-500
                            to-blue-600
                            text-white
                            text-sm
                            font-semibold
                            hover:scale-[1.02]
                            transition-all
                            shadow-lg
                            shadow-cyan-500/20
                            disabled:opacity-50
                          "
                        >

                          {isLoading
                            ? "Rezerwowanie..."
                            : "Rezerwuj"
                          }

                        </button>

                      ) : (

                        <div className={`
                          px-4
                          py-2
                          rounded-full
                          text-xs
                          font-medium
                          border

                          ${
                            past
                            ? `
                              bg-slate-900
                              border-slate-800
                              text-slate-500
                            `
                            : `
                              bg-rose-500/10
                              border-rose-500/20
                              text-rose-300
                            `
                          }
                        `}>

                          {past
                            ? "Minęło"
                            : "Zajęta"
                          }

                        </div>

                      )}

                    </div>

                  );

                })}

              </div>

            ))}

          </div>

        </div>

      )}

    </motion.div>

  );

}

export default RoomCalendar;