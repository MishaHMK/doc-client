import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import { Card, List, Pagination, Input, Space, Select } from 'antd';
import { EditOutlined, CommentOutlined } from '@ant-design/icons';

const pageSize = 4;
const { Search } = Input;

export const DoctorsPage: React.FC = () => {

    const [state, actions] = useUserStore();
    const [totalItems, settotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSpec, setSelectedSpec] = useState("");
    const [searchName, setSearchName] = useState("");

    useEffect(() => {  
        actions.getUsers(currentPage, pageSize, searchName, selectedSpec);
        settotalItems(state.paginatedUsers.totalItems);
    });

    const handleChange = (page : any) => {
        setCurrentPage(page);
        actions.getUsers(currentPage, pageSize, searchName, selectedSpec);
    };

    const onSearch = (value: string) => {
        setSearchName(value);
        actions.getUsers(currentPage, pageSize, searchName, selectedSpec);
    };

    const handleSelect = (value : any) => {
        setSelectedSpec(value);
        actions.getUsers(currentPage, pageSize, searchName, selectedSpec);
    };


    return (
        <div className = "docpage"> 
            <h2>OUR DOCTORS</h2>

            <Space direction="horizontal">
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
                />

            </Space>

            <br></br>
            <br></br>
            <br></br>

            <List
                grid={{ column: 2 }}
                dataSource={state.paginatedUsers.pagedUsers}
                renderItem={(item : any) => (
                <List.Item>
                    <Card title={"Doctor " + item.name + " (" + item.speciality + ") " }
                        actions={[
                            <CommentOutlined  key="chat" />,
                            <EditOutlined key="edit" />
                        ]}
                        bordered = {true}
                        style={{ }}
                        >
                        <i>{item.introduction}</i>
                    </Card>
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