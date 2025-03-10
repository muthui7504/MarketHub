import { useEffect, useState, useContext } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from './Context/appContext'; // Import AppContext
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Products from './pages/Products';
import ECommerce from './pages/Dashboard/ECommerce';
import SellerECommerce from './pages/Dashboard/SellerEcommerce';
import AddProductForm from './pages/Form/addProducts';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/supplierProfile';
import Settings from './pages/SupplierSettings';
import Tables from './pages/Tables';
import SellerSettings from './pages/sellerSettings';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout'; // Supplier layout
import SellerDefaultLayout from './layout/SellerDefaultLayout'; // Seller layout
import { ToastContainer } from 'react-toastify';
import OTPEntry from './pages/Authentication/OTPEntry';
import SellerProfile from './pages/sellerProfile';
import ReceivedRequestsTable from './components/Tables/receivedRequests';
import RecentlyAddedItems from './components/Tables/TableSix';
import SellerOrdersTable from './components/Tables/ordersTable';
import  ConnectedUsers from './components/Tables/connectionList';
import ProductDetails from  './components/Tables/productOrderCard';
import CombinedChatPage from './pages/chatpage/chat';



function App() {
  
  
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const appContext = useContext(AppContext); // Access context data
  const isLoggedin = appContext?.isLoggedin;
  const userData = appContext?.userData;

  // Scroll to the top on path change
  useEffect(() => {
    window.scrollTo(0, 0);  
  }, [pathname]);

  // Simulate loading effect
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedin && !loading) {
      navigate('/auth/signin');
    }
  }, [isLoggedin, loading, navigate]);

  // Choose layout based on user role
  const getLayout = () => {
    if (userData?.userType === 'seller') {
      return SellerDefaultLayout;
    }
    return DefaultLayout; // Default to supplier layout
  };

  const Layout = getLayout();

  return loading ? (
    <Loader />
  ) : (
    <>
      <ToastContainer />
      <Routes>
        {/* Authentication Routes */}
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup" />
              <SignUp />
            </>
          }
        />
        <Route
          path="/auth/verify"
          element={
            <>
              <PageTitle title="Verify OTP" />
              <OTPEntry />
            </>
          }
        />

        {/* Dashboard and Other Routes with Conditional Layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route
                  index
                  element={
                    <>
                      <PageTitle title="eCommerce Dashboard" />
                      <ECommerce />
                    </>
                  }
                />
                <Route
                  path="products"
                  element={
                    <>
                      <PageTitle title="Products" />
                      <Products />
                    </>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <>
                      <PageTitle title="Profile" />
                      <Profile />
                    </>
                  }
                />
                <Route
                  path="forms/addProduct"
                  element={
                    <>
                      <PageTitle title="add product" />
                      <AddProductForm />
                    </>
                  }
                />
                <Route
                  path="forms/form-layout"
                  element={
                    <>
                      <PageTitle title="Form Layout" />
                      <FormLayout />
                    </>
                  }
                />
                <Route
                  path="tables"
                  element={
                    <>
                      <PageTitle title="Tables" />
                      <Tables />
                    </>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <>
                      <PageTitle title="Settings" />
                      <Settings />
                    </>
                  }
                />
                <Route
                  path="seller-settings"
                  element={
                    <>
                      <PageTitle title="Settings" />
                      <SellerSettings />
                    </>
                  }
                />
                <Route
                  path="ui/buttons"
                  element={
                    <>
                      <PageTitle title="Buttons" />
                      <Buttons />
                    </>
                  }
                />
                <Route
                  path="seller-profile"
                  element={
                    <>
                      <PageTitle title="Profile" />
                      <SellerProfile />
                    </>
                  }
                />
                <Route
                  path="received-requests"
                  element={
                    <>
                      <PageTitle title="Received Requests" />
                      <ReceivedRequestsTable />
                    </>
                  }
                />
                <Route
                  path="product"
                  element={
                    <>
                      <PageTitle title="Product" />
                      <RecentlyAddedItems/>
                    </>
                  }
                />
                <Route
                  path="seller-ecommerce"
                  element={
                    <>
                      <PageTitle title="Seller eCommerce" />
                      <SellerECommerce />
                    </>
                  }
                />
                <Route
                  path="seller-orders"
                  element={
                    <>
                      <PageTitle title="Seller Orders" />
                      <SellerOrdersTable />
                    </>
                  }
                />  
                <Route
                  path="connected-users"
                  element={
                    <>
                      <PageTitle title="Connected Users" />
                      <ConnectedUsers />
                    </>
                  }
                />
                <Route
                  path="product/:id"
                  element={
                    <>
                      <PageTitle title="Product Details" />
                      <ProductDetails />
                    </>
                  }
                />
                <Route
                  path="chat"
                  element={
                    <>
                      <PageTitle title="Chat" />
                      <CombinedChatPage />
                    </>
                  }
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
