import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import { Card, List, Pagination, Input, Space, Select, Button } from 'antd';
import { PlusCircleOutlined, CommentOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const pageSize = 4;
const { Search } = Input;

export const DoctorsPage: React.FC = () => {

    const [state, actions] = useUserStore();
    const [totalItems, settotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSpec, setSelectedSpec] = useState("");
    const [searchName, setSearchName] = useState("");
    const [orderBy, setOrderBy] = useState("");
    const [sortItem, setSortItem] = useState("");
    const navigate = useNavigate();

    useEffect(() => {  
        actions.getUsers(currentPage, pageSize, searchName, selectedSpec, sortItem, orderBy);
        settotalItems(state.paginatedUsers.totalItems);
    }, []);

    const handleChange = (page : any) => {
        setCurrentPage(page);
        actions.getUsers(page, pageSize, searchName, selectedSpec, sortItem, orderBy);
    };

    const onSearch = (value: string) => {
        setSearchName(value);
        actions.getUsers(currentPage, pageSize, searchName, selectedSpec, sortItem, orderBy);
    };

    const handleSelect = (value : any) => {
        setSelectedSpec(value);
        actions.getUsers(currentPage, pageSize, searchName, value, sortItem, orderBy);
    };

    const sortNameByAsc = () => {
        setSortItem("name");
        setOrderBy("ascend");
        actions.getUsers(currentPage, pageSize, searchName, selectedSpec, sortItem, orderBy);
    };

    const sortNameByDesc = () => {
        setSortItem("name");
        setOrderBy("descend");
        actions.getUsers(currentPage, pageSize, searchName, selectedSpec, sortItem, orderBy);
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
                dataSource={state.paginatedUsers.pagedList}
                renderItem={(item : any) => (
                <List.Item>
                    {(state.currentRole == "Doctor") ?
                        <Card title={"Doctor " + item.name + " (" + item.speciality + ") " }
                            bordered = {true}
                            >
                            <i>{item.introduction}</i>
                        </Card>
                        :
                        <Card title={"Doctor " + item.name + " (" + item.speciality + ") " }
                            actions={[
                                <CommentOutlined  key="chat" />,
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
       </div>
    );
 };