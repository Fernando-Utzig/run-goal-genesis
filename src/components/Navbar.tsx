
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="bg-[#F97316] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Run Goal Genesis
            </Link>
          </div>
          <div className="flex space-x-4">
            <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-[#FB923C]">
              <Link to="/">Home</Link>
            </Button>
            <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-[#FB923C]">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-[#FB923C]">
              <Link to="/log-run">Log Run</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
