import AuthorizeApi from "../api/authorizeApi";
import UserApi from "../api/userApi";
import MessageApi from "../api/messageApi";
import { Layout, MenuProps, Dropdown, message } from "antd";
import { DownOutlined, UserOutlined, MedicineBoxOutlined, EditOutlined, SnippetsOutlined} from '@ant-design/icons';
import { useUserStore } from '../stores/user.store';
import Link from 'antd/es/typography/Link';
import React, { useState, useEffect, useRef } from "react";
import jwt from "jwt-decode";
import AuthLocalStorage from "../AuthLocalStorage";
import { useNavigate } from "react-router-dom";
import { useSignalrStore } from '../stores/signalr.store';
import { useMessageStore } from "../stores/message.store";

const { Header, Footer } = Layout;

export const NavBar: React.FC = () => {
    const [state, actions] = useUserStore();
    const [name, setName] = useState<string>();
    const [id, setId] = useState<string>("");
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
      }, [state.senderName, state.receiverName, userState.current, signedIn,
          messageState.messageThreadSource, messageState.unreadCount, state.currentName]);

    useEffect(() => {
         fetchData();
         if(signedIn){
              signalActions.createHubConnection(token);
              messageActions.createHubConnection(token);
         }
    }, []);

    useEffect(() => {     
      if(signedIn){
        const user: any = jwt(token);
        setTimeout(() => messageActions.receiveUnread(user.NameIdentifier), 300);
      }
    });

    const fetchData = async () => {
       if(signedIn){
          const user: any = jwt(token);
          actions.getAllUsers();
          actions.getUserById(user.NameIdentifier);
          actions.setUserRole(user.Role);
          await userService.getById(user.NameIdentifier)
          .then(async (response) => {
            state.currentUserId = user.NameIdentifier;
            actions.setSenderName(response.data.user.name);
            setName(response.data.user.name);
            if (user.NameIdentifier !== undefined) {
              userState.current = true;
            }
            setId(response.data.user.id);
            setTimeout(() => messageActions.receiveUnread(user.NameIdentifier), 300);
          });
        }
      };

      
      const logOut = () => {
          authService.logout();
          messageActions.stopHubConncetion();
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

      const myAppointments = () => {
        const token = AuthLocalStorage.getToken() as string;
        const user: any = jwt(token);
        navigate("../appointments/" + id, { replace: true });
      } 



      const items: MenuProps['items'] = [
        {
          label: 'Edit Profile',
          key: '1',
          icon: <EditOutlined />,
          onClick: editProfile
        },
        {
          label: 'My Appointments',
          key: '2',
          icon: <SnippetsOutlined />,
          onClick: myAppointments
        },
        {
          label: 'Log Out',
          key: '3',
          icon: <UserOutlined />,
          onClick: logOut
        }
      ];

      const menuProps = {
        items
      };

      const register = () => {
        navigate("../register", { replace: true });
    } 
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

    const toMain = () => {
      state.docPageOn = false;
      navigate("../main", { replace: true });
  } 


    return (
      <div> 
      <Layout className="headerContainer">
          <Header className = "headerContainer">
          {signedIn && userState.current ? (
            
             <div style={{ display: 'flex'}} >

                  <MedicineBoxOutlined onClick={toMain} style = {{paddingRight: "2%", color: "white", fontSize: "40px", marginBottom: "15px" }}/>

                  <h3 className = "docCal" style={{paddingLeft: "0%", marginTop: "2px"}}>
                    <Link onClick={toCalendar} style={{ color: "white" }}>Calendar</Link>
                  </h3>

                  <h3 className = "docCal" style={{paddingLeft: "3%", marginTop: "2px"}}>
                    <Link onClick={toDrCatalogue} style={{ color: "white" }}>Our Doctors</Link>
                  </h3>

                  <h3 className = "docCal" style ={ {paddingLeft: "1.5%", marginTop: "2px"}}>
                    <Link onClick={toMessages} style={{ color: "white" }} className="messages">
                        <div>Messages </div>
                        { messageState.unreadCount > 0 ? <div><span className="badge">{messageState.unreadCount}</span></div> : <div></div> }
                    </Link>
                  </h3>

                  <h3 style={{ marginLeft: "50%", marginTop: "2px", color: "white" }}>
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
                  <MedicineBoxOutlined onClick={toMain} style = {{paddingRight: "2%", color: "white", fontSize: "40px", marginBottom: "15px" }}/>

                  <h3 style={{ marginLeft: "1100px", marginTop: "2px", color: "white" }}>
                       <Link onClick={logIn} style={{ padding: "15px"}}>Log In</Link>
                       <Link onClick={register} style={{ padding: "15px", color: "white"}}>Register</Link>
                   </h3>
              </div>
          )}
              </Header> 
       </Layout>
      </div>
    );
}