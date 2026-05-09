import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  Building2,
  Users,
  Monitor,
  ShieldCheck,
  CalendarDays,
  CircleDot
} from "lucide-react";

import {
  getRoomById
} from "../services/roomService";

import RoomCalendar from "../components/RoomCalendar";

function RoomDetailsPage() {

  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadRoom() {

      try {

        const data =
          await getRoomById(id);

        setRoom(data);

      } catch (error) {
        console.error(error);

      } finally {
        setLoading(false);
      }

    }

    loadRoom();

  }, [id]);

  if (loading) {
    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-slate-400
      ">
        Ładowanie sali...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-slate-400
      ">
        Sala nie istnieje
      </div>
    );
  }

  return (
    <div className="
      relative
      overflow-hidden
      min-h-screen
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
        px-4
        sm:px-6
        lg:px-8
        py-10
        lg:py-16
      ">

        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.4 }}
          className="
            glass
            rounded-[32px]
            p-6
            md:p-10
            border
            border-slate-800
            mb-10
          "
        >

          <div className="
            flex
            flex-col
            xl:flex-row
            xl:items-start
            xl:justify-between
            gap-10
          ">

            <div className="flex-1">

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
                Sala uczelniana
              </div>

              <h1 className="
                text-4xl
                md:text-6xl
                font-black
                tracking-tight
                mb-6
              ">
                {room.name}
              </h1>

              <p className="
                text-slate-400
                text-lg
                leading-relaxed
                max-w-3xl
              ">
                {room.description ||
                  "Nowoczesna sala dostępna do rezerwacji w systemie uczelnianym."}
              </p>

            </div>

            <div className="
              w-full
              xl:w-[340px]
              glass
              rounded-3xl
              p-6
              border
              border-slate-800
            ">

              <div className="space-y-5">

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-4
                ">
                  <div className="
                    flex
                    items-center
                    gap-3
                  ">
                    <Building2
                      size={18}
                      className="text-cyan-400"
                    />

                    <span className="text-slate-400">
                      Budynek
                    </span>
                  </div>

                  <span className="font-medium">
                    {room.building_name}
                  </span>
                </div>

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-4
                ">
                  <div className="
                    flex
                    items-center
                    gap-3
                  ">
                    <Users
                      size={18}
                      className="text-cyan-400"
                    />

                    <span className="text-slate-400">
                      Pojemność
                    </span>
                  </div>

                  <span className="font-medium">
                    {room.capacity}
                  </span>
                </div>

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-4
                ">
                  <div className="
                    flex
                    items-center
                    gap-3
                  ">
                    <Monitor
                      size={18}
                      className="text-cyan-400"
                    />

                    <span className="text-slate-400">
                      Typ
                    </span>
                  </div>

                  <span className="
                    capitalize
                    font-medium
                  ">
                    {room.type}
                  </span>
                </div>

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-4
                ">
                  <div className="
                    flex
                    items-center
                    gap-3
                  ">
                    <ShieldCheck
                      size={18}
                      className="text-cyan-400"
                    />

                    <span className="text-slate-400">
                      Status
                    </span>
                  </div>

                 <div
                      className={`
                        flex
                        items-center
                        gap-2
                        px-3
                        py-1.5
                        rounded-full
                        border
                        text-sm
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
                      <CircleDot size={12} />

                      {
                        room.status === "maintenance"
                          ? "Konserwacja"
                          : (
                              room.live_status ||
                              "Dostępna"
                            )
                      }
                    </div>
                </div>

              </div>

            </div>

          </div>

        </motion.div>

        {room.equipment?.length > 0 && (

          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:.5 }}
            className="
              glass
              rounded-[32px]
              p-6
              md:p-8
              border
              border-slate-800
              mb-10
            "
          >

            <h2 className="
              text-2xl
              md:text-3xl
              font-bold
              mb-8
            ">
              Wyposażenie sali
            </h2>

            <div className="
              flex
              flex-wrap
              gap-4
            ">

              {room.equipment.map(item => (

                <div
                  key={item.id}
                  className="
                    px-5
                    py-3
                    rounded-2xl
                    bg-slate-900/70
                    border
                    border-slate-800
                    text-slate-200
                    hover:border-cyan-500/30
                    hover:-translate-y-1
                    transition-all
                  "
                >
                  {item.name}
                </div>

              ))}

            </div>

          </motion.div>

        )}

        <RoomCalendar roomId={id} />

      </div>

    </div>
  );
}

export default RoomDetailsPage;