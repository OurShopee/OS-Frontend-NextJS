import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function useCurrentLocation({ inputs }) {
    const [formValues, setFormValues] = useState({});
    const [errors, seterrors] = useState({});

    const currentcountry = useSelector((state) => state.globalslice.currentcountry);


    const [isClickable, setisClickable] = useState(false);


    useEffect(() => {
        const isSubmit = inputs.every(key => key in formValues);
        if (isSubmit) {
            setisClickable(true);
        } else {
            setisClickable(false);
        }

    }, [formValues])


    const handleChange = (event) => {
        setFormValues(prev => {
            const updated = { ...prev };
            if (event.target.value == '' || event.target.value == 0 || (event.target.name == 'number' && event.target.value.length < currentcountry.number_count)) {
                delete updated[event.target.name];
            } else {
                if (event.target.name == 'number') {
                    if (event.target.value.length <= currentcountry.number_count) {
                        updated[event.target.name] = event.target.value;
                    }
                } else {
                    updated[event.target.name] = event.target.value;
                }
            }
            return updated;
        });
    }

    const handleSubmit = () => {
        seterrors(inputs)
    }
    return { handleChange, formValues, setFormValues, handleSubmit, errors, isClickable };
}