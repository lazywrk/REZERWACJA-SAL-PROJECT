import { useState } from "react";

import {
  CalendarDays,
  Clock3,
  Sparkles,
} from "lucide-react";

import { toast } from "sonner";

import {
  createBooking
} from "../services/bookingService";

function BookingForm({ roomId }) {

  const [date, setDate] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  async function handleSubmit(e) {

    e.preventDefault();

    if (!date || !startTime || !endTime) {

      toast.error(
        "Uzupełnij wszystkie pola rezerwacji."
      );

      return;
    }

    if (startTime >= endTime) {

      toast.error(
        "Godzina zakończenia musi być późniejsza niż rozpoczęcia."
      );

      return;
    }

    setLoading(true);

    try {

      await createBooking({
        room_id: roomId,

        start_time:
          `${date}T${startTime}:00`,

        end_time:
          `${date}T${endTime}:00`
      });


      toast.success(
        "Sala została pomyślnie zarezerwowana."
      );

      setDate("");
      setStartTime("");
      setEndTime("");

    } catch (error) {

      const message =
        error?.response?.data?.error
        || "Nie udało się utworzyć rezerwacji.";

      toast.error(message);

    } finally {

      setLoading(false);
    }
  }


  return (
    <div className="
      relative
      overflow-hidden
      rounded-[32px]
      border
      border-slate-800
      bg-slate-900/60
      backdrop-blur-xl
      p-6
      md:p-8
    ">

      <div className="
        absolute
        top-0
        right-0
        w-60
        h-60
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
          <Sparkles size={16} />

          Formularz rezerwacji
        </div>


        <h2 className="
          text-3xl
          font-black
          text-white
          mb-3
        ">
          Rezerwacja sali
        </h2>


        <p className="
          text-slate-400
          mb-8
          leading-relaxed
        ">
          Wybierz datę oraz przedział czasowy
          dla swojej rezerwacji.
        </p>


        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-300
              mb-3
            ">
              <CalendarDays size={16} />

              Data rezerwacji
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              required
              className="
                w-full
                rounded-2xl
                border
                border-slate-700
                bg-slate-950/60
                px-4
                py-4
                text-slate-100
                outline-none
                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/10
                transition-all
              "
            />

          </div>


          <div className="
            grid
            sm:grid-cols-2
            gap-5
          ">

            <div>

              <label className="
                flex
                items-center
                gap-2
                text-sm
                text-slate-300
                mb-3
              ">
                <Clock3 size={16} />

                Godzina rozpoczęcia
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(e) =>
                  setStartTime(
                    e.target.value
                  )
                }
                required
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-950/60
                  px-4
                  py-4
                  text-slate-100
                  outline-none
                  focus:border-cyan-500
                  focus:ring-4
                  focus:ring-cyan-500/10
                  transition-all
                "
              />

            </div>


            <div>

              <label className="
                flex
                items-center
                gap-2
                text-sm
                text-slate-300
                mb-3
              ">
                <Clock3 size={16} />

                Godzina zakończenia
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(e) =>
                  setEndTime(
                    e.target.value
                  )
                }
                required
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-950/60
                  px-4
                  py-4
                  text-slate-100
                  outline-none
                  focus:border-cyan-500
                  focus:ring-4
                  focus:ring-cyan-500/10
                  transition-all
                "
              />

            </div>

          </div>


          <button
            disabled={loading}
            className="
              group
              relative
              w-full
              overflow-hidden
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              px-6
              py-4
              text-white
              font-semibold
              shadow-2xl
              shadow-cyan-500/20
              hover:scale-[1.01]
              transition-all
              disabled:opacity-70
              disabled:hover:scale-100
            "
          >

            <span className="relative z-10">

              {
                loading
                  ? "Tworzenie rezerwacji..."
                  : "Zarezerwuj salę"
              }

            </span>

            <div className="
              absolute
              inset-0
              opacity-0
              group-hover:opacity-100
              transition-opacity
              bg-white/10
            " />

          </button>

        </form>

      </div>

    </div>
  );
}

export default BookingForm;