import { useEffect, useState } from "react";

import {
  MonitorSmartphone
} from "lucide-react";

import {
  getEquipment,
  createEquipment,
  deleteEquipment,
} from "../services/adminEquipmentService";

function AdminEquipmentPage() {

  const [equipment, setEquipment] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [name, setName] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);


  useEffect(() => {

    async function loadEquipment() {

      try {

        const data =
          await getEquipment();

        setEquipment(data || []);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    }

    loadEquipment();

  }, []);


  async function handleCreate(e) {

    e.preventDefault();

    if (!name.trim()) return;

    try {

      setCreating(true);

      await createEquipment({
        name,
      });

      const updated =
        await getEquipment();

      setEquipment(updated || []);

      setName("");

    } catch (err) {

      console.error(err);

    } finally {

      setCreating(false);
    }
  }


  async function handleDelete(id) {

    const confirmed =
      window.confirm(
        "Czy na pewno chcesz usunąć wyposażenie?"
      );

    if (!confirmed) return;

    try {

      setDeletingId(id);

      await deleteEquipment(id);

      setEquipment((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

    } catch (err) {

      console.error(err);

    } finally {

      setDeletingId(null);
    }
  }


  if (loading) {

    return (
      <div className="
        min-h-[60vh]
        flex
        items-center
        justify-center
      ">

        <div className="
          flex
          items-center
          gap-3
          text-slate-400
        ">

          <div className="
            h-5
            w-5
            rounded-full
            border-2
            border-violet-300/40
            border-t-violet-500
            animate-spin
          " />

          <span className="text-sm sm:text-base">
            Ładowanie wyposażenia...
          </span>

        </div>

      </div>
    );
  }


  return (
    <div className="
      max-w-7xl
      mx-auto
      px-4
      sm:px-6
      lg:px-8
      py-8
      sm:py-10
      space-y-8
    ">

      <div className="
        flex
        flex-col
        xl:flex-row
        xl:items-end
        xl:justify-between
        gap-8
      ">

        <div>

          <div className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-violet-500/20
            bg-violet-500/10
            px-4
            py-2
            text-sm
            font-medium
            text-violet-300
            backdrop-blur-xl
            mb-5
          ">
            Panel administratora
          </div>

          <h1 className="
            text-4xl
            sm:text-5xl
            font-black
            tracking-tight
            text-white
          ">
            Wyposażenie sal
          </h1>

          <p className="
            mt-4
            max-w-2xl
            text-sm
            sm:text-base
            text-slate-400
            leading-relaxed
          ">
            Zarządzaj wyposażeniem dostępnym
            w salach uczelni oraz dodawaj
            nowe elementy dla studentów
            i wykładowców.
          </p>

        </div>


        <div className="
          relative
          overflow-hidden
          rounded-[30px]
          border border-white/10
          bg-slate-900/70
          backdrop-blur-2xl
          px-7
          py-6
          shadow-[0_20px_80px_rgba(15,23,42,0.45)]
        ">

          <div className="
            absolute
            inset-0
            bg-gradient-to-br
            from-violet-500/10
            via-transparent
            to-fuchsia-500/10
            pointer-events-none
          " />

          <div className="relative">

            <p className="
              text-sm
              text-slate-400
            ">
              Łączna liczba elementów
            </p>

            <h2 className="
              mt-2
              text-5xl
              font-black
              text-white
            ">
              {equipment.length}
            </h2>

          </div>

        </div>

      </div>



      <div className="
        relative
        overflow-hidden
        rounded-[32px]
        border border-white/10
        bg-slate-900/70
        backdrop-blur-2xl
        shadow-[0_20px_80px_rgba(15,23,42,0.45)]
      ">

        <div className="
          absolute
          inset-0
          bg-gradient-to-br
          from-violet-500/10
          via-transparent
          to-fuchsia-500/10
          pointer-events-none
        " />

        <div className="
          relative
          p-6
          sm:p-8
        ">

          <div className="mb-8">

            <h2 className="
              text-2xl
              sm:text-3xl
              font-bold
              text-white
            ">
              Dodaj nowe wyposażenie
            </h2>

            <p className="
              text-slate-400
              mt-3
            ">
              Utwórz nowy element wyposażenia
              dostępny dla wszystkich sal.
            </p>

          </div>


          <form
            onSubmit={handleCreate}
            className="
              flex
              flex-col
              lg:flex-row
              gap-4
            "
          >

            <div className="flex-1">

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Np. Projektor 4K"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-slate-950/60
                  px-5
                  py-4
                  text-white
                  placeholder:text-slate-500
                  outline-none
                  transition-all
                  focus:border-violet-500/40
                  focus:ring-4
                  focus:ring-violet-500/10
                "
              />

            </div>


            <button
              type="submit"
              disabled={creating}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-fuchsia-600
                px-8
                py-4
                font-semibold
                text-white
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_15px_40px_rgba(139,92,246,0.35)]
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              <span className="relative z-10">

                {creating
                  ? "Tworzenie..."
                  : "Dodaj wyposażenie"}

              </span>

            </button>

          </form>

        </div>

      </div>



      {equipment.length === 0 ? (

        <div className="
          rounded-[32px]
          border
          border-dashed
          border-white/10
          bg-slate-900/50
          backdrop-blur-2xl
          px-8
          py-24
          text-center
        ">

          <div className="
            mx-auto
            mb-6
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-3xl
            border
            border-violet-500/20
            bg-violet-500/10
          ">

            <MonitorSmartphone
              size={42}
              className="text-violet-300"
            />

          </div>

          <h3 className="
            text-3xl
            font-bold
            text-white
          ">
            Brak wyposażenia
          </h3>

          <p className="
            text-slate-400
            mt-4
          ">
            Dodaj pierwszy element wyposażenia.
          </p>

        </div>

      ) : (

        <div className="
          grid
          sm:grid-cols-2
          xl:grid-cols-3
          gap-6
        ">

          {equipment.map((item) => {

            const deleting =
              deletingId === item.id;

            return (

              <div
                key={item.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[30px]
                  border border-white/10
                  bg-slate-900/70
                  backdrop-blur-2xl
                  shadow-[0_10px_50px_rgba(15,23,42,0.35)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_20px_80px_rgba(15,23,42,0.55)]
                "
              >

                <div className="
                  absolute
                  inset-0
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                  bg-gradient-to-br
                  from-violet-500/10
                  via-transparent
                  to-fuchsia-500/10
                " />

                <div className="
                  relative
                  p-6
                  flex
                  flex-col
                  h-full
                ">

                  <div className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  ">

                    <div>

                      <div className="
                        inline-flex
                        items-center
                        rounded-full
                        border
                        border-violet-500/20
                        bg-violet-500/10
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-violet-300
                        mb-5
                      ">
                        ID #{item.id}
                      </div>

                      <h3 className="
                        text-2xl
                        font-bold
                        text-white
                        break-words
                      ">
                        {item.name}
                      </h3>

                    </div>


                    <div className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-violet-500/20
                      bg-violet-500/10
                    ">

                      <MonitorSmartphone
                        size={26}
                        className="text-violet-300"
                      />

                    </div>

                  </div>


                  <div className="
                    mt-10
                    pt-6
                    border-t
                    border-white/10
                    flex
                    items-center
                    justify-between
                  ">

                    <div className="
                      text-sm
                      text-slate-500
                    ">
                      Wyposażenie uczelni
                    </div>


                    <button
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      disabled={deleting}
                      className="
                        rounded-xl
                        bg-red-500
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-white
                        transition-all
                        hover:bg-red-400
                        hover:shadow-lg
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                    >

                      {deleting
                        ? "Usuwanie..."
                        : "Usuń"}

                    </button>

                  </div>

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default AdminEquipmentPage;