// components/deals/LimitedDealCard.js
import Image from "next/image";
import Link from "next/link";

export default function LimitedDealCard({ deal }) {
  return (
    <Link href={`/limited-deals/${deal.id}`}>
       <div className="relative w-full h-[136px]">
        <Image
          src={deal.productImage}
          alt={deal?.title}
          fill
          className="object-cover aspect-[165/136] cursor-pointer rounded-[10px]"
        />
      </div>
    </Link>
  );
}
