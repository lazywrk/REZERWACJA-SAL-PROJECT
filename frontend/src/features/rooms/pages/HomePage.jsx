import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import {
  ArrowRight,
  CalendarDays,
  Building2,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import { useAuth } from "../../auth/hooks/useAuth";

function HomePage() {

  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">

      <div className="absolute inset-0 -z-10">

        <div className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-[800px]
          h-[800px]
          bg-cyan-400/20
          blur-3xl
          rounded-full
        " />

        <div className="
          absolute
          top-[30%]
          right-0
          w-[500px]
          h-[500px]
          bg-blue-500/20
          blur-3xl
          rounded-full
        " />

      </div>

      <section className="
        max-w-7xl
        mx-auto
        px-6
        lg:px-8
        pt-24
        pb-20
      ">

        <motion.div
          initial={{ opacity:0, y:40 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.7 }}
          className="
            text-center
            max-w-5xl
            mx-auto
          "
        >

          <div className="
            inline-flex
            items-center
            gap-2
            px-5
            py-2.5
            rounded-full
            border
            border-cyan-400/20
            bg-cyan-400/10
            text-cyan-300
            text-sm
            mb-8
          ">
            <Sparkles size={16} />
            Nowoczesna platforma akademicka
          </div>

          <h1 className="
            text-5xl
            md:text-7xl
            lg:text-8xl
            font-black
            tracking-tight
            leading-[0.95]
            mb-8
          ">

            Nowoczesny system
            <span className="
              block
              bg-gradient-to-r
              from-cyan-300
              via-blue-400
              to-cyan-400
              bg-clip-text
              text-transparent
            ">
              rezerwacji sal
            </span>

          </h1>

          <p className="
            text-lg
            md:text-2xl
            text-slate-300
            leading-relaxed
            max-w-3xl
            mx-auto
            mb-14
          ">
            Zarządzaj rezerwacjami sal uczelnianych,
            sprawdzaj dostępność i planuj zajęcia
            w nowoczesnym systemie online.
          </p>

          <div className="
            flex
            flex-col
            sm:flex-row
            justify-center
            items-center
            gap-5
          ">

            <motion.div
              whileHover={{ scale:1.03 }}
              whileTap={{ scale:.98 }}
            >

              <Link
                to="/rooms"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  px-8
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  text-white
                  font-semibold
                  text-lg
                  shadow-cyan
                "
              >
                Przeglądaj sale

                <ArrowRight
                  size={20}
                  className="
                    transition-transform
                    group-hover:translate-x-1
                  "
                />

              </Link>

            </motion.div>

            {user ? (
              <Link
                to="/my-bookings"
                className="
                  px-8
                  py-4
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-900/60
                  hover:bg-slate-800
                  text-slate-100
                  text-lg
                "
              >
                Moje rezerwacje
              </Link>
            ) : (
              <Link
                to="/login"
                className="
                  px-8
                  py-4
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-900/60
                  hover:bg-slate-800
                  text-slate-100
                  text-lg
                "
              >
                Zaloguj się
              </Link>
            )}

          </div>

        </motion.div>

      </section>

      <section className="
        max-w-7xl
        mx-auto
        px-6
        lg:px-8
        pb-28
      ">

        <div className="
          grid
          md:grid-cols-3
          gap-7
        ">

          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            transition={{ duration:.4 }}
            viewport={{ once:true }}
            className="
              glass
              rounded-[28px]
              p-8
              hover:-translate-y-1
            "
          >

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-cyan-500/20
              flex
              items-center
              justify-center
              mb-6
            ">
              <Building2 className="text-cyan-300" />
            </div>

            <h3 className="
              text-2xl
              font-bold
              mb-4
            ">
              Inteligentne wyszukiwanie
            </h3>

            <p className="
              text-slate-300
              leading-relaxed
            ">
              Znajduj sale według typu,
              wyposażenia oraz liczby miejsc.
            </p>

          </motion.div>

          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            transition={{ duration:.5 }}
            viewport={{ once:true }}
            className="
              glass
              rounded-[28px]
              p-8
              hover:-translate-y-1
            "
          >

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-blue-500/20
              flex
              items-center
              justify-center
              mb-6
            ">
              <CalendarDays className="text-blue-300" />
            </div>

            <h3 className="
              text-2xl
              font-bold
              mb-4
            ">
              Rezerwacje w czasie rzeczywistym
            </h3>

            <p className="
              text-slate-300
              leading-relaxed
            ">
              Sprawdzaj dostępność sal
              i zarządzaj harmonogramem online.
            </p>

          </motion.div>

          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            transition={{ duration:.6 }}
            viewport={{ once:true }}
            className="
              glass
              rounded-[28px]
              p-8
              hover:-translate-y-1
            "
          >

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-emerald-500/20
              flex
              items-center
              justify-center
              mb-6
            ">
              <ShieldCheck className="text-emerald-300" />
            </div>

            <h3 className="
              text-2xl
              font-bold
              mb-4
            ">
              Bezpieczny system
            </h3>

            <p className="
              text-slate-300
              leading-relaxed
            ">
              Nowoczesny i bezpieczny system
              dla studentów oraz administratorów.
            </p>

          </motion.div>

        </div>

      </section>

    </div>
  );
}

export default HomePage;