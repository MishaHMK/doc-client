import React, {useState, useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import { Button, Table} from 'antd';
import Link from 'antd/es/typography/Link';
import TimeAgo from 'timeago-react'; 
import type { ColumnsType } from 'antd/es/table';
import jwt from "jwt-decode";
import { FolderOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import AuthLocalStorage from "../AuthLocalStorage";
import MessageApi from "../api/messageApi";
import { MessageThreadModal } from './MessageThreadModal';

const pageSize = 6;

export const Messages: React.FC = () => { 
    const [state, actions] = useUserStore();
    const [totalItems, settotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [container, setContainer] = useState("Unread");
    const [messages, setMessages] = useState([]);
    const token = AuthLocalStorage.getToken() as string;
    const user: any = jwt(token);
    let msgService = new MessageApi();
    
    useEffect(() => {  
        fetchData();
    }, [totalItems, currentPage, pageSize, container]);


    interface DataType {
        message: string;
        senderUserName: string;
        receiverUserName: string;
        sentRec: string;
      }

    const columns: ColumnsType<DataType> = [
        {
            title: 'From',
            dataIndex: 'senderUserName',
            width: '20%',
            render: (senderUserName: any) => (
                <Link onClick={() => openMessageModal(senderUserName)}>{senderUserName}</Link>
            )
        },
        {
            title: 'Message',
            dataIndex: 'content',
            width: '50%'
        },
        {
            title: 'Sent',
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
            dataIndex: 'id',
            render: (id: any) => (
                <Button danger onClick={() => deleteMessage(id, state.senderName)}>Delete</Button>
            )
        }
      ]

    const onUnread = () => {
        setCurrentPage(1);
        setContainer("Unread");
    } 

    const onInbox = () => {
        setCurrentPage(1);
        setContainer("Inbox");
    } 

    const onOutbox = () => {
        setCurrentPage(1);
        setContainer("Outbox");
    } 

    const handleChange = (page : any) => {
        setCurrentPage(page);
    };

    const openMessageModal = (receiverName : any) => {
        actions.setReceiverName(receiverName);
        actions.makeThreadModalVisible();
    };

    const deleteMessage = async (id : any, userName : any) => {
        await msgService.deleteMessage(id, userName);
        await msgService.getMessages(currentPage, pageSize, container, user.NameIdentifier)
        .then(async (response) => {
           settotalItems(response.data.totalItems);
           setMessages(response.data.pagedList);
    });
    };

    const fetchData = async () => {
        await msgService.getMessages(currentPage, pageSize, container, user.NameIdentifier)
            .then(async (response) => {
               settotalItems(response.data.totalItems);
               setMessages(response.data.pagedList);
        });
    };

    return (
        <div>
            <h2>MESSAGES</h2>
                <div>
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
                                dataSource={messages}
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

                <MessageThreadModal/>
        </div>
    );
}