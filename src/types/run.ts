
export interface RunData {
  id: string;
  userId: string;
  date: Date;
  distance: number; // in kilometers
  duration: number; // in seconds
  notes?: string;
  status: 'Completed' | 'In Progress' | 'Cancelled';
  state_id?: string;
  state_name?: string;
  city_id?: string;
  city_name?: string;
  location?: string; // For backward compatibility
}
