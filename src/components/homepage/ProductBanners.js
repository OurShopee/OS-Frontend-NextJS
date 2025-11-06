// components/deals/ProductBanners.js
import Image from "next/image";
import Link from "next/link";

export default function ProductBanners({ banners }) {
  return (
    <div className="flex flex-col gap-2.5">
      {banners.map((banner) => (
        <Link key={banner.id} href={`/products/${banner.id}`}>
          <div className="relative w-full h-[170px] rounded-[10px] overflow-hidden cursor-pointer">
            <Image
              src={banner.image}
              alt={banner.alt}
              fill
              className="aspect-[449/170]"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
