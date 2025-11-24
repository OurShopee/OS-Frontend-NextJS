"use client";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MediaQueries } from "@/components/utils";
import { getAssetsUrl } from "@/components/utils/helpers";
import { useSelector} from "react-redux";
import { useContent, useCurrentLanguage } from "@/hooks";

const Tabbyplan = () => {
     const { isMobile } = MediaQueries();
     const currentLanguage = useCurrentLanguage();
     const isRTL = currentLanguage === "ar";
     const currentcountry = useSelector((state) => state.globalslice.currentcountry);
     
     // Get translated content
     const amI = useContent("tabby.amI");
     const eligible = useContent("tabby.eligible");
     const yesIfYou = useContent("tabby.yesIfYou");
     const age18Plus = useContent("tabby.age18Plus");
     const validCard = useContent("tabby.validCard");
     const uaeResident = useContent("tabby.uaeResident");
     const andJustFYI = useContent("tabby.andJustFYI");
     const installmentPlanValid = useContent("tabby.installmentPlanValid")
       .replace("{electronicsLimit}", "1500")
       .replace("{nonElectronicsLimit}", "2500")
       .replace(/{currency}/g, currentcountry.currency);
     const automaticPayments = useContent("tabby.automaticPayments");
     const returnPolicy = useContent("tabby.returnPolicy");
     const selectEverything = useContent("tabby.selectEverything");
     const browseAndAdd = useContent("tabby.browseAndAdd");
     const tabbyForEMI = useContent("tabby.tabbyForEMI");
     const chooseTabby = useContent("tabby.chooseTabby");
     const signUp = useContent("tabby.signUp");
     const registerInstantly = useContent("tabby.registerInstantly");
     const shipRightAway = useContent("tabby.shipRightAway");
     const fastProcessing = useContent("tabby.fastProcessing");
     const pay25Percent = useContent("tabby.pay25Percent");
     const enjoyNowPayLater = useContent("tabby.enjoyNowPayLater");
     const easy = useContent("tabby.easy");
     const installmentPlan = useContent("tabby.installmentPlan");
     const convenienceDescription = useContent("tabby.convenienceDescription");
     const processStep1 = useContent("tabby.processStep1")
       .replace("{amount}", "200")
       .replace(/{currency}/g, currentcountry.currency);
     const processStep2 = useContent("tabby.processStep2")
       .replace("{amount}", "200")
       .replace(/{currency}/g, currentcountry.currency);
     const processStep3 = useContent("tabby.processStep3");
     const processStep4 = useContent("tabby.processStep4");
     const processStep5 = useContent("tabby.processStep5");
     const processStep6 = useContent("tabby.processStep6");
     const processStep7 = useContent("tabby.processStep7");
     const processStep8 = useContent("tabby.processStep8");
     
    return (
        <Container fluid className="homepagecontainer mt-3 mb-3" dir={isRTL ? "rtl" : "ltr"}>
            <div className="single_banner ">
                {
                    !isMobile?
                    <img src={'assets/banners/shopnowpaylater.png'} loading="lazy" />:
                    <img src={'assets/banners/mobiletabbybanner.png'} loading="lazy"></img>
                }
            
            </div>
            <Row className="shopnow-paylater-eligible">

                <Col lg={2} >
                <div className={isMobile?"bnpl-eligible":""}>

                    <div className={isMobile?" ami":" ami  pb-2"} >{amI}</div>
                    <div className="tabbyplansbtn">{eligible}

                    </div>
                    </div>
                </Col>
                <Col lg={10}>
                    <div className="tabbyplan-card mb-2">
                        <div className="tabbycard-title">{yesIfYou}</div>
                        <div className="d-flex">
                            <img src={getAssetsUrl("Sta5r.png")} className="me-3 tabbtstaring" loading="lazy"></img>
                            <div className="tabbycard-content">
                                {age18Plus}
                            </div>
                        </div>
                        <div className="d-flex">
                            <img src={getAssetsUrl("Sta5r.png")} className="me-3 tabbtstaring" loading="lazy"></img>
                            <div className="tabbycard-content">
                                {validCard}
                            </div>
                        </div>
                        <div className="d-flex">
                            <img src={getAssetsUrl("Sta5r.png")} className="me-3 tabbtstaring" loading="lazy"></img>
                            <div className="tabbycard-content">
                                {uaeResident}
                            </div>
                        </div>


                    </div>
                    <div className="tabbyplan-card ">
                        <div className="tabbycard-title">{andJustFYI}</div>
                        <div className="d-flex">
                            <img src={getAssetsUrl("Sta5r.png")} className="me-3 tabbtstaring" loading="lazy"></img>
                            <div className="tabbycard-content">
                                {installmentPlanValid}
                            </div>
                        </div>
                        <div className="d-flex">
                            <img src={getAssetsUrl("Sta5r.png")} className="me-3 tabbtstaring" loading="lazy"></img>
                            <div className="tabbycard-content">
                                {automaticPayments}
                            </div>
                        </div>
                        <div className="d-flex">
                            <img src={getAssetsUrl("Sta5r.png")} className="me-3 tabbtstaring" loading="lazy"></img>
                            <div className="tabbycard-content">
                                {returnPolicy}
                            </div>
                        </div>

                    </div>
                </Col>
            </Row>
            <Row className="benifts-bnpl">
                <Col lg={4}>
                {
                    isMobile?
                    <img className="benfitsimg" src={'assets/banners/bnplmobile.png'} loading="lazy" />:
                    <img className="benfitsimg" src={'assets/banners/benefitofbnpl.png'} loading="lazy" />
                }
     
                </Col>
                <Col lg={4}>
                    <div className="benfitscard benfitsmiddle">
                        <div>
                            <div className="d-flex">
                                <img src={getAssetsUrl("Sta5r.png")} className="me-3 tabbtstaring" loading="lazy"></img>
                                <div className="benfitscontent">{selectEverything}
                                </div>

                            </div>
                            <div className="benfits-subcontent">{browseAndAdd}</div>
                        </div>
                        <img className="bnplcardimages" src={'assets/banners/bnpl1.png'} loading="lazy" />
                    </div>
                    <div className="benfitscard benfitsmiddle">
                        <div>
                            <div className="d-flex">
                                <img src={getAssetsUrl("Sta5r.png")} className="me-3 tabbtstaring" loading="lazy"></img>
                                <div className="benfitscontent">{tabbyForEMI}
                                </div>

                            </div>
                            <div className="benfits-subcontent">{chooseTabby}</div>
                        </div>
                        <img className="bnplcardimages" src={'assets/banners/bnpl2.png'} loading="lazy" />
                    </div>
                    <div className="benfitscard benfitsmiddle">
                        <div>
                            <div className="d-flex">
                                <img src={getAssetsUrl("Sta5r.png")} className="me-3 tabbtstaring" loading="lazy"></img>
                                <div className="benfitscontent">{signUp}
                                </div>

                            </div>
                            <div className="benfits-subcontent">{registerInstantly}</div>
                        </div>
                        <img className="bnplcardimages" src={'assets/banners/bnpl3.png'} loading="lazy" />
                    </div>
                </Col>
                <Col lg={4} className="benfitscard-main">
                    <div className="benfitscard benfitslast">
                        <div>
                            <div className="d-flex">
                                <img src={getAssetsUrl("Sta5r.png")} className="me-3 tabbtstaring" loading="lazy"></img>
                                <div className="benfitscontent">{shipRightAway}
                                </div>

                            </div>
                            <div className="benfits-subcontent">{fastProcessing}</div>
                        </div>
                        <img className="bnplcardimages" src={'assets/banners/bnpl4.png'} loading="lazy" />
                    </div>
                    <div className="benfitscard benfitslast">
                        <div>
                            <div className="d-flex">
                                <img src={getAssetsUrl("Sta5r.png")} className="me-3 tabbtstaring" loading="lazy"></img>
                                <div className="benfitscontent">{pay25Percent}
                                </div>

                            </div>
                            <div className="benfits-subcontent">{enjoyNowPayLater}</div>
                        </div>
                        <img className="bnplcardimages" src={'assets/banners/bnpl5.png'} loading="lazy" />
                    </div>
                </Col>
            </Row>
            <Row className="shopnow-paylater-eligible mt-3 mb-3">

                <Col lg={6} className="installment">
                    <div className="tabbyinstallments">

                        <div className="tabbyplansbtn">{easy}

                        </div>
                        <div className="tabby-sub ps-3">{installmentPlan}</div>
                    </div>
                </Col>
                <Col lg={6}>
                    <div className="tabbyinstallment-content">{convenienceDescription}</div>
                </Col>
            </Row>
            <Row className="shopnow-paylater-eligible mt-3 mb-3">

                <Col lg={6} className="d-flex align-content-center bnpl-bottom">
                 <div className="tabbyimages">
                 <img src={'assets/banners/tprocess1.png'} className="tabbyprocessimg" loading="lazy" />

                 <div className="d-flex">
                    <div className="tprocesscount">1</div>
                    <div className={isRTL ? "!pl-0 !pr-2" : "tprocess-content"}>{processStep1}</div>

                 </div>
                 </div>
                </Col>
                <Col lg={6} className="d-flex align-content-center bnpl-bottom">
                 <div className="tabbyimages">
                 <img src={'assets/banners/tprocess2.png'} className="tabbyprocessimg" loading="lazy" />

                 <div className="d-flex">
                    <div className="tprocesscount">2</div>
                    <div className={isRTL ? "!pl-0 !pr-2" : "tprocess-content"}>{processStep2}</div>

                 </div>
                 </div>
                </Col>
                <Col lg={6} className="d-flex align-content-center bnpl-bottom">
                 <div className="tabbyimages">
                 <img src={'assets/banners/tprocess3.png'} className="tabbyprocessimg" loading="lazy" />

                 <div className="d-flex">
                    <div className="tprocesscount">3</div>
                    <div className={isRTL ? "!pl-0 !pr-2" : "tprocess-content"}>{processStep3}</div>

                 </div>
                 </div>
                </Col>
                <Col lg={6} className="d-flex align-content-center bnpl-bottom">
                 <div className="tabbyimages">
                 <img src={'assets/banners/tprocess4.png'} className="tabbyprocessimg" loading="lazy" />

                 <div className="d-flex">
                    <div className="tprocesscount">4</div>
                    <div className={isRTL ? "!pl-0 !pr-2" : "tprocess-content"}>{processStep4}</div>

                 </div>
                 </div>
                </Col>
                <Col lg={6} className="d-flex align-content-center bnpl-bottom">
                 <div className="tabbyimages">
                 <img src={'assets/banners/tprocess5.png'} className="tabbyprocessimg" loading="lazy" />

                 <div className="d-flex">
                    <div className="tprocesscount">5</div>
                    <div className={isRTL ? "!pl-0 !pr-2" : "tprocess-content"}>{processStep5}</div>

                 </div>
                 </div>
                </Col>
                <Col lg={6} className="d-flex align-content-center bnpl-bottom">
                 <div className="tabbyimages">
                 <img src={'assets/banners/tprocess6.png'} className="tabbyprocessimg" loading="lazy" />

                 <div className="d-flex">
                    <div className="tprocesscount">6</div>
                    <div className={isRTL ? "!pl-0 !pr-2" : "tprocess-content"}>{processStep6}</div>

                 </div>
                 </div>
                </Col>
                <Col lg={6} className="d-flex align-content-center bnpl-bottom">
                 <div className="tabbyimages">
                 <img src={'assets/banners/tprocess7.png'} className="tabbyprocessimg" loading="lazy" />

                 <div className="d-flex">
                    <div className="tprocesscount">7</div>
                    <div className={isRTL ? "!pl-0 !pr-2" : "tprocess-content"}>{processStep7}</div>

                 </div>
                 </div>
                </Col>
                <Col lg={6} className="d-flex align-content-center bnpl-bottom">
                 <div className="tabbyimages">
                 <img src={'assets/banners/tprocess8.png'} className="tabbyprocessimg" loading="lazy" />

                 <div className="d-flex">
                    <div className="tprocesscount">8</div>
                    <div className={isRTL ? "!pl-0 !pr-2" : "tprocess-content"}>{processStep8}</div>

                 </div>
                 </div>
                </Col>
              
            </Row>
        </Container>
    )
}
export default Tabbyplan;