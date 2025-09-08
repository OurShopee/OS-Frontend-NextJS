export const getImagesByKey = (bannerList, key) => {
  return bannerList?.dynamicBanners?.[key] || {};
};
