import AuthorizeApi from "../api/authorizeApi";
import UserApi from "../api/userApi";
import { Layout, Menu, MenuProps, Space, Dropdown, Avatar, Badge, Button, Drawer } from "antd";
import { DownOutlined, UserOutlined} from '@ant-design/icons';
import { useUserStore } from '../stores/user.store';
import Link from 'antd/es/typography/Link';
import React, { useState, useEffect, useRef } from "react";
import jwt from "jwt-decode";
import AuthLocalStorage from "../AuthLocalStorage";
import { useNavigate } from "react-router-dom";
const { Header, Content, Footer } = Layout;

export const NavBar: React.FC = () => {
    const user = AuthorizeApi.isSignedIn();
    const [state, actions] = useUserStore();
    const [name, setName] = useState<string>();
    const [id, setId] = useState<string>("");
    const token = AuthLocalStorage.getToken() as string;
    const signedIn = AuthorizeApi.isSignedIn();
    const userState = useRef(signedIn);
    const navigate = useNavigate();

    let userService = new UserApi();
    let authService = new AuthorizeApi();
    useEffect(() => {
        fetchData();
        actions.getAllUsers();
      }, []);

    const fetchData = async () => {
        if (user) {
          const user: any = jwt(token);
          await userService.getById(user.NameIdentifier).then(async (response) => {
            state.currentUserId = user.NameIdentifier;
            setName(response.data.user.name);
            if (name !== undefined) {
              userState.current = true;
            }
            setId(response.data.user.id);
          });
        }
      };

      
      const logOut = () => {
          authService.logout();
          navigate("../", { replace: true });
          window.location.reload();
      } 

      const logIn = () => {
        authService.logout();
        navigate("../", { replace: true });
        window.location.reload();
      } 

      const editProfile = () => {
        const user: any = jwt(token);
        actions.getUserById(user.NameIdentifier);
        navigate("../editprofile/" + id, { replace: true });
      } 


      const items: MenuProps['items'] = [
        {
          label: 'Edit Profile',
          key: '1',
          icon: <UserOutlined />,
          onClick: editProfile
        },
        {
          label: 'Log Out',
          key: '2',
          icon: <UserOutlined />,
          onClick: logOut
        }
      ];

      const menuProps = {
        items
      };


      const toDrCatalogue = () => {
        state.docPageOn = true;
        navigate("../catalogue", { replace: true });
    } 

      const toCalendar = () => {
        state.docPageOn = false;
        navigate("../calendar", { replace: true });
    } 


    return (
        <div> 
            <Layout>
                <Header style={{ position: 'sticky', width: '100%', height: "65px" }}>
                {signedIn && userState.current ? (
                  
                   <div style={{ display: 'flex'}}>
                        <h3 style={{marginTop: "2px"}}>
                        {state.docPageOn ? (
                              <Link onClick={toCalendar} style={{ padding: "15px", color: "white" }}>Calendar</Link>
                        ) 
                        : <Link onClick={toDrCatalogue} style={{ padding: "15px", color: "white" }}>Our Doctors</Link>}
                        </h3>

                        <h3 style={{ marginLeft: "1100px", marginTop: "2px", color: "white" }}>
                            Welcome, {" "}   
                            {name !== undefined
                            ? name?.length > 12
                            ? name.slice(0, 10) + "..."
                            : name
                            : ""}
                           
                              <Dropdown menu={menuProps} overlayStyle={{color: "white"}}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <DownOutlined />
                                </a>
                              </Dropdown>
                         </h3>
                    </div>
                    ) : (
                    <div style={{ display: 'flex'}}>
                        <h3 style={{ marginLeft: "680px", marginTop: "2px", color: "white"}}>
                            Unloged
                        </h3>

                        <h3 style={{ marginLeft: "500px", marginTop: "2px", color: "white" }}>
                             <Link onClick={logIn} style={{ padding: "15px"}}>Log In</Link>
                         </h3>
                    </div>
                )}
                </Header> 
             </Layout>
        </div>
    );

 }