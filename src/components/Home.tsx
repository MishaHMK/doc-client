import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { useUserStore } from '../stores/user.store';
import { Select} from 'antd';
import { CalendarModal } from '../components/CalendarModal';
import { IDoctor } from '../interfaces/IDoctor';
import { IAppointment } from '../interfaces/IAppointment';
import FullCalendar from '@fullcalendar/react' 
import dayGridPlugin from '@fullcalendar/daygrid' 
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction"
import { DateTimePicker } from "@progress/kendo-react-dateinputs";
import jwt from "jwt-decode";
import jwt_decode from "jwt-decode";
import AuthLocalStorage from "../AuthLocalStorage";
import {
    EventApi,
    EventContentArg,
  } from '@fullcalendar/core'

interface DemoAppState {
    weekendsVisible: boolean
    currentEvents: EventApi[]
  }

export const Home: React.FC = () => {
    const [state, actions] = useUserStore();

    useEffect(() => {
        setUp();
        actions.getDoctors();
        actions.getPatients();
        actions.getAllTimes();
        actions.getAppointments(state.doctorId, state.patientId,
         state.currentRole);

        if(state.currentRole == "Doctor"){
            state.docSelected = true;
            actions.getAppointments(state.doctorId, state.patientId,
                state.currentRole);
        }
        else {
            actions.getAppointments(state.doctorId, state.patientId,
                state.currentRole);
        }
    }, []);

    const showModal = () => {
        actions.makeModalVisible();
    };

    const handleChange = (value : any) => {
        state.docSelected = true;
        state.doctorIdSelected = value;
        state.doctorId = value;
        actions.getAppointments(state.doctorId, state.patientId,
            state.currentRole);
    };

    const handleEvents  = (value : any) => {
        state.currentEventId = value.event.extendedProps.id;
        actions.makeModalVisible();
        actions.getAppointment(value.event.extendedProps.id);
    };    

    const setUp = () => {
        const token = AuthLocalStorage.getToken() as string;
        const decoded: any = jwt_decode(token);
        state.currentRole = decoded.Role;
        if(decoded.Role == "Patient"){
            state.patientId = decoded.NameIdentifier;
        }
        if(decoded.Role == "Doctor"){
            state.doctorId = decoded.NameIdentifier;
        }
    };

    function renderEventContent(eventContent: EventContentArg) {
        return (
          <div >
            <i>{eventContent.event.title + ' '}</i>
            <b>{eventContent.timeText + ' '}</b>
            <b>{eventContent.event.extendedProps.approved ? 'approved' : 'not-approved' }</b>
         </div>
        )
      }

    return (
        <div>
            <br></br>
            {(state.currentRole == "Patient") ?  
            <div>
                <label> Select Doctor </label>
                 <Select
                    style={{ width: 120 }}
                    options={state.doctors.map((doc : IDoctor) => 
                         ({ label: "Doctor " + doc.name, value: doc.id  }))}
                    onChange={handleChange}/>
            </div>
             : <p></p>}
           
            <br></br>
            <br></br>

            {(state.docSelected == true) ?  
            <div>
                <FullCalendar
                    timeZone = 'local'
                    height = '800px'
                    plugins = {[ dayGridPlugin, interactionPlugin ]}   
                    headerToolbar = {{ 
                        left: 'prev, next, today', 
                        center: 'title',
                        end: 'dayGridMonth, dayGridWeek, dayGridDay'
                     }}
                    initialView = 'dayGridMonth'
                    selectable = {true}
                    editable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    select = {showModal}
                    eventContent={renderEventContent}
                    events = {state.appointments.map((app : any) => 
                        ({                     
                           title: app.title, 
                           start: app.startDate,
                           extendedProps: {
                            approved: app.isApproved,
                            id: app.id
                          }
                        })
                        )
                    }
                    eventTimeFormat = {({ 
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: false
                          })}
                    eventColor = '#378006'
                    eventClick = {handleEvents}
            />  
            </div>
             : <h1>Choose your Doctor</h1>}
            
            <CalendarModal/> 
        </div>
    );
 };

