
import { Dashboard } from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
