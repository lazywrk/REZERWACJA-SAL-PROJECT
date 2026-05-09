function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden">

      <div className="absolute inset-0 -z-10">

        <div className="
          absolute
          top-0
          left-[10%]
          w-[500px]
          h-[500px]
          bg-cyan-500/10
          blur-3xl
          rounded-full
        " />

        <div className="
          absolute
          bottom-0
          right-[5%]
          w-[450px]
          h-[450px]
          bg-blue-600/10
          blur-3xl
          rounded-full
        " />

      </div>

      <main className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-8
        sm:py-10
      ">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;