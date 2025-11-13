import { useEffect, useState } from "react";
import { clearance_saleApi, getSectionPagesApi } from "../../services/Apis";
import DesktopView from "./DesktopView";
import { MediaQueries } from "../../components/utils";
import MobileView from "./MobileView";
import AOS from "aos";
import "aos/dist/aos.css";
import { pushToDataLayer } from "../../components/utils/dataUserpush";
import { useSelector } from "react-redux";

const ElevenSale = () => {
  const { isMobile } = MediaQueries();
  const [saleData, setSaleData] = useState(null);
  const [productsAtOne, setProductsAtOne] = useState([]);
  const [clearanceItems, setClearanceItems] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [sectionId, setSectionId] = useState();
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );
  const [schoolEssential, setSchoolEssential] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const res = await getSectionPagesApi(sectionId);
      if (res.data.status === "success") {
        setSaleData(res.data.data);
      }
    };
    const getOneAed = async () => {
      const data = await clearance_saleApi(1, 20);
      if (data?.data?.status === "success") {
        setProductsAtOne(data?.data?.data?.top_items || []);
        setClearanceItems(data?.data?.data?.items || []);
      }
    };
    if (sectionId) {
      getData();
    }
    getOneAed();
  }, [sectionId]);

  useEffect(() => {
    const id = currentcountry.nav_items.find((i) => i.id === 11)?.section_id;
    setSectionId(id);
  }, [currentcountry]);
  useEffect(() => {
    const sectionData = saleData?.other_section;
    
    const topBrands = sectionData?.find(
      (d) => d.heading === "Top Brands"
    )?.items;
    const schoolEssential = sectionData?.find(
      (d) => d.heading === "School Essentials"
    )?.items;
    setTopBrands(topBrands || []);
    setSchoolEssential(schoolEssential || []);
  }, [saleData]);


  useEffect(() => {
    const offset = window.innerHeight * 0.08;
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
      offset: offset,
    });
    pushToDataLayer(window.location.pathname.split('/')[1], currentcountry?.name);
  }, []);
  const sectionData = saleData?.other_section;

  const electronics =
    sectionData?.find((d) => d.heading === "Electronics")?.items?.[0]?.items ||
    [];
  const sunglasses =
    sectionData?.find((d) => d.heading === "Pre Owned Tablet")?.items?.[0]
      ?.items || [];
  const perfumes =
    sectionData?.find((d) => d.heading === "Perfumes")?.items?.[0]?.items || [];
  const watches =
    sectionData?.find((d) => d.heading === "Smart Watches")?.items?.[0]
      ?.items || [];
  const preOwned =
    sectionData?.find((d) => d.heading === "Pre Owned Laptop")?.items?.[0]
      ?.items || [];
  const categories = sectionData?.find((d) => d.type === 1) || [];
  console.log(schoolEssential);
  const categoryItems = [
    {
      id: 1,
      percent: "50",
      color: "#EED6B2",
      textColor: "#FFFFFFCC",
      url: schoolEssential.find((d) => d.sub_category_name === "School Bags")
        ?.url,
      sub_category_image: "/assets/11-sale/categories/phone.png",
      sub_category_name: `Bagpacks`,
      name: "bag.png",
      mobileImg: "bags.png",
    },
    {
      id: 2,
      percent: "30",
      color: "#4F4537",
      textColor: "#F3E3CA",
      url: schoolEssential.find(
        (d) => d.sub_category_name === "School Stationery"
      )?.url,
      sub_category_image: "/assets/11-sale/categories/sunglass.png",
      sub_category_name: "Stationary Essentials",
      name: "stationary.png",
      mobileImg: "essentials.png",
    },
    {
      id: 3,
      percent: "50",
      color: "#B5AA99B2",
      textColor: " #4D4D4D",
      url: schoolEssential.find(
        (d) => d.sub_category_name === "School Footwear"
      )?.url,
      sub_category_image: "/assets/11-sale/categories/Perfume.png",
      sub_category_name: "Footwears",
      name: "footwear.png",
      mobileImg: "footwear.png",
    },
    {
      id: 4,
      percent: "50",
      color: "#A9E5DBB2",
      textColor: " #4D4D4D",
      url: schoolEssential.find(
        (d) => d.sub_category_name === "School Lunch Box"
      )?.url,
      sub_category_image: "/assets/11-sale/categories/Watch.png",
      sub_category_name: "Lunchboxes",
      name: "lunch.png",
      mobileImg: "lunch.png",
    },
    {
      id: 5,
      percent: "50",
      color: "#D2B993",
      textColor: "#F2EEE8",
      url: schoolEssential.find(
        (d) => d.sub_category_name === "School Water Bottles"
      )?.url,
      sub_category_image: "/assets/11-sale/categories/Tv.png",
      sub_category_name: "Watter Bottles",
      name: "bottles.png",
      mobileImg: "bottles.png",
    },
  ];

  const rows = [[...preOwned], [...sunglasses]];
  return (
    <div>
      {!isMobile ? (
        <DesktopView
          sectionData={sectionData}
          categories={categories}
          categoryItems={categoryItems}
          rows={rows}
          productsAtOne={productsAtOne}
          topBrands={topBrands}
          clearanceItems={clearanceItems}
        />
      ) : (
        <MobileView
          sectionData={sectionData}
          categories={categories}
          categoryItems={categoryItems}
          productsAtOne={productsAtOne}
          topBrands={topBrands}
          clearanceItems={clearanceItems}
          rows={rows}
        />
      )}
    </div>
  );
};

export default ElevenSale;
