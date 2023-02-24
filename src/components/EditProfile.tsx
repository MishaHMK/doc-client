import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import { Form, Input, Select, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IEditUserForm } from '../interfaces/IEditUserForm';
import AuthLocalStorage from "../AuthLocalStorage";
import jwt from "jwt-decode";

export const EditProfile: React.FC = () => {

    const [state, actions] = useUserStore();
    const [editForm] = useForm();
    const [chosenSpec, setChosenSpec] = useState("");
    const { TextArea } = Input;
    const token = AuthLocalStorage.getToken() as string;
    const user: any = jwt(token);

    useEffect(() => {
        setUserForm();
    }, []);

    const handleUpdate = (values: any) => {;
        const userToUpdate : IEditUserForm = 
        {
          name: values.name,
          introduction: values.introduction,
          speciality: chosenSpec
        };
  
        actions.updateUser(state.currentUserId, userToUpdate);
     };

     const setUserForm = () => {
        editForm.setFieldsValue({
            id: state.currentUserId,
            name: state.currentUserName,
            introduction: state.currentUserIntroduction
        });
    }

     const handleSelectSpec = (value : any) => {
        setChosenSpec(value);
    } 

    return (
        <div> 
            <h2>EDIT PROFILE</h2>
            <Form 
                 form = {editForm} onFinish={handleUpdate} 
                 name="control-hooks"
                 className="edit-form">

            <Form.Item
                 name="id">
                   <Input type="hidden"/>
             </Form.Item> 

             <Form.Item
                 name="name"
                 label="Name">
                 <Input/>

             </Form.Item>
             <Form.Item
                 name="introduction"
                 label="Introduciton">
                 <TextArea rows={4} />
             </Form.Item>

             <Form.Item
                name="speciality">
                <div>
                    <Select
                        style={{ width: 120 }}
                        options={state.specs.map((sp : string) => ({ label: sp, value: sp }))}
                        defaultValue = {state.currentUserSpeciality}
                        onChange={handleSelectSpec}
                    />
                    <br></br>
                </div>
            </Form.Item>

            <Form.Item shouldUpdate>
                     {() => (
                      <Button
                          type="primary"
                          style={{ background: "#52c41a", borderColor: "green" }}
                          htmlType="submit">
                          Update
                      </Button>
                      )}
                  </Form.Item>
            </Form> 

       </div>
    );
 };