import React, {ChangeEvent, FC, useState, useEffect} from 'react';
import { useUserStore } from '../stores/user.store';
import { Card, List, Pagination, Input, Space, Select, Button, Rate, Tooltip  } from 'antd';
import { PlusCircleOutlined, CommentOutlined, UpOutlined, DownOutlined, StarOutlined} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import UserApi from "../api/userApi";
import AuthLocalStorage from '../AuthLocalStorage';
import jwt_decode from "jwt-decode";
import { MessageThreadModal } from './MessageThreadModal';
import { useSignalrStore } from '../stores/signalr.store';
import { useMessageStore } from "../stores/message.store";
import { ReviewModal } from './ReviewModal';
import Link from 'antd/es/typography/Link';
import { useTranslation, Trans } from 'react-i18next';
import { IListElement } from '../interfaces/IListElement';

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
    const [users, setUsers] = useState(Array());
    const [usersOnline, setUsersOnline] = useState<any>();
    const [messageState, messageActions] = useMessageStore();

    const { t, i18n } = useTranslation();

    useEffect(() => {  
        fetchData();
        console.log(users);
    }, [currentPage, searchName, orderBy, selectedSpec, usersOnline]);

    const fetchData = async () => {
        const decoded: any = jwt_decode(token);
        setCurrentRole(decoded.Role);

        let response = await userService.getPagedUsers(currentPage, pageSize, searchName, selectedSpec, sortItem, orderBy);

        setUsers(response.data.pagedList);
        settotalItems(response.data.totalItems);
        setUsersOnline(signalState.onlineUsers);
    };
        

    const handleChange = (page : any) => {
        setCurrentPage(page);
    };

    const onSearch = (value: string) => {
        setSearchName(value);
    };

    const handleSelect = async (value : any) => {
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

    const goToReviews = (doctorId : string, doctorName: string) => {
        state.docIdToReview = doctorId;
        state.docNameToReview = doctorName;
        navigate("../reviews/" + doctorId, { replace: true });    
    };


    const openMessageModal = (receiverName: any) => {
        messageActions.recieveThread(state.senderName, state.receiverName);
        actions.setReceiverName(receiverName);
        actions.makeThreadModalVisible();
    };

    const openReviewModal  = (doctorId: any, doctorName: any, surname: any, fathername: any) => {
        state.docIdToReview = doctorId;
        state.docNameToReview = doctorName;
        state.docFatherNameToReview = fathername;
        state.docSurnameToReview = surname;
        actions.makeReviewModalVisible();
    };  
    
    const transSpecToUA = (arg: string) : string => {          
        var response = "";
        switch (arg) {
            case "Pediatrics":
                response = "Педіатрія";
                break;
            case "Neurology":
                response = "Нейрологія";
                break;
            case "Cardiology":
                response = "Кардіологія";
                break;
            case "Radiology":
                response = "Радіологія";
                break;
            default:
                console.log("No such day exists!");
                break;
        }
        return response;
    } 

    const specsUA: IListElement[] = [
        {label: "Усі", value: "Any"},
        {label: "Педіатрія", value: "Pediatrics"},
        {label: "Нейрологія", value: "Neurology"},
        {label: "Кардіологія", value: "Cardiology"},
        {label: "Радіологія", value: "Radiology"},
    ]

    const specsEn: IListElement[] = [
        {label: "Any", value: "Any"},
        {label: "Pediatrics", value: "Pediatrics"},
        {label: "Neurology", value: "Neurology"},
        {label: "Cardiology", value: "Cardiology"},
        {label: "Radiology", value: "Radiology"},
    ]


    return (
        <div style = {{marginTop: "3%", marginBottom: "3%"}}> 
            <h2 style = {{marginBottom: "2%"}}>{t("doctorPage.title")}</h2>

            <Space direction="horizontal">

            <Button onClick={sortNameByAsc}><UpOutlined /></Button>
            <Button onClick={sortNameByDesc}><DownOutlined /></Button>

               <Search
                    placeholder={t("doctorPage.placeholder").toString()}
                    allowClear
                    enterButton
                    size="large"
                    onSearch={onSearch}
                />

                <Select
                    style={{ width: 140 }}
                    onChange={handleSelect}
                    options={i18n.language == 'ua' ? specsUA.map((sp : any) => ({ label: sp.label, value: sp.value })) :
                                                     specsEn.map((sp : any) => ({ label: sp.label, value: sp.value}))}
                    defaultValue = {i18n.language == 'ua' ? "Cпеціальність": "Speciality"}
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
                        <Card title=
                        {i18n.language == 'ua' ? 
                        item.surname + " " + item.name + " " + item.fathername + " (" + transSpecToUA(item.speciality) + ") "
                        : item.surname + " " + item.name + " " + item.fathername + " (" + item.speciality + ") "}
                              extra={(usersOnline.includes(item.id))  
                                         ?  <h4 style={{color: '#21bb4b'}}>{t("doctorPage.online")}</h4>  
                                         : <h4>{t("doctorPage.offline")}</h4> } 
                              bordered = {true}
                              style = {{boxShadow: '10px 5px 5px grey'}}>
                        
                            <i>{item.introduction}</i>
                            <br></br>
                            <br></br>
                               <Rate disabled = {true} allowHalf value={item.averageRate}></Rate>
                            <br></br>
                            <Tooltip placement="right" title={t("doctorPage.fullTooltip")}>
                               <Link onClick={() => goToReviews(item.id, item.name)}>{t("doctorPage.reviews")}</Link>
                            </Tooltip>
                        </Card>
                        :
                        <Card title={ item.surname + " " + item.name + " " + item.fathername +
                                     " (" + transSpecToUA(item.speciality)+ ") " }
                            extra={(usersOnline.includes(item.id)) ? 
                                <h4 style={{color: '#21bb4b'}}>{t("doctorPage.online")}</h4> : 
                                <h4>{t("doctorPage.offline")}</h4> } 
                            actions={[
                                <Tooltip placement="top" title={t("doctorPage.chatTooltip")}>
                                    <CommentOutlined  key="chat"  onClick={() => openMessageModal(item.name)}/>
                                </Tooltip>,
                                <Tooltip placement="top" title={t("doctorPage.calTooltip")}>
                                    <PlusCircleOutlined key="app" onClick={() => goToAppoint(item.id, item.name)}/>
                                </Tooltip>,
                                <Tooltip placement="top" title={t("doctorPage.revTooltip")}>
                                    <StarOutlined key="review" onClick={() => 
                                        openReviewModal(item.id, item.name, item.surname, item.fathername)}/>
                                </Tooltip>

                            ]}
                            bordered = {true}   
                            style = {{boxShadow: '10px 5px 5px grey', width: '700px'}}
                            >
                            <i>{item.introduction}</i>
                            
                            <br></br>
                            <br></br>
                                <Rate disabled = {true} allowHalf value={item.averageRate}></Rate>
                            <br></br>
                            <Tooltip placement="right" title={t("doctorPage.fullTooltip")}>
                               <Link onClick={() => goToReviews(item.id, item.name)}>{t("doctorPage.reviews")}</Link>
                            </Tooltip>
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
           <ReviewModal/>
       </div>
    );
 };

