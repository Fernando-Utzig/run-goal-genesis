
import { RunGoalDemo } from "@/components/RunGoalDemo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold text-gray-900">Run Goal Genesis</h1>
          <p className="text-gray-600">Automatically generate challenging running goals</p>
          <div className="mt-4">
            <Button asChild className="bg-[#007bff] hover:bg-[#0056b3]">
              <Link to="/log-run">Log a New Run</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8">
        <RunGoalDemo />
      </main>
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto text-center text-gray-500">
          <p>Run Goal Genesis - Helping you improve with every run</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
