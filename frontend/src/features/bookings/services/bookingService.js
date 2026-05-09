import api from "../../../api/client";


export async function getMyBookings(){

 const response =
   await api.get(
    "/bookings"
   );

 return response.data;
}



export async function createBooking(
 bookingData
){
 const response =
   await api.post(
    "/bookings",
    bookingData
   );

 return response.data;
}



export async function cancelBooking(
 id
){
 const response =
   await api.patch(
    `/bookings/${id}/cancel`
   );

 return response.data;
}