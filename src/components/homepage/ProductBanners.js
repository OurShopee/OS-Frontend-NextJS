// components/deals/ProductBanners.js
import DynamicBanners from "./DynamicBanners";

export default function ProductBanners() {
  return (
    <div className="flex flex-col gap-2.5">
      {/* {banners.map((banner) => (
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
      ))} */}
      <DynamicBanners
        bannerKey="mainBanner1"
        enableAos={true}
        className="mt-0 aspect-[363/136] lg:aspect-[449/170] object-cover h-[140px] lg:h-[170px] rounded-[10px] overflow-hidden"
      />
      <DynamicBanners
        bannerKey="mainBanner2"
        enableAos={true}
        className="mt-0 aspect-[363/136] lg:aspect-[449/170] object-cover h-[140px] lg:h-[170px] rounded-[10px] overflow-hidden"
      />
    </div>
  );
}
