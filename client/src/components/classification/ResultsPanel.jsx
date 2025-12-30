import { Badge } from "@/components/ui/badge";
import { Recycle, Award } from "lucide-react";
import EnvironmentalImpactNotice from "./EnvironmentalImpactNotice";
import { getWasteGuide, getCategoryBadgeVariant } from "@/utils/wasteHelpers";

const ResultsPanel = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center" role="status">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.13-3.36L23 10"/><path d="M20.49 15a9 9 0 01-14.13 3.36L1 14"/></svg>
        </div>
        <p className="text-gray-600">Upload an image to see classification results</p>
      </div>
    );
  }

  const category = result.category || "unknown";
  const impact = category !== "unknown" ? getWasteGuide(category)?.impact : null;

  return (
    <div className="space-y-6" role="region" aria-label="Classification results">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Recycle className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 capitalize">{category}</h3>
            <p className="text-sm text-gray-600">Confidence: {result.confidence}%</p>
          </div>
        </div>
        <Badge variant={getCategoryBadgeVariant(category)} className="mb-4">Classification Complete</Badge>

        {Array.isArray(result.instructions) && result.instructions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Recycling Instructions:</h4>
            <ul className="text-sm text-gray-600 space-y-1" role="list" aria-label="Recycling instructions">
              {result.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-2" role="listitem">
                  <span className="text-primary" aria-hidden="true">•</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-primary/20 mt-4">
          <span className="text-sm font-medium text-gray-700">Eco Points Earned:</span>
          <div className="flex items-center space-x-1" role="status" aria-label={`Earned ${result.pointsEarned} eco points`}>
            <Award className="h-4 w-4 text-amber-600" aria-hidden="true" />
            <span className="text-lg font-bold text-amber-600">+{result.pointsEarned}</span>
          </div>
        </div>
      </div>

      {category !== "unknown" && <EnvironmentalImpactNotice message={impact || "Proper disposal helps protect our environment."} />}
    </div>
  );
};

export default ResultsPanel;
