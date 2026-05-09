import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Users,
  Monitor,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Building2
} from "lucide-react";

import { motion } from "framer-motion";

import api from "../../../api/client";

import { getRooms } from "../services/roomService";

import RoomFilters from "../components/RoomFilters";

function getTypeLabel(type) {

  switch(type){

    case "lecture":
      return "Aula wykładowa";

    case "seminar":
      return "Sala seminaryjna";

    case "lab":
      return "Laboratorium";

    case "conference":
      return "Sala konferencyjna";

    case "computer":
      return "Sala komputerowa";

    default:
      return type;
  }
}

function RoomsPage() {

  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    capacity: "",
    type: "",
    equipment: ""
  });

  const [equipmentOptions, setEquipmentOptions] = useState([]);

  const [page, setPage] = useState(1);

  const ROOMS_PER_PAGE = 9;

  useEffect(() => {

    api.get("/equipment")
      .then(res => setEquipmentOptions(res.data || []))
      .catch(console.error);

  }, []);

  useEffect(() => {

    async function load() {

      try {

        setLoading(true);

        const params = {
          search: filters.search || undefined,
          type: filters.type || undefined,
          capacity: filters.capacity || undefined,
          equipment: filters.equipment || undefined
        };

        const data = await getRooms(params);

        setRooms(
          Array.isArray(data)
            ? data
            : []
        );

        setPage(1);

      } catch (e) {

        console.error(e);

      } finally {

        setLoading(false);

      }
    }

    load();

  }, [filters]);

  const start =
    (page - 1) * ROOMS_PER_PAGE;

  const paginated =
    rooms.slice(
      start,
      start + ROOMS_PER_PAGE
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        rooms.length / ROOMS_PER_PAGE
      )
    );

  return (

    <div className="relative overflow-hidden">

      <div className="absolute inset-0 -z-10">

        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-[700px]
            h-[700px]
            bg-cyan-500/10
            blur-3xl
            rounded-full
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-0
            w-[500px]
            h-[500px]
            bg-blue-600/10
            blur-3xl
            rounded-full
          "
        />

      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.5 }}
          className="mb-14"
        >

          <div
            className="
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
            "
          >

            <Search size={16} />

            Katalog sal uczelnianych

          </div>

          <h1
            className="
              text-4xl
              md:text-6xl
              font-black
              tracking-tight
              leading-tight
              mb-6
            "
          >

            Znajdź idealną
            <span
              className="
                block
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                bg-clip-text
                text-transparent
              "
            >
              salę dla siebie
            </span>

          </h1>

          <p
            className="
              text-lg
              text-slate-400
              max-w-2xl
              leading-relaxed
            "
          >
            Wyszukuj dostępne sale,
            sprawdzaj wyposażenie
            i rezerwuj terminy
            w nowoczesnym systemie online.
          </p>

        </motion.div>

        <RoomFilters
          filters={filters}
          onApply={setFilters}
          equipmentOptions={equipmentOptions}
        />

        {loading ? (

          <div
            className="
              grid
              md:grid-cols-2
              xl:grid-cols-3
              gap-8
            "
          >

            {[...Array(6)].map((_,i)=>(

              <div
                key={i}
                className="
                  h-[320px]
                  rounded-3xl
                  bg-slate-900/60
                  border
                  border-slate-800
                  animate-pulse
                "
              />

            ))}

          </div>

        ) : rooms.length === 0 ? (

          <div
            className="
              glass
              rounded-3xl
              border
              border-slate-800
              p-16
              text-center
            "
          >

            <div
              className="
                w-20
                h-20
                rounded-full
                bg-slate-900
                flex
                items-center
                justify-center
                mx-auto
                mb-6
              "
            >
              <Search
                size={32}
                className="text-slate-500"
              />
            </div>

            <h3 className="text-2xl font-bold mb-3">
              Nie znaleziono sal
            </h3>

            <p className="text-slate-400">
              Spróbuj zmienić filtry wyszukiwania.
            </p>

          </div>

        ) : (

          <>
            <div
              className="
                grid
                md:grid-cols-2
                xl:grid-cols-3
                gap-8
              "
            >

              {paginated.map((room,index)=>(

                <motion.div
                  key={room.id}
                  initial={{
                    opacity:0,
                    y:20
                  }}
                  animate={{
                    opacity:1,
                    y:0
                  }}
                  transition={{
                    duration:.4,
                    delay:index * .05
                  }}
                  whileHover={{
                    y:-6
                  }}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-slate-800
                    bg-slate-950/70
                    backdrop-blur-xl
                  "
                >

                  <div
                    className="
                      absolute
                      inset-0
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity
                      bg-gradient-to-br
                      from-cyan-500/10
                      to-blue-600/10
                    "
                  />

                  <div className="relative p-8">

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        mb-8
                      "
                    >

                      <div>

                        <div
                          className="
                            w-16
                            h-16
                            rounded-2xl
                            bg-gradient-to-br
                            from-cyan-500/20
                            to-blue-600/20
                            border
                            border-cyan-500/20
                            flex
                            items-center
                            justify-center
                            mb-5
                          "
                        >
                          <Building2
                            className="
                              text-cyan-400
                            "
                          />
                        </div>

                        <h3
                          className="
                            text-2xl
                            font-bold
                            mb-2
                          "
                        >
                          {room.name}
                        </h3>

                        <p className="text-slate-400">
                          {getTypeLabel(room.type)}
                        </p>

                      </div>

                     <div
                          className={`
                            px-3
                            py-2
                            rounded-xl
                            border
                            text-sm
                            font-medium
                            ${
                              room.status === "maintenance"
                                ? `
                                  bg-red-500/10
                                  border-red-500/20
                                  text-red-300
                                `
                                : `
                                  bg-emerald-500/10
                                  border-emerald-500/20
                                  text-emerald-300
                                `
                            }
                          `}
                        >
                          {
                            room.status === "maintenance"
                              ? "Konserwacja"
                              : "Dostępna"
                          }
                        </div>

                    </div>

                    <div
                      className="
                        space-y-4
                        mb-8
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-2xl
                          bg-slate-900/70
                          border
                          border-slate-800
                          px-4
                          py-4
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <div
                            className="
                              w-10
                              h-10
                              rounded-xl
                              bg-cyan-500/10
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <Users
                              size={18}
                              className="text-cyan-400"
                            />
                          </div>

                          <span className="text-slate-300">
                            Pojemność
                          </span>

                        </div>

                        <span
                          className="
                            text-lg
                            font-bold
                          "
                        >
                          {room.capacity}
                        </span>

                      </div>

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-2xl
                          bg-slate-900/70
                          border
                          border-slate-800
                          px-4
                          py-4
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <div
                            className="
                              w-10
                              h-10
                              rounded-xl
                              bg-blue-500/10
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <Monitor
                              size={18}
                              className="text-blue-400"
                            />
                          </div>

                          <span className="text-slate-300">
                            Typ sali
                          </span>

                        </div>

                        <span
                          className="
                            text-sm
                            text-slate-200
                          "
                        >
                          {getTypeLabel(room.type)}
                        </span>

                      </div>

                    </div>

                    <Link
                      to={`/rooms/${room.id}`}
                      className="
                        group/button
                        flex
                        items-center
                        justify-center
                        gap-2
                        w-full
                        h-14
                        rounded-2xl
                        bg-gradient-to-r
                        from-cyan-500
                        to-blue-600
                        text-white
                        font-semibold
                        shadow-xl
                        shadow-cyan-500/20
                        hover:scale-[1.02]
                        transition-all
                      "
                    >

                      Zobacz szczegóły

                      <ArrowRight
                        size={18}
                        className="
                          transition-transform
                          group-hover/button:translate-x-1
                        "
                      />

                    </Link>

                  </div>

                </motion.div>

              ))}

            </div>

            <div
              className="
                flex
                items-center
                justify-center
                gap-4
                mt-16
                flex-wrap
              "
            >

              <button
                onClick={() =>
                  setPage(p =>
                    Math.max(1,p-1)
                  )
                }
                className="
                  w-12
                  h-12
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-900/60
                  hover:bg-slate-800
                  flex
                  items-center
                  justify-center
                  transition-all
                "
              >
                <ChevronLeft size={20} />
              </button>

              <div
                className="
                  px-6
                  h-12
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-900/60
                  flex
                  items-center
                  justify-center
                  text-slate-300
                "
              >
                Strona {page} z {totalPages}
              </div>

              <button
                onClick={() =>
                  setPage(p =>
                    Math.min(
                      totalPages,
                      p + 1
                    )
                  )
                }
                className="
                  w-12
                  h-12
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-900/60
                  hover:bg-slate-800
                  flex
                  items-center
                  justify-center
                  transition-all
                "
              >
                <ChevronRight size={20} />
              </button>

            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default RoomsPage;