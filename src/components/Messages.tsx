import React, {useState, useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import { Button, Table} from 'antd';
import Link from 'antd/es/typography/Link';
import type { ColumnsType } from 'antd/es/table';
import jwt from "jwt-decode";
import { FolderOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import AuthLocalStorage from "../AuthLocalStorage";
import MessageApi from "../api/messageApi";
import { MessageThreadModal } from './MessageThreadModal';
import { useMessageStore } from "../stores/message.store";

import { useTranslation, Trans } from 'react-i18next';

import TimeAgo from 'timeago-react';
import * as timeAgo from 'timeago.js'; 
import uk from 'timeago.js/lib/lang/uk';

timeAgo.register('uk', uk);

const pageSize = 6;

export const Messages: React.FC = () => { 
    const [state, actions] = useUserStore();
    const [totalItems, settotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [container, setContainer] = useState("Unread");
    const [messages, setMessages] = useState([]);
    const [messageState, messageActions] = useMessageStore();
    const token = AuthLocalStorage.getToken() as string;
    const user: any = jwt(token);
    let msgService = new MessageApi();

    const { t, i18n } = useTranslation();
    
    useEffect(() => {  
        fetchData();
    }, [totalItems, currentPage, pageSize, container]);


    interface DataType {
        senderId: string;
        email: string;
        message: string;
        senderUserName: string;
        receiverUserName: string;
        sentRec: string;
      }

    const columns: ColumnsType<DataType> = [
        {
            title: t("messages.from"),
            dataIndex: "senderUserName",
            width: '15%',
            render: (senderUserName: any, elem: any) => (
                <Link onClick={() => openMessageModal(elem.senderId, senderUserName)}>{senderUserName}</Link>
            )
        },
        {
            title: t("messages.message"),
            dataIndex: 'content',
            width: '50%',
            render: (content: any) => (
                <p>{content !== undefined
                    ? content?.length > 100
                    ? content.slice(0, 100) + "..."
                    : content + " "
                    : ""}</p>
            )
        },
        {
            title: t("messages.sent"),
            dataIndex: 'messageSent',
            width: '20%',
            render: (messageSent: any) => (
                <TimeAgo
                locale= {i18n.language == 'ua' ? 'uk' : 'en_US'}
                datetime={messageSent}
                />
            )
        },
        {
            width: '10%',
            key: "delete",
            dataIndex: 'id',
            render: (id: any) => (
                <Button danger onClick={() => deleteMessage(id, state.senderName)}>{t("messages.delete")}</Button>
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

    const handleChange = (page : number) => {
        setCurrentPage(page);
    };

    const openMessageModal = (receiverId : string, receiverName: string) => {
        actions.setReceiverId(receiverId);
        actions.setReceiverName(receiverName);
        messageActions.recieveThread(state.senderId, receiverId);
        actions.makeThreadModalVisible();
        setContainer("Inbox");
        console.log(receiverId);
        console.log(state.senderId);
    };

/*
    const openMessageModal = (receiverName : any) => {
        actions.setReceiverName(receiverName);
        messageActions.recieveThread(state.senderName, receiverName);
        actions.makeThreadModalVisible();
        setContainer("Inbox");
    };
*/
    const deleteMessage = async (id : any, userName : any) => {
        if(window.confirm('Are you sure?')){
            await msgService.deleteMessage(id, userName);
            await msgService.getMessages(currentPage, pageSize, container, user.NameIdentifier)
            .then(async (response) => {
            settotalItems(response.data.totalItems);
            setMessages(response.data.pagedList); });
        }
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
            <h2>{t("messages.title")}</h2>
                <div>
                    <Button type="primary" icon={<MailOutlined />} size={'large'} onClick = {onUnread}>
                    {t("messages.unread")}
                    </Button>
                    <Button type="primary" icon={<FolderOutlined />} size={'large'} onClick = {onInbox}>
                    {t("messages.inbox")}
                    </Button>
                    <Button type="primary" icon={<SendOutlined />} size={'large'} onClick = {onOutbox}>
                    {t("messages.outbox")}
                    </Button>
                </div>
                
                <div>
                    {(state.paginatedMessages.totalItems === 0 && !state.paginatedMessages.pagedList) ?
                        <div style={{ display: 'flex', position: 'absolute', top: '25%', left: '47%'}}>
                            <h3>{t("messages.noMessages")}</h3>
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