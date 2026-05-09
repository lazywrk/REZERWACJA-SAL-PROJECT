import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  Clock3,
  XCircle,
  History,
  Building2,
  Sparkles
} from "lucide-react";

import { toast } from "sonner";

import {
  getMyBookings,
  cancelBooking
} from "../services/bookingService";

import { getRooms } from "../../rooms/services/roomService";

import {
  formatDate,
  getBookingVisualStatus,
  splitBookings
} from "../../../utils/bookings";

function SectionHeader({ icon, title, count }) {

  return (
    <div className="flex items-center justify-between mb-6">

      <div className="flex items-center gap-3">

        <div className="
          w-12
          h-12
          rounded-2xl
          bg-slate-900/70
          border
          border-slate-800
          flex
          items-center
          justify-center
        ">
          {icon}
        </div>

        <div>

          <h2 className="text-2xl font-bold text-white">
            {title}
          </h2>

          <p className="text-sm text-slate-400">
            {count} rezerwacji
          </p>

        </div>

      </div>

    </div>
  );
}

function BookingCard({
  booking,
  roomName,
  status,
  canCancel,
  cancellingId,
  handleCancel
}) {

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-800
        bg-slate-900/60
        backdrop-blur-xl
        p-6
        hover:border-cyan-500/30
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >

      <div className="
        absolute
        top-0
        right-0
        w-40
        h-40
        bg-cyan-500/5
        blur-3xl
        rounded-full
      " />

      <div className="
        relative
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-6
      ">

        <div className="flex-1">

          <div className="
            flex
            flex-wrap
            items-center
            gap-3
            mb-5
          ">

            <div className="
              w-12
              h-12
              rounded-2xl
              bg-cyan-500/10
              flex
              items-center
              justify-center
              border
              border-cyan-500/20
            ">

              <Building2
                size={22}
                className="text-cyan-400"
              />

            </div>

            <div>

              <h3 className="text-xl font-bold text-white">
                {roomName}
              </h3>

              <p className="text-sm text-slate-400">
                Sala uczelniana
              </p>

            </div>

          </div>

          <div className="
            grid
            sm:grid-cols-2
            gap-4
          ">

            <div className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/40
              p-4
            ">

              <div className="
                flex
                items-center
                gap-2
                text-slate-400
                text-sm
                mb-2
              ">

                <CalendarDays size={16} />

                Początek
              </div>

              <p className="font-medium text-slate-100">
                {formatDate(booking.start_time)}
              </p>

            </div>

            <div className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/40
              p-4
            ">

              <div className="
                flex
                items-center
                gap-2
                text-slate-400
                text-sm
                mb-2
              ">

                <Clock3 size={16} />

                Koniec
              </div>

              <p className="font-medium text-slate-100">
                {formatDate(booking.end_time)}
              </p>

            </div>

          </div>

        </div>

        <div className="
          flex
          flex-col
          items-start
          lg:items-end
          gap-4
        ">

          <span className={`
            inline-flex
            items-center
            px-4
            py-2
            rounded-2xl
            text-sm
            font-medium
            border
            ${status.classes}
          `}>
            {status.label}
          </span>

          {canCancel && (

            <button
              onClick={() =>
                handleCancel(booking.id)
              }
              disabled={cancellingId === booking.id}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                rounded-2xl
                border
                border-red-500/30
                bg-red-500/10
                text-red-300
                hover:bg-red-500/20
                hover:scale-[1.02]
                transition-all
                disabled:opacity-60
                disabled:hover:scale-100
              "
            >

              <XCircle size={18} />

              {
                cancellingId === booking.id
                  ? "Anulowanie..."
                  : "Anuluj rezerwację"
              }

            </button>

          )}

        </div>

      </div>

    </div>
  );
}

function EmptyState() {

  return (
    <div className="
      relative
      overflow-hidden
      rounded-[32px]
      border
      border-slate-800
      bg-slate-900/60
      backdrop-blur-xl
      p-12
      text-center
    ">

      <div className="
        absolute
        inset-0
        bg-gradient-to-br
        from-cyan-500/5
        to-blue-500/5
      " />

      <div className="relative">

        <div className="
          w-20
          h-20
          rounded-3xl
          bg-cyan-500/10
          border
          border-cyan-500/20
          flex
          items-center
          justify-center
          mx-auto
          mb-6
        ">

          <Sparkles
            size={34}
            className="text-cyan-400"
          />

        </div>

        <h2 className="
          text-3xl
          font-bold
          text-white
          mb-4
        ">
          Brak rezerwacji
        </h2>

        <p className="
          text-slate-400
          max-w-md
          mx-auto
          leading-relaxed
        ">
          Nie masz jeszcze żadnych rezerwacji.
          Przeglądaj dostępne sale i zarezerwuj termin.
        </p>

      </div>

    </div>
  );
}

