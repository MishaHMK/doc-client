import React, {useEffect, useState} from 'react';
import { Button, Carousel} from 'antd';
import { ReconciliationFilled, CalendarFilled, MessageFilled} from '@ant-design/icons';
import AuthorizeApi from "../api/authorizeApi";
import { useUserStore } from '../stores/user.store';
import { useNavigate } from "react-router-dom";
import AuthLocalStorage from "../AuthLocalStorage";
import jwt from "jwt-decode";

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
            <div style = {{paddingLeft:'24%', paddingTop:'5%'}}>
                    <div style={contentStyle}> 
                        <Carousel autoplay autoplaySpeed = {5000} dots={true} style = {{paddingBottom:'8%'}}>
                            <div>
                                <h1 className='carousel' style = {{paddingTop:'3%'}}>Find the right specialist</h1>
                                <ReconciliationFilled style = {{paddingTop:'3%', color: "white", fontSize: "120px"}}/>
                                <h3 style = {{paddingTop:'3%', color: "white"}}>You can find the specialist you need. <br></br> 
                                                                                You can also see the brief introduction and rating of the specialist.</h3>
                                <div style = {{paddingTop:'3%'}}>
                                    <Button onClick={toDrCatalogue}
                                            type="primary" shape="round">
                                            Find
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <h1 className='carousel' style = {{paddingTop:'3%'}}>Interactive calendar</h1>
                                <CalendarFilled style = {{paddingTop:'3%', color: "white", fontSize: "120px"}}/>
                                <h3 style = {{paddingTop:'3%', color: "white"}}>You can set up an appointment on a particular doctor's interactive calendar. <br></br> 
                                                                                The doctor can see and verify your appointment.</h3>
                                <div style = {{paddingTop:'3%'}}>
                                    <Button onClick={toCalendar}
                                            type="primary" shape="round">
                                            Calendar
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <h1 className='carousel' style = {{paddingTop:'3%'}}>Chat with doctors</h1>
                                <MessageFilled style = {{paddingTop:'3%', color: "white", fontSize: "120px"}}/>
                                <h3 style = {{paddingTop:'3%', color: "white"}}>You can сhat and keep in touch with your doctor. <br></br> </h3>
                                <div style = {{paddingTop:'3%'}}>
                                    <Button onClick={toMessages}
                                            type="primary" shape="round">
                                            Messager
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