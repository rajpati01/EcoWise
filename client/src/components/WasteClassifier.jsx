import { useState, useCallback, useEffect, memo } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wasteService } from "@/services/wasteService";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import UploadDropzone from "@/components/classification/UploadDropzone";
import PreviewPane from "@/components/classification/PreviewPane";
import SampleImages from "@/components/classification/SampleImages";
import ResultsPanel from "@/components/classification/ResultsPanel";
import { Camera, CheckCircle } from "lucide-react";

// Constants
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
};

const SAMPLE_IMAGES = [
  { name: "Plastic Bottle", type: "plastic",},
  { name: "Paper", type: "paper", },
  { name: "Organic Waste", type: "organic",},
  { name: "Glass", type: "glass", },
];

const WasteClassifier = memo(() => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const classifyMutation = useMutation({
    mutationFn: (file) => wasteService.classifyWaste(file),
    onSuccess: (data) => {
      // console.log("Frontend received data:", data);
      const result = {
        category: data.category || "unknown",
        confidence: data.confidence || 0,
        instructions: data.instructions || [],
        pointsEarned: data.pointsEarned || 0,
      };

      setClassificationResult(result);

      // Update user eco points (if updateUser is available)
      if (updateUser && typeof updateUser === "function") {
        updateUser((prev) => ({
          ...prev,
          ecoPoints: (prev?.ecoPoints || 0) + result.pointsEarned,
        }));
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["/api/waste-classifications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/user"],
      });

      toast({
        title: "Classification Complete!",
        description: `You earned ${result.pointsEarned} eco points!`,
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to classify waste. Please try again.";

      toast({
        title: "Classification Failed",
        description: message,
        variant: "destructive",
      });

      console.error("Classification error:", error);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        let errorMessage = "File rejected";

        if (rejection.errors[0]?.code === "file-too-large") {
          errorMessage = `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          errorMessage =
            "Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).";
        }

        toast({
          title: "Upload Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Handle accepted file
      const file = acceptedFiles[0];
      if (file) {
        // Revoke previous preview URL to prevent memory leak
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setClassificationResult(null);
      }
    },
    [previewUrl, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: false,
  });

  const handleClassify = useCallback(() => {
    if (selectedFile) {
      classifyMutation.mutate(selectedFile);
    }
  }, [selectedFile, classifyMutation]);

  const handleReset = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setClassificationResult(null);
  }, [previewUrl]);

  const handleSampleClick = useCallback(
    (sampleType) => {
      toast({
        title: "Sample Image",
        description: `Sample ${sampleType} image would load here in production`,
      });
    },
    [toast]
  );

  return (
    <div
      className="space-y-8"
      role="main"
      aria-label="Waste classification tool"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          AI Waste Classifier
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload an image of your waste and our AI will classify it instantly,
          providing recycling recommendations and eco points.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" aria-hidden="true" />
              <span>Upload Image</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dropzone */}
            <UploadDropzone
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
              maxFileSizeLabel={`PNG, JPG, GIF, WebP up to ${MAX_FILE_SIZE_MB}MB`}
            />

            {/* Preview */}
            <PreviewPane
              previewUrl={previewUrl}
              selectedFile={selectedFile}
              onClassify={handleClassify}
              onReset={handleReset}
              isClassifying={classifyMutation.isPending}
            />

            {/* Sample Images */}
            <SampleImages
              samples={SAMPLE_IMAGES}
              onSampleClick={handleSampleClick}
            />
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" aria-hidden="true" />
              <span>Classification Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResultsPanel result={classificationResult} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default WasteClassifier;
