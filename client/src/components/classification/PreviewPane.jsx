import { Button } from "@/components/ui/button";
import { Loader2, Recycle } from "lucide-react";

const PreviewPane = ({ previewUrl, selectedFile, onClassify, onReset, isClassifying }) => {
  if (!previewUrl) return null;
  return (
    <div className="space-y-4" role="region" aria-label="Image preview">
      <div className="relative">
        <img
          src={previewUrl}
          alt="Uploaded waste preview"
          className="w-full h-48 object-cover rounded-lg"
          loading="lazy"
        />
        {selectedFile && (
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">{selectedFile.name}</span>
            <span className="text-gray-400 ml-2">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <Button onClick={onClassify} disabled={isClassifying} className="flex-1" aria-label={isClassifying ? "Classifying waste" : "Classify uploaded waste"}>
          {isClassifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Classifying...
            </>
          ) : (
            <>
              <Recycle className="mr-2 h-4 w-4" aria-hidden="true" />
              Classify Waste
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onReset} disabled={isClassifying} aria-label="Reset and upload new image">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default PreviewPane;
