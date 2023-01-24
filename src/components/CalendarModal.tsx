import {useState, useEffect} from "react"
import { Modal, Form, Input, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useUserStore } from '../stores/user.store';

export const CalendarModal: React.FC = () =>{ 

    //const [form] = useForm();
    //const [isModalOpen, setIsModalOpen] = useState(false);
    const [state, actions] = useUserStore();

     useEffect(() => {  

     });

      const handleOk = () => {
        actions.makeModalInvisible();
      };
    
      const handleCancel = () => {
        actions.makeModalInvisible();
      };

     return(
            <Modal title="Basic Modal" open={state.IsShown} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>     
     ) 

}
