import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import { Card, List, Pagination, Input, Space, Select, Button } from 'antd';
import { PlusCircleOutlined, CommentOutlined, UpOutlined, DownOutlined, UserOutlined} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import UserApi from "../api/userApi";
import AuthLocalStorage from '../AuthLocalStorage';
import jwt_decode from "jwt-decode";
import { MessageThreadModal } from './MessageThreadModal';
import { useSignalrStore } from '../stores/signalr.store';
import { useMessageStore } from "../stores/message.store";

const pageSize = 4;
const { Search } = Input;

export const DoctorsPage: React.FC = () => {
    const token = AuthLocalStorage.getToken() as string;
    const navigate = useNavigate();
    let userService = new UserApi();
    const [state, actions] = useUserStore();
    const [signalState, signalActions] = useSignalrStore();
    const [totalItems, settotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSpec, setSelectedSpec] = useState("");
    const [searchName, setSearchName] = useState("");
    const [orderBy, setOrderBy] = useState("");
    const [sortItem, setSortItem] = useState("");
    const [currentRole, setCurrentRole] = useState<any>();
    const [users, setUsers] = useState([]);
    const [usersOnline, setUsersOnline] = useState<any>();
    const [messageState, messageActions] = useMessageStore();


    useEffect(() => {  
        fetchData();
    }, [currentPage, searchName, sortItem, orderBy, selectedSpec, usersOnline, signalState.onlineUsers]);

    const fetchData = async () => {
        const decoded: any = jwt_decode(token);
        setCurrentRole(decoded.Role);

        await userService.getPagedUsers(currentPage, pageSize, searchName, selectedSpec, sortItem, orderBy)
            .then(async (response) => {
               settotalItems(response.data.totalItems);
               setUsers(response.data.pagedList);
        });

        setUsersOnline(signalState.onlineUsers);
    };
        

    const handleChange = (page : any) => {
        setCurrentPage(page);
    };

    const onSearch = (value: string) => {
        setSearchName(value);
    };

    const handleSelect = (value : any) => {
        setSelectedSpec(value);
    };

    const sortNameByAsc = () => {
        setSortItem("name");
        setOrderBy("ascend");
    };

    const sortNameByDesc = () => {
        setSortItem("name");
        setOrderBy("descend");
    };

    const goToAppoint = (id : string, name: string) => {
        state.docSelected = true;
        state.doctorIdSelected = id;
        state.doctorId = id;
        state.doctorName = name;
        state.docPageOn = false;
        actions.getAppointments(state.doctorId, state.patientId,
            state.currentRole);
        navigate("../calendar", { replace: true });    
    };

    const openMessageModal = (receiverId: any, receiverName : any) => {
        messageActions.recieveThread(state.senderName, state.receiverName);
        actions.setReceiverName(receiverId);
        actions.makeThreadModalVisible();
    };

    return (
        <div className = "docpage"> 
            <h2>OUR DOCTORS</h2>

            <Space direction="horizontal">

            <Button onClick={sortNameByAsc}><UpOutlined /></Button>
            <Button onClick={sortNameByDesc}><DownOutlined /></Button>

               <Search
                    placeholder="Put doctors name"
                    allowClear
                    enterButton
                    size="large"
                    onSearch={onSearch}
                />

                <Select
                    style={{ width: 120 }}
                    onChange={handleSelect}
                    options={state.specs.map((sp : any) => ({ label: sp, value: sp }))}
                    defaultValue = "Speciality"
                />

            </Space>

            <br></br>
            <br></br>
            <br></br>

            <List
                grid={{ column: 2 }}
                dataSource={users}
                renderItem={(item : any) => (
                <List.Item>
                    {(currentRole == "Doctor") ?
                        <Card title={ "Doctor " + item.name + " (" + item.speciality + ") " }
                              extra={(usersOnline.includes(item.id)) ? 
                                        <h4 style={{color: '#21bb4b'}}>Online</h4> : 
                                        <h4>Offline</h4> } 
                              bordered = {true}
                            >
                        
                            <i>{item.introduction}</i>
                        </Card>
                        :
                        <Card title={"Doctor " + item.name + " (" + item.speciality + ") " }
                            extra={  (usersOnline.includes(item.id)) ? 
                                <h4 style={{color: '#21bb4b'}}>Online</h4> : 
                                <h4>Offline</h4> } 
                            actions={[
                                <CommentOutlined  key="chat"  onClick={() => openMessageModal(item.id, item.name)}/>,
                                <PlusCircleOutlined key="app" onClick={() => goToAppoint(item.id, item.name)}/>
                            ]}
                            bordered = {true}   
                            >
                            <i>{item.introduction}</i>
                        </Card>
                    }
                </List.Item>
            )}
            />

            <Pagination
                pageSize={pageSize}
                current={currentPage}
                total={totalItems}
                onChange={handleChange}
                style={{ bottom: "0px" }}
            />

           <MessageThreadModal/>
       </div>
    );
 };

