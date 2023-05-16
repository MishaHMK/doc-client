import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { Button, Form, Input, Select} from 'antd';
import Link from 'antd/es/typography/Link';
import { useNavigate } from "react-router-dom";
import { IRegister } from '../interfaces/IRegister';
import { useUserStore } from '../stores/user.store';
import AuthorizeApi from "../api/authorizeApi";
import { LockOutlined, UserOutlined, MailOutlined} from '@ant-design/icons';

export const Register: React.FC = () => {

    const navigate = useNavigate();
    const [state, actions] = useUserStore();
    const [chosenRole, setChosenRole] = useState("");
    const [chosenSpec, setChosenSpec] = useState("");
    let authService = new AuthorizeApi();
    const roles = ['Patient', 'Doctor'];

    useEffect(() => {
        actions.getAllRoles();
    }, []);

    const register = async (values: IRegister) => {
        const regForm : IRegister = {name: values.name, fathername: values.fathername, surname: values.surname,
                                     email: values.email, password: values.password,
                                     confirmPassword: values.confirmPassword, roleName: values.roleName,
                                     speciality: chosenSpec};
        console.log(regForm);
        authService.register(regForm);
        navigate("../", { replace: true });
    }

    const login = () => {
        navigate("../", { replace: true });
    } 
    
    const handleSelectRole = (value : any) => {
        setChosenRole(value);
    } 

    const handleSelectSpec = (value : any) => {
        setChosenSpec(value);
    } 

    return (
        <div> 
        <Form 
          onFinish = {register}>

            <Form.Item>
                <h2> Register </h2>
            </Form.Item>

            <Form.Item
                name="name"
                rules={[
                {
                    max: 30,
                    required: true,
                    message: 'Please input your name!',
                },
                ]}
                hasFeedback>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder="Name" style={{ width: 400 }}/>
            </Form.Item>
            
            <Form.Item
                name="surname"
                rules={[
                {
                    max: 30,
                    required: true,
                    message: 'Please input your surname!',
                },
                ]}
                hasFeedback>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder="Surname" style={{ width: 400 }}/>
            </Form.Item>

            <Form.Item
                name="fathername"
                rules={[
                {
                    max: 30,
                    required: true,
                    message: 'Please input your fathername!',
                },
                ]}
                hasFeedback>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder="Fathername" style={{ width: 400 }}/>
            </Form.Item>


            <Form.Item
                name="email"
                rules={[
                {
                    max: 50,
                    message: 'Email address shoud be lesser than 50 chars'
                },
                {
                    required: true,
                    message: 'Please input your E-mail!'
                },
                {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                }
                ]}
                hasFeedback>
                <Input placeholder="Email" 
                       style={{ width: 400 }}
                       prefix={<MailOutlined className="site-form-item-icon" />} />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {
                        min: 8,
                        message: 'Password must contain at least 8 chars'
                    },
                    {
                        max: 18,
                        message: 'Password max lenght is 18 chars'
                    },
                    {
                        required: true,
                        message: 'Please input your Password!'
                    },
                    {
                        pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
                        message: 'Password must contain at least one uppercase letter, one lowercase letter and one number'
                    }
                ]}
                hasFeedback>
                <Input.Password placeholder="Password" 
                                prefix={<LockOutlined className="site-form-item-icon" />} 
                                style={{ width: 400 }}/>
            </Form.Item>


            <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                hasFeedback
                rules={[
                {
                    max: 30,
                    required: true
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  })
                ]}>
                <Input.Password 
                 prefix={<LockOutlined className="site-form-item-icon" />} 
                 placeholder="Confirm Password" 
                 style={{ width: 400}}/>
            </Form.Item>

            
            <Form.Item
                name="roleName"
                rules={[
                {
                    max: 20,
                    required: true,
                    message: 'Please select Role!'
                },
                ]}>
                <Select
                    defaultValue={'Role'}
                    style={{ width: 120, marginTop: '25px' }}
                    onChange={handleSelectRole}
                    options={roles.map((role : string) => ({ label: role, value: role }))}
                />
            </Form.Item>


            {(chosenRole == "Doctor") ?  
             <Form.Item
                name="speciality">
                <div>
                    <Select
                        style={{ width: 120 }}
                        options={state.specs.map((sp : string) => ({ label: sp, value: sp }))}
                        defaultValue = "Speciality"
                        onChange={handleSelectSpec}
                    />
                    <br></br>
                </div>
            </Form.Item>
             : <br></br>}
           
            <Form.Item shouldUpdate>
                {() => (
                <Button
                    type="primary"
                    htmlType="submit">
                    Register
                </Button>
                )}
            </Form.Item>



            <Form.Item>
                <Link onClick={login}>Log In</Link>
            </Form.Item>
     </Form>
    </div>
    );
 };