
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { RunData } from "@/types/run";

export function useAllRunsData() {
  return useQuery({
    queryKey: ['all-runs-data'],
    queryFn: async () => {
      const { data: runs, error } = await supabase
        .from('runs')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) {
        console.error('Error fetching all runs data:', error);
        throw error;
      }
      
      console.log('Fetched all runs:', runs);
      return runs || [];
    },
  });
}
