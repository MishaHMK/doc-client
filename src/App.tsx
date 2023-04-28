
import './App.css';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Calendar } from './components/Calendar';
import { Confirmed } from './components/Confirmed';
import { NavBar } from './components/NavBar';
import { Intro } from './components/Intro';
import { DoctorsPage } from './components/DoctorsPage';
import { ReviewPage } from './components/ReviewPage';
import { AppointmentPage } from './components/AppointmentPage';
import { EditProfile } from './components/EditProfile';
import { Messages } from './components/Messages';
import { BrowserRouter, Route, Routes, Link} from "react-router-dom";
import { Layout, ConfigProvider} from "antd"
import { useTranslation, Trans } from 'react-i18next';


const { Header, Content, Footer } = Layout;

function App() {

  return (
    <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#001d66',
          },
        }}
  >
      <div className="App">
      <div className="container">
          <BrowserRouter>
                  <NavBar/>
                  <Routes>
                      <Route path="main" element={<Intro/>} />
                      <Route path="confirmed" element={<Confirmed/>} />
                      <Route path="calendar" element={<Calendar/>} />
                      <Route path="register" element={<Register/>} />
                      <Route path="catalogue" element={<DoctorsPage/>} />
                      <Route path="messages/:id" element={<Messages/>} />
                      <Route path="editprofile/:id" element={<EditProfile/>} />
                      <Route path="appointments/:id" element={<AppointmentPage/>} />
                      <Route path="reviews/:id" element={<ReviewPage/>} />
                      <Route path="" element={<Login/>} />
                  </Routes>
          </BrowserRouter>
      </div>
    </div>
  </ConfigProvider>
  );
}

export default App;
