import React, {useEffect, useState, useRef} from 'react';
import AuthorizeApi from "../api/authorizeApi";
import { Button, DatePickerProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DatePicker, Space } from 'antd';
import { useTranslation, Trans } from 'react-i18next';
import { Table} from 'antd';
import AppointmentApi from "../api/appointmentApi";
import jwt from "jwt-decode";
import AuthLocalStorage from "../AuthLocalStorage";
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import fs from 'fs';
import axios, { AxiosError } from "axios";

export const AppointReport: React.FC = () => {
    const { t, i18n } = useTranslation();

    const token = AuthLocalStorage.getToken() as string;
    const user: any = jwt(token);

    const changeLanguage = (lng : any) => {
        i18n.changeLanguage(lng);
    };  

    let appService = new AppointmentApi();  

    const [reports, setReports] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");  

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

   const fetchData = async () => {
      if(startDate != "" && endDate != ""){
          await appService.getAppointmentsReport(user.NameIdentifier, startDate, endDate)
          .then(async (response) => {
              setReports(response.data);
          });
      }
    };

    const exportToExcel = async () => {
      if(startDate != "" && endDate != ""){
          await appService.loadAppointmentsReport(user.NameIdentifier, startDate, endDate)
          .then(async (response) => {
            const url = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Report.xls`;
            link.click();
        });
      }
    };

    const onStartChange: DatePickerProps['onChange'] = (date, dateString) => {
      console.log(date, dateString);
      setStartDate(dateString);
    };

    const onEndChange: DatePickerProps['onChange'] = (date, dateString) => {
      console.log(date, dateString);
      setEndDate(dateString);
    };

    interface DataType {
      id: string;
      doctorName: string;
      PatientName: string;
      Title: string;
      Description: string;
      StartDate: string;
      EndDate: string;
      isApproved: boolean;
    }


    const columns: ColumnsType<DataType> = [

      {
          title: 'Id',
          dataIndex: 'id',
          width: '5%'
      },
      {
          title: t("reportPage.docFullName"),
          dataIndex: 'doctorName',
          width: '15%'
      },
      {
          title: t("reportPage.patFullName"),
          dataIndex: 'patientName',
          width: '15%'
      },
      {
        title: t("reportPage.titleCol"),
        dataIndex: 'title',
        width: '15%'
      },
      {
        title: t("reportPage.description"),
        dataIndex: 'description',
        width: '20%'
      },
      {
        title: t("reportPage.startDate"),
        dataIndex: 'startDate',
        width: '10%'
      },
      {
        title: t("reportPage.endDate"),
        dataIndex: 'endDate',
        width: '10%'
      },
      {
        title: t("reportPage.approved"),
        dataIndex: 'isApproved',
        width: '10%',
        render: (isApproved: any) => (
          (isApproved == true)  ? 
            <CheckCircleOutlined style={{ fontSize: "20px", color: "green", marginLeft: '18%' }}/> :    
            <CloseCircleOutlined style={{ fontSize: "20px", color: "red", marginLeft: '18%' }}/>
      )
      }
    ]

    return (
        <div style = {{marginTop: "3%", marginBottom: "10%"}}>  
          <h2 style = {{ marginBottom: "3%"}}>{t("reportPage.title")}</h2>
          { reports.length < 0 ? (
            <div>
                <DatePicker onChange={onStartChange} />
                <DatePicker onChange={onEndChange} />
            </div>
          ) : (
            <div>
                <DatePicker onChange={onStartChange} />
                <DatePicker onChange={onEndChange} />

                   <Button onClick={exportToExcel} 
                           style={{ background: "#52c41a", borderColor: "green", color: "white" }}> 
                           {t("reportPage.downloadBtn")}
                   </Button>

                   <Table
                        style = {{fontSize: "20px"}}
                        columns={columns}
                        dataSource={reports}>
                   </Table>
            </div>
          )}        
        </div> 
    );
 };