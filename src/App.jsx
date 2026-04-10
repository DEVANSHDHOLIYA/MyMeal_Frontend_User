import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Nav from "./components/nav";
import ProtectedRoute from "./components/protected";
import LoadingPage from "./components/loadingpage";
import AuthRedirect from "./components/authredirect";

import NotFound from "./components/notfound";
const Landingpage = lazy(() => import("./app/home"));
const Profile = lazy(() => import("./app/profile"));
const Signup = lazy(() => import("./auth/signup"));
const Login = lazy(() => import("./auth/login"));
const UserForgotPassword = lazy(() => import("./auth/forgetpassword"));
const UserResetPassword = lazy(() => import("./auth/UserResetpassword"));
const UserDashboard = lazy(() => import("./app/userdashboard"));
const VerifyOTP = lazy(() => import("./auth/verifyotp"));
const Vendors = lazy(() => import("./app/vendors"));
const Vendordetails = lazy(() => import("./app/vendordetails"));
const Payment = lazy(() => import("./app/payment"));
const Subscription = lazy(() => import("./app/subscription"));
const MealCart = lazy(() => import("./app/mealcart"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>


          <Route element={<ProtectedRoute />}>
            <Route element={<Nav />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/showvendors" element={<Vendors />} />
              <Route path="/showvendors/viewdetail/:vendor_id" element={<Vendordetails />} />
              <Route path="/showvendors/payment/:subscription_id" element={<Payment />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/showvendors/meal/payment/:meal_id" element={<MealCart />} />
            </Route>
            
          </Route>
          
          <Route element={<AuthRedirect />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Landingpage />} />
          
          <Route path="/verify_otp" element={<VerifyOTP />} />
          
          <Route path="/forgetpassword" element={<UserForgotPassword/>}/>
        
          <Route path="/resetpassword" element={<UserResetPassword/>}/>
  
          
          </Route>
          <Route path="*" element={<NotFound/>}/>
        </Routes>

        <Toaster position="bottom-right" />
      </Suspense>
    </BrowserRouter>
  );
}