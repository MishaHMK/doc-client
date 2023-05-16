import {useEffect} from "react"
import React, { useState } from 'react';
import { Modal, Form, Input, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useUserStore } from '../stores/user.store';
import { IPatient } from '../interfaces/IPatient';
import { IDoctor } from '../interfaces/IDoctor';
import { IAppointment } from '../interfaces/IAppointment';
import dayjs from "dayjs";
import { Select } from 'antd';
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import jwt from "jwt-decode";
import AuthLocalStorage from "../AuthLocalStorage";
import { useTranslation, Trans } from 'react-i18next';

export const AppointmentModal: React.FC = () => { 

    const [createForm] = useForm();
    const [editForm] = useForm();
    const [state, actions] = useUserStore();
    const [dateTimeChoice, setDateTime] = useState(" ");
    const token = AuthLocalStorage.getToken() as string;

     useEffect(() => {    
        updateModal(); 
        console.log(state.currentEventStartDate);
        //console.log(state.dates);
    });


      const { t, i18n } = useTranslation();

      const handleCreateCancel = () => {
        actions.makeAppModalInvisible();
      }
    
      const handleEditCancel = () => {
        actions.makeAppModalInvisible();
      }

      const dateTimeChange: DatePickerProps['onChange']  = (date, dateTimeString) => {
        setDateTime(dateTimeString);
      }
      
      const updateModal = () => {
        let dateFormat = dayjs(state.currentEventStartDate)
       
        editForm.setFieldsValue({
            editId: state.currentEventId,
            editTitle: state.currentEventTitle,
            editDescription: state.currentEventDescription,
            editPatientId: state.currentEventPatientId,               
            editDoctorId: state.currentEventDoctorId,
            editDateTime: dayjs(state.currentEventStartDate, "YYYY-MM-DD HH:mm") 
        });
    }

      const range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      };

      const disabledTime = (current : any) => ({
          disabledHours: () => [19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8],
          disabledMinutes: () => 
          range(1, 60).filter(item => item != 0 && item != 20 && item != 40)
     });


     function padTo2Digits(num: number) {
      return num.toString().padStart(2, '0');
    }
      function formatDate(date: Date) {
        return (
          [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
          ].join('-') +
          ' ' +
          [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
          ].join(':')
        );
      }


    const disabledDate = (current : any) => {
            return (
                (
                new Date(current).getDay() === 0 ||
                new Date(current).getDay() === 6 ||
                current.valueOf() < Date.now()   ||
                !!state.dates.includes(formatDate(new Date(current)))
                )   
            );
        }; 

      const handleSubmit = (values: any) => {
        actions.makeAppModalInvisible();
        const user: any = jwt(token);

        const appoint : IAppointment = 
        {
          title: values.title,
          description: values.description,
          startDate: dateTimeChoice,
          endDate: "",
          duration: 60,
          doctorId: (state.currentRole == "Doctor") ? user.NameIdentifier : state.doctorIdSelected,
          patientId: (state.currentRole == "Doctor") ? values.patientId : user.NameIdentifier,
          isApproved: false,
          adminId: ""
        };
        actions.createAppointment(appoint);
     }

    const deleteAppointment = (id : any) : any => {
      actions.deleteAppointment(id);
      actions.makeAppModalInvisible();
    }

    const approveAppointment = () : any => {
      actions.approveAppointment(state.currentEventId, state.currentEventStatus);
      actions.makeAppModalInvisible();
    }

    const handleUpdate = (values: any) => {
      actions.makeAppModalInvisible();
      const user: any = jwt(token);
      const appointToUpdate : IAppointment = 
      {
        id: state.currentEventId,
        title: values.editTitle,
        description: values.editDescription,
        startDate: dateTimeChoice,
        endDate: "",
        duration: 60,
        doctorId: (state.currentRole == "Doctor") ? user.NameIdentifier: state.doctorIdSelected,
        patientId: state.currentEventPatientId,
        isApproved: false,
        adminId: ""
      };

      actions.updateAppointment(state.currentEventId, appointToUpdate);
   };


      if(state.currentEventId == 0){
        return(  
        <Modal title={t("appModal.createTitle")}
           open={state.IsAppShown} 
           onCancel={handleCreateCancel}
           footer={null}>
              <Form form = {createForm} onFinish={handleSubmit}>
                <br></br>
                 <p></p>
                  <Form.Item
                      name="title"
                      label={t("appModal.title")}
                      rules={[
                        {
                          max: 60
                        },
                      ]}>
                      <Input placeholder = {i18n.language == 'ua' ? 'Назва' : 'Title'} />
                  </Form.Item>
                  <Form.Item
                      name="description"
                      label={t("appModal.description")}
                      rules={[
                        {
                          max: 200
                        },
                      ]}>
                      <Input placeholder= {i18n.language == 'ua' ? 'Опис' : 'Description'}/>
                  </Form.Item>              
                
                  <Form.Item
                      label={t("appModal.dateTime")}
                      name="dateTime">
                          <DatePicker format="YYYY-MM-DD HH:mm" 
                            onChange={dateTimeChange} 
                            disabledDate = {disabledDate} 
                            disabledTime = {disabledTime}
                            hideDisabledOptions={true}
                            showTime={{
                              format: 'HH:mm', 
                            }}
                            />
                  </Form.Item> 
                  
                  
                  {(state.currentRole == "Doctor") ? 
                      <div>
                        <Form.Item
                            name="patientId"
                            label={t("appModal.selectPat")}>
                            <Select
                                  style={{ width: 120 }}
                                  options={state.patients.map((pt : IPatient) => ({ label: pt.name, value: pt.id  }))}
                            />
                        </Form.Item>
                      </div> 
                  : <br></br>}

                  <Form.Item shouldUpdate>
                     {() => (
                      <Button
                          type="primary"
                          style={{ background: "#52c41a", borderColor: "green" }}
                          htmlType="submit">
                          {t("appModal.add")} 
                      </Button>
                      )}
                  </Form.Item>
              </Form>
        </Modal>)
      } 
      else return (
      <Modal title={t("appModal.editTitle")}
            open={state.IsAppShown} 
            onCancel={handleEditCancel}
            footer={null}>
         <Form form = {editForm} onFinish={handleUpdate} name="control-hooks">
           <br></br>

            <Form.Item
                 name="editId">
                   <Input type="hidden"/>
             </Form.Item> 

             <Form.Item
                 name="editTitle"
                 label={t("appModal.title")}>
                 <Input/>
             </Form.Item>

             <Form.Item
                 name="editDescription"
                 label={t("appModal.description")}>
                 <Input/>
             </Form.Item>

             <Form.Item
                 name="editPatientId"
                 label={t("appModal.changePat")}>
                 <Select
                       style={{ width: 120 }}
                       options={state.patients.map((pt : IPatient) => ({ label: pt.name, value: pt.id  }))}
                 />
             </Form.Item>

             {(state.currentRole == "Patient") ? 
                      <div>
                       <Form.Item
                          name="editDoctorId"
                          label={t("appModal.changeDoc")}>
                          <Select
                                defaultValue={state.doctors[0]}
                                style={{ width: 120 }}
                                options={state.doctors.map((dr : IDoctor) => ({ label: dr.name, value: dr.id  }))}
                          />
                      </Form.Item>
                      </div> 
                  : <div></div>}

              <Form.Item
                      label={t("appModal.dateTime")}
                      name="editDateTime">
                          <DatePicker //format="YYYY-MM-DD HH:mm" 
                          //defaultValue={dayjs("2023-04-20 12:20:00", "YYYY-MM-DD HH:mm")}
                          onChange={dateTimeChange} 
                            disabledDate = {disabledDate} 
                            disabledTime = {disabledTime}
                            hideDisabledOptions={true}
                            showTime={{
                              format: 'HH:mm', 
                            }}
                            />
                  </Form.Item> 
                  

             <Form.Item>
               <Button type="primary" htmlType="submit">
                 {t("appModal.change")}
               </Button>

               <Button type="primary" onClick={() => {deleteAppointment(state.currentEventId)}} danger> 
                 {t("appModal.delete")}
               </Button>

              {(state.currentRole == "Doctor" && state.currentEventStatus == false) ? 
              <div>
                <br></br>
                <Button type="primary" 
                          onClick={() => {approveAppointment()}}
                          style={{ background: "#52c41a", borderColor: "green" }}> 
                    {t("appModal.approve")}  
                </Button>
              </div> 
               : <br></br>}

             {(state.currentRole == "Doctor" && state.currentEventStatus == true) ?  
              <div>
                <br></br>
                <Button type="primary" 
                    onClick={() => {approveAppointment()}}
                    style={{ background: "#f6546a", borderColor: "red" }}> 
                      {t("appModal.cancel")} 
                </Button>
              </div>
             : <br></br>}

             </Form.Item>
         </Form>
      </Modal>)
}
