import { motion } from "framer-motion";

function AuthLayout({ children }) {

  return (

    <div className="
      relative
      min-h-screen
      overflow-hidden
      bg-[#020617]
      flex
      items-center
      justify-center
      px-4
      py-10
    ">

      <div className="absolute inset-0 -z-10">

        <div className="
          absolute
          top-[-150px]
          left-1/2
          -translate-x-1/2
          w-[500px]
          h-[500px]
          rounded-full
          bg-cyan-500/20
          blur-3xl
        " />

        <div className="
          absolute
          bottom-[-120px]
          right-[-100px]
          w-[350px]
          h-[350px]
          rounded-full
          bg-blue-600/20
          blur-3xl
        " />

      </div>

      <motion.div
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.35 }}
        className="
          w-full
          max-w-md
        "
      >

        {children}

      </motion.div>

    </div>
  );
}

export default AuthLayout;