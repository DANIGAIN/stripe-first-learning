
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StripeComponent from './components/StripeComponent';
import Subscription from './components/Subscription';
import Layout from './components/Layout'
import 'bootstrap/dist/css/bootstrap.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ListUser from './components/ListUser';
import Success from './components/Success';


function App() {
  
  return (
    <BrowserRouter>
      <ToastContainer position='top-center' />
      <Routes>
        <Route path='/' element={<Layout />} > Index</Route>
        <Route path="/stripe" element={<StripeComponent />} >stripe</Route>
        <Route path="/user" element={<ListUser />} />
        <Route path="/stripeSubscription" element={<Subscription />}>StripeSubscription</Route>
        <Route path="/success/:id" element={<Success/>} >success</Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
