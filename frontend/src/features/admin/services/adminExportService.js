import api from "../../../api/client";


function downloadFile(data, filename) {
  const url = window.URL.createObjectURL(
    new Blob([data])
  );

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}


// CSV
export async function downloadBookingsCSV() {
  try {
    const response = await api.get(
      "/export/bookings/csv",
      {
        responseType: "blob"
      }
    );

    downloadFile(response.data, "bookings.csv");

  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.error
      || "Błąd eksportu CSV"
    );
  }
}


// PDF
export async function downloadBookingsPDF() {
  try {
    const response = await api.get(
      "/export/bookings/pdf",
      {
        responseType: "blob"
      }
    );

    downloadFile(response.data, "bookings.pdf");

  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.error
      || "Błąd eksportu PDF"
    );
  }
}