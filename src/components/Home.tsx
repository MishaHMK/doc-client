import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { useUserStore } from '../stores/user.store';
import { Select} from 'antd';
import { CalendarModal } from '../components/CalendarModal';
import { IDoctor } from '../interfaces/IDoctor';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const [state, actions] = useUserStore();

    useEffect(() => {
        actions.getDoctors();
    }, []);

    const showModal = () => {
        actions.makeModalVisible();
    };

    return (
        <div>
            <br></br>

            <label> Select Doctor </label>
            <Select
                    defaultValue={state.doctors[0]}
                    style={{ width: 120 }}
                    options={state.doctors.map((doc : IDoctor) => ({ label: "Doctor " + doc.name, value: doc.id  }))}
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
                    //initialView="dayGridMonth"
                    selectable = {true}
                    editable = {false}
                    select = {showModal}
            />  

            <CalendarModal/> 
        </div>
    );
 };

 /* plugins = {[ dayGridPlugin, interactionPlugin ]}    
    initialView="dayGridMonth" */