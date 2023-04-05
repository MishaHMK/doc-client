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

    const handleUpdate = (values: any) => {
        if(chosenSpec.length < 3){
            setChosenSpec(state.currentUserSpeciality);
            const userToUpdate : IEditUserForm = 
            {
              name: values.name,
              introduction: values.introduction,
              speciality: state.currentUserSpeciality
            };
            actions.updateUser(state.currentUserId, userToUpdate);
        }
        else {
            const userToUpdate : IEditUserForm = 
            {
              name: values.name,
              introduction: values.introduction,
              speciality: chosenSpec
            };
            actions.updateUser(state.currentUserId, userToUpdate);
        }

        actions.setSenderName(values.name);
     };

     const setUserForm = () => {
        editForm.setFieldsValue({
            id: state.currentUserId,
            name: state.currentName,
            introduction: state.currentUserIntroduction
        });
    }

     const handleSelectSpec = (value : any) => {
        setChosenSpec(value);
    } 

    return (
        <div> 
            <Form 
                 form = {editForm} onFinish={handleUpdate} 
                 name="control-hooks"
                 className="edit-form"
                 layout="vertical">

            <h2>EDIT PROFILE</h2>

            <Form.Item
                 name="id">
                   <Input type="hidden"/>
             </Form.Item> 

             <Form.Item
                 name="name"
                 label="Name">
                 <Input/>

             </Form.Item>

            {(state.currentRole == "Doctor") ? 
                    <div>
                        <Form.Item
                            name="introduction"
                            label="Introduciton">
                            <TextArea rows={5} />
                         </Form.Item>

                        <Form.Item
                            name="speciality"
                            label="Speciality">
                            <div>
                                <Select
                                    style={{ width: '100%' }}
                                    options={state.specs.map((sp : string) => ({ label: sp, value: sp }))}
                                    defaultValue = {state.currentUserSpeciality}
                                    onChange={handleSelectSpec}
                                />
                                <br></br>
                            </div>
                        </Form.Item>
                    </div> 
                  : <br></br>}

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