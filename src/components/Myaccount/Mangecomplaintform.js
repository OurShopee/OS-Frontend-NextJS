import React, { useEffect, useState } from 'react';
import Inputbox from '../Common/Inputbox';
import { RefreshCw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { getComplaintapi } from "../../redux/formslice"
import { useContent, useCurrentLanguage } from '@/hooks';
const Mangecomplaintform = () => {
    const currentLanguage = useCurrentLanguage();
    const dispatch=useDispatch()
    const [referenceId, setReferenceId] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
    const [errorReferenceId, setErrorReferenceId] = useState('');
    const [resData, setResData] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const referencePlaceholder = useContent("account.complaintReferencePlaceholder");
    const referenceTitle = useContent("account.complaintReferenceTitle");
    const captchaPlaceholder = useContent("account.complaintCaptchaPlaceholder");
    const captchaErrorMessage = useContent("account.captchaMismatch");
    const trackComplaintCta = useContent("account.trackComplaintCta");
    const processingLabel = useContent("messages.processing");
    useEffect(() => {
        if (errorReferenceId) {
            setErrorReferenceId(captchaErrorMessage);
        }
    }, [captchaErrorMessage, errorReferenceId]);
    function generateCaptcha() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        return Array.from({ length: 7 }, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    }

    const refreshCaptcha = () => {
        setCaptchaCode(generateCaptcha());
        setCaptchaInput('');
        setErrorReferenceId('');
    };

    const isFormValid = () => {
        return (
            referenceId.trim() !== '' &&
            captchaInput.trim().toUpperCase() === captchaCode
        );
    };

    const handleTrackOrder = async() => {
        if (!isFormValid()) {
            setErrorReferenceId(captchaErrorMessage);
            return;
        }
        const input_data ={
            cno:referenceId
        }
        try{
            setIsLoading(true)
            const res= await dispatch(getComplaintapi(input_data))
            setResData(res?.payload?.data)
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <>


            <div className="p-3  bg-white rounded shadow-sm complaint-form-wrapper">
                <Inputbox
                    id="referenceId"
                    type="text"
                    value={referenceId}
                    handleChange={(e) => setReferenceId(e.target.value)}
                    placeholder={referencePlaceholder}
                    title={referenceTitle}
                />

                <div className="d-flex align-items-center mt-3 mb-2 select-none">
                    <div
                        className="captcha-box"
                    >
                        {captchaCode}
                    </div>
                    <div
                        type="button"
                        className={`captcha-refresh-btn ${currentLanguage === "ar" ? "pr-4" : "pl-4"}`}
                        onClick={refreshCaptcha}
                    >
                        <RefreshCw size={16} />
                    </div>
                </div>

                <Inputbox
                    id="captchaInput"
                    type="text"
                    value={captchaInput}
                    handleChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder={captchaPlaceholder}
                    title={captchaPlaceholder}
                    error={errorReferenceId}
                />
                {resData && 
                    <div
                        className="text-green-700 font-semibold"
                        dangerouslySetInnerHTML={{ __html: resData.msg }}
                    />
                }
            </div>
            <div className="d-flex justify-content-end mt-3">
                <span
                    className={isFormValid() ? "activeformsubmitbutton profileviewsubmitbtn cursor-pointer" : "formsubmitbutton profileviewsubmitbtn cursor-pointer"}
                    onClick={isFormValid() && !isLoading ? handleTrackOrder : undefined}
                    aria-busy={isLoading}
                >
                    {isLoading ? processingLabel : trackComplaintCta}
                </span>
            </div>
        </>
    );
};

export default Mangecomplaintform;
