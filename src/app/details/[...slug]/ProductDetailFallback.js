const skeletonRow = (count = 3) =>
  Array.from({ length: count }).map((_, idx) => (
    <div
      key={idx}
      className="h-4 bg-gray-200 rounded-md"
      style={{ width: `${60 - idx * 10}%` }}
    />
  ));

const ProductDetailFallback = () => {
  return (
    <div className="container mx-auto px-4 py-10 animate-pulse">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gray-200 rounded-2xl h-[420px]" />
        <div className="space-y-5">
          <div className="h-6 bg-gray-200 rounded-md w-2/3" />
          <div className="space-y-3">{skeletonRow(4)}</div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded-full" />
            <div className="h-10 w-32 bg-gray-200 rounded-full" />
          </div>

          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded-md w-1/3" />
            <div className="h-28 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <div className="h-5 bg-gray-200 rounded-md w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white shadow-sm border border-gray-100 rounded-2xl p-4 space-y-3"
            >
              <div className="h-32 bg-gray-100 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailFallback;

