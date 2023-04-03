import {useEffect, useRef} from "react"
import React, { useState } from 'react';
import { Modal, Form, List, Input, Button} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useUserStore } from '../stores/user.store';
import { useMessageStore } from "../stores/message.store";
import TimeAgo from 'timeago-react';
import { SendOutlined , DownOutlined} from '@ant-design/icons';
import { ICreateMessage } from "../interfaces/ICreateMessage";
import AuthLocalStorage from "../AuthLocalStorage";

export const MessageThreadModal: React.FC = () => { 

    const token = AuthLocalStorage.getToken() as string;
    const [sendForm] = useForm();
    const [state, actions] = useUserStore();
    const [messageState, messageActions] = useMessageStore();

    const [scrollNumber, setScrollNumber] = useState(0);

    const messagesEndRef = React.createRef<HTMLDivElement>();

    useEffect(() => {  
        setScrollNumber(messageState.messageThreadSource.length * 100);
        scrollToDown2();
    }, [state.senderName, state.receiverName]);

   useEffect(() => {  
      if(state.IsThreadShown == true){
        setScrollNumber(messageState.messageThreadSource.length * 100);
      }
    }, [state.IsThreadShown]); 

    useEffect(() => {  
      setScrollNumber(messageState.messageThreadSource.length * 100);
      scrollToDown2();
   }, []);

    const scrollToDown = async () => {
        messagesEndRef.current?.scrollTo(0, 1000000000);
  };

  const scrollToDown2 = async () => {
    if (messagesEndRef) {
      messagesEndRef.current?.addEventListener('DOMNodeInserted', (event: { currentTarget: any; }) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
};
    const handleCancel = () => {
         // messageActions.stopHubConncetion();
          actions.makeThreadModalInvisible();
    };

    const handleSubmit = async (values: any) => {
        const messageToCreate : ICreateMessage = {
          content: values.content,
          senderName: state.senderName,
          recipientName: state.receiverName
        }

        messageActions.sendMessage(messageToCreate);
        setTimeout(() => messageActions.receiveUnread(state.receiverName), 300);
        sendForm.setFieldsValue({
          content: "",
        });

        messageActions.recieveThread(state.senderName, state.receiverName);

        scrollToDown2();
  };


    return(  
        <Modal title= {state.receiverName}
           open={state.IsThreadShown} 
           onCancel={handleCancel}
           footer={ <Form form = {sendForm} onFinish={handleSubmit}>
                      <Input.Group compact>
                        <br></br>
                        <Button onClick={scrollToDown} shape="circle"
                                style={{ marginRight: 20 }} ><DownOutlined /></Button>
                        <Form.Item name="content">
                          <Input placeholder = 'Write a message...' style={{ width: 300, textAlign: "left" }}/>
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
                                          <TimeAgo datetime={item.messageSent}/>
                                  </div>}
                              description={item.content}/>
                          </List.Item>
                      )}
                    />   
      
            </div>     
        </Modal>)
}
