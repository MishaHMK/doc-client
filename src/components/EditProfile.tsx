import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import { Form, Input, Select, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IEditUserForm } from '../interfaces/IEditUserForm';
import AuthLocalStorage from "../AuthLocalStorage";
import { useTranslation, Trans } from 'react-i18next';
import jwt from "jwt-decode";

export const EditProfile: React.FC = () => {

    const [state, actions] = useUserStore();
    const [editForm] = useForm();
    const [chosenSpec, setChosenSpec] = useState("");
    const { TextArea } = Input;
    const token = AuthLocalStorage.getToken() as string;
    const user: any = jwt(token);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        setUserForm();
    }, []);

    const handleUpdate = (values: any) => {
        if(chosenSpec.length < 3){
            setChosenSpec(state.currentUserSpeciality);
            const userToUpdate : IEditUserForm = 
            {
              name: values.name,
              surname: values.surname,
              fathername: values.fathername,
              introduction: values.introduction,
              speciality: state.currentUserSpeciality
            };
            actions.updateUser(state.currentUserId, userToUpdate);
        }
        else {
            const userToUpdate : IEditUserForm = 
            {
              name: values.name,
              surname: values.surname,
              fathername: values.fathername,
              introduction: values.introduction,
              speciality: chosenSpec
            };
            actions.updateUser(state.currentUserId, userToUpdate);
        }

        actions.setSenderName(values.name);
        actions.setSenderId(values.id);
     };

     const setUserForm = () => {
        editForm.setFieldsValue({
            id: state.currentUserId,
            name: state.currentName,
            surname: state.currentSurname,
            fathername: state.currentFathername,
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

            <h2>{t("editProfile.title")}</h2>

            <Form.Item
                 name="id">
                   <Input type="hidden"/>
             </Form.Item> 

             <Form.Item
                 name="surname"
                 label={t("editProfile.surname")}>
                 <Input/>
             </Form.Item>

             <Form.Item
                 name="name"
                 label={t("editProfile.name")}>
                 <Input/>
             </Form.Item>

             <Form.Item
                 name="fathername"
                 label={t("editProfile.fathername")}>
                 <Input/>
             </Form.Item>


            {(state.currentRole == "Doctor") ? 
                    <div>
                        <Form.Item
                            name="introduction"
                            label={t("editProfile.introduction")}>
                            <TextArea rows={5} />
                         </Form.Item>

                        <Form.Item
                            name="speciality"
                            label={t("editProfile.speciality")}>
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