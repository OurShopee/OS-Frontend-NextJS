// components/CategoryCard.jsx

export default function CategoryCard({
  image,
  bgColor,
}) {
  return (
    <div
      className={`${bgColor} rounded-xl overflow-hidden cursor-pointer h-[132px]`}
    >
      <img
        src={image}
        alt="Card"
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-300 aspect-[168/132]"
      />
    </div>
  );
}
