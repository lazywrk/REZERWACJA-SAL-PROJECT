import { useEffect, useState } from "react";

import {
  getAdminStatistics,
} from "../services/adminStatisticsService";

import {
  downloadBookingsCSV,
  downloadBookingsPDF,
} from "../services/adminExportService";


function AdminStatisticsPage() {

  const [statistics, setStatistics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    async function loadStatistics() {

      try {

        const data =
          await getAdminStatistics();

        setStatistics(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    }

    loadStatistics();

  }, []);


  if (loading) {

    return (
      <div className="p-6 md:p-10">

        <div className="
          rounded-[28px]
          border border-white/10
          bg-slate-900/70
          backdrop-blur-xl
          p-8
          text-slate-300
        ">
          Ładowanie statystyk...
        </div>

      </div>
    );
  }


  return (
    <div className="p-6 md:p-10 space-y-8 md:space-y-10">

      {/* HEADER */}

      <div className="
        rounded-[32px]
        border border-white/10
        bg-gradient-to-br
        from-slate-900/90
        via-slate-900/80
        to-slate-800/70
        backdrop-blur-2xl
        p-6 md:p-8
      ">

        <div className="
          flex flex-col xl:flex-row
          xl:items-center
          xl:justify-between
          gap-6
        ">

          <div>

            <p className="
              text-sm
              uppercase
              tracking-[0.25em]
              text-cyan-300/80
              mb-3
            ">
              Panel administratora
            </p>

            <h1 className="
              text-3xl
              md:text-5xl
              font-black
              text-white
              leading-tight
            ">
              Statystyki i raporty
            </h1>

            <p className="
              mt-4
              text-slate-400
              text-sm md:text-base
              max-w-2xl
            ">
              Analiza rezerwacji sal, aktywności użytkowników
              oraz eksport raportów uczelnianych.
            </p>

          </div>


          <div className="
            flex flex-col sm:flex-row
            gap-3
            w-full sm:w-auto
          ">

            <button
              onClick={downloadBookingsCSV}
              className="
                px-5 py-3
                rounded-2xl
                border border-white/10
                bg-white/5
                hover:bg-white/10
                text-slate-200
                transition-all
              "
            >
              Eksport CSV
            </button>

            <button
              onClick={downloadBookingsPDF}
              className="
                px-5 py-3
                rounded-2xl
                bg-cyan-400
                hover:bg-cyan-300
                text-slate-950
                font-semibold
                transition-all
              "
            >
              Eksport PDF
            </button>

          </div>

        </div>

      </div>


      {/* STATS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">

        <div className="
          rounded-[28px]
          border border-cyan-500/10
          bg-slate-900/70
          backdrop-blur-xl
          p-7
        ">

          <p className="
            text-sm
            text-slate-400
          ">
            Wszystkie rezerwacje
          </p>

          <h2 className="
            text-5xl
            font-black
            text-white
            mt-4
          ">
            {statistics.total_bookings}
          </h2>

        </div>


        <div className="
          rounded-[28px]
          border border-emerald-500/10
          bg-slate-900/70
          backdrop-blur-xl
          p-7
        ">

          <p className="
            text-sm
            text-slate-400
          ">
            Aktywne rezerwacje
          </p>

          <h2 className="
            text-5xl
            font-black
            text-emerald-300
            mt-4
          ">
            {statistics.active_bookings}
          </h2>

        </div>


        <div className="
          rounded-[28px]
          border border-purple-500/10
          bg-slate-900/70
          backdrop-blur-xl
          p-7
        ">

          <p className="
            text-sm
            text-slate-400
          ">
            Użytkownicy systemu
          </p>

          <h2 className="
            text-5xl
            font-black
            text-purple-300
            mt-4
          ">
            {statistics.total_users}
          </h2>

        </div>

      </div>


      {/* TOP ROOMS */}

      <div className="
        rounded-[32px]
        border border-white/10
        bg-slate-900/70
        backdrop-blur-xl
        overflow-hidden
      ">

        <div className="
          flex flex-col md:flex-row
          md:items-center
          md:justify-between
          gap-4
          px-6 md:px-8
          py-6
          border-b border-white/10
        ">

          <div>

            <h2 className="
              text-2xl
              font-bold
              text-white
            ">
              Najczęściej rezerwowane sale
            </h2>

            <p className="
              text-slate-400
              mt-2
              text-sm
            ">
              Sale z największą liczbą rezerwacji
            </p>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead className="border-b border-white/10">

              <tr className="text-slate-400 text-sm">

                <th className="text-left px-6 py-5 font-medium">
                  Sala
                </th>

                <th className="text-left px-6 py-5 font-medium">
                  Liczba rezerwacji
                </th>

              </tr>

            </thead>

            <tbody>

              {statistics.top_rooms.map((room) => (

                <tr
                  key={room.id}
                  className="
                    border-b border-white/5
                    hover:bg-white/[0.03]
                    transition-colors
                  "
                >

                  <td className="px-6 py-5">

                    <div className="
                      font-semibold
                      text-white
                    ">
                      {room.name}
                    </div>

                  </td>

                  <td className="px-6 py-5">

                    <span className="
                      inline-flex
                      items-center
                      px-4 py-2
                      rounded-full
                      bg-cyan-500/10
                      border border-cyan-500/10
                      text-cyan-300
                      text-sm
                      font-semibold
                    ">
                      {room.bookings_count}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AdminStatisticsPage;