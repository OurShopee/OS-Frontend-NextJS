import React, { useState } from 'react';
import Inputbox from '../Common/Inputbox';
import { RefreshCw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import {getComplaintapi} from "../../redux/formslice"
const Mangecomplaintform = () => {
    const dispatch=useDispatch()
    const [referenceId, setReferenceId] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
    const [errorReferenceId, setErrorReferenceId] = useState('');
    const [resData, setResData] = useState()
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
            setErrorReferenceId('Captcha mismatch!');
            return;
        }
        const input_data ={
            cno:referenceId
        }
       const res= await dispatch(getComplaintapi(input_data))
        setResData(res?.payload?.data)
    };

    return (
        <>


            <div className="p-3  bg-white rounded shadow-sm complaint-form-wrapper">
                <Inputbox
                    id="referenceId"
                    type="text"
                    value={referenceId}
                    handleChange={(e) => setReferenceId(e.target.value)}
                    placeholder="Order Id / Reference no."
                    title="Order Id / Reference ID"
                />

                <div className="d-flex align-items-center mt-3 mb-2">
                    <div
                        className="captcha-box"
                    >
                        {captchaCode}
                    </div>
                    <div
                        type="button"
                        className="captcha-refresh-btn"
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
                    placeholder="Enter reCAPTCHA"
                    title="Enter reCAPTCHA"
                    error={errorReferenceId}
                />
                {resData && 
                    <div
                        className="tw-text-green-700 tw-font-semibold"
                        dangerouslySetInnerHTML={{ __html: resData.msg }}
                    />
                }
            </div>
            <div className="d-flex justify-content-end mt-3">
                <span
                    className={isFormValid() ? "activeformsubmitbutton profileviewsubmitbtn tw-cursor-pointer" : "formsubmitbutton profileviewsubmitbtn tw-cursor-pointer"}
                    onClick={isFormValid() ? handleTrackOrder : undefined}
                >
                    Track a complaint
                </span>
            </div>
        </>
    );
};

export default Mangecomplaintform;
