import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { Button, Form, Input, Select} from 'antd';
import Link from 'antd/es/typography/Link';
import { useNavigate } from "react-router-dom";
import { IRegister } from '../interfaces/IRegister';
import { useUserStore } from '../stores/user.store';

export const Register: React.FC = () => {

    const [state, actions] = useUserStore();
    const navigate = useNavigate();
    const [value, setValue] = useState();


    useEffect(() => {
        actions.getAllRoles();
    }, []);

    const register = async (values: IRegister) => {
        const regForm : IRegister = {name: values.name, email: values.email, password: values.password,
                                     confirmPassword: values.confirmPassword, roleName: values.roleName};
        actions.registerUser(regForm);
        navigate("../", { replace: true });
    }

    const login = () => {
        navigate("../", { replace: true });
    } 

    return (
        <div> 
        <div className="create">
        <Form 
          onFinish = {register}
          wrapperCol = {{ span: 18 }}>

            <Form.Item>
                <h2> Register </h2>
            </Form.Item>

            <Form.Item
                name="name"
                rules={[
                {
                    max: 30,
                    required: true
                },
                ]}>
                <Input placeholder="Name" />
            </Form.Item>

            <Form.Item
                name="email"
                rules={[
                {
                    max: 50,
                    required: true
                },
                ]}>
                <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                {
                    max: 30,
                    required: true
                },
                ]}>
                <Input.Password placeholder="Password" />
            </Form.Item>


            <Form.Item
                name="confirmPassword"
                rules={[
                {
                    max: 30,
                    required: true
                },
                ]}>
                <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            
            <Form.Item
                name="roleName"
                rules={[
                {
                    max: 20,
                    required: true
                },
                ]}>
                <Select
                    defaultValue={state.roles[0]}
                    style={{ width: 120 }}
                    options={state.roles.map((role : string) => ({ label: role, value: role }))}
                />
            </Form.Item>

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
</div>
    );
 };