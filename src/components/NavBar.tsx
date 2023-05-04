import AuthorizeApi from "../api/authorizeApi";
import UserApi from "../api/userApi";
import { Layout, MenuProps, Dropdown, Radio } from "antd";
import { DownOutlined, UserOutlined, MedicineBoxOutlined, EditOutlined, SnippetsOutlined} from '@ant-design/icons';
import { useUserStore } from '../stores/user.store';
import Link from 'antd/es/typography/Link';
import React, { useState, useEffect, useRef } from "react";
import jwt from "jwt-decode";
import AuthLocalStorage from "../AuthLocalStorage";
import { useNavigate } from "react-router-dom";
import { useSignalrStore } from '../stores/signalr.store';
import { useMessageStore } from "../stores/message.store";

import { useTranslation, Trans } from 'react-i18next';

const { Header, Footer } = Layout;

export const NavBar: React.FC = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng : any) => {
      i18n.changeLanguage(lng);
    };

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
        navigate("../editprofile/" + id, { replace: true });
      } 

      const myAppointments = () => {
        navigate("../appointments/" + id, { replace: true });
      } 

      const toReports = () => {
        navigate("../report", { replace: true });
    } 

      const items: MenuProps['items'] = [
        {
          label: t("navBar.editProfile"),
          key: '1',
          icon: <EditOutlined />,
          onClick: editProfile
        },
        (state.currentRole != "Admin") ? ({
          label: t("navBar.myApps"),
          key: '2',
          icon: <SnippetsOutlined />,
          onClick: myAppointments
        }) 
        : 
        ({
          label: t("navBar.reports"),
          key: '2',
          icon: <SnippetsOutlined />,
          onClick: toReports
        }),
        {
          label: t("navBar.logOut"),
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
        navigate("../catalogue", { replace: true });
    } 

      const toCalendar = () => {
        state.docPageOn = false;
        navigate("../calendar", { replace: true });
    } 

      const toMessages = () => {
        navigate("../messages/" + id, { replace: true });
    } 

      const toMain = () => {
        navigate("../main", { replace: true });
    } 


    return (
      <div> 
      <Layout className="headerContainer">
          <Header className = "headerContainer">
          {signedIn && userState.current ? (
            
             <div style={{ display: 'flex'}} >

                  <MedicineBoxOutlined onClick={toMain} style = {{paddingRight: "2%", color: "white", fontSize: "40px", marginBottom: "15px" }}/>

                  <h3 className = "docCal" style={{paddingLeft: "1%", marginTop: "2px"}}>
                    <Link onClick={toCalendar} style={{ color: "white" }}>{t("navBar.calendar")}</Link>
                  </h3>

                  <h3 className = "docCal" style={{paddingLeft: "4%", marginTop: "2px"}}>
                    <Link onClick={toDrCatalogue} style={{ color: "white" }}>{t("navBar.doctors")}</Link>
                  </h3>

                  <h3 className = "docCal" style ={ {paddingLeft: "2%", marginTop: "2px"}}>
                    <Link onClick={toMessages} style={{ color: "white" }} className="messages">
                        <div>{t("navBar.messages")}</div>
                        { messageState.unreadCount > 0 ? <div><span className="badge">{messageState.unreadCount}</span></div> : <div></div> }
                    </Link>
                  </h3>

                  <div style ={{paddingLeft: "2%"}}>
                        <Radio.Button onClick={() => changeLanguage("ua")}>UA</Radio.Button>
                        <Radio.Button onClick={() => changeLanguage("en")}>EN</Radio.Button>
                  </div>

                  <h3 style={{ marginLeft: "45%", marginTop: "2px", color: "white" }}>
                      {t("welcome")} {""}   
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
                  <div>
                        <Radio.Button onClick={() => changeLanguage("ua")}>UA</Radio.Button>
                        <Radio.Button onClick={() => changeLanguage("en")}>EN</Radio.Button>
                  </div>
                  <h3 style={{ marginLeft: "75%", marginTop: "2px", color: "white" }}>
                       <Link onClick={logIn} style={{ padding: "15px"}}>{t("navBar.logIn")}</Link>
                       <Link onClick={register} style={{ padding: "15px", color: "white"}}>{t("navBar.register")}</Link>
                   </h3>
              </div>
          )}
              </Header> 
       </Layout>
      </div>
    );
}