
export interface RunData {
  id: string;
  userId: string;
  date: Date;
  distance: number; // in kilometers
  duration: number; // in seconds
  notes?: string;
  status: 'Completed' | 'In Progress' | 'Cancelled';
}
