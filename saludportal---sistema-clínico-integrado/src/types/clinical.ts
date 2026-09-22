export type ScreenView = 
  | 'dashboard' 
  | 'search-booking' 
  | 'booking-auth' 
  | 'my-appointments' 
  | 'records' 
  | 'profile' 
  | 'login' 
  | 'register' 
  | 'recovery' 
  | 'reset-password';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  subspecialty?: string;
  rmc: string;
  university?: string;
  rating: number;
  reviewsCount: number;
  room: string;
  facility: string;
  facilityAddress: string;
  avatarUrl: string;
  availableDays: string[];
  slots: { [dateKey: string]: string[] };
  isVirtual?: boolean;
}

export interface Appointment {
  id: string;
  code: string;
  doctorName: string;
  specialty: string;
  subspecialty?: string;
  doctorAvatar: string;
  room: string;
  facility: string;
  facilityAddress: string;
  date: string;
  time: string;
  duration: string;
  copayAmount: string;
  copayStatus: string;
  status: 'confirmada' | 'en_revision' | 'reprogramacion' | 'cancelada';
  statusLabel: string;
  preparationNotes?: string;
  authorizationNumber?: string;
  type: 'general' | 'especializada' | 'telemedicina';
  isUrgent?: boolean;
}

export interface LabResult {
  id: string;
  title: string;
  date: string;
  issuedBy: string;
  category: 'laboratorio' | 'cardiologia' | 'hematologia' | 'radiologia';
  isNew?: boolean;
  status: 'Disponible' | 'En proceso';
  summary: string;
  downloadUrl?: string;
}

export interface PatientProfile {
  name: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  eps: string;
  plan: string;
  affiliateType: string;
  historyNumber: string;
  assignedFacility: string;
  avatarUrl: string;
  copayStandard: string;
}
