export interface StudentAppointment {
  appt_id: string;
  duration: string;
  date: Date;
  type: string;
  location: string;
  cancelled: boolean;
  supporter_name: string;
  supporter_id: number;
  rated: boolean;
}
