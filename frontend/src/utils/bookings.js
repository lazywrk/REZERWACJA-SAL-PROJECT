export function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}


function parseLocalDate(dateString) {
  return new Date(dateString); // FIX
}

export function getBookingStatus(booking, now = new Date()) {
  if (booking.status === "cancelled") {
    return "cancelled";
  }

  const start = parseLocalDate(booking.start_time);
  const end = parseLocalDate(booking.end_time);

  if (end < now) return "finished";
  if (start > now) return "upcoming";

  return "active";
}


export function getBookingVisualStatus(booking, now = new Date()) {
  const status = getBookingStatus(booking, now);

  switch (status) {

    case "cancelled":
      return {
        label: "Anulowana",
        classes: `
          border-red-500/20
          bg-red-500/10
          text-red-300
        `,
      };

    case "finished":
      return {
        label: "Zakończona",
        classes: `
          border-slate-500/20
          bg-slate-500/10
          text-slate-300
        `,
      };

    case "upcoming":
      return {
        label: "Nadchodząca",
        classes: `
          border-emerald-500/20
          bg-emerald-500/10
          text-emerald-300
        `,
      };

    default:
      return {
        label: "Aktywna",
        classes: `
          border-cyan-500/20
          bg-cyan-500/10
          text-cyan-300
        `,
      };
  }
}

export function splitBookings(bookings, now = new Date()) {
  const active = [];
  const upcoming = [];
  const history = [];

  bookings.forEach((b) => {
    const status = getBookingStatus(b, now);

    if (status === "active") active.push(b);
    else if (status === "upcoming") upcoming.push(b);
    else history.push(b);
  });

  return { active, upcoming, history };
}