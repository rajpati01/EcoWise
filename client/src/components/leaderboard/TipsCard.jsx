import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TipsCard() {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Earn More Points</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>• Classify waste items (+1-10 points)</div>
        <div>• Join campaigns (+3 points)</div>
        <div>• Write blog posts (+15 points)</div>
        <div>• Create a campaign (+10 points)</div>
      </CardContent>
    </Card>
  );
}
