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
    DateSelectArg,
    EventClickArg,
    EventContentArg,
    formatDate,
  } from '@fullcalendar/core'

interface DemoAppState {
    weekendsVisible: boolean
    currentEvents: EventApi[]
  }

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const [state, actions] = useUserStore();

    useEffect(() => {
        setUp();
        actions.getDoctors();
        actions.getAppointments(state.doctorId, state.patientId,
         state.currentRole);
    }, []);

    const showModal = () => {
        actions.makeModalVisible();
    };

    const handleChange = (value : any) => {
        state.doctorIdSelected = value;
    };

    const handleEvents  = (value : any) => {
        //state.appointments = values;
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
          <div className = "s">
            <i>{eventContent.event.title + ' '}</i>
            <b>{eventContent.timeText}</b>
         </div>
        )
      }

    return (
        <div>
            <br></br>

            <label> Select Doctor </label>
            <Select
                    defaultValue={state.doctors[0]}
                    style={{ width: 120 }}
                    options={state.doctors.map((doc : IDoctor) => ({ label: "Doctor " + doc.name, value: doc.id  }))}
                    onChange={handleChange}
                />

            <br></br>
            <br></br>
            
            <FullCalendar
                    timeZone = 'local'
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
                    eventColor = 'green'
                   events= {state.appointments.map((app : IAppointment) => 
                        ({ title: app.title, 
                           start: app.startDate,
                           end:  app.endDate,
                           color: 'purple'})) } 

                    eventsSet={handleEvents}
            />  

            <CalendarModal/> 
        </div>
    );
 };

