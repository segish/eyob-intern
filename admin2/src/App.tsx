
// import { type ReactElement } from "react";
import { Routes,Route, useNavigate, Navigate } from "react-router-dom"


import Login from "./pages/Login"
import SideBar from "./components/SideBar"
import Product from "./pages/Product"
import Categories from "./pages/categories" 
import User from "./pages/user"
import Message from "./pages/message"
import Service from "./pages/service"
import Events from "./pages/events"
import Testimonials from "./pages/testimonial"
import Partners from "./pages/partner"
import Settings from "./pages/setting"
import Dashbored from "./pages/dashbored"
import { useEffect } from "react"
import { Toaster } from "sonner"
import { useUserStore } from "./store/useUserStore"
import AddProduct from "./pages/addProduct"
import AddCategoies from "./pages/addCategories"
import AddService from "./pages/addService"
import AddEvent from "./pages/addEvent"
import AddTestimonial from "./pages/addTestimonial"
import AddPartner from "./pages/addPartner"
import AddUser from "./pages/addUser"

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    // go back to the previous page
    navigate(-1);
  }, [navigate]);

//  useEffect(() => {
//   if (window.history.state && window.history.state.idx > 0) {
//     navigate(-1);
//   } else {
//     navigate("/");
//   }
// }, [navigate]);

  return null; 

}
type Role = "productManager" | "serviceManager" | "socialManager" | "admin";

// const firstPage: Record<Role, ReactElement> = {
//   productManager: <Product />,
//   serviceManager: <Service />,
//   socialManager: <Events />,
//   admin: <Dashbored />,
// };
function getFirstPagePath(role: Role) {
  switch (role) {
    case "productManager":
      return "/products";
    case "serviceManager":
      return "/services";
    case "socialManager":
      return "/events";
    case "admin":
      return "/";
  }
}
function App() {
  const {user,checkAuth} = useUserStore();
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);
  
  return (
    <div className="w-full h-full">
      <Toaster />
      <Routes>
        <Route element={<SideBar />}>
          <Route path="/" element={user && user?.role == "admin"?<Dashbored />:<Navigate to="/login"/>} />

          <Route path="/products" element={user && (user?.role == "admin"|| user?.role == "productManager")?<Product />:<Navigate to="/login"/>} />
          <Route path="/products/add" element={user && (user?.role == "admin"|| user?.role == "productManager")?<AddProduct />:<Navigate to="/login"/>} />
          <Route path="/products/edit/:id" element={user && (user?.role == "admin"|| user?.role == "productManager")?<AddProduct />:<Navigate to="/login"/>} />

          <Route path="/categories" element={user && (user?.role == "admin"|| user?.role == "productManager")?<Categories/>:<Navigate to="/login"/>} />
          <Route path="/categories/add" element={user && (user?.role == "admin"|| user?.role == "productManager")?<AddCategoies/>:<Navigate to="/login"/>} />
          <Route path="/categories/edit/:id" element={user && (user?.role == "admin"|| user?.role == "productManager")?<AddCategoies/>:<Navigate to="/login"/>} />

          <Route path="/users" element={user && user?.role == "admin"?<User/>:<Navigate to="/login"/>} />
          <Route path="/users/add" element={user && user?.role == "admin"?<AddUser/>:<Navigate to="/login"/>} />
          <Route path="/users/edit/:id" element={user && user?.role == "admin"?<AddUser/>:<Navigate to="/login"/>} />

          <Route path="/messages" element={user && user?.role == "admin"?<Message/>:<Navigate to="/login"/>} />

          <Route path="/services" element={user && (user?.role == "admin" || user?.role =="serviceManager")?<Service/>:<Navigate to="/login"/>}/>
          <Route path="/services/add" element={user && (user?.role == "admin" || user?.role =="serviceManager")?<AddService/>:<Navigate to="/login"/>}/>
          <Route path="/services/edit/:id" element={user && (user?.role == "admin" || user?.role =="serviceManager")?<AddService/>:<Navigate to="/login"/>}/>

          <Route path="/events" element={user && (user?.role == "admin" || user?.role =="socialManager")?<Events/>:<Navigate to="/login"/>}/>
          <Route path="/events/add" element={user && (user?.role == "admin" || user?.role =="socialManager")?<AddEvent/>:<Navigate to="/login"/>}/>
          <Route path="/events/edit/:id" element={user && (user?.role == "admin" || user?.role =="socialManager")?<AddEvent/>:<Navigate to="/login"/>}/>

          <Route path="/testimonials" element={user && (user?.role == "admin" || user?.role =="socialManager")?<Testimonials/>:<Navigate to="/login"/>}/>
          <Route path="/testimonials/add" element={user && (user?.role == "admin" || user?.role =="socialManager")?<AddTestimonial/>:<Navigate to="/login"/>}/>
          <Route path="/testimonials/edit/:id" element={user && (user?.role == "admin" || user?.role =="socialManager")?<AddTestimonial/>:<Navigate to="/login"/>}/>

          <Route path="/partners" element={user && user?.role == "admin"?<Partners/>:<Navigate to="/login"/>}/>
          <Route path="/partners/add" element={user && user?.role == "admin"?<AddPartner/>:<Navigate to="/login"/>}/>
          <Route path="/partners/edit/:id" element={user && user?.role == "admin"?<AddPartner/>:<Navigate to="/login"/>}/>          

          <Route path="/settings" element={user && user?.role == "admin"?<Settings/>:<Navigate to="/login"/>}/>
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={user ? <Navigate to={getFirstPagePath(user.role as Role)} replace /> : <Login />}/>
      </Routes>
    </div>

  )
}
 
export default App 