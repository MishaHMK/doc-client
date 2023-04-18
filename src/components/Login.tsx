import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import AuthorizeApi from "../api/authorizeApi";
import AuthLocalStorage from "../AuthLocalStorage";
import { Button, Checkbox, Form, Input } from 'antd';
import Link from 'antd/es/typography/Link';
import { useNavigate } from "react-router-dom";
import jwt from "jwt-decode";
import { useSignalrStore } from '../stores/signalr.store';
import { useMessageStore } from "../stores/message.store";
import { LockOutlined, UserOutlined, MailOutlined} from '@ant-design/icons';

export const Login: React.FC = () => {
    const [form] = Form.useForm();
    let authService = new AuthorizeApi();
    let user: any;
    const navigate = useNavigate();
    const [signalState, signalActions] = useSignalrStore();
    const [messageState, messageActions] = useMessageStore();

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
        <div> 
            <h1> Login </h1>
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
                        required: true
                    },
                    ]}>
                    <Input placeholder="Email" 
                           style={{ width: 400 }}
                           prefix={<MailOutlined className="site-form-item-icon" />}/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                    {
                        max: 30,
                        required: true
                    }
                    ]}>
                    <Input.Password placeholder="Password" 
                                    style={{ width: 400 }}
                                    prefix={<LockOutlined className="site-form-item-icon" />}/>
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item shouldUpdate>
                    {() => (
                    <Button
                        type="primary"
                        style={{ background: "#52c41a", borderColor: "green" }}
                        htmlType="submit">
                        Login
                    </Button>
                    )}
                </Form.Item>
         </Form>

         <Link onClick={register}>Sing Up</Link>
        </div>
    </div>
    );
 };

