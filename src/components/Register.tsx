import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { Button, Form, Input, Select} from 'antd';
import Link from 'antd/es/typography/Link';
import { useNavigate } from "react-router-dom";
import { IRegister } from '../interfaces/IRegister';
import { useUserStore } from '../stores/user.store';
import AuthorizeApi from "../api/authorizeApi";
import { LockOutlined, UserOutlined, MailOutlined} from '@ant-design/icons';
import { useTranslation, Trans } from 'react-i18next';
import { IListElement } from '../interfaces/IListElement';

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

    const { t, i18n } = useTranslation();

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

    const specsUA: IListElement[] = [
        {label: "Усі", value: "Any"},
        {label: "Педіатрія", value: "Pediatrics"},
        {label: "Нейрологія", value: "Neurology"},
        {label: "Кардіологія", value: "Cardiology"},
        {label: "Радіологія", value: "Radiology"},
    ]

    const rolesUA: IListElement[] = [
        {label: "Пацієнт", value: "Patient"},
        {label: "Лікар", value: "Doctor"}
    ]

    return (
        <div> 
        <Form 
          onFinish = {register}>

            <Form.Item>
                <h1 style = {{marginTop: "2%"}}>  {t("register.title")}</h1>
            </Form.Item>

            <Form.Item
                name="name"
                rules={[
                {
                    max: 30,
                    required: true,
                    message: i18n.language == 'ua' ? "Потрібно ввести ім'я" : 'Please input your name'
                },
                ]}
                hasFeedback>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder={i18n.language == 'ua' ? "Ім'я" : 'Name'} 
                                style={{ width: 400 }}/>
            </Form.Item>
            
            <Form.Item
                name="surname"
                rules={[
                {
                    max: 30,
                    required: true,
                    message: i18n.language == 'ua' ? "Потрібно ввести прізвище" : 'Please input your surname'
                },
                ]}
                hasFeedback>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder={i18n.language == 'ua' ? 'Прізвище' : 'Surname'} 
                                style={{ width: 400 }}/>
            </Form.Item>

            <Form.Item
                name="fathername"
                rules={[
                {
                    max: 30,
                    required: true,
                    message: i18n.language == 'ua' ? "Потрібно ввести по-батькові" : 'Please input your fathername'
                },
                ]}
                hasFeedback>
                <Input prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder={i18n.language == 'ua' ? 'По-батькові' : 'Fathername'}
                                style={{ width: 400 }}/>
            </Form.Item>


            <Form.Item
                name="email"
                rules={[
                {
                    max: 50,
                    message: i18n.language == 'ua' ? "Електронна пошта повинна складати менше 50 символів" : 
                                                    'Email address shoud be lesser than 50 chars'
                },
                {
                    required: true,
                    message: i18n.language == 'ua' ? "Потрібно ввести електронну пошту" : 
                                                    'Please input your E-mail'
                },
                {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                }
                ]}
                hasFeedback>
                <Input placeholder={i18n.language == 'ua' ? 'Електронна пошта' : 'Email'}
                       style={{ width: 400 }}
                       prefix={<MailOutlined className="site-form-item-icon" />} />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {
                        min: 8,
                        message: i18n.language == 'ua' ? "Пароль повинен складати неменше 8 символів" : 
                                                         'Password must contain at least 8 chars'
                    },
                    {
                        max: 25,
                        message: i18n.language == 'ua' ? "Пароль повинен складати максимум 25 символів" : 
                                                          'Password must contain maximum 25 chars'
                    },
                    {
                        required: true,
                        message: i18n.language == 'ua' ? "Потрібно ввести пароль" : 
                                                          'Please input your Password'
                    },
                    {
                        pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
                        message: i18n.language == 'ua' ? "Пароль повинен містити мінімум одну велику літеру, маленьку літеру і число" : 
                                                          'Password must contain at least one uppercase letter, one lowercase letter and one number'
                    }
                ]}
                hasFeedback>
                <Input.Password placeholder={i18n.language == 'ua' ? 'Пароль' : 'Password'}
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
                      return Promise.reject(new Error(i18n.language == 'ua' 
                              ? 'Два паролі не збігаються' : 'The two passwords do not match!'));
                    },
                  })
                ]}>
                <Input.Password 
                 prefix={<LockOutlined className="site-form-item-icon" />} 
                 placeholder={i18n.language == 'ua' ? 'Підтвердити пароль' : 'Confirm Password'}
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
                    defaultValue={i18n.language == 'ua' ? "Роль" : "Role"}
                    style={{ width: 150, marginTop: '25px' }}
                    onChange={handleSelectRole}
                    options={i18n.language == 'ua' ? rolesUA.map((sp : any) => ({ label: sp.label, value: sp.value })) :
                                                     roles.map((role : string) => ({ label: role, value: role }))}
                />
            </Form.Item>


            {(chosenRole == "Doctor") ?  
             <Form.Item
                name="speciality">
                <div>
                    <Select
                        style={{ width: 150 }}
                        options= {i18n.language == 'ua' ? specsUA.map((sp : any) => ({ label: sp.label, value: sp.value })) :
                                                         state.specs.map((role : string) => ({ label: role, value: role }))}
                        defaultValue = {i18n.language == 'ua' ? "Спеціальність" : "Speciality"}
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
                    {t("register.title")}
                </Button>
                )}
            </Form.Item>



            <Form.Item>
                <Link onClick={login}>{t("login.signin")}</Link>
            </Form.Item>
     </Form>
    </div>
    );
 };