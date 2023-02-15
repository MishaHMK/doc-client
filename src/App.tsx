
import './App.css';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Calendar } from './components/Calendar';
import { NavBar } from './components/NavBar';
import { DoctorsPage } from './components/DoctorsPage';
import { BrowserRouter, Route, Routes, Link} from "react-router-dom";
import { Layout, Menu, Dropdown, Avatar, Badge, Button, Drawer } from "antd"

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <div className="App">
      <div className="container">
          <BrowserRouter>
                  <NavBar/>
                  <Routes>
                      <Route path="calendar" element={<Calendar/>} />
                      <Route path="register" element={<Register/>} />
                      <Route path="catalogue" element={<DoctorsPage/>} />
                      <Route path="" element={<Login/>} />
                  </Routes>
          </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
