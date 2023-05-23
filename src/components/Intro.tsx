import React, {useEffect, useState} from 'react';
import { Button, Carousel} from 'antd';
import { ReconciliationFilled, CalendarFilled, MessageFilled} from '@ant-design/icons';
import AuthorizeApi from "../api/authorizeApi";
import { useUserStore } from '../stores/user.store';
import { useNavigate } from "react-router-dom";
import AuthLocalStorage from "../AuthLocalStorage";
import jwt from "jwt-decode";
import { useTranslation, Trans } from 'react-i18next';

export const Intro: React.FC = () => {
    const signedIn = AuthorizeApi.isSignedIn();
    const [id, setId] = useState<string>("");
    const contentStyle: React.CSSProperties = {
        borderRadius: '25px',
        height: '500px',
        width: '800px',
        color: 'white',
        backgroundColor: '#051643'
      };

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng : any) => {
        i18n.changeLanguage(lng);
      };  

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        if(signedIn){
           const token = AuthLocalStorage.getToken() as string; 
           const user: any = jwt(token);
           actions.getAllUsers();
           actions.getUserById(user.NameIdentifier);
           actions.setUserRole(user.Role);
           setId(user.NameIdentifier);
         }
       };

    const [state, actions] = useUserStore();
    const navigate = useNavigate();

    const toDrCatalogue = () => {
        if(signedIn){
            state.docPageOn = true;
            navigate("../catalogue", { replace: true });
        }
        else {}
    } 

      const toCalendar = () => {
        if(signedIn){
            state.docPageOn = false;
            navigate("../calendar", { replace: true });
        }
    } 

      const toMessages = () => {
        if(signedIn){
            state.docPageOn = false;
            navigate("../messages/" + id, { replace: true });
        }
    } 

        const logIn = () => {
            navigate("../", { replace: true });
    } 

        const register = () => {
            navigate("../register", { replace: true });
    } 

    return (
        <div>
            <div style = {{paddingLeft:'24%', paddingTop:'5%', paddingBottom:'5%'}}>
                    <div style={contentStyle}> 
                        <Carousel autoplay autoplaySpeed = {5000} dots={true} style = {{paddingBottom:'8%'}}>
                            <div>
                                <h1 className='carousel' style = {{paddingTop:'5%'}}>{t("intro.searchTitle")}</h1>
                                <ReconciliationFilled style = {{paddingTop:'5%', color: "white", fontSize: "120px"}}/>
                                <h3 style = {{paddingTop:'5%', color: "white"}}>{t("intro.searchTextLine1")} <br></br> 
                                                                                {t("intro.searchTextLine2")}</h3>
                                <div style = {{paddingTop:'5%'}}>
                                    <Button onClick={toDrCatalogue}
                                            type="primary" shape="round">
                                            {t("intro.searchButton")}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <h1 className='carousel' style = {{paddingTop:'3%'}}>{t("intro.calendarTitle")}</h1>
                                <CalendarFilled style = {{paddingTop:'3%', color: "white", fontSize: "120px"}}/>
                                <h3 style = {{paddingTop:'3%', color: "white"}}>{t("intro.calendarTextLine1")} <br></br> 
                                                                                {t("intro.calendarTextLine2")}</h3>
                                <div style = {{paddingTop:'3%'}}>
                                    <Button onClick={toCalendar}
                                            type="primary" shape="round">
                                            {t("intro.calendarButton")}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <h1 className='carousel' style = {{paddingTop:'3%'}}>{t("intro.chatTitle")}</h1>
                                <MessageFilled style = {{paddingTop:'3%', color: "white", fontSize: "120px"}}/>
                                <h3 style = {{paddingTop:'3%', color: "white"}}>{t("intro.chatTextLine")} <br></br> </h3>
                                <div style = {{paddingTop:'3%'}}>
                                    <Button onClick={toMessages}
                                            type="primary" shape="round">
                                            {t("intro.chatButton")}
                                    </Button>
                                </div>
                            </div>
                        </Carousel>
                </div>
            </div>
            {signedIn ? 
                    (
                    <div> </div>
                    )
                
                :
                    (
                        <div style={{marginTop: '25px'}}> 
                            <Button type="primary" shape="round" onClick={logIn}>Log In</Button>
                            <Button shape="round" onClick={register}>Register</Button>
                        </div>
                    )
                }
        </div>  
    );
 };