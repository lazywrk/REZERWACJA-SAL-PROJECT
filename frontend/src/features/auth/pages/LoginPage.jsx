import { useState } from "react";

import {
  useNavigate,
  useLocation,
  Link
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  Mail,
  LockKeyhole,
  ArrowRight,
  CalendarDays,
  Building2,
  ShieldCheck
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

import {
  loginUser
} from "../services/authService";

function LoginPage(){

  const { login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [email,setEmail] = useState("");

  const [password,setPassword] = useState("");

  const [loading,setLoading] = useState(false);

  async function handleSubmit(e){

    e.preventDefault();

    setLoading(true);

    try{

      const response =
        await loginUser({
          email,
          password
        });

      login(response.token);

      const from =
        location.state?.from
        || "/dashboard";

      navigate(from);

    }catch(error){

      const message =
        error?.response?.data?.message
        || "Błąd logowania";

      alert(message);

    }finally{
      setLoading(false);
    }

  }

  return(

    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:.35 }}
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-slate-800
        bg-slate-950/80
        backdrop-blur-2xl
        shadow-2xl
      "
    >

      <div className="
        absolute
        top-[-120px]
        right-[-100px]
        w-[240px]
        h-[240px]
        rounded-full
        bg-cyan-500/20
        blur-3xl
      " />

      <div className="
        absolute
        bottom-[-120px]
        left-[-100px]
        w-[240px]
        h-[240px]
        rounded-full
        bg-blue-600/20
        blur-3xl
      " />

      <div className="
        relative
        z-10
        p-6
        sm:p-8
      ">

        <div className="mb-8">

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

            System rezerwacji sal

          </div>

          <h1 className="
            text-3xl
            sm:text-4xl
            font-black
            leading-tight
            tracking-tight
            text-white
            mb-4
          ">

            Witaj ponownie

          </h1>

          <p className="
            text-slate-400
            leading-relaxed
            text-sm
            sm:text-base
            max-w-sm
          ">
            Zaloguj się do systemu i zarządzaj
            rezerwacjami sal uczelnianych.
          </p>

        </div>

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-3
          mb-8
        ">

          <div className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900/60
            p-4
          ">

            <Building2
              size={18}
              className="
                text-cyan-400
                mb-3
              "
            />

            <p className="
              text-xs
              text-slate-300
              leading-relaxed
            ">
              Wyszukiwanie sal
            </p>

          </div>

          <div className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900/60
            p-4
          ">

            <CalendarDays
              size={18}
              className="
                text-blue-400
                mb-3
              "
            />

            <p className="
              text-xs
              text-slate-300
              leading-relaxed
            ">
              Kalendarz online
            </p>

          </div>

          <div className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900/60
            p-4
          ">

            <ShieldCheck
              size={18}
              className="
                text-emerald-400
                mb-3
              "
            />

            <p className="
              text-xs
              text-slate-300
              leading-relaxed
            ">
              Bezpieczny system
            </p>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>

            <label className="
              block
              mb-2
              text-sm
              text-slate-300
            ">
              Email
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                type="email"
                value={email}
                onChange={(e)=>
                  setEmail(e.target.value)
                }
                placeholder="twoj@email.com"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-900/70
                  pl-12
                  pr-4
                  text-white
                  placeholder:text-slate-500
                  focus:outline-none
                  focus:border-cyan-500
                  focus:ring-4
                  focus:ring-cyan-500/10
                  transition-all
                "
              />

            </div>

          </div>

          <div>

            <label className="
              block
              mb-2
              text-sm
              text-slate-300
            ">
              Hasło
            </label>

            <div className="relative">

              <LockKeyhole
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "
              />

              <input
                type="password"
                value={password}
                onChange={(e)=>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-900/70
                  pl-12
                  pr-4
                  text-white
                  placeholder:text-slate-500
                  focus:outline-none
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
              w-full
              h-14
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              text-white
              font-semibold
              hover:scale-[1.02]
              transition-all
              shadow-xl
              shadow-cyan-500/20
              mt-2
            "
          >

            {loading
              ? "Logowanie..."
              : "Zaloguj się"
            }

            {!loading && (
              <ArrowRight
                size={18}
                className="
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            )}

          </button>

        </form>

        <div className="
          mt-7
          text-center
          text-sm
          text-slate-400
        ">

          Nie masz konta?{" "}

          <Link
            to="/register"
            className="
              text-cyan-400
              hover:text-cyan-300
              font-medium
            "
          >
            Rejestracja
          </Link>

        </div>

      </div>

    </motion.div>
  )

}

export default LoginPage;