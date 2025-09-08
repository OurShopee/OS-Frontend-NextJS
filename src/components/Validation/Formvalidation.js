import { useEffect } from "react";
import { useSelector } from "react-redux";

const useFormValidation = (formData, setFormData, setErrors, handleNext) => {
    const currentcountry = useSelector((state) => state.globalslice.currentcountry);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // setFormData(prev => ({
        //     ...prev,
        //     [name]: type === "checkbox" ? checked : value
        // }));
        let newValue = value;

        // If the field should accept only alphabets (e.g. for 'name' input)
        if (name === "first_name") {
            newValue = value.replace(/[^A-Za-z\s]/g, '');  // Remove non-alphabet characters
        }

        if (name === "mobile") {
            newValue = value.replace(/\D/g, "").slice(0, currentcountry.isAreaCodeRequired ? 9 : currentcountry.number_count)
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : newValue
        }));
    };

    const handleSubmit = (e) => {
        if (e?.preventDefault) e.preventDefault();
        formData && handleNext();
    };

    useEffect(() => {
        setFormData(formData);
    }, [formData]);

    return {
        handleChange,
        handleSubmit
    };
};

export default useFormValidation;
