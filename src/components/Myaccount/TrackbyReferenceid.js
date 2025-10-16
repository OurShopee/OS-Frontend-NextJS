import React, { useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import Inputbox from '../Common/Inputbox';
import Formvalidation from '../Validation/Formvalidation';
import {trackdatabyreferencidapi} from "../../redux/formslice";
import { MediaQueries } from "../../components/utils";
import BreadComp from './BreadComp';
import Orders from '../Common/Orders';
const TrackbyReferenceid = () => {
    const { isMobile } = MediaQueries()
    const dispatch = useDispatch();
    const trackorderlistdata = useSelector((state) => state.formslice.trackorderlistdata);
    const [formData, setFormData] = useState({
        referenceid: "",
    });
    const [errors, setErrors] = useState({});

    const isFormValid = () => {
        return formData.referenceid.trim() !== "";
    };

    const handleNext = () => {
        if (!isFormValid()) return;

        const input_data = {
            referenceid: formData.referenceid,
        };

        // Dispatch the track order action here (replace with your actual action)
        dispatch(trackdatabyreferencidapi(input_data));
    };

    const { handleChange, handleSubmit } = Formvalidation(
        formData,
        setFormData,
        setErrors,
        handleNext
    );

    return (
        <div className='ms-2 me-2 mb-2'>
        {
            isMobile &&
            <>   <BreadComp title={"Track your order"} />
            <div className="page-titile">Track your order
            </div></>
        }
        <div className="mytractrightside order-trackcard">
            <div className='ordrtract-title'>Track by Reference ID</div>
            <Inputbox
                id="referenceid"
                type="text"
                value={formData.referenceid}
                handleChange={handleChange}
                placeholder="Enter Reference ID"
                title="Reference ID"
                error={errors.referenceid}
            />
           
        </div>
        <div className="d-flex justify-content-end">
                <div
                    className={isFormValid() ? "activeformsubmitbutton profileviewsubmitbtn tw-cursor-pointer" : "formsubmitbutton profileviewsubmitbtn tw-cursor-pointer"}
                    onClick={isFormValid() ? handleSubmit : null}
                >
                    Submit
                </div>
            </div>
            <Orders orderlistdata={trackorderlistdata}/>
        </div>
       
    );
};

export default TrackbyReferenceid;
