import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import AuthorizeApi from "../api/authorizeApi";
import AuthLocalStorage from "../AuthLocalStorage";
import { Button, Checkbox, Form, Input } from 'antd';
import Link from 'antd/es/typography/Link';
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";
import { useSignalrStore } from '../stores/signalr.store';
import { useMessageStore } from "../stores/message.store";
import { useTranslation, Trans } from 'react-i18next';
import { LockOutlined, UserOutlined, MailOutlined} from '@ant-design/icons';

export const Login: React.FC = () => {
    const [form] = Form.useForm();
    let authService = new AuthorizeApi();
    let user: any;
    const navigate = useNavigate();
    const [signalState, signalActions] = useSignalrStore();
    const [messageState, messageActions] = useMessageStore();

    const { t, i18n } = useTranslation();

    const register = () => {
        navigate("../register", { replace: true });
    } 

    const login = async (values: any) => {
        await authService.login(values);
        const token = AuthLocalStorage.getToken() as string;
        user = jwt(token);

        if(user){
            signalActions.createHubConnection(token);
            messageActions.createHubConnection(token);
            navigate("../main", { replace: true });
        } 
    }

    return (
        <div style = {{marginTop: "3%", marginBottom: "10%"}}> 
            <h1 style = {{marginBottom: "2%"}}> {t("login.title")} </h1>
            <div className="create">
            <Form 
             form={form}
             onFinish={login}
            >
                <Form.Item
                    name="email"
                    rules={[
                    {
                        max: 50,
                        required: true,
                        message: i18n.language == 'ua' ? 'Потрібно ввести електронну пошту' : 'Please input your email' 
                    },
                    ]}>
                    <Input placeholder = {i18n.language == 'ua' ? 'Електронна пошта' : 'Email'}
                           style={{ width: 400 }}
                           prefix={<MailOutlined className="site-form-item-icon" />}/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                    {
                        max: 30,
                        required: true,
                        message: i18n.language == 'ua' ? 'Потрібно ввести пароль' : 'Please input your password' 
                    }
                    ]}>
                    <Input.Password placeholder = {i18n.language == 'ua' ? 'Пароль' : 'Password'}
                                    style={{ width: 400 }}
                                    prefix={<LockOutlined className="site-form-item-icon" />}/>
                </Form.Item>

                <Form.Item shouldUpdate>
                    {() => (
                    <Button
                        type="primary"
                        style={{ background: "#52c41a", borderColor: "green", marginTop: '15px' }}
                        htmlType="submit">
                        {t("login.signin")}
                    </Button>
                    )}
                </Form.Item>
         </Form>

         <Link onClick={register}>{t("login.signup")}</Link>
        </div>
    </div>
    );
 };

