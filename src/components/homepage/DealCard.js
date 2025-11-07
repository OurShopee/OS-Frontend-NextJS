// components/deals/DealCard.js
import Image from "next/image";
import Link from "next/link";
import { MediaQueries } from "../utils";

export default function DealCard({ deal }) {
  const { isMobile } = MediaQueries();
  return (
    <Link href={deal?.url}>
      <div className="relative w-full h-[126px]">
        <Image
          src={isMobile ? deal?.mobileImage : deal?.desktopImage}
          fill
          className="object-cover aspect-[178/126] cursor-pointer rounded-lg"
        />
      </div>
    </Link>
  );
}
