import { Button } from "@/components/ui/button";

const SampleImages = ({ samples, onSampleClick }) => (
  <div className="space-y-2">
    <p className="text-sm font-medium text-gray-700">Try with sample images:</p>
    <div className="flex flex-wrap gap-2" role="list" aria-label="Sample images">
      {samples.map((sample) => (
        <Button
          key={sample.type}
          variant="outline"
          size="sm"
          onClick={() => onSampleClick(sample.type)}
          aria-label={`Load sample ${sample.name} image`}
          role="listitem"
        >
          <span className="mr-1" aria-hidden="true">{sample.icon}</span>
          {sample.name}
        </Button>
      ))}
    </div>
  </div>
);

export default SampleImages;
