import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { Card, List, Pagination, Input, Space, Select, Button } from 'antd';
import jwt_decode from "jwt-decode";
import AuthLocalStorage from '../AuthLocalStorage';
import AppointmentApi from "../api/appointmentApi";
import { format } from 'date-fns'

export const AppointmentPage: React.FC = () => {
    const { Meta } = Card;
    const token = AuthLocalStorage.getToken() as string;
    const pageSize = 3;
    const [totalItems, settotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [orderBy, setOrderBy] = useState("");
    const [userId, setUserId] = useState("");
    const [sortItem, setSortItem] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [currentRole, setCurrentRole] = useState<any>();
    const [appointments, setAppointments] = useState([]);

    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    let appointService = new AppointmentApi();
    
    const handleChange = (page : any) => {
        setCurrentPage(page);
    };

    
    const handleSelect = (value : any) => {
        setSelectedStatus(value);
    };

    const handleСhange = (value : number) => {
        console.log(value);
    };


    useEffect(() => {  
        fetchData();
    }, [currentPage, sortItem, orderBy, selectedStatus]);


    const fetchData = async () => {
        const decoded: any = jwt_decode(token);
        setCurrentRole(decoded.Role);
        setUserId(decoded.NameIdentifier);
        console.log(decoded.NameIdentifier);

        await appointService.getMyAppointments(decoded.NameIdentifier, currentPage, pageSize, decoded.Role, selectedStatus, sortItem, orderBy)
            .then(async (response) => {
               settotalItems(response.data.totalItems);
               setAppointments(response.data.pagedList);
        });
    };

    return (
        <div> 

            <h1>My Appointments</h1>
            <Select
                    style={{ width: 120 }}
                    onChange={handleSelect}
                    options={[
                        { value: null, label: '------' },
                        { value: true, label: 'Approved' },
                        { value: false, label: 'Unapproved' },
                    ]}
                    defaultValue = "------"
             />
            <br></br>
            <br></br>
            <br></br>
            <List
                grid={{ column: 1 }}
                dataSource={appointments}
                renderItem={(item : any) => (
                <List.Item>
                    <Card title =
                            { 
                                item.title 
                                           + " " + format(new Date(item.startDate), 'dd.MM.yyyy') 
                                           //+ " on "+ months[new Date(item.startDate).getMonth()] 
                                           + " (" 
                                           + days[new Date(item.startDate).getDay()] 
                                           + ") " + format(new Date(item.startDate), 'HH:mm')
                            }
                            extra={(item.isApproved == true) ? 
                                <h4 style={{color: '#21bb4b'}}>Approved</h4> : 
                                <h4 style={{color: '#CC0000'}}>Unapproved</h4> } 
                            bordered = {true}
                            style = {{boxShadow: '10px 5px 5px grey', width: '800px', marginLeft: '23%'}}>
                        <i>{item.description}</i>
                        <br></br>
                        <br></br>
                        <div className="appointContainer">
                            <h4 style={{}}>Doctor: {item.doctorName} </h4>
                            <h4 style={{}}>Patient: {item.patientName} </h4>
                        </div>
                    </Card>
                </List.Item>
            )}
            />

            <Pagination
                pageSize={pageSize}
                current={currentPage}
                total={totalItems}
                onChange={handleChange}
                style={{ bottom: "10px" }}
            />
            <br></br>
            <br></br>
          
       </div>
    );
 };

