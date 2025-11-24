// components/deals/DealCard.js
import Link from "next/link";
import { MediaQueries } from "../utils";

export default function DealCard({ deal }) {
  const { isMobile } = MediaQueries();
  return (
    <Link href={deal?.url}>
      <div className="relative w-full h-[126px] flex items-center justify-center">
        <img src={isMobile ? deal?.mobileImage : deal?.desktopImage}
          className="object-cover aspect-[178/126] cursor-pointer rounded-lg w-full h-full"
          loading="lazy"
          alt={deal?.title || "Deal"} />
      </div>
    </Link>
  );
}
