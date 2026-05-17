import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './apps/user/auth/Login'
import Otp from './apps/user/auth/Otp'
import UserDashboard from './apps/user/UserDashboard'
import ChefDashboard from './apps/chef/chefDashboard'
import ChefOrdersPage from './apps/chef/ChefOrdersPage'
import ChefRegister from './apps/chef/auth/Register'
import AddMenu from './apps/chef/AddMenu'
import ProtectedRoute from './components/ProtectedRoute'
import ChefLogin from './apps/chef/auth/ChefLogin'
import LoadingSpinner from './components/LoadingSpinner'
import MainPage from './apps/MainPage'
import { chefCookieCheck } from '../services/chefAuthService'
import DeliveryLogin from './apps/delivery/auth/DeliveryLogin'
import DeliveryOtp from './apps/delivery/auth/DeliveryOtp'
import DeliveryDashboard from './apps/delivery/deliveryDashboard'
import DeliveryRegister from './apps/delivery/auth/Register'
import { deliveryCookieCheck } from '../services/deliveryAuthService'
import Orders from './apps/delivery/Orders'
import PaymentAnalysis from './apps/delivery/PaymentAnalysis'
import DeliveryOrderDetails from './apps/delivery/DeliveryOrderDetails'
import AdminLogin from './apps/admin/auth/AdminLogin'
import AdminDashboard from './apps/admin/AdminDashboard'
import { adminCookieCheck } from '../services/adminAuthService'
import SuperAdminDashboard from './apps/superAdmin/SuperAdminDashboard'
import PnrResultPage from './components/PnrResultPage'
import ChefMenuPage from './components/ChefMenuPage'
import OrderCartPage from './components/OrderCartPage'
import OrderBillingPage from './components/OrderBillingPage'
import OrderPaymentPage from './components/OrderPaymentPage'
import OrderConfirmationPage from './components/OrderConfirmationPage'
import UserOrderDetailsPage from './components/UserOrderDetailsPage'

const isChefAuthorized = (res) => Boolean(res?.chefUser)
const isDeliveryAuthorized = (res) => Boolean(res?.deliveryBoy)
const isAdminAuthorized = (res) => Boolean(res?.adminUser)

function App() {
  const [isBooting, setIsBooting] = React.useState(true)

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsBooting(false)
    }, 450)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  if (isBooting) {
    return <LoadingSpinner label="Loading..." />
  }

  return (
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/chef" element={<Navigate to="/chef/login" replace />} />
      <Route path="/chef/login" element={<ChefLogin />} />
      <Route path="/chef/otp" element={<Otp />} />
      <Route
        path="/chef/dashboard"
        element={
          <ProtectedRoute
            authCheck={chefCookieCheck}
            isAuthorized={isChefAuthorized}
            redirectTo="/chef/login"
            loadingLabel="Loading ..."
          >
            <ChefDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chef/register"
        element={
          <ProtectedRoute
            authCheck={chefCookieCheck}
            isAuthorized={isChefAuthorized}
            redirectTo="/chef/login"
            loadingLabel="Loading..."
          >
            <ChefRegister />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chef/menu"
        element={
          <ProtectedRoute
            authCheck={chefCookieCheck}
            isAuthorized={isChefAuthorized}
            redirectTo="/chef/login"
            loadingLabel="Loading..."
          >
            <AddMenu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chef/orders"
        element={
          <ProtectedRoute
            authCheck={chefCookieCheck}
            isAuthorized={isChefAuthorized}
            redirectTo="/chef/login"
            loadingLabel="Loading..."
          >
            <ChefOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chef/orders/:orderId"
        element={
          <ProtectedRoute
            authCheck={chefCookieCheck}
            isAuthorized={isChefAuthorized}
            redirectTo="/chef/login"
            loadingLabel="Loading..."
          >
            <ChefOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route path="/delivery" element={<Navigate to="/delivery/login" replace />} />
      <Route path="/delivery/login" element={<DeliveryLogin />} />
      <Route path="/delivery/otp" element={<DeliveryOtp />} />
      <Route
        path="/delivery/register"
        element={
          <ProtectedRoute
            authCheck={deliveryCookieCheck}
            isAuthorized={isDeliveryAuthorized}
            redirectTo="/delivery/login"
            loadingLabel="Loading..."
          >
            <DeliveryRegister />
          </ProtectedRoute>
        }
      />
      <Route
        path="/delivery/dashboard"
        element={
          <ProtectedRoute
            authCheck={deliveryCookieCheck}
            isAuthorized={isDeliveryAuthorized}
            redirectTo="/delivery/login"
            loadingLabel="Loading ..."
          >
            <DeliveryDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/delivery/orders"
        element={
          <ProtectedRoute
            authCheck={deliveryCookieCheck}
            isAuthorized={isDeliveryAuthorized}
            redirectTo="/delivery/login"
            loadingLabel="Loading ..."
          >
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/delivery/payments"
        element={
          <ProtectedRoute
            authCheck={deliveryCookieCheck}
            isAuthorized={isDeliveryAuthorized}
            redirectTo="/delivery/login"
            loadingLabel="Loading ..."
          >
            <PaymentAnalysis />
          </ProtectedRoute>
        }
      />

      <Route
        path="/delivery/order/:orderId"
        element={
          <ProtectedRoute
            authCheck={deliveryCookieCheck}
            isAuthorized={isDeliveryAuthorized}
            redirectTo="/delivery/login"
            loadingLabel="Loading ..."
          >
            <DeliveryOrderDetails />
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard/*"
        element={
          <ProtectedRoute
            authCheck={adminCookieCheck}
            isAuthorized={isAdminAuthorized}
            redirectTo="/admin/login"
            loadingLabel="Loading ..."
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/superadmin" element={<SuperAdminDashboard />} />
      <Route path="/pnr/:pnrNumber" element={<PnrResultPage />} />
      <Route path="/station/:stationCode/chef/:chefId" element={<ChefMenuPage />} />
      <Route path="/station/:stationCode/chef/:chefId/cart" element={<OrderCartPage />} />
      <Route path="/station/:stationCode/chef/:chefId/billing" element={<OrderBillingPage />} />
      <Route path="/station/:stationCode/chef/:chefId/payment" element={<OrderPaymentPage />} />
      <Route path="/station/:stationCode/chef/:chefId/bill" element={<OrderConfirmationPage />} />
      <Route
        path="/orders/:orderId"
        element={
          <ProtectedRoute>
            <UserOrderDetailsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
