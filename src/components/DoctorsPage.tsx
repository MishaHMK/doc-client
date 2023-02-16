import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import { Card, List, Pagination } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const pageSize = 4;

export const DoctorsPage: React.FC = () => {

    const [state, actions] = useUserStore();
    const [totalItems, settotalItems] = useState(0);
    const [current, setCurrent] = useState(1);

    useEffect(() => {  
        actions.getUsers(current, pageSize);
        settotalItems(state.paginatedUsers.totalItems);
    });

    const handleChange = (page : any) => {
        setCurrent(page);
        actions.getUsers(page, pageSize);
    };


    return (
        <div className = "docpage"> 
            <h2>D O C T O R S</h2>

            <List
                grid={{ column: 2 }}
                dataSource={state.paginatedUsers.pagedUsers}
                renderItem={(item : any) => (
                <List.Item>
                    <Card title={"Doctor " + item.name + " (" + item.speciality + ") " }
                        actions={[
                            <SettingOutlined key="setting" />,
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
                current={current}
                total={totalItems}
                onChange={handleChange}
                style={{ bottom: "0px" }}
            />
       </div>
    );
 };