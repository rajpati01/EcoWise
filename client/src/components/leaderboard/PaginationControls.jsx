import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControls({ page, hasPrev, hasNext, isFetching, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between mt-6">
      <Button variant="outline" size="sm" onClick={onPrev} disabled={!hasPrev || isFetching}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      <span className="text-sm text-gray-500">Page {page}</span>
      <Button variant="outline" size="sm" onClick={onNext} disabled={!hasNext || isFetching}>
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
