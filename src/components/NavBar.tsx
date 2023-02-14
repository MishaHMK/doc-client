import AuthorizeApi from "../api/authorizeApi";
import UserApi from "../api/userApi";
import { Layout, Menu, Dropdown, Avatar, Badge, Button, Drawer } from "antd";
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
      }, []);

    const fetchData = async () => {
        if (user) {
          const user: any = jwt(token);
          await userService.getById(user.NameIdentifier).then(async (response) => {
            state.currentUserId = user.NameIdentifier;
            console.log(state.currentUserId);
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

    return (
        <div> 
            <Layout>
                <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', height: "65px" }}>
                {signedIn && userState.current ? (
                <div>
                        <h3 style={{ marginLeft: "1000px", marginTop: "2px", color: "white"}}>
                            Welcome, { " "   }   
                            {name !== undefined
                            ? name?.length > 12
                            ? name.slice(0, 10) + "..."
                            : name
                            : ""}
                                    
                             <Link onClick={logOut} style={{ padding: "15px"}}>Log Out</Link>
                         </h3>

                </div>
                ) : (
                <div>
                     <h3 style={{ marginRight: "140px", marginTop: "-5px", color: "white"}}>
                        Unloged
                    </h3>
                </div>
              )}

              </Header> 
             </Layout>
        </div>
    );

 }