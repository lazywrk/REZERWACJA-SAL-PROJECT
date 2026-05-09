import { useState, useRef, useEffect } from "react";

import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Check
} from "lucide-react";

function RoomFilters({
  filters,
  onApply,
  equipmentOptions = []
}) {

  const [local, setLocal] = useState(() => ({
    search: filters.search || "",
    capacity: filters.capacity || "",
    type: filters.type || "",
    equipment: Array.isArray(filters.equipment)
      ? filters.equipment
      : (
          filters.equipment
            ? filters.equipment.split(",").map(Number)
            : []
        )
  }));

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {

    function handleOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside
      );

  }, []);

  function update(field, value) {
    setLocal(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function toggleEquipment(id) {

    if (local.equipment.includes(id)) {

      update(
        "equipment",
        local.equipment.filter(e => e !== id)
      );

    } else {

      update(
        "equipment",
        [...local.equipment, Number(id)]
      );

    }
  }

  function handleSubmit() {

    onApply({
      search: local.search.trim(),
      capacity: local.capacity
        ? Number(local.capacity)
        : "",
      type: local.type,
      equipment: local.equipment.length
        ? local.equipment.join(",")
        : ""
    });

    setOpen(false);
  }

  function handleReset() {

    setLocal({
      search: "",
      capacity: "",
      type: "",
      equipment: []
    });

    onApply({
      search: "",
      capacity: "",
      type: "",
      equipment: ""
    });

    setOpen(false);
  }

  return (

    <div className="relative z-40 mb-12">

      <div
        className="
          glass
          rounded-3xl
          border
          border-slate-800
          p-4
          md:p-5
        "
      >

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-4
          "
        >

          <div className="relative">

            <Search
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
              type="text"
              placeholder="Szukaj sali..."
              value={local.search}
              onChange={(e) =>
                update("search", e.target.value)
              }
              className="
                w-full
                h-14
                pl-11
                pr-4
                rounded-2xl
                bg-slate-950/70
                border
                border-slate-800
                text-slate-100
                placeholder:text-slate-500
                focus:outline-none
                focus:border-cyan-500
                transition-all
              "
            />

          </div>

          <input
            type="number"
            placeholder="Minimalna pojemność"
            value={local.capacity}
            onChange={(e) =>
              update("capacity", e.target.value)
            }
            className="
              h-14
              px-4
              rounded-2xl
              bg-slate-950/70
              border
              border-slate-800
              text-slate-100
              placeholder:text-slate-500
              focus:outline-none
              focus:border-cyan-500
              transition-all
            "
          />

          <select
            value={local.type}
            onChange={(e) =>
              update("type", e.target.value)
            }
            className="
              h-14
              px-4
              rounded-2xl
              bg-slate-950/70
              border
              border-slate-800
              text-slate-100
              focus:outline-none
              focus:border-cyan-500
              transition-all
            "
          >
            <option value="">
              Typ sali
            </option>

            <option value="lecture">
              Aula wykładowa
            </option>

            <option value="seminar">
              Sala seminaryjna
            </option>

            <option value="lab">
              Laboratorium
            </option>

            <option value="conference">
              Sala konferencyjna
            </option>

            <option value="computer">
              Sala komputerowa
            </option>

          </select>

          <div
            className="relative"
            ref={dropdownRef}
          >

            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              className="
                w-full
                h-14
                px-4
                rounded-2xl
                bg-slate-950/70
                border
                border-slate-800
                text-slate-100
                flex
                items-center
                justify-between
                hover:border-cyan-500
                transition-all
              "
            >

              <div className="flex items-center gap-3">

                <SlidersHorizontal
                  size={18}
                  className="text-cyan-400"
                />

                <span className="truncate">

                  {local.equipment.length > 0
                    ? `Wyposażenie (${local.equipment.length})`
                    : "Wyposażenie"}

                </span>

              </div>

              <ChevronDown
                size={18}
                className={`
                  transition-transform
                  ${open ? "rotate-180" : ""}
                `}
              />

            </button>

            {open && (

              <div
                className="
                  absolute
                  top-[calc(100%+12px)]
                  left-0
                  w-full
                  min-w-[280px]
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-950
                  shadow-2xl
                  shadow-black/50
                  overflow-hidden
                  z-[999]
                "
              >

                <div
                  className="
                    max-h-72
                    overflow-y-auto
                    p-2
                  "
                >

                  {equipmentOptions.map(eq => {

                    const active =
                      local.equipment.includes(eq.id);

                    return (

                      <button
                        key={eq.id}
                        type="button"
                        onClick={() =>
                          toggleEquipment(eq.id)
                        }
                        className={`
                          w-full
                          flex
                          items-center
                          justify-between
                          px-4
                          py-3
                          rounded-xl
                          text-left
                          transition-all
                          ${
                            active
                              ? "bg-cyan-500/15 text-cyan-300"
                              : "hover:bg-slate-900 text-slate-300"
                          }
                        `}
                      >

                        <span>
                          {eq.name}
                        </span>

                        {active && (
                          <Check size={16} />
                        )}

                      </button>

                    );

                  })}

                </div>

              </div>

            )}

          </div>

        </div>

        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-3
            mt-5
          "
        >

          <button
            onClick={handleReset}
            className="
              h-12
              px-6
              rounded-2xl
              border
              border-slate-700
              bg-slate-900/60
              hover:bg-slate-800
              text-slate-200
              transition-all
            "
          >
            Resetuj filtry
          </button>

          <button
            onClick={handleSubmit}
            className="
              h-12
              px-6
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
            "
          >
            Wyszukaj sale
          </button>

        </div>

      </div>

    </div>
  );
}

export default RoomFilters;