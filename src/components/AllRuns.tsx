
import { AllRunsList } from "./runs/AllRunsList";
import { useAllRunsData } from "@/hooks/useAllRunsData";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function AllRuns() {
  const { data: runs = [], isLoading, refetch } = useAllRunsData();

  const handleDeleteRun = async (runId: string) => {
    try {
      const { error } = await supabase
        .from('runs')
        .delete()
        .eq('id', runId);

      if (error) throw error;

      toast.success('Run deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting run:', error);
      toast.error('Failed to delete run');
    }
  };

  return (
    <div className="p-6 bg-[#F0F0F0] rounded-lg space-y-6">
      <h1 className="text-3xl font-bold mb-6">All User Runs</h1>
      <AllRunsList 
        runs={runs} 
        loading={isLoading} 
        onDeleteRun={handleDeleteRun}
      />
    </div>
  );
}
