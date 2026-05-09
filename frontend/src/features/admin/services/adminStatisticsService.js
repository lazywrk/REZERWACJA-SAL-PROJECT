import api from "../../../api/client";


export async function getAdminStatistics() {

  const response =
    await api.get("/statistics");

  return response.data;
}