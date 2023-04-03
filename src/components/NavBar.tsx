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
import { useMessageStore } from "../stores/message.store";

const { Header } = Layout;

export const NavBar: React.FC = () => {
    const [state, actions] = useUserStore();
    const [name, setName] = useState<string>();
    const [id, setId] = useState<string>("");
    const [totalItems, settotalItems] = useState(0);
    const [signalState, signalActions] = useSignalrStore();
    const [messageState, messageActions] = useMessageStore();
    const signedIn = AuthorizeApi.isSignedIn();
    const userState = useRef(signedIn);
    const token = AuthLocalStorage.getToken() as string;
    const navigate = useNavigate();
    let userService = new UserApi();
    let authService = new AuthorizeApi();
    let msgService = new MessageApi();

    useEffect(() => {
        fetchData();
      }, [state.senderName, state.receiverName, userState.current, signedIn, messageState.messageThreadSource]);

    useEffect(() => {
         //const user: any = jwt(token);
         fetchData();
         if(signedIn){
              const user: any = jwt(token);
              signalActions.createHubConnection(token);
              messageActions.createHubConnection(token);
              //messageActions.receiveUnread(user.NameIdentifier);
              setTimeout(() => messageActions.receiveUnread(user.NameIdentifier), 300);
              console.log(messageState.unreadCount);
         }
    }, []);

    useEffect(() => {
      if(signedIn){
           const user: any = jwt(token);
           setTimeout(() => messageActions.receiveUnread(user.NameIdentifier), 100);
      }
    });

    const fetchData = async () => {
       if(signedIn){
          actions.getAllUsers();
          const user: any = jwt(token);
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
            <Layout className="headerContainer">
                <Header className = "headerContainer">
                {signedIn && userState.current ? (
                  
                   <div style={{ display: 'flex'}}>
                        <h3 className = "docCal" style={{paddingLeft: "50px", marginTop: "2px"}}>
                        {state.docPageOn ? (
                              <Link onClick={toCalendar} style={{ color: "white" }}>Calendar</Link>
                        ) 
                        : <Link onClick={toDrCatalogue} style={{ color: "white" }}>Our Doctors</Link>}
                        </h3>

                        <h3 style={{paddingLeft: "50px", marginTop: "2px"}}>
                          <Link onClick={toMessages} style={{ color: "white" }} className="messages">
                              <div>Messages </div>
                              { messageState.unreadCount > 0 ? <div><span className="badge">{messageState.unreadCount}</span></div> : <div></div> }
                          </Link>
                        </h3>

                        <h3 style={{ marginLeft: "850px", marginTop: "2px", color: "white" }}>
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