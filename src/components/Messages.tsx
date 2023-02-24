import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import { Button, Table} from 'antd';
import TimeAgo from 'timeago-react'; 
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import jwt from "jwt-decode";
import { FolderOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import AuthLocalStorage from "../AuthLocalStorage";

const pageSize = 4;

export const Messages: React.FC = () => { 
    const [state, actions] = useUserStore();
    const [totalItems, settotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [container, setContainer] = useState("Unread");
    const token = AuthLocalStorage.getToken() as string;
    const user: any = jwt(token);

    useEffect(() => {  
        getMessages(container);
    });


    interface DataType {
        message: string;
        senderUserName: string;
        sentRec: string;
      }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Message',
            dataIndex: 'content',
            width: '50%'
        },
        {
            title: 'From / To',
            dataIndex: 'senderUserName',
            width: '20%'
        },
        {
            title: 'Sent / Received',
            dataIndex: 'messageSent',
            width: '20%',
            render: (messageSent: any) => (
                <TimeAgo
                datetime={messageSent}
                />
            )
        },
        {
            width: '10%',
            key: "delete",
            render: () => (
                <Button danger>Delete</Button>
            )
        }
      ];

    const onUnread = () => {
        setContainer("Unread");
        getMessages("Unread");
        settotalItems(state.paginatedMessages.totalItems);
    } 

    const onInbox = () => {
        setContainer("Inbox");
        getMessages("Inbox");
        settotalItems(state.paginatedMessages.totalItems);
    } 

    const onOutbox = () => {
        setContainer("Outbox");
        getMessages("Outbox");
        settotalItems(state.paginatedMessages.totalItems);
    } 

    const handleChange = (page : any) => {
        setCurrentPage(page);
        actions.getMessages(page, pageSize, container, user.NameIdentifier);
    };


    const getMessages = (container?: string) => {
        actions.getMessages(currentPage, pageSize, container, user.NameIdentifier);
        settotalItems(state.paginatedMessages.totalItems);
    }

    return (
        <div>
            <h2>MESSAGES</h2>
                <div style={{ display: 'flex', position: 'absolute', top: '18%', left: '40%'}}>
                    <Button type="primary" icon={<MailOutlined />} size={'large'} onClick = {onUnread}>
                        Unread
                    </Button>
                    <Button type="primary" icon={<FolderOutlined />} size={'large'} onClick = {onInbox}>
                        Inbox
                    </Button>
                    <Button type="primary" icon={<SendOutlined />} size={'large'} onClick = {onOutbox}>
                        Outbox
                    </Button>
                </div>
                
                <div>
                    {(state.paginatedMessages.totalItems === 0 && !state.paginatedMessages.pagedList) ?
                        <div style={{ display: 'flex', position: 'absolute', top: '25%', left: '47%'}}>
                            <h3>No messages</h3>
                        </div>
                            :
                        <div style={{ marginTop: '70px'}}>
                            <Table
                                columns={columns}
                                dataSource={state.paginatedMessages.pagedList}
                                pagination={{
                                    current: currentPage,
                                    pageSize: pageSize,
                                    total: totalItems,
                                    showLessItems: true,
                                    responsive: true,
                                    showSizeChanger: true,
                                    onChange: (page) => handleChange(page),
                                    //onShowSizeChange: (page, size) => handleSizeChange(page, size),
                                  }}>
                            </Table>
                        </div>    
                    }
                </div>
        </div>
    );
}