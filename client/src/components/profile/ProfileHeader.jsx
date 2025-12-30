import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Award, Crown } from "lucide-react";

export default function ProfileHeader({ userName, userEcoPoints, onCheckCertificate, onGenerateReport }) {
  const isEcoMaster = userEcoPoints >= 1000;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          {isEcoMaster && (
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 px-3 py-1 text-sm font-semibold shadow-lg">
              <Crown className="h-4 w-4 mr-1" />
              Eco Master
            </Badge>
          )}
        </div>
        <p className="text-xl text-gray-600">Track your eco-journey and manage your account</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {isEcoMaster && (
          <Button 
            variant="default" 
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold shadow-lg"
            onClick={onCheckCertificate}
          >
            <Award className="h-4 w-4 mr-2" />
            Get Eco Master Certificate
          </Button>
        )}
        
        <Button variant="outline" onClick={onGenerateReport}>
          <FileText className="h-4 w-4 mr-2" />
          Generate Activity Report
        </Button>
      </div>
    </div>
  );
}