import api from "../../../api/client";


export async function getRooms(
 params = {}
){

 const response =
  await api.get(
   "/rooms",
   {
    params
   }
  );

 return response.data;
}



export async function getRoomById(
 id
){

 const response =
  await api.get(
   `/rooms/${id}`
  );

 return response.data;
}



export async function getRoomCalendar(
 roomId,
 date
){

 const response =
  await api.get(
   "/rooms/calendar",
   {
    params:{
      room_id: roomId,
      date
    }
   }
  );

 return response.data;
}



/*
 Pobieranie dostępnych sal dla danego zakresu czasu
 Wymaga endpointu: GET /rooms/available
*/
export async function getAvailableRooms(
 params = {}
){

 const response =
  await api.get(
   "/rooms/available",
   {
    params
   }
  );

 return response.data;
}
