// components/CategoryCard.jsx
import { useRouter } from "next/navigation";
import { MediaQueries } from "../utils";

export default function CategoryCard({
  url,
  desktopImage,
  mobileImage,
  bgColor,
}) {
const router = useRouter()
const {isMobile }= MediaQueries()
  return (
    <div
      className={`flex justify-center items-center rounded-xl overflow-hidden cursor-pointer h-[132px]`}
    >
      <img src={isMobile ? mobileImage : desktopImage}
        alt="Card"
        onClick={() => {
          router.push(url);
        }}
        loading="lazy"
      />
    </div>
  );
}
