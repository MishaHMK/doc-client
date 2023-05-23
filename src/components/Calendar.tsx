import React, {useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import { Select} from 'antd';
import { AppointmentModal } from './AppointmentModal';
import { IDoctor } from '../interfaces/IDoctor';
import FullCalendar from '@fullcalendar/react' 
import dayGridPlugin from '@fullcalendar/daygrid' 
import interactionPlugin from "@fullcalendar/interaction"
import jwt_decode from "jwt-decode";
import jwt from "jwt-decode";
import AuthLocalStorage from "../AuthLocalStorage";
import {
    EventContentArg,
  } from '@fullcalendar/core'
import { useTranslation, Trans } from 'react-i18next';

export const Calendar: React.FC = () => {
    const [state, actions] = useUserStore();
    const token = AuthLocalStorage.getToken() as string; 
    const user: any = jwt(token);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        setUp();
        actions.getDoctors();
        actions.getPatients();
        actions.getAllAppointmentsDates();
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

    useEffect(() => {
        if(state.currentRole == "Doctor"){
            state.docSelected = true;
        }
    });

    const showModal = () => {
        actions.makeAppModalVisible();
    };

    const handleChange = (value : any) => {
        state.docSelected = true;
        state.doctorIdSelected = value;
        state.doctorId = value;
        state.patientId = user.NameIdentifier;
        console.log(state.doctorId);
        console.log(state.patientId);
        console.log(value);
        actions.getAppointments(state.doctorId, state.patientId,
            state.currentRole);
    };

    const handleEvents  = (value : any) => {
        state.currentEventId = value.event.extendedProps.id;
        actions.makeAppModalVisible();
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
            <div className={`${eventContent.event.extendedProps.approved? 'approved' : 'not-approved'}`} >
            <i> {' ' + eventContent.event.title + ' '}</i>
            <b> {eventContent.timeText}</b>
         </div>
        )
      }
      
    return (
        <div>
            <br></br>
            {(state.currentRole == "Patient") ?  
            <div>
                <label> {t("calendar.title")} </label>
                 <Select
                    style={{ width: 300 }}
                    options={state.doctors.map((doc : IDoctor) => 
                         ({ label: doc.surname + " " + doc.name + " " + doc.fathername, value: doc.id  }))}
                    defaultValue = {state.doctorName}
                    onChange={handleChange}/>
                   <br></br> 
                   <br></br> 
            </div>
             : <br></br>}
           

            {(state.docSelected == true) ?  
            <div>
                <FullCalendar
                    timeZone = 'local'
                    hiddenDays = {[0, 6]} 
                    height = '1000px'
                    plugins = {[ dayGridPlugin, interactionPlugin ]}   
                    headerToolbar = {{ 
                        left: 'prev, next, today', 
                        center: 'title',
                        end: 'dayGridMonth, dayGridWeek, dayGridDay',
                     }}
                     buttonText = {{
                        today: i18n.language == 'ua' ? 'Сьогодні' : 'Today',
                        day: i18n.language == 'ua' ? 'День' : 'Day',
                        week: i18n.language == 'ua' ? 'Тиждень' : 'Week',
                        month: i18n.language == 'ua' ? 'Місяць' : 'Month'
                    }}
                    initialView = 'dayGridMonth'
                    selectable = {true}
                    editable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    eventStartEditable={false}
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
                            meridiem: false,
                            hour12: false
                          })}
                    eventColor = '#378006'
                    eventClick = {handleEvents}
                    locale= {i18n.language == 'ua' ? 'uk' : 'en'}
            />  
            </div>
             : <h1></h1>}
            
            <AppointmentModal/> 
        </div>
    );
 };

