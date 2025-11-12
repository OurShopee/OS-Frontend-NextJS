"use client"
import { clearance_saleApi, getSectionPagesApi } from "@/api/products";
import DesktopView from "@/components/blackfriday/DesktopView";
import MobileViewCard from "@/components/blackfriday/mobileViewCard";
import { MediaQueries } from "@/components/utils";
import { pushToDataLayer } from "@/components/utils/dataUserpush";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
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
    setTopBrands(topBrands || []);
  }, [saleData]);

  useEffect(() => {
    const offset = window.innerHeight * 0.08;
    AOS.init({
      once: true,
      offset: offset,
    });
    pushToDataLayer("view_summer_page", currentcountry?.name);
  }, []);

  const sectionData = saleData?.other_section;

  const electronics =
    sectionData?.find((d) => d.heading === "Electronics")?.items?.[0]?.items ||
    [];
  const sunglasses =
    sectionData?.find((d) => d.heading === "Sunglass")?.items?.[0]?.items || [];
  const perfumes =
    sectionData?.find((d) => d.heading === "Perfumes")?.items?.[0]?.items || [];
  const watches =
    sectionData?.find((d) => d.heading === "Smart Watches")?.items?.[0]
      ?.items || [];
  const preOwned =
    sectionData?.find((d) => d.heading === "Pre Owned Laptop")?.items?.[0]
      ?.items || [];
  const categories = sectionData?.find((d) => d.type === 1) || [];
  const categoryItems = [
    {
      id: 1,
      percent: "60%",
      color: "#EED6B2",
      textColor: "#FFFFFFCC",
      url: "/products-category/Pre-Owned-Laptops/",
      sub_category_image: "/assets/11-sale/categories/phone.png",
      sub_category_name: `Pre-owned Laptops & Phones`,
      mobileImg: "Preowned.png",
    },
    {
      id: 2,
      percent: "70%",
      color: "#4F4537",
      textColor: "#F3E3CA",
      url: "/products-category/Sunglasses/",
      sub_category_image: "/assets/11-sale/categories/sunglass.png",
      sub_category_name: "Sunglasses",
      mobileImg: "sunglass.png",
    },
    {
      id: 3,
      percent: "40%",
      color: "#B5AA99B2",
      textColor: " #4D4D4D",
      url: "/products-category/Perfumes/",
      sub_category_image: "/assets/11-sale/categories/Perfume.png",
      sub_category_name: "Perfumes",
      mobileImg: "Perfumes.png",
    },
    {
      id: 4,
      percent: "60%",
      color: "#A9E5DBB2",
      textColor: " #4D4D4D",
      url: "/products-category/Smart-Watches/",
      sub_category_image: "/assets/11-sale/categories/Watch.png",
      sub_category_name: "Watches",
      mobileImg: "Watches.png",
    },
    {
      id: 5,
      percent: "50%",
      color: "#D2B993",
      textColor: "#F2EEE8",
      url: "/products-category/Television-Accessories/",
      sub_category_image: "/assets/11-sale/categories/Tv.png",
      sub_category_name: "Electronics",
      mobileImg: "Electronics.png",
    },
  ];

  const rows = [
    [...preOwned],
    [...sunglasses],
    [...perfumes],
    [...watches],
    [...electronics],
  ];

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
        <MobileViewCard
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
