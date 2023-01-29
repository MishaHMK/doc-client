export interface IAppointment{
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
    duration?: number;
    doctorId: string;
    patientId: string;
    isApproved?: boolean;
    adminId?: string;
}
