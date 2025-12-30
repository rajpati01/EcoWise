import { Upload } from "lucide-react";

const UploadDropzone = ({ getRootProps, getInputProps, isDragActive, maxFileSizeLabel }) => (
  <div
    {...getRootProps()}
    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
      isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary hover:bg-gray-50"
    }`}
    role="button"
    aria-label="Upload waste image"
    tabIndex={0}
  >
    <input {...getInputProps()} aria-label="File input" />
    <div className="space-y-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
        <Upload className="h-8 w-8 text-gray-400" aria-hidden="true" />
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-900">
          {isDragActive ? "Drop your image here" : "Drop your image here"}
        </p>
        <p className="text-gray-600">or click to browse</p>
      </div>
      <p className="text-sm text-gray-500">{maxFileSizeLabel}</p>
    </div>
  </div>
);

export default UploadDropzone;
