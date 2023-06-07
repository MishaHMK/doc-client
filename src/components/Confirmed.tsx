import React, {useState, useEffect} from 'react';
import AuthorizeApi from "../api/authorizeApi";
import UserApi from "../api/userApi";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import Link from 'antd/es/typography/Link';
import { MailOutlined} from '@ant-design/icons';

export const Confirmed: React.FC = () => {
    	
   /* const params = useParams();*/
    const navigate = useNavigate();
    const [status, setStatus] = useState<boolean>(false);

    const antIcon = <LoadingOutlined style={{ fontSize: 72 }} spin />;

    let authService = new AuthorizeApi();
    let userService = new UserApi();

    const queryParameters = new URLSearchParams(window.location.search)
    const userId = queryParameters.get("userId")
    const token = queryParameters.get("token")

    useEffect(() => {
       userService.confirmEmail(userId, token)
            .then(async (response) => {
                setTimeout(() => setStatus(response.data.succeeded), 2500);
        });

        console.log(userId);
        console.log(token);
    }, []);

    const logIn = () => {
        authService.logout();
        navigate("../", { replace: true });
    } 

    return (
        <div>    
            {(status == true) ?  
            <div style={{marginTop: "3%"}}>
                <MailOutlined style={{ fontSize: "200px", marginBottom: 100 }}/>
                <h1>Пошту успішно підтверджено!</h1> 
   
                <Link onClick={logIn} style={{ padding: "10px"}}>
                    <div style={{marginTop: "3%", fontSize: 24, fontWeight: 'bold'}} >
                         Увійти
                    </div> 
                </Link>
            </div>
             : 
             <div> 
                <h1 style={{marginTop: "10%"}}>Waiting to confirm...</h1>
                <Spin style={{marginTop: "3%"}} indicator={antIcon} />
            </div>
            }
        </div>
    );
 };