export default function MyBookingsPage() {

  const [bookings, setBookings] =
    useState([]);

  const [rooms, setRooms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [cancellingId, setCancellingId] =
    useState(null);

  useEffect(() => {

    async function loadData() {

      try {

        const [
          bookingsData,
          roomsData
        ] = await Promise.all([
          getMyBookings(),
          getRooms()
        ]);

        setBookings(
          Array.isArray(bookingsData)
            ? bookingsData
            : []
        );

        setRooms(
          Array.isArray(roomsData)
            ? roomsData
            : []
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Nie udało się pobrać rezerwacji."
        );

      } finally {

        setLoading(false);
      }

    }

    loadData();

  }, []);


  const roomNameById = useMemo(() => {

    const map = new Map();

    rooms.forEach(room => {
      map.set(room.id, room.name);
    });

    return map;

  }, [rooms]);


  async function handleCancel(id) {

    const confirmed =
      window.confirm(
        "Czy na pewno chcesz anulować tę rezerwację?"
      );

    if (!confirmed) return;

    try {

      setCancellingId(id);

      await cancelBooking(id);

      const data =
        await getMyBookings();

      setBookings(
        Array.isArray(data)
          ? data
          : []
      );

      toast.success(
        "Rezerwacja została anulowana."
      );

    } catch (error) {

      toast.error(
        error?.response?.data?.error
        || "Nie udało się anulować rezerwacji."
      );

    } finally {

      setCancellingId(null);
    }

  }


  if (loading) {

    return (
      <div className="
        min-h-[60vh]
        flex
        items-center
        justify-center
      ">

        <div className="
          w-14
          h-14
          rounded-full
          border-4
          border-cyan-500/20
          border-t-cyan-400
          animate-spin
        " />

      </div>
    );
  }


  const now = new Date();

  const {
    active,
    upcoming,
    history
  } = splitBookings(bookings, now);


  function renderSection(
    list,
    title,
    icon
  ) {

    if (list.length === 0) {
      return null;
    }

    return (
      <section className="space-y-6">

        <SectionHeader
          title={title}
          icon={icon}
          count={list.length}
        />

        <div className="space-y-5">

          {list.map(booking => {

            const roomName =
              roomNameById.get(
                booking.room_id
              ) || `Sala #${booking.room_id}`;

            const status =
              getBookingVisualStatus(
                booking,
                now
              );

            const canCancel =
              booking.status === "active"
              &&
              new Date(
                booking.start_time
              ) > now;

            return (
              <BookingCard
                key={booking.id}
                booking={booking}
                roomName={roomName}
                status={status}
                canCancel={canCancel}
                cancellingId={cancellingId}
                handleCancel={handleCancel}
              />
            );

          })}

        </div>

      </section>
    );
  }


  return (
    <div className="
      relative
      overflow-hidden
      px-4
      sm:px-6
      lg:px-8
      py-10
      md:py-14
    ">

      <div className="
        absolute
        top-0
        left-1/2
        -translate-x-1/2
        w-[700px]
        h-[700px]
        bg-cyan-500/10
        blur-3xl
        rounded-full
        -z-10
      " />

      <div className="
        max-w-7xl
        mx-auto
        space-y-14
      ">

        <section className="
          relative
          overflow-hidden
          rounded-[36px]
          border
          border-slate-800
          bg-slate-900/60
          backdrop-blur-xl
          p-8
          md:p-12
        ">

          <div className="
            absolute
            top-0
            right-0
            w-72
            h-72
            bg-cyan-500/10
            blur-3xl
            rounded-full
          " />

          <div className="relative">

            <div className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              border
              border-cyan-500/20
              bg-cyan-500/10
              text-cyan-300
              text-sm
              mb-6
            ">

              <CalendarDays size={16} />

              Panel rezerwacji użytkownika
            </div>

            <h1 className="
              text-4xl
              md:text-6xl
              font-black
              tracking-tight
              text-white
              mb-6
            ">

              Moje

              <span className="
                block
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                bg-clip-text
                text-transparent
              ">
                rezerwacje
              </span>

            </h1>

            <p className="
              max-w-2xl
              text-slate-400
              text-lg
              leading-relaxed
            ">
              Zarządzaj swoimi rezerwacjami,
              sprawdzaj nadchodzące terminy
              i kontroluj historię aktywności.
            </p>

          </div>

        </section>

        {bookings.length === 0 ? (

          <EmptyState />

        ) : (

          <div className="space-y-16">

            {renderSection(
              active,
              "Aktywne",
              <Clock3 className="text-emerald-400" />
            )}

            {renderSection(
              upcoming,
              "Nadchodzące",
              <CalendarDays className="text-cyan-400" />
            )}

            {renderSection(
              history,
              "Historia",
              <History className="text-slate-400" />
            )}

          </div>

        )}

      </div>

    </div>
  );
}