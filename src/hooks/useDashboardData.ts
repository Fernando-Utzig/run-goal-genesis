
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { RunData } from "@/types/run";

export function useDashboardData(userId: string) {
  return useQuery({
    queryKey: ['dashboard-data', userId],
    queryFn: async () => {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      const { data: runs, error } = await supabase
        .from('runs')
        .select('*')
        .eq('user_id', userId)
        .gte('date', firstDayOfMonth.toISOString())
        .order('date', { ascending: true });
        
      if (error) throw error;
      
      return runs || [];
    },
  });
}
