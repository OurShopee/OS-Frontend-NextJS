import { Suspense, lazy } from "react";
import HomeSectionFallback from "./HomeSectionFallback";

/**
 * Utility to wrap components with React.lazy + Suspense and a shared fallback.
 */
const withSuspense = (importer, FallbackComponent = HomeSectionFallback) => {
  const LazyComponent = lazy(importer);

  const SuspendedComponent = (props) => (
    <Suspense fallback={<FallbackComponent />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  SuspendedComponent.displayName = `Lazy${
    LazyComponent.displayName || LazyComponent.name || "Component"
  }`;

  return SuspendedComponent;
};

const HomeCarousel = withSuspense(() => import("./HomeCarousel"));
const HomeMobileCarousel = withSuspense(() => import("./HomeMobileCarousel"));
const HomeCategories = withSuspense(() => import("./HomeCategories"));
const CarouselProducts = withSuspense(() => import("./CarouselProducts"));
const HalfCarouselProducts = withSuspense(() =>
  import("./HalfCarouselProducts")
);
const CarouselWithBanner = withSuspense(() => import("./CarouselWithBanner"));
const TopPicksCarouselProducts = withSuspense(() =>
  import("./TopPicksCarouselProducts")
);
const AutoToggleHeader = withSuspense(() => import("./AutoToggleHeader"));
const BestDeals = withSuspense(() => import("./BestDeals"));
const BrandOfTheWeekUpdated = withSuspense(() =>
  import("./BrandOfTheWeekUpdated")
);
const CategoryCard = withSuspense(() => import("./CategoryCard"));
const CountdownClock = withSuspense(() => import("./CountdownClock"));
const CountdownTimer = withSuspense(() => import("./CountdownTimer"));
const DealCard = withSuspense(() => import("./DealCard"));
const DealsYouMightLike = withSuspense(() => import("./DealsYouMightLike"));
const DynamicBanners = withSuspense(() => import("./DynamicBanners"));
const LimitedDealCard = withSuspense(() => import("./LimitedDealCard"));
const LimitedTimeDeals = withSuspense(() => import("./LimitedTimeDeals"));
const MastZone = withSuspense(() => import("./MastZone"));
const ProductBanners = withSuspense(() => import("./ProductBanners"));
const PromoBanner = withSuspense(() => import("./PromoBanner"));
const PromotionalBanners = withSuspense(() => import("./PromotionalBanners"));
const TopSelling = withSuspense(() => import("./TopSelling"));
const VerticalTextCarousel = withSuspense(() =>
  import("./VerticalTextCarousel")
);

export {
  AutoToggleHeader,
  BestDeals,
  BrandOfTheWeekUpdated,
  CarouselProducts,
  CarouselWithBanner,
  CategoryCard,
  CountdownClock,
  CountdownTimer,
  DealCard,
  DealsYouMightLike,
  DynamicBanners,
  HalfCarouselProducts,
  HomeCarousel,
  HomeCategories,
  HomeMobileCarousel,
  LimitedDealCard,
  LimitedTimeDeals,
  MastZone,
  ProductBanners,
  PromoBanner,
  PromotionalBanners,
  TopPicksCarouselProducts,
  TopSelling,
  VerticalTextCarousel,
};