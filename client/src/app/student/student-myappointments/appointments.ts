export interface Appointment {
  appt_id: string;
  duration: string;
  date: Date;
  type: string;
  supporter: string;
  location: string;
  cancelled: boolean;
}
