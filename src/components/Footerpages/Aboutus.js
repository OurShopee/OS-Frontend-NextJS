"use client";
import BreadComp from "@/components/Myaccount/BreadComp";
import { MediaQueries } from "@/components/utils";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useContent } from "@/hooks";
const Aboutus = () => {
  const dispatch = useDispatch();
  const { isMobile } = MediaQueries();

  // Language content
  const aboutOurshopee = useContent("pages.aboutOurshopee");
  const welcomeTitle = useContent("aboutUs.title");
  const welcomeSubtitle = useContent("aboutUs.subtitle");
  const desc1 = useContent("aboutUs.description1");
  const desc2 = useContent("aboutUs.description2");
  const desc3 = useContent("aboutUs.description3");
  const desc4 = useContent("aboutUs.description4");
  const journey = useContent("aboutUs.journey");
  const visions = useContent("aboutUs.visions");
  const visionText = useContent("aboutUs.visionText");
  const missions = useContent("aboutUs.missions");
  const missionText = useContent("aboutUs.missionText");
  const factor1Title = useContent("aboutUs.factor1Title");
  const factor1Text = useContent("aboutUs.factor1Text");
  const factor2Title = useContent("aboutUs.factor2Title");
  const factor2Text = useContent("aboutUs.factor2Text");
  const factor3Title = useContent("aboutUs.factor3Title");
  const factor3Text = useContent("aboutUs.factor3Text");
  const factor4Title = useContent("aboutUs.factor4Title");
  const factor4Text = useContent("aboutUs.factor4Text");
  const customerFirst = useContent("aboutUs.customerFirst");
  const customerFirstText = useContent("aboutUs.customerFirstText");
  const integrity = useContent("aboutUs.integrity");
  const integrityText = useContent("aboutUs.integrityText");
  const inclusion = useContent("aboutUs.inclusion");
  const inclusionText = useContent("aboutUs.inclusionText");
  const biasForAction = useContent("aboutUs.biasForAction");
  const biasForActionText = useContent("aboutUs.biasForActionText");
  const audacity = useContent("aboutUs.audacity");
  const audacityText = useContent("aboutUs.audacityText");
  const founderName = useContent("aboutUs.founderName");
  const founderTitle = useContent("aboutUs.founderTitle");
  const founderDescription = useContent("aboutUs.founderDescription");
  const achievements = useContent("aboutUs.achievements");

  return (
    <Container fluid className="homepagecontainer">
      <BreadComp title={aboutOurshopee} />
      <div className="footerpagesheader">{aboutOurshopee}</div>
      <div className="single_banner pt-4">
        <img src={"assets/banners/aboutus.png"} loading="lazy" />
      </div>

      <div className="abouts-company">
        <div className="aboutus-title">{welcomeTitle}</div>
        <div className="aboutus-subtitle">{welcomeSubtitle}</div>
        <div className="aboutus-discription">{desc1}</div>
        <div className="aboutus-discription">{desc2}</div>
        <div className="aboutus-discription">{desc3}</div>
        <div className="aboutus-discription">{desc4}</div>
      </div>
      <div className="ourjourny">
        <div className="aboutus-title">{journey}</div>
        <div className="single_banner pt-4">
          <img src={"assets/banners/aboutmap.png"} loading="lazy" />
        </div>
      </div>
      <Row className="mt-4">
        <Col lg={6} md={6} sm={12} className="mb-4 ">
          <div className="about-us-twobanner">
            <div className="aboutus-twobanner-title">{visions}</div>
            <div className="aboutus-twobanner-subtitle">{visionText}</div>
          </div>
        </Col>
        <Col lg={6} md={6} sm={12} className="mb-4 ">
          <div className="about-us-twobanner">
            <div className="aboutus-twobanner-title">{missions}</div>
            <div className="aboutus-twobanner-subtitle">{missionText}</div>
          </div>
        </Col>
      </Row>
      <Row className="mt-4 factors">
        <div className="fcatortitle">
          {isMobile ? (
            <img src={"assets/banners/mobilefactror.png"} loading="lazy" />
          ) : (
            <img src={"assets/banners/factors.png"} loading="lazy" />
          )}

          {/* <div className="foutfactor-title">The </div>
                    <div className="fourtitle" >4</div>
                    <div className="foutfactor-title">factors <br></br>
                    that inspire</div> */}
        </div>
        <Col lg={6} md={6} sm={12} className="mb-4">
          <div className="about-factors about-factorbackground">
            <div className="about-factorcont">1</div>
            <div className="about-us-factors-comp">
              <div className="aboutus-factor-title">{factor1Title}</div>
              <div className="aboutus-twobanner-subtitle">{factor1Text}</div>
            </div>
          </div>
        </Col>
        <Col lg={6} md={6} sm={12} className="mb-4">
          <div className="about-factors about-factorbackground">
            <div className="about-factorcont">2</div>
            <div className="about-us-factors-comp">
              <div className="aboutus-factor-title">{factor2Title}</div>
              <div className="aboutus-twobanner-subtitle">{factor2Text}</div>
            </div>
          </div>
        </Col>
        <Col lg={6} md={6} sm={12} className="mb-4 ">
          <div className="about-factors about-factorbackground">
            <div className="about-factorcont">3</div>
            <div className="about-us-factors-comp">
              <div className="aboutus-factor-title">{factor3Title}</div>
              <div className="aboutus-twobanner-subtitle">{factor3Text}</div>
            </div>
          </div>
        </Col>
        <Col lg={6} md={6} sm={12} className="mb-4 ">
          <div className="about-factors about-factorbackground">
            <div className="about-factorcont">4</div>
            <div className="about-us-factors-comp">
              <div className="aboutus-factor-title">{factor4Title}</div>
              <div className="aboutus-twobanner-subtitle">{factor4Text}</div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-4 fivecomponet fivebannerbackground">
        <div className="aboutus-title">{journey}</div>
        <Col lg={4} md={4} sm={12} className="mb-4 ">
          <div className="about-fivecomponet-comp  about-fivecomponet-compcard">
            <div className="aboutus-factor-title">{customerFirst}</div>
            <div className="aboutus-twobanner-subtitle">
              {customerFirstText}
            </div>
          </div>
        </Col>
        <Col lg={4} md={4} sm={12} className="mb-4">
          <div className="about-fivecomponet-comp  about-fivecomponet-compcard">
            <div className="aboutus-factor-title">{integrity}</div>
            <div className="aboutus-twobanner-subtitle">{integrityText}</div>
          </div>
        </Col>
        <Col lg={4} md={4} sm={12} className="mb-4">
          <div className="about-fivecomponet-comp  about-fivecomponet-compcard">
            <div className="aboutus-factor-title">{inclusion}</div>
            <div className="aboutus-twobanner-subtitle">{inclusionText}</div>
          </div>
        </Col>
        <Col lg={6} md={6} sm={12} className="mb-4">
          <div className="about-fivecomponet-comp  about-fivecomponet-compcard">
            <div className="aboutus-factor-title">{biasForAction}</div>
            <div className="aboutus-twobanner-subtitle">
              {biasForActionText}
            </div>
          </div>
        </Col>
        <Col lg={6} md={6} sm={12} className="mb-4">
          <div className="about-fivecomponet-comp  about-fivecomponet-compcard">
            <div className="aboutus-factor-title">{audacity}</div>
            <div className="aboutus-twobanner-subtitle">{audacityText}</div>
          </div>
        </Col>
      </Row>
      <Row className="mt-4 ceocomponent fivebannerbackground">
        <Col lg={3} md={6} sm={12}>
          <img className="ceoimg" src={"assets/banners/ceo.png"} loading="lazy" />
        </Col>
        <Col lg={9} md={6} sm={12}>
          <div className="ceoname">{founderName}</div>
          <div className="aboutceo">{founderTitle}</div>
          <div className="aboutceo-discription">
            {founderDescription.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </div>
          <Row className="mt-4 Ceo-main">
            <div className="Ceo-main-title">
              <img className="medalimg" src={"assets/banners/Medal.png"} loading="lazy" />
              {achievements}
            </div>
            <Col lg={4} md={4} sm={12} className="mb-4 ">
              <div className="about-ceo-card">
                <div className="aboutus-ceo-title">
                  Global Leadership Award 2019,2023
                </div>
                <div className="aboutus-ceo-subtitle">
                  By American leadership Development Association (ALDA) and
                  Leaders Magazine, Malaysia
                </div>
              </div>
            </Col>
            <Col lg={4} md={4} sm={12} className="mb-4 ">
              <div className="about-ceo-card">
                <div className="aboutus-ceo-title">
                  Asian Business Award 2019
                </div>
                <div className="aboutus-ceo-subtitle">
                  By Arab chamber of commerce Hyderabad
                </div>
              </div>
            </Col>
            <Col lg={4} md={4} sm={12} className="mb-4 ">
              <div className="about-ceo-card">
                <div className="aboutus-ceo-title">
                  Regal British Award 2019
                </div>
                <div className="aboutus-ceo-subtitle">
                  from World Humanitarian Drive, UK
                </div>
              </div>
            </Col>
            <Col lg={4} md={4} sm={12} className="mb-4 ">
              <div className="about-ceo-card">
                <div className="aboutus-ceo-title">
                  Beat Health Care Brand, Golden Achievements Awards
                </div>
                <div className="aboutus-ceo-subtitle">
                  Dubai 5th Edition 2018
                </div>
              </div>
            </Col>
            <Col lg={4} md={4} sm={12} className="mb-4 ">
              <div className="about-ceo-card">
                <div className="aboutus-ceo-title">
                  Best Health Care Brand Award
                </div>
                <div className="aboutus-ceo-subtitle">
                  By Middle East Chandrika 2018
                </div>
              </div>
            </Col>
            <Col lg={4} md={4} sm={12} className="mb-4 ">
              <div className="about-ceo-card">
                <div className="aboutus-ceo-title">
                  Young Indian Visionary award 2017
                </div>
                <div className="aboutus-ceo-subtitle">By IMG</div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default Aboutus;
