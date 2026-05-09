import {
 BrowserRouter,
 Routes,
 Route
} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import AdminRoute from "./AdminRoute";

import AdminDashboardPage from "../../features/admin/pages/AdminDashboardPage";
import AdminUsersPage from "../../features/admin/pages/AdminUsersPage";
import AdminRoomsPage from "../../features/admin/pages/AdminRoomsPage";
import AdminRoomCreatePage from "../../features/admin/pages/AdminRoomCreatePage";
import AdminRoomEditPage from "../../features/admin/pages/AdminRoomEditPage";
import AdminEquipmentPage from "../../features/admin/pages/AdminEquipmentPage";

import HomePage from "../../features/rooms/pages/HomePage";
import RoomsPage from "../../features/rooms/pages/RoomsPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import MyBookingsPage from "../../features/bookings/pages/MyBookingsPage";
import RoomDetailsPage from "../../features/rooms/pages/RoomDetailsPage";
import AdminStatisticsPage from "../../features/admin/pages/AdminStatisticsPage";

function AppRouter(){

 return(
  <BrowserRouter>

   <Routes>

    {/* PUBLIC */}

    <Route
     path="/"
     element={
      <PublicLayout>
       <HomePage/>
      </PublicLayout>
     }
    />

    <Route
     path="/rooms"
     element={
      <PublicLayout>
       <RoomsPage/>
      </PublicLayout>
     }
    />

    <Route
     path="/rooms/:id"
     element={
      <PublicLayout>
       <RoomDetailsPage/>
      </PublicLayout>
     }
    />

    <Route
     path="/login"
     element={
      <PublicLayout>
       <LoginPage/>
      </PublicLayout>
     }
    />

    <Route
     path="/register"
     element={
      <PublicLayout>
       <RegisterPage/>
      </PublicLayout>
     }
    />


    {/* PROTECTED */}

    <Route
     path="/dashboard"
     element={
      <ProtectedRoute>
       <PublicLayout>
        <DashboardLayout>
         <DashboardPage/>
        </DashboardLayout>
       </PublicLayout>
      </ProtectedRoute>
     }
    />

    <Route
     path="/my-bookings"
     element={
      <ProtectedRoute>
       <PublicLayout>
        <DashboardLayout>
         <MyBookingsPage/>
        </DashboardLayout>
       </PublicLayout>
      </ProtectedRoute>
     }
    />


    {/* ADMIN */}

    <Route
     path="/admin"
     element={
      <AdminRoute>
       <PublicLayout>
        <DashboardLayout>
         <AdminDashboardPage/>
        </DashboardLayout>
       </PublicLayout>
      </AdminRoute>
     }
    />

    <Route
     path="/admin/users"
     element={
      <AdminRoute>
       <PublicLayout>
        <DashboardLayout>
         <AdminUsersPage/>
        </DashboardLayout>
       </PublicLayout>
      </AdminRoute>
     }
    />

    <Route
     path="/admin/rooms"
     element={
      <AdminRoute>
       <PublicLayout>
        <DashboardLayout>
         <AdminRoomsPage/>
        </DashboardLayout>
       </PublicLayout>
      </AdminRoute>
     }
    />

    <Route
     path="/admin/rooms/create"
     element={
      <AdminRoute>
       <PublicLayout>
        <DashboardLayout>
         <AdminRoomCreatePage/>
        </DashboardLayout>
       </PublicLayout>
      </AdminRoute>
     }
    />

    <Route
     path="/admin/rooms/:id/edit"
     element={
      <AdminRoute>
       <PublicLayout>
        <DashboardLayout>
         <AdminRoomEditPage/>
        </DashboardLayout>
       </PublicLayout>
      </AdminRoute>
     }
    />

    <Route
     path="/admin/equipment"
     element={
      <AdminRoute>
       <PublicLayout>
        <DashboardLayout>
         <AdminEquipmentPage/>
        </DashboardLayout>
       </PublicLayout>
      </AdminRoute>
     }
    />

    <Route
 path="/admin/statistics"
 element={
  <AdminRoute>
   <PublicLayout>
    <DashboardLayout>
     <AdminStatisticsPage/>
    </DashboardLayout>
   </PublicLayout>
  </AdminRoute>
 }
/>

    {/* FALLBACK */}

    <Route
     path="*"
     element={
      <div className="p-20">
       404 - Strona nie istnieje
      </div>
     }
    />

   </Routes>

  </BrowserRouter>
 )

}

export default AppRouter;