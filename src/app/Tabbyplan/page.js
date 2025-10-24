"use client";

import { MediaQueries } from "@/components/utils";
import starimg from "@/images/Sta5r.png";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

const Tabbyplan = () => {
  const { isMobile } = MediaQueries();
  const currentcountry = useSelector(
    (state) => state.globalslice.currentcountry
  );

  return (
    <Container fluid className="homepagecontainer mt-3 mb-3">
      <div className="single_banner">
        {!isMobile ? (
          <img
            src="/assets/banners/shopnowpaylater.png"
            alt="Shop now pay later"
          />
        ) : (
          <img
            src="/assets/banners/mobiletabbybanner.png"
            alt="Mobile tabby banner"
          />
        )}
      </div>
      <Row className="shopnow-paylater-eligible">
        <Col lg={2}>
          <div className={isMobile ? "bnpl-eligible" : ""}>
            <div className={isMobile ? " ami" : " ami pb-2"}>Am I</div>
            <div className="tabbyplansbtn">Eligible?</div>
          </div>
        </Col>
        <Col lg={10}>
          <div className="tabbyplan-card mb-2">
            <div className="tabbycard-title">Yes, if you…</div>
            <div className="d-flex">
              <img src={starimg.src} className="me-3 tabbtstaring" alt="Star" />
              <div className="tabbycard-content">are 18+ years old</div>
            </div>
            <div className="d-flex">
              <img src={starimg.src} className="me-3 tabbtstaring" alt="Star" />
              <div className="tabbycard-content">
                have a valid debit or credit card
              </div>
            </div>
            <div className="d-flex">
              <img src={starimg.src} className="me-3 tabbtstaring" alt="Star" />
              <div className="tabbycard-content">
                are resident in the United Arab Emirates
              </div>
            </div>
          </div>
          <div className="tabbyplan-card">
            <div className="tabbycard-title">and just FYI…</div>
            <div className="d-flex">
              <img src={starimg.src} className="me-3 tabbtstaring" alt="Star" />
              <div className="tabbycard-content">
                Tabby easy installment plan is valid for all electronics
                category products value up to 1500 {currentcountry.currency} and
                Non-electronics category products value up to 2500{" "}
                {currentcountry.currency}.
              </div>
            </div>
            <div className="d-flex">
              <img src={starimg.src} className="me-3 tabbtstaring" alt="Star" />
              <div className="tabbycard-content">
                Your payment instalments are automatic, although a small late
                fee applies if you fail to make a payment on time.
              </div>
            </div>
            <div className="d-flex">
              <img src={starimg.src} className="me-3 tabbtstaring" alt="Star" />
              <div className="tabbycard-content">
                If you need to make a return, you are to do so through Ourshopee
                as you normally would. Once the refund is confirmed, your
                payments will be refunded back to you.
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="benifts-bnpl">
        <Col lg={4}>
          {isMobile ? (
            <img
              className="benfitsimg"
              src="/assets/banners/bnplmobile.png"
              alt="BNPL benefits mobile"
            />
          ) : (
            <img
              className="benfitsimg"
              src="/assets/banners/benefitofbnpl.png"
              alt="Benefits of BNPL"
            />
          )}
        </Col>
        <Col lg={4}>
          <div className="benfitscard benfitsmiddle">
            <div>
              <div className="d-flex">
                <img src={starimg.src} className="me-3 tabbtstaring" alt="Star" />
                <div className="benfitscontent">
                  Select everything you love at Ourshopee
                </div>
              </div>
              <div className="benfits-subcontent">
                Browse and add your favorite items to your cart with ease.
              </div>
            </div>
            <img
              className="bnplcardimages"
              src="/assets/banners/bnpl1.png"
              alt="BNPL step 1"
            />
          </div>
          <div className="benfitscard benfitsmiddle">
            <div>
              <div className="d-flex">
                <img src={starimg.src} className="me-3 tabbtstaring" alt="Star" />
                <div className="benfitscontent">Tabby for EMI Plans</div>
              </div>
              <div className="benfits-subcontent">
                Choose Tabby at checkout to split your payment into easy
                installments.
              </div>
            </div>
            <img
              className="bnplcardimages"
              src="/assets/banners/bnpl2.png"
              alt="BNPL step 2"
            />
          </div>
          <div className="benfitscard benfitsmiddle">
            <div>
              <div className="d-flex">
                <img src={starimg.src} className="me-3 tabbtstaring" alt="Star" />
                <div className="benfitscontent">Sign Up</div>
              </div>
              <div className="benfits-subcontent">
                Register instantly using just your email and mobile number—it's
                quick and simple!
              </div>
            </div>
            <img
              className="bnplcardimages"
              src="/assets/banners/bnpl3.png"
              alt="BNPL step 3"
            />
          </div>
        </Col>
        <Col lg={4} className="benfitscard-main">
          <div className="benfitscard benfitslast">
            <div>
              <div className="d-flex">
                <img src={starimg.src} className="me-3 tabbtstaring" alt="Star" />
                <div className="benfitscontent">
                  Ourshopee will ship out your order right away
                </div>
              </div>
              <div className="benfits-subcontent">
                Fast processing ensures your order is on its way as soon as you
                place it.
              </div>
            </div>
            <img
              className="bnplcardimages"
              src="/assets/banners/bnpl4.png"
              alt="BNPL step 4"
            />
          </div>
          <div className="benfitscard benfitslast">
            <div>
              <div className="d-flex">
                <img src={starimg.src} className="me-3 tabbtstaring" alt="Star" />
                <div className="benfitscontent">
                  Pay only 25% today and the rest later
                </div>
              </div>
              <div className="benfits-subcontent">
                Enjoy now, pay later—just 25% upfront with the rest split into
                equal payments.
              </div>
            </div>
            <img
              className="bnplcardimages"
              src="/assets/banners/bnpl5.png"
              alt="BNPL step 5"
            />
          </div>
        </Col>
      </Row>
      <Row className="shopnow-paylater-eligible mt-3 mb-3">
        <Col lg={6} className="installment">
          <div className="tabbyinstallments">
            <div className="tabbyplansbtn">Easy</div>
            <div className="tabby-sub ps-3">Installment Plan</div>
          </div>
        </Col>
        <Col lg={6}>
          <div className="tabbyinstallment-content">
            OurShopee.com at your convenience. Pay the easy way with our Buy now
            pay later or shop now pay later.You can buy your desired product
            with no wait. No Credit Card needed. You can place order using your
            debit card with 0% interest rate & Get your product without any
            burden on your pocket.
          </div>
        </Col>
      </Row>
      <Row className="shopnow-paylater-eligible mt-3 mb-3">
        <Col lg={6} className="d-flex align-content-center bnpl-bottom">
          <div className="tabbyimages">
            <img
              src="/assets/banners/tprocess1.png"
              className="tabbyprocessimg"
              alt="Process step 1"
            />
            <div className="d-flex">
              <div className="tprocesscount">1</div>
              <div className="tprocess-content">
                If you desired product is worth 200
                <span>{currentcountry.currency}</span> or above, you will see
                installement eligibility message.
              </div>
            </div>
          </div>
        </Col>
        <Col lg={6} className="d-flex align-content-center bnpl-bottom">
          <div className="tabbyimages">
            <img
              src="/assets/banners/tprocess2.png"
              className="tabbyprocessimg"
              alt="Process step 2"
            />
            <div className="d-flex">
              <div className="tprocesscount">2</div>
              <div className="tprocess-content">
                If your cart is worth 200<span>{currentcountry.currency}</span>{" "}
                or above by selecting multiple items, you will see the options
                to convert them into installement.
              </div>
            </div>
          </div>
        </Col>
        <Col lg={6} className="d-flex align-content-center bnpl-bottom">
          <div className="tabbyimages">
            <img
              src="/assets/banners/tprocess3.png"
              className="tabbyprocessimg"
              alt="Process step 3"
            />
            <div className="d-flex">
              <div className="tprocesscount">3</div>
              <div className="tprocess-content">
                Shop Now Pay Later There will be Shop Now pay Later option,
                select the option and you will be redirected on the payment plan
                option page. You have to register yourself on that page.
              </div>
            </div>
          </div>
        </Col>
        <Col lg={6} className="d-flex align-content-center bnpl-bottom">
          <div className="tabbyimages">
            <img
              src="/assets/banners/tprocess4.png"
              className="tabbyprocessimg"
              alt="Process step 4"
            />
            <div className="d-flex">
              <div className="tprocesscount">4</div>
              <div className="tprocess-content">Confirm your Phone Number.</div>
            </div>
          </div>
        </Col>
        <Col lg={6} className="d-flex align-content-center bnpl-bottom">
          <div className="tabbyimages">
            <img
              src="/assets/banners/tprocess5.png"
              className="tabbyprocessimg"
              alt="Process step 5"
            />
            <div className="d-flex">
              <div className="tprocesscount">5</div>
              <div className="tprocess-content">Upload your Emirates ID.</div>
            </div>
          </div>
        </Col>
        <Col lg={6} className="d-flex align-content-center bnpl-bottom">
          <div className="tabbyimages">
            <img
              src="/assets/banners/tprocess6.png"
              className="tabbyprocessimg"
              alt="Process step 6"
            />
            <div className="d-flex">
              <div className="tprocesscount">6</div>
              <div className="tprocess-content">Confirm your Phone Number.</div>
            </div>
          </div>
        </Col>
        <Col lg={6} className="d-flex align-content-center bnpl-bottom">
          <div className="tabbyimages">
            <img
              src="/assets/banners/tprocess7.png"
              className="tabbyprocessimg"
              alt="Process step 7"
            />
            <div className="d-flex">
              <div className="tprocesscount">7</div>
              <div className="tprocess-content">
                Fill in your Debit or Credit details.
              </div>
            </div>
          </div>
        </Col>
        <Col lg={6} className="d-flex align-content-center bnpl-bottom">
          <div className="tabbyimages">
            <img
              src="/assets/banners/tprocess8.png"
              className="tabbyprocessimg"
              alt="Process step 8"
            />
            <div className="d-flex">
              <div className="tprocesscount">8</div>
              <div className="tprocess-content">
                Once the details are submitted and approved, you will be
                redirected to the Order confirmed page.
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Tabbyplan;
