import { useEffect, useState } from "react";

import {
  getEquipment,
} from "../services/adminEquipmentService";

function AdminRoomForm({
  initialData = {},
  onSubmit,
  submitText = "Zapisz",
}) {

  const [form, setForm] = useState({
    name: initialData.name || "",
    type: initialData.type || "lecture",
    capacity: initialData.capacity || "",
    status: initialData.status || "free",
    max_booking_minutes:
      initialData.max_booking_minutes || 90,
    description: initialData.description || "",
  });

  const [equipment, setEquipment] =
    useState([]);

  const [selectedEquipment, setSelectedEquipment] =
    useState(
      initialData.equipment?.map(
        (item) => item.id
      ) || []
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {

    async function loadEquipment() {

      try {

        const data =
          await getEquipment();

        setEquipment(data);

      } catch (err) {

        console.error(err);
      }
    }

    loadEquipment();

  }, []);

  function handleChange(e) {

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleEquipmentToggle(id) {

    setSelectedEquipment((prev) => {

      if (prev.includes(id)) {

        return prev.filter(
          (item) => item !== id
        );
      }

      return [...prev, id];
    });
  }

  async function handleSubmit(e) {

    e.preventDefault();

    try {

      setSaving(true);
      setError("");

      await onSubmit({
        ...form,
        capacity: Number(form.capacity),
        building_id: 1,
        max_booking_minutes: Number(
          form.max_booking_minutes
        ),
        equipment_ids:
          selectedEquipment,
      });

    } catch (err) {

      console.error(err);

      setError(
        "Nie udało się zapisać sali"
      );

    } finally {

      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-[32px]
        border border-white/10
        bg-slate-900/70
        backdrop-blur-2xl
        p-5 sm:p-8
        space-y-8
      "
    >

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="space-y-3">

          <label
            className="
              text-sm
              font-semibold
              tracking-wide
              text-slate-300
            "
          >
            Nazwa sali
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Np. Aula A1"
            className="
              w-full
              rounded-2xl
              border border-white/10
              bg-slate-950/70
              px-5 py-4
              text-white
              placeholder:text-slate-500
              outline-none
              transition-all
              focus:border-cyan-400/50
              focus:ring-4
              focus:ring-cyan-400/10
            "
          />

        </div>

        <div className="space-y-3">

          <label
            className="
              text-sm
              font-semibold
              tracking-wide
              text-slate-300
            "
          >
            Typ sali
          </label>

          <div className="relative">

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="
                w-full
                appearance-none
                rounded-2xl
                border border-white/10
                bg-slate-950/70
                px-5 py-4
                text-white
                outline-none
                transition-all
                focus:border-cyan-400/50
                focus:ring-4
                focus:ring-cyan-400/10
              "
            >

              <option
                value="lecture"
                className="bg-slate-900"
              >
                Wykładowa
              </option>

              <option
                value="seminar"
                className="bg-slate-900"
              >
                Seminaryjna
              </option>

              <option
                value="lab"
                className="bg-slate-900"
              >
                Laboratoryjna
              </option>

              <option
                value="conference"
                className="bg-slate-900"
              >
                Konferencyjna
              </option>

              <option
                value="computer"
                className="bg-slate-900"
              >
                Komputerowa
              </option>

            </select>

            <div
              className="
                pointer-events-none
                absolute right-4 top-1/2
                -translate-y-1/2
                text-slate-500
              "
            >
              ▼
            </div>

          </div>

        </div>

      </div>


      <div className="grid lg:grid-cols-3 gap-6">

        <div className="space-y-3">

          <label
            className="
              text-sm
              font-semibold
              tracking-wide
              text-slate-300
            "
          >
            Pojemność
          </label>

          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            required
            placeholder="Np. 40"
            className="
              w-full
              rounded-2xl
              border border-white/10
              bg-slate-950/70
              px-5 py-4
              text-white
              placeholder:text-slate-500
              outline-none
              transition-all
              focus:border-cyan-400/50
              focus:ring-4
              focus:ring-cyan-400/10
            "
          />

        </div>

        <div className="space-y-3">

          <label
            className="
              text-sm
              font-semibold
              tracking-wide
              text-slate-300
            "
          >
            Status sali
          </label>

          <div className="relative">

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="
                w-full
                appearance-none
                rounded-2xl
                border border-white/10
                bg-slate-950/70
                px-5 py-4
                text-white
                outline-none
                transition-all
                focus:border-cyan-400/50
                focus:ring-4
                focus:ring-cyan-400/10
              "
            >

              <option
                value="free"
                className="bg-slate-900"
              >
                Dostępna
              </option>

              <option
                value="maintenance"
                className="bg-slate-900"
              >
                Konserwacja
              </option>

            </select>

            <div
              className="
                pointer-events-none
                absolute right-4 top-1/2
                -translate-y-1/2
                text-slate-500
              "
            >
              ▼
            </div>

          </div>

        </div>

        <div className="space-y-3">

          <label
            className="
              text-sm
              font-semibold
              tracking-wide
              text-slate-300
            "
          >
            Maks. czas rezerwacji
          </label>

          <input
            type="number"
            name="max_booking_minutes"
            value={form.max_booking_minutes}
            onChange={handleChange}
            required
            placeholder="Np. 90"
            className="
              w-full
              rounded-2xl
              border border-white/10
              bg-slate-950/70
              px-5 py-4
              text-white
              placeholder:text-slate-500
              outline-none
              transition-all
              focus:border-cyan-400/50
              focus:ring-4
              focus:ring-cyan-400/10
            "
          />

        </div>

      </div>


      <div className="space-y-3">

        <label
          className="
            text-sm
            font-semibold
            tracking-wide
            text-slate-300
          "
        >
          Opis sali
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="5"
          placeholder="Dodaj opis sali..."
          className="
            w-full
            rounded-2xl
            border border-white/10
            bg-slate-950/70
            px-5 py-4
            text-white
            placeholder:text-slate-500
            outline-none
            resize-none
            transition-all
            focus:border-cyan-400/50
            focus:ring-4
            focus:ring-cyan-400/10
          "
        />

      </div>


      <div className="space-y-5">

        <div>

          <h2 className="text-xl font-bold text-white">
            Wyposażenie
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Wybierz wyposażenie przypisane do sali
          </p>

        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">

          {equipment.map((item) => {

            const active =
              selectedEquipment.includes(
                item.id
              );

            return (

              <button
                key={item.id}
                type="button"
                onClick={() =>
                  handleEquipmentToggle(
                    item.id
                  )
                }
                className={`
                  rounded-2xl
                  border
                  px-5 py-4
                  text-left
                  transition-all
                  duration-300
                  ${
                    active
                      ? `
                        border-cyan-400/30
                        bg-cyan-400/10
                        text-cyan-200
                        shadow-[0_10px_30px_rgba(34,211,238,0.15)]
                      `
                      : `
                        border-white/10
                        bg-slate-950/50
                        text-slate-300
                        hover:border-white/20
                        hover:bg-white/[0.03]
                      `
                  }
                `}
              >

                <div className="flex items-center justify-between gap-4">

                  <span className="font-medium">
                    {item.name}
                  </span>

                  <div
                    className={`
                      w-5 h-5 rounded-full border flex items-center justify-center text-xs
                      ${
                        active
                          ? "border-cyan-400 bg-cyan-400 text-slate-950"
                          : "border-slate-600"
                      }
                    `}
                  >
                    {active && "✓"}
                  </div>

                </div>

              </button>

            );
          })}

        </div>

      </div>


      {error && (

        <div
          className="
            rounded-2xl
            border border-red-500/20
            bg-red-500/10
            px-5 py-4
            text-red-300
          "
        >
          {error}
        </div>

      )}


      <div className="flex justify-end">

        <button
          type="submit"
          disabled={saving}
          className="
            inline-flex
            items-center
            justify-center
            rounded-2xl
            bg-cyan-400
            hover:bg-cyan-300
            px-8 py-4
            text-slate-950
            font-semibold
            transition-all
            duration-300
            hover:scale-[1.02]
            disabled:opacity-50
            disabled:cursor-not-allowed
            shadow-[0_20px_50px_rgba(34,211,238,0.25)]
          "
        >
          {
            saving
              ? "Zapisywanie..."
              : submitText
          }
        </button>

      </div>

    </form>
  );
}

export default AdminRoomForm;