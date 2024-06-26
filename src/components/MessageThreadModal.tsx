import {useEffect, useRef} from "react"
import React, { useState } from 'react';
import { Modal, Form, List, Input, Button} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useUserStore } from '../stores/user.store';
import { useMessageStore } from "../stores/message.store";
import TimeAgo from 'timeago-react';
import { SendOutlined , DownOutlined, RestOutlined} from '@ant-design/icons';
import { ICreateMessage } from "../interfaces/ICreateMessage";
import { useTranslation, Trans } from 'react-i18next';

export const MessageThreadModal: React.FC = () => { 

    const [sendForm] = useForm();
    const [state, actions] = useUserStore();
    const [messageState, messageActions] = useMessageStore();
    const messagesEndRef = React.createRef<HTMLDivElement>();

    const { t, i18n } = useTranslation();

   useEffect(() => {  
    messageActions.recieveThread(state.senderId, state.receiverId);
      if(state.IsThreadShown == true){
        scrollToDown();
      }
    }, [state.IsThreadShown]); 

   useEffect(() => {  
    messageActions.recieveThread(state.senderId, state.receiverId);
    scrollToDown();
   }, []);


  const scrollToDown = async () => {
        messagesEndRef.current?.scrollTo(0, 1000000000);
  };

  const scrollOnSend = async () => {
    if (messagesEndRef) {
      messagesEndRef.current?.addEventListener('DOMNodeInserted', (event: { currentTarget: any; }) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  };

    const handleCancel = () => {
          actions.makeThreadModalInvisible();
    };

    const handleSubmit = async (values: any) => {
        const messageToCreate : ICreateMessage = {
          content: values.content,
          senderName: state.senderName,
          recipientName: state.receiverName,
          senderId: state.senderId,
          recipientId: state.receiverId,
        }

        messageActions.sendMessage(messageToCreate);
        
        sendForm.setFieldsValue({
          content: "",
        });

        messageActions.recieveThread(state.senderId, state.receiverId);

        scrollOnSend();
  };

    const deleteMessage = async (id : any, userName : any) => {
      if(window.confirm('Are you sure?')){
          messageActions.removeMessage(id, userName);
          messageActions.recieveThread(state.senderId, state.receiverId);
          console.log("ddddd");
      }
  };

    return(  
        <Modal title= {state.receiverName}
           open={state.IsThreadShown} 
           onCancel={handleCancel}
           footer={ <Form form = {sendForm} onFinish={handleSubmit}>
                    <Input.Group compact> <br></br>
                      <Button onClick={scrollToDown} shape="circle"
                              style={{ marginRight: 20 }} ><DownOutlined /></Button>
                        <Form.Item name="content">
                          <Input placeholder = {t("messages.thread.placeholder").toString()} 
                                style={{ width: 300, textAlign: "left" }}/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit"
                                style={{ marginRight: 60 }} ><SendOutlined /></Button>
                      </Input.Group>
                  </Form>}>

            <div ref={messagesEndRef} 
              style={{
                  height: 400,
                  overflow: 'auto',
                  padding: '0 16px'
                }}> 
                    <List 
                      dataSource={messageState.messageThreadSource}
                      renderItem={(item: any) => (
                      <List.Item key={item.senderId}>
                        <List.Item.Meta
                          style={{ width: 'calc(100% - 60px)' }}
                          title={<div><a>{item.senderUserName + " "}</a> 
                                <TimeAgo
                                    locale= {i18n.language == 'ua' ? 'uk' : 'en_US'}
                                    datetime={item.messageSent}
                                    style = {{paddingRight: "3%"}}/>

                                <Button danger shape="circle"
                                        onClick={() => deleteMessage(item.id, state.senderName)}>
                                        <RestOutlined /></Button>
                                  </div>}
                              description={item.content}/>
                          </List.Item>
                      )}/>   
            </div>     
        </Modal>)
}
