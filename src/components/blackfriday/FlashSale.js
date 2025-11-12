import CountdownTimer from "../homepage/CountdownTimer";

const FlashSale = () => {
  return (
    <div>
      <div className="component_1 mt-4">
        <div className="component_header">
          <div>
            <img src="" className="" />
          </div>

          <CountdownTimer />
        </div>

        {!loading5 && (
          <CarouselWithBanner
            products={top_picks?.[0]?.productlist}
            bannerImage={top_picks?.[0]?.image_slider}
            bannerImageRedirectUrl={top_picks?.[0]?.url}
            type={1}
            inner_bg={"rgba(238, 235, 250, 1)"}
          />
        )}
      </div>
    </div>
  );
};

export default FlashSale;
