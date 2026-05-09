import { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  Mail,
  LockKeyhole,
  UserPlus,
  ArrowRight
} from "lucide-react";

import {
  registerUser
} from "../services/authService";

function RegisterPage(){

  const navigate = useNavigate();

  const [email,setEmail] = useState("");

  const [password,setPassword] = useState("");

  const [loading,setLoading] = useState(false);

  async function handleSubmit(e){

    e.preventDefault();

    setLoading(true);

    try{

      await registerUser({
        email,
        password
      });

      alert("Konto utworzone");

      navigate("/login");

    }catch(error){

      const message =
        error?.response?.data?.message
        || "Błąd rejestracji";

      alert(message);

    }finally{
      setLoading(false);
    }

  }

  return(

    <motion.div
      initial={{ opacity:0, scale:.97 }}
      animate={{ opacity:1, scale:1 }}
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
        p-6
        sm:p-8
      "
    >

      <div className="
        absolute
        bottom-0
        left-0
        w-40
        h-40
        bg-blue-500/10
        blur-3xl
        rounded-full
      " />

      <div className="relative z-10">

        <div className="text-center mb-8">

          <div className="
            w-16
            h-16
            rounded-3xl
            bg-gradient-to-br
            from-blue-500
            to-cyan-400
            mx-auto
            mb-5
            shadow-lg
            shadow-cyan-500/20
            flex
            items-center
            justify-center
          ">

            <UserPlus className="text-white" />

          </div>

          <h1 className="
            text-3xl
            sm:text-4xl
            font-black
            tracking-tight
            mb-3
            text-white
          ">
            Rejestracja
          </h1>

          <p className="
            text-slate-400
            text-sm
            sm:text-base
          ">
            Utwórz konto i rozpocznij korzystanie z systemu
          </p>

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
                placeholder="Utwórz hasło"
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
              from-blue-500
              to-cyan-500
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
              ? "Tworzenie konta..."
              : "Utwórz konto"
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

          Masz już konto?{" "}

          <Link
            to="/login"
            className="
              text-cyan-400
              hover:text-cyan-300
              font-medium
            "
          >
            Zaloguj się
          </Link>

        </div>

      </div>

    </motion.div>
  )

}

export default RegisterPage;