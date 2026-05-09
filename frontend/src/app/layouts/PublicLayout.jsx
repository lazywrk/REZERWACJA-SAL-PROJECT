import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../features/auth/hooks/useAuth";

function PublicLayout({ children }) {

  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen text-slate-100 relative">

      <div className="
        fixed
        inset-0
        pointer-events-none
        -z-10
        grid-glow
        opacity-30
      " />

      <header className="
        sticky
        top-0
        z-50
        border-b
        border-slate-800/60
        glass
      ">

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="h-20 flex items-center justify-between">

            <Link
              to="/"
              className="flex items-center gap-4"
            >

              <div className="
                w-11
                h-11
                rounded-2xl
                bg-gradient-to-br
                from-cyan-400
                to-blue-600
                glow
              " />

              <div>

                <p className="
                  text-lg
                  font-bold
                  tracking-tight
                ">
                  Rezerwacja Sal
                </p>

                <p className="
                  text-xs
                  text-slate-400
                ">
                  Uniwersytecki system rezerwacji
                </p>

              </div>

            </Link>

            <div className="
              flex
              items-center
              gap-3
              flex-wrap
              justify-end
            ">

              {user ? (
                <>

                  <div className="
                    hidden
                    lg:flex
                    items-center
                    px-4
                    py-2
                    rounded-2xl
                    bg-slate-900/70
                    border
                    border-slate-800
                    text-sm
                    text-slate-300
                  ">
                    {user.email}
                  </div>

                  <Link
                    to="/dashboard"
                    className="
                      px-5
                      py-2.5
                      rounded-2xl
                      border
                      border-slate-700
                      bg-slate-900/60
                      hover:bg-slate-800
                      hover:border-slate-600
                    "
                  >
                    Panel
                  </Link>

                  <Link
                    to="/my-bookings"
                    className="
                      px-5
                      py-2.5
                      rounded-2xl
                      border
                      border-slate-700
                      bg-slate-900/60
                      hover:bg-slate-800
                      hover:border-slate-600
                    "
                  >
                    Rezerwacje
                  </Link>

                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="
                        px-5
                        py-2.5
                        rounded-2xl
                        bg-gradient-to-r
                        from-cyan-500
                        to-blue-600
                        text-white
                        shadow-cyan
                        hover:scale-[1.03]
                      "
                    >
                      Administrator
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="
                      px-5
                      py-2.5
                      rounded-2xl
                      bg-white
                      text-slate-900
                      hover:scale-[1.03]
                      font-semibold
                    "
                  >
                    Wyloguj
                  </button>

                </>
              ) : (
                <>

                  <Link
                    to="/login"
                    className="
                      px-5
                      py-2.5
                      rounded-2xl
                      border
                      border-slate-700
                      bg-slate-900/60
                      hover:bg-slate-800
                    "
                  >
                    Logowanie
                  </Link>

                  <motion.div
                    whileHover={{ scale:1.03 }}
                    whileTap={{ scale:.98 }}
                  >

                    <Link
                      to="/register"
                      className="
                        inline-flex
                        px-5
                        py-2.5
                        rounded-2xl
                        bg-gradient-to-r
                        from-cyan-500
                        to-blue-600
                        text-white
                        font-semibold
                        shadow-cyan
                      "
                    >
                      Rejestracja
                    </Link>

                  </motion.div>

                </>
              )}

            </div>

          </div>

        </div>

      </header>

      <main>
        {children}
      </main>

    </div>
  );
}

export default PublicLayout;