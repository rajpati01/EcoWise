const ClassificationHeader = ({
  title = "Waste Classification",
  subtitle = "Use our AI-powered classifier to identify your waste and get recycling recommendations. Earn eco points for every classification!",
}) => (
  <div className="text-center space-y-4">
    <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
    {subtitle && (
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
    )}
  </div>
);

export default ClassificationHeader;
