import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { format } from "date-fns";

const CATEGORY_COLORS = {
  plastic: "bg-blue-100 text-blue-800",
  paper: "bg-green-100 text-green-800",
  glass: "bg-purple-100 text-purple-800",
  metal: "bg-gray-100 text-gray-800",
  organic: "bg-amber-100 text-amber-800",
  electronic: "bg-red-100 text-red-800",
};

const getCategoryColor = (category) => CATEGORY_COLORS[category] || "bg-gray-100 text-gray-800";

const ClassificationHistoryItem = ({ item }) => {
  // Ensure imageUrl is properly constructed
  const imageUrl = item.imageUrl || '';
  const hasValidImage = imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/'));

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      {hasValidImage ? (
        <img
          src={imageUrl}
          alt="Classified waste"
          className="w-16 h-16 object-cover rounded-lg"
          onError={(e) => {
            // eslint-disable-next-line no-console
            console.log("Image failed to load:", imageUrl);
            e.currentTarget.src = "/placeholder-image.png";
            e.currentTarget.onerror = null; // Prevent infinite loop
          }}
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-xs">No image</span>
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
          <span className="text-sm text-gray-600">{item.confidence}% confidence</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {format(new Date(item.createdAt), "MMM dd, yyyy at h:mm a")}
        </p>
      </div>
      <div className="text-right">
        <div className="flex items-center space-x-1">
          <Award className="h-4 w-4 text-amber-600" />
          <span className="font-semibold text-amber-600">+{item.pointsEarned}</span>
        </div>
      </div>
    </div>
  );
};

export default ClassificationHistoryItem;
