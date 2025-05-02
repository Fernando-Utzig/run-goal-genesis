
import { AllRuns } from "@/components/AllRuns";
import { Navbar } from "@/components/Navbar";

const AllRunsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8">
        <AllRuns />
      </div>
    </div>
  );
};

export default AllRunsPage;
