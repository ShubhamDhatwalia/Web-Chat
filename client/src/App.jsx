
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Component/Layout';
import Home from './Component/Pages/Home';
import Chat from './Component/Pages/Chat';
import Broadcast from './Component/Pages/BroadCast';
import ErrorPage from './Component/Pages/ErrorPage';
import ManageTemplates from './Component/Pages/ManageTemplates';
import Automation from './Component/Pages/Automation';
import { ToastContainer } from 'react-toastify';



function App() {


  return (
    <>

      <ToastContainer position="top-right" autoClose={3000} />

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/chats' element={<Chat />} />
            <Route path='/broadCast' element={<Broadcast />} />
            <Route path='/manageTemplates' element={<ManageTemplates />} />
            <Route path='/automation' element={<Automation />} />




          </Route>

          <Route path='*' element={<ErrorPage />} />
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
