import {useEffect} from "react"
import React, { useState } from 'react';
import { Modal, Form, Input, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useUserStore } from '../stores/user.store';
import { IPatient } from '../interfaces/IPatient';
import { IDoctor } from '../interfaces/IDoctor';
import { IAppointment } from '../interfaces/IAppointment';
import { TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Select } from 'antd';
import AppointmentApi from "../api/appointmentApi";
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';

export const CalendarModal: React.FC = () =>{ 

    const [createForm] = useForm();
    const [editForm] = useForm();
    //const [isModalOpen, setIsModalOpen] = useState(false);
    const [state, actions] = useUserStore();
    const [dateChoice, setDate] = useState(" ");
    const [timeChoice, setTime] = useState(" ");

    let appointmentService = new AppointmentApi();

     useEffect(() => {  
           actions.getPatients();
           actions.getAllTimes();
    }, []);

    
      const handleCreateCancel = () => {
        actions.makeModalInvisible();
        console.log("create cancel");
        console.log(state.currentEventId);
      };
    
      const handleEditCancel = () => {
        actions.makeModalInvisible();
        console.log("edit cancel");
        console.log(state.currentEventId);
      };

      const dayChange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(dateString);
      };

      const timeChange: any = (time: Dayjs, timeString: string) => {
        setTime(timeString);
        console.log(timeChoice);
      };
      

      const handleSubmit = (values: any) => {
        actions.makeModalInvisible();

        const appoint : IAppointment = 
        {
          id: 0,
          title: values.title,
          description: values.description,
          startDate: dateChoice + "T" + timeChoice,
          endDate: "",
          duration: 60,
          doctorId: state.doctorIdSelected,
          patientId: values.patientId,
          isApproved: false,
          adminId: ""
        };
        console.log(appoint);

        appointmentService.makeAppointment(appoint);

  };

      if(state.currentEventId == 0){
        return(  
        <Modal title="Create Appointment" 
           open={state.IsShown} 
           onCancel={handleCreateCancel}
           footer={null}>
              <Form form = {createForm} onFinish={handleSubmit} name="control-hooks">
                <br></br>
                  <Form.Item
                      name="title"
                      label="Title"
                      rules={[
                        {
                          max: 60,
                          required: true,
                        },
                      ]}>
                      <Input/>
                  </Form.Item>
                  <Form.Item
                      name="description"
                      label="Description"
                      rules={[
                        {
                          max: 200,
                          required: true,
                        },
                      ]}>
                      <Input/>
                  </Form.Item>
                  <Form.Item
                      name="patientId"
                      label="Select Patient">
                      <Select
                            defaultValue={state.patients[0]}
                            style={{ width: 120 }}
                            options={state.patients.map((pt : IPatient) => ({ label: pt.name, value: pt.id  }))}
                      />
                  </Form.Item>

                  <Form.Item
                      name="startDate"
                      label="Appointment Day">
                          <DatePicker onChange={dayChange} />
                  </Form.Item>  

                  <Form.Item
                      name="time"
                      label="Appointment Time">
                          <TimePicker onChange={timeChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                  </Form.Item>  

                  <Form.Item
                      name="id">
                        <Input type="hidden"/>
                  </Form.Item>  

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
              </Form>
           </Modal>)
      } 
      else return (
      <Modal title="Edit Appointment" 
            open={state.IsShown} 
            onCancel={handleEditCancel}
            footer={null}>
         <Form form = {editForm} onFinish={handleSubmit} name="control-hooks">
           <br></br>

            <Form.Item
                 name="id">
                   <Input type="hidden"/>
             </Form.Item> 

             <Form.Item
                 name="title"
                 label="Title"
                 rules={[
                   {
                     max: 60,
                     required: true,
                   },
                 ]}>
                 <Input/>

             </Form.Item>
             <Form.Item
                 name="description"
                 label="Description"
                 rules={[
                   {
                     max: 200,
                     required: true,
                   },
                 ]}>
                 <Input/>
             </Form.Item>

             <Form.Item
                 name="patientId"
                 label="Change Patient">
                 <Select
                       defaultValue={state.patients[0]}
                       style={{ width: 120 }}
                       options={state.patients.map((pt : IPatient) => ({ label: pt.name, value: pt.id  }))}
                 />
             </Form.Item>

             <Form.Item
                 name="doctorId"
                 label="Change Doctor">
                 <Select
                       defaultValue={state.doctors[0]}
                       style={{ width: 120 }}
                       options={state.doctors.map((dr : IDoctor) => ({ label: dr.name, value: dr.id  }))}
                 />
             </Form.Item>

             <Form.Item
                 name="startDate"
                 label="Appointment Day">
                     <DatePicker onChange={dayChange} />
             </Form.Item>  

             <Form.Item
                 name="time"
                 label="Appointment Time">
                     <TimePicker onChange={timeChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
             </Form.Item>   

             <Form.Item>
               <Button type="primary" htmlType="submit">
                 Submit
               </Button>
             </Form.Item>
         </Form>
      </Modal>)
}
