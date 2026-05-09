import api from "../../../api/client";


export async function loginUser(
 credentials
){
 const response =
   await api.post(
     "/auth/login",
     credentials
   );

 return response.data;
}



export async function registerUser(
 userData
){
 const response =
   await api.post(
     "/auth/register",
     userData
   );

 return response.data;
}