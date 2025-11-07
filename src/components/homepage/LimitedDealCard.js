// components/deals/LimitedDealCard.js
import Image from "next/image";
import Link from "next/link";
import { MediaQueries } from "../utils";

export default function LimitedDealCard({ deal }) {
  const { isMobile } = MediaQueries();
  return (
    <Link href={deal?.url}>
      <div className="relative w-full h-[136px]">
        <Image
          src={isMobile ? deal?.mobileImage : deal?.desktopImage}
          alt={deal?.title}
          fill
          className="object-cover aspect-[165/136] cursor-pointer rounded-[10px]"
        />
      </div>
    </Link>
  );
}
