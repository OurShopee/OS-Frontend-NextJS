// components/PromoBanner.jsx
import Image from "next/image";

export default function PromoBanner({
  title,
  subtitle,
  label,
  badge,
  buttonText,
  image,
  gradient,
  textColor,
  url,
  hasBabyBottle,
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl overflow-hidden relative cursor-pointer group hover:shadow-xl transition-all`}
    >
      {/* Badge */}
      <div className="absolute top-4 right-4 bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-bold z-10 shadow-md">
        {badge}
      </div>

      {/* Content Container */}
      <div className="relative p-6 min-h-[280px] flex flex-col">
        {/* Text Content */}
        <div className="mb-auto">
          {label && (
            <p
              className={`${textColor} text-xs font-semibold mb-1 uppercase tracking-wide`}
            >
              {label}
            </p>
          )}
          <h3
            className={`${textColor} text-3xl font-black uppercase tracking-tight mb-1`}
          >
            {title}
          </h3>
          <p className={`${textColor} text-sm font-medium uppercase`}>
            {subtitle}
          </p>
          {url && <p className="text-white text-xs mt-2">{url}</p>}
        </div>

        {/* Product Image */}
        {image && (
          <div className="relative h-40 mt-4">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}

        {/* Baby Bottle Decoration */}
        {hasBabyBottle && (
          <div className="absolute bottom-6 right-6 w-16 h-20">
            <Image
              src="/images/baby-bottle.png"
              alt="Baby bottle"
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* Button */}
        {buttonText && (
          <button className="mt-4 bg-white text-gray-900 font-bold px-6 py-2 rounded-full text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 w-fit">
            {buttonText}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
