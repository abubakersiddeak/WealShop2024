export default function ProductSkeleton() {
  return (
    <div className="w-70 md:w-80 bg-white overflow-hidden shrink-0 animate-pulse">
      <div className="h-90 md:h-120 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}
