import AuthorizeApi from "../api/authorizeApi";
import UserApi from "../api/userApi";
import MessageApi from "../api/messageApi";
import { Layout, MenuProps, Dropdown } from "antd";
import { DownOutlined, UserOutlined} from '@ant-design/icons';
import { useUserStore } from '../stores/user.store';
import Link from 'antd/es/typography/Link';
import React, { useState, useEffect, useRef } from "react";
import jwt from "jwt-decode";
import AuthLocalStorage from "../AuthLocalStorage";
import { useNavigate } from "react-router-dom";
import { useSignalrStore } from '../stores/signalr.store';

const { Header } = Layout;

export const NavBar: React.FC = () => {
    const [state, actions] = useUserStore();
    const [name, setName] = useState<string>();
    const [id, setId] = useState<string>("");
    const [totalItems, settotalItems] = useState(0);
    const [signalState, signalActions] = useSignalrStore();
    const signedIn = AuthorizeApi.isSignedIn();
    const userState = useRef(signedIn);
    const token = AuthLocalStorage.getToken() as string;
    const navigate = useNavigate();
    let userService = new UserApi();
    let authService = new AuthorizeApi();
    let msgService = new MessageApi();

    useEffect(() => {
        fetchData();
      }, [totalItems, state.senderName, state.receiverName, userState.current, signedIn]);

    useEffect(() => {
        if(token != null){ 
          signalActions.createHubConnection(token);
        }
        else  {
          signalActions.stopHubConncetion();
        }
      }, []);

    const fetchData = async () => {
       console.log(token);
       if(signedIn){
          const user: any = jwt(token);
          actions.getAllUsers();

          await userService.getById(user.NameIdentifier)
          .then(async (response) => {
            state.currentUserId = user.NameIdentifier;
            actions.setSenderName(response.data.user.name);
            setName(response.data.user.name);
            if (user.NameIdentifier !== undefined) {
              userState.current = true;
            }
            setId(response.data.user.id);
          });

          await msgService.getMessages(1, 4, "Unread", user.NameIdentifier)
              .then(async (response) => {
                settotalItems(response.data.totalItems);
           });

          //signalActions.createHubConnection(token);
        }
      };

      
      const logOut = () => {
          authService.logout();
          signalActions.stopHubConncetion();
          navigate("../", { replace: true });
      } 

      const logIn = () => {
        authService.logout();
        navigate("../", { replace: true });
        //window.location.reload();
      } 

      const editProfile = () => {
        const token = AuthLocalStorage.getToken() as string;
        const user: any = jwt(token);
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

      const toMessages = () => {
        state.docPageOn = false;
        navigate("../messages/" + id, { replace: true });
    } 

    return (
        <div> 
            <Layout>
                <Header /* style={{ position: 'sticky', width: '100%', height: "70px" }} */className = "header">
                {signedIn && userState.current ? (
                  
                   <div style={{ display: 'flex'}}>
                        <h3 className = "docCal" style={{marginTop: "2px"}}>
                        {state.docPageOn ? (
                              <Link onClick={toCalendar} style={{ color: "white" }}>Calendar</Link>
                        ) 
                        : <Link onClick={toDrCatalogue} style={{ color: "white" }}>Our Doctors</Link>}
                        </h3>

                        <h3 style={{paddingLeft: "50px", marginTop: "2px"}}>
                          <Link onClick={toMessages} style={{ color: "white" }} className="messages">
                              <div>Messages </div>
                              { totalItems > 0 ? <div><span className="badge">{totalItems}</span></div> : <div></div> }
                          </Link>
                        </h3>

                        <h3 style={{ marginLeft: "950px", marginTop: "2px", color: "white" }}>
                            Welcome, {""}   
                            {name !== undefined
                            ? name?.length > 12
                            ? name.slice(0, 15) + "..."
                            : name + " "
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