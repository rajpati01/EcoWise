import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";

const EmptyStateCard = memo(({ Icon, title, message }) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        {Icon && <Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" aria-hidden="true" />}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </CardContent>
    </Card>
  );
});

export default EmptyStateCard;
