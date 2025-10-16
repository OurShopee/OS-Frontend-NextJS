"use client"
import { MediaQueries } from '@/components/utils';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComplaintapi } from '@/redux/formslice';
import Inputbox from '../Common/Inputbox';

const Affiliateprogramform = () => {
    const dispatch = useDispatch();
    const { isMobile } = MediaQueries();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        company: '',
        website: '',
        refId: '',
        captchaInput: ''
    });

    const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
    const [errorCaptcha, setErrorCaptcha] = useState('');

    function generateCaptcha() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        return Array.from({ length: 7 }, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    }

    const refreshCaptcha = () => {
        setCaptchaCode(generateCaptcha());
        setFormData({ ...formData, captchaInput: '' });
        setErrorCaptcha('');
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const isFormValid = () => {
        const validEmail = /^\S+@\S+\.\S+$/.test(formData.email);
        const validPhone = /^\d{9,14}$/.test(formData.phone);

        return (
            formData.name.trim() &&
            formData.mobile.trim() &&
            validEmail &&
            formData.company.trim() &&
            formData.website.trim() &&
            formData.captchaInput.trim().toUpperCase() === captchaCode
        );
    };

    const handleSubmit = () => {
        if (!isFormValid()) {
            setErrorCaptcha('Captcha mismatch or incomplete fields!');
            return;
        }

        // You can split this logic based on whether it's a track or place form
        dispatch(
            addComplaintapi({
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                comments: 'Complaint placed via full form',
                company: formData.company,
                website: formData.website,
            })
        );


    };

    return (
        <div className={`Myaccount-rightsidecard ${isMobile ? '' : 'w-2/3 mx-auto'}`}>
            <Inputbox
                id="name"
                type="text"
                title="Name"
                placeholder="Enter your name"
                value={formData.name}
                handleChange={handleChange}
            />
            <Inputbox
                id="email"
                type="email"
                title="Email"
                placeholder="Enter your email"
                value={formData.email}
                handleChange={handleChange}
            />
            <Inputbox
                id="mobile"
                type="text"
                title="Phone number"
                placeholder="Enter phone number"
                value={formData.mobile}
                handleChange={handleChange}

            />
            <Inputbox
                id="company"
                type="text"
                title="Company Name"
                placeholder="Enter company name"
                value={formData.company}
                handleChange={handleChange}
            />
            <Inputbox
                id="website"
                type="url"
                title="Website URL"
                placeholder="Enter website URL"
                value={formData.website}
                handleChange={handleChange}
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
            <div className="mt-3">

                <Inputbox
                    id="captchaInput"
                    type="text"
                    title="Enter reCAPTCHA"
                    placeholder="Enter reCAPTCHA"
                    value={formData.captchaInput}
                    handleChange={handleChange}
                    error={errorCaptcha}
                />
            </div>

            <div className="d-flex justify-content-end mt-3">
                <div
                    className={isFormValid() ? "activeformsubmitbutton " : "formsubmitbutton "}
                >
                    Submit
                </div>
            </div>

            {/* <div className="text-right mt-4">
                <button
                    onClick={isFormValid() ? handleSubmit : undefined}
                    className={`px-6 py-2 rounded text-white font-semibold ${
                        isFormValid() ? 'bg-[#5f23d0]' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    Submit
                </button>
            </div> */}
        </div>
    );
};

export default Affiliateprogramform;
