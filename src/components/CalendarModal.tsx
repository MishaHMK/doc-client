import {useEffect} from "react"
import React, { useState } from 'react';
import { Modal, Form, Input, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useUserStore } from '../stores/user.store';
import { IPatient } from '../interfaces/IPatient';
import { IAppointment } from '../interfaces/IAppointment';
import { TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Select } from 'antd';
import AppointmentApi from "../api/appointmentApi";
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';

export const CalendarModal: React.FC = () =>{ 

    const [form] = useForm();
    //const [isModalOpen, setIsModalOpen] = useState(false);
    const [state, actions] = useUserStore();
    const [dateChoice, setDate] = useState(" ");
    const [timeChoice, setTime] = useState(" ");

    let appointmentService = new AppointmentApi();

     useEffect(() => {  
           actions.getPatients();
           actions.getAllTimes();
    }, []);

      const handleOk = () => {
        actions.makeModalInvisible();
      };
    
      const handleCancel = () => {
        actions.makeModalInvisible();
      };

      const dayChange: DatePickerProps['onChange'] = (date, dateString) => {
        //console.log(dateString);
        setDate(dateString);
        console.log(dateChoice);
      };

      const timeChange: any = (time: Dayjs, timeString: string) => {
        //console.log(timeString);
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

     return(
            <Modal title="Create / Change Appointment" 
                   open={state.IsShown} 
                   onOk={handleOk} onCancel={handleCancel}
                   footer={null}>
                 <Form form = {form} onFinish={handleSubmit} name="control-hooks">
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
            </Modal>     
     ) 

}
