// components/deals/DealCard.js
import Image from "next/image";
import Link from "next/link";

export default function DealCard({ deal }) {
  return (
    <Link href={`/deals/${deal.id}`}>
      <div className="relative w-full h-[126px]">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          className="object-cover aspect-[178/126] cursor-pointer rounded-lg"
        />
      </div>
    </Link>
  );
}
