import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Users,
  DoorOpen,
  MonitorSmartphone,
  BarChart3,
  ArrowRight
} from "lucide-react";

const cards = [
  {
    title: "Użytkownicy",
    description: "Zarządzanie kontami użytkowników",
    icon: Users,
    to: "/admin/users",
    glow: "from-cyan-500/20 to-blue-500/20"
  },
  {
    title: "Sale",
    description: "Zarządzanie salami uczelnianymi",
    icon: DoorOpen,
    to: "/admin/rooms",
    glow: "from-emerald-500/20 to-cyan-500/20"
  },
  {
    title: "Wyposażenie",
    description: "Zarządzanie wyposażeniem sal",
    icon: MonitorSmartphone,
    to: "/admin/equipment",
    glow: "from-purple-500/20 to-cyan-500/20"
  },
  {
    title: "Statystyki",
    description: "Raporty i analityka systemu",
    icon: BarChart3,
    to: "/admin/statistics",
    glow: "from-orange-500/20 to-red-500/20"
  }
];

function AdminDashboardPage() {

  return (
    <div className="space-y-10">

      <motion.div
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.4 }}
        className="
          relative
          overflow-hidden
          rounded-[32px]
          border border-white/10
          bg-gradient-to-br
          from-slate-900/90
          to-slate-950
          p-8 md:p-10
        "
      >

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

        <div className="relative z-10">

          <div className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            border border-cyan-500/20
            bg-cyan-500/10
            text-cyan-300
            text-sm
            mb-6
          ">
            Panel administratora
          </div>

          <h1 className="
            text-4xl
            md:text-5xl
            font-black
            tracking-tight
            mb-4
          ">
            Zarządzaj systemem
            <span className="
              block
              bg-gradient-to-r
              from-cyan-400
              to-blue-500
              bg-clip-text
              text-transparent
            ">
              rezerwacji sal
            </span>
          </h1>

          <p className="
            max-w-2xl
            text-slate-400
            text-lg
            leading-relaxed
          ">
            Zarządzaj użytkownikami,
            salami, wyposażeniem oraz
            analizuj dane systemowe
            w jednym miejscu.
          </p>

        </div>

      </motion.div>


      <div className="
        grid
        sm:grid-cols-2
        xl:grid-cols-4
        gap-6
      ">

        {cards.map((card, index) => {

          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity:0, y:20 }}
              animate={{ opacity:1, y:0 }}
              transition={{
                duration:.35,
                delay:index * .08
              }}
            >

              <Link
                to={card.to}
                className="
                  group
                  relative
                  overflow-hidden
                  block
                  rounded-[28px]
                  border border-white/10
                  bg-slate-900/70
                  p-6
                  hover:-translate-y-1
                  hover:border-cyan-500/30
                  transition-all
                  duration-300
                "
              >

                <div className={`
                  absolute
                  inset-0
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  bg-gradient-to-br
                  ${card.glow}
                `} />

                <div className="relative z-10">

                  <div className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-slate-800
                    border border-white/10
                    flex items-center justify-center
                    mb-6
                  ">
                    <Icon
                      size={26}
                      className="text-cyan-300"
                    />
                  </div>

                  <h2 className="
                    text-xl
                    font-bold
                    text-white
                    mb-3
                  ">
                    {card.title}
                  </h2>

                  <p className="
                    text-slate-400
                    text-sm
                    leading-relaxed
                    mb-6
                  ">
                    {card.description}
                  </p>

                  <div className="
                    inline-flex
                    items-center
                    gap-2
                    text-cyan-300
                    text-sm
                    font-medium
                  ">
                    Otwórz
                    <ArrowRight
                      size={16}
                      className="
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </div>

                </div>

              </Link>

            </motion.div>
          );
        })}

      </div>

    </div>
  );
}

export default AdminDashboardPage;