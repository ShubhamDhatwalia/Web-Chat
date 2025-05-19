
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Component/Layout';
import Home from './Component/Pages/Home';
import Chat from './Component/Pages/Chat';
import Broadcast from './Component/Pages/BroadCast';
import ErrorPage from './Component/Pages/ErrorPage';
import ManageTemplates from './Component/Pages/ManageTemplates';
import KeywordAction from './Component/Pages/KeywordAction';
import ReplyMaterial from './Component/Pages/ReplyMaterial';
import Chatbot from './Component/Pages/Chatbot';
import Rules from './Component/Pages/Rules';
import { ToastContainer } from 'react-toastify';
import Flowbuilder from './Component/Flowbuilder/Flowbuilder';
import Contact from './Component/Pages/Contact';


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
            <Route path='/keywordAction' element={<KeywordAction />} />
            <Route path='/replyMaterial' element={<ReplyMaterial />} />
            <Route path='/chatbot' element={<Chatbot />} />
            <Route path='/rules' element={<Rules />} />
            <Route path='/chatbot/flowbuilder' element={<Flowbuilder />} />
            <Route path='/contacts' element={<Contact />} />


          </Route>

          <Route path='*' element={<ErrorPage />} />
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
