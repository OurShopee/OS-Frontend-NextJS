// components/ProductForm.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
// import { getLocationsApi, getAreasApi, addFeed } from '../../services/Apis'; // Import API base URL from config
import { useSelector, useDispatch } from 'react-redux';
import { pushToDataLayer } from '../utils/dataUserpush';
import { toast } from 'react-toastify';
import { checkmobileotpapi, setotpmodal, setregistermobile, setregisterapicall } from '../../redux/formslice';
import { getAreasApi, getLocationsApi, addFeed } from '@/api/others';
import { checkmobileotp } from '@/api/user';


// --- Helper Functions ---

// Validates input fields based on type and requirement
const validateInput = (value, fieldName, type = 'text', country) => {



    if (!value || String(value).trim() === '') {
        return `${fieldName} is Required.`;
    }
    if (type === 'phone') {
        const trimmedValue = String(value).trim();

        // UAE specific validation (9 digits with prefix)
        if (country.toLowerCase() === 'uae') {
            if (!/^[5][0-9]{8}$/.test(trimmedValue)) {
                return 'UAE number must start with 5 followed by 8 digits (e.g., 501234567)';
            }
        }
        // Other countries validation (8 digits)
        else {
            if (!/^\d{8}$/.test(trimmedValue)) {
                return 'Phone number must be exactly 8 digits';
            }
        }
    }
    return ''; // No error
};

// Get phone number placeholder based on country
const getPhonePlaceholder = (country) => {
    if (country.toLowerCase() === 'uae') {
        return '5xxxxxxxx';
    }
    return 'xxxxxxxx';
};

// Get max length based on country
const getMaxLength = (country) => {
    return country.toLowerCase() === 'uae' ? 9 : 8;
};


// --- Component ---

const ProductForm = ({ product, queryParams, Webfeed }) => {
    // --- State Hooks ---
    console.log(product)
    const dispatch = useDispatch();
    const currentcountry = useSelector((state) => state.globalslice.currentcountry);
    const country = currentcountry.name
    const [formData, setFormData] = useState({
        form_name: '',
        contact_no: '',
        quantity: '1',
        location: '', // Holds selected Location ID
        area: '',     // Holds selected Area ID
        delivery_address: '',
        product: product?.sku || '', // Product SKU from props
        price: product?.display_price || '0.00', // Product price from props
        // UTM and tracking parameters from queryParams or defaults
        orderfrom: queryParams?.orderfrom || 'Web',
        source: queryParams?.source || '',
        medium: queryParams?.medium || '',
        campaign: queryParams?.campaign || '',
        content: queryParams?.content || '',
        term: queryParams?.term || '',
    });
    const [errors, setErrors] = useState({}); // Form validation errors
    const [locations, setLocations] = useState([]); // List of locations (e.g., Governorates, Emirates) fetched from API
    const [areas, setAreas] = useState([]); // List of areas within a selected location, fetched from API
    const [loadingLocations, setLoadingLocations] = useState(false); // Loading state for locations fetch
    const [loadingAreas, setLoadingAreas] = useState(false); // Loading state for areas fetch
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
    const [submissionStatus, setSubmissionStatus] = useState({ message: '', type: '' }); // Feedback message after submission (success/error)
    const [mapCoords, setMapCoords] = useState(null); // Coordinates selected from the map
    
    // OTP Verification State
    const [pendingFormData, setPendingFormData] = useState(null);

    // --- Event Handlers ---

    // Listen for OTP verification success from Redux state
    const optmodalopen = useSelector((state) => state.formslice.optmodalopen);
    
    // Add a new effect to handle OTP verification success from Redux
    const registerapicall = useSelector((state) => state.formslice.registerapicall);
    
    useEffect(() => {
        console.log("Redux effect triggered - registerapicall:", registerapicall, "pendingFormData:", pendingFormData, "optmodalopen:", optmodalopen);
        if (registerapicall && pendingFormData && !optmodalopen) {
            console.log("OTP verification successful, submitting form...");
            // OTP verification was successful (Redux state indicates this)
            // Call the submission function immediately
            const submitForm = async () => {
                try {
                    await submitFormAfterOTP();
                } catch (error) {
                    console.error("Error submitting form after OTP:", error);
                }
            };
            
            submitForm();
        }
    }, [registerapicall, pendingFormData, optmodalopen]);

    // Updates formData state on input changes and clears related errors/status
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Phone number validation
        if (name === 'contact_no') {
            // Only allow numbers
            const numericValue = value.replace(/[^\d]/g, '');
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Reset area when location changes
        if (name === 'location') {
            setFormData(prev => ({ ...prev, area: '' }));
            setAreas([]);
        }

        // Clear specific error when user types in the field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        // Clear submission status message on new input
        if (submissionStatus.message) {
            setSubmissionStatus({ message: '', type: '' });
        }
    };

    // --- Effects ---

    // Fetches the list of locations (e.g., Governorates, Emirates) on component mount
    useEffect(() => {
        const fetchLocations = async () => {
            setLoadingLocations(true);
            setErrors(prev => ({ ...prev, location: '' })); // Clear previous location errors
            try {
                const data = await getLocationsApi();
                if (data?.status === 200 && Array.isArray(data.data?.data)) {
                    setLocations(data.data?.data); // Set locations list from API response
                } else {
                    console.error("Invalid locations API response:", data);
                    setErrors(prev => ({ ...prev, location: 'Failed to load locations (invalid format).' }));
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
                setErrors(prev => ({ ...prev, location: 'Failed to load locations.' }));
            } finally {
                setLoadingLocations(false);
            }
        };
        fetchLocations();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Fetches areas based on the selected location ID (formData.location)
    useEffect(() => {
        const fetchAreas = async () => {
            if (formData.location) { // Only fetch if a location ID is selected
                setLoadingAreas(true);
                setAreas([]); // Clear previous areas
                setErrors(prev => ({ ...prev, area: '' })); // Clear previous area errors
                try {
                    // Fetch areas using the selected location ID
                    const data = await getAreasApi(formData.location)
                    if (data?.status === 200 && Array.isArray(data.data?.data)) {
                        setAreas(data.data?.data || []); // Set areas list from API response
                    } else {
                        console.error("Invalid areas API response:", data);
                        setErrors(prev => ({ ...prev, area: 'Failed to load areas (invalid format).' }));
                    }
                } catch (error) {
                    console.error("Error fetching areas:", error);
                    setErrors(prev => ({ ...prev, area: 'Failed to load areas.' }));
                } finally {
                    setLoadingAreas(false);
                }
            } else {
                setAreas([]); // Clear areas if no location is selected
            }
        };
        fetchAreas();
    }, [formData.location]); // Re-run this effect when the selected location ID changes

    // Handles location selection from the MapLocationSelector component
    const handleLocationSelect = useCallback((place, coords) => {
        setMapCoords(coords); // Store selected map coordinates

        if (place?.address_components && locations.length > 0) {
            let locationNameFromMap = ''; // Governorate/City from map data
            let areaNameFromMap = '';     // Sublocality/Area from map data

            // Extract location and area names from Google Place address components
            place.address_components.forEach(component => {
                const types = component.types;
                const name = component.long_name;
                // Find Governorate/Emirate/City
                if (types.includes("administrative_area_level_1")) { // Primary target (e.g., Manama Governorate)
                    locationNameFromMap = name;
                } else if (!locationNameFromMap && types.includes("locality") && types.includes("political")) { // Fallback (e.g., Manama city)
                    locationNameFromMap = name;
                }
                // Find Area/Sublocality
                if (types.includes("sublocality") || types.includes("locality")) {
                    areaNameFromMap = name; // Prefer sublocality if available
                }
            });

            // Match extracted location name with the fetched locations list
            if (locationNameFromMap) {
                // Find the location in our list that matches the name from the map
                const matchedLocation = locations.find(loc =>
                    loc.name.toLowerCase().trim() === locationNameFromMap.toLowerCase().trim()
                    // Consider adding more robust matching (e.g., removing "Governorate") if needed
                );

                if (matchedLocation) {
                    // If matched, set the location ID in formData and clear errors
                    setFormData(prev => ({ ...prev, location: matchedLocation.id, area: '' })); // Update location ID
                    setErrors(prev => ({ ...prev, location: '' }));
                    // Temporarily store the area name from map to auto-select later (once areas are fetched)
                    sessionStorage.setItem('selectedAreaNameFromMap', areaNameFromMap || '');
                } else {
                    console.warn("Map location not matched in dropdown list:", locationNameFromMap);
                    // Optionally: Clear selection or show a message if no match found
                }
            }

            // Set the detailed address from the map result
            if (place.formatted_address) {
                setFormData(prev => ({ ...prev, delivery_address: place.formatted_address }));
                setErrors(prev => ({ ...prev, delivery_address: '' }));
            }
        }
    }, [locations]); // Depends on the fetched locations list

    // Attempts to auto-select the area dropdown based on the name derived from the map selection
    useEffect(() => {
        // Retrieve the area name temporarily stored after map selection
        const areaNameFromMap = sessionStorage.getItem('selectedAreaNameFromMap');
        // Check if location is set, areas are loaded, and we have an area name from the map
        if (formData.location && areas.length > 0 && areaNameFromMap) {
            // Find the area in the current list that matches the name from the map
            const matchedArea = areas.find(a => a.name.toLowerCase().trim() === areaNameFromMap.toLowerCase().trim());
            if (matchedArea) {
                // If matched, set the area ID in formData and clear errors
                setFormData(prev => ({ ...prev, area: matchedArea.id }));
                setErrors(prev => ({ ...prev, area: '' }));
                sessionStorage.removeItem('selectedAreaNameFromMap'); // Clean up storage
            } else {
                sessionStorage.removeItem('selectedAreaNameFromMap'); // Clean up storage
            }
        }
    }, [areas, formData.location]); // Runs when areas list or selected location changes


    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsSubmitting(true);
        setSubmissionStatus({ message: '', type: '' });
        setErrors({}); // Clear previous errors

        // --- Validation ---
        const currentErrors = {};
        currentErrors.form_name = validateInput(formData.form_name, 'Full Name');
        currentErrors.contact_no = validateInput(formData.contact_no, 'Contact Number', 'phone', country);
        currentErrors.location = validateInput(formData.location, 'Location'); // Validate location ID
        currentErrors.area = validateInput(formData.area, 'Area'); // Validate area ID
        currentErrors.delivery_address = validateInput(formData.delivery_address, 'Street/Flat No');
        currentErrors.quantity = validateInput(formData.quantity, 'Quantity');
        // Check if any validation errors exist
        const hasErrors = Object.values(currentErrors).some(error => error !== '');
        if (hasErrors) {
            setErrors(currentErrors);
            setIsSubmitting(false);
            toast.error("Please Fill All Required Fields.")
            setSubmissionStatus({ message: 'Please Fill All Required Fields.', type: 'error' });
            // Focus the first field with an error for better UX
            const firstErrorField = Object.keys(currentErrors).find(key => currentErrors[key]);
            if (firstErrorField) {
                document.getElementsByName(firstErrorField)?.[0]?.focus();
            }
            return; // Stop submission if validation fails
        }

        const apiData = {
            form_name: formData.form_name.trim(),
            contact_no: `${currentcountry.country_code}${formData.contact_no.trim()}`,
            product: formData.product,
            emirate: formData.location,
            area: formData.area,
            delivery_address: formData.delivery_address.trim(),
            orderfrom: Webfeed ? Webfeed : "WebFeed",
            price: formData.price,
            quantity: formData.quantity,
            productid: product?.id,
            //   source: apiSource, medium: formData.medium, campaign: formData.campaign, content: formData.content, term: formData.term,
        };
        const selectedLocationName = locations.find(loc => loc.id === parseInt(formData.location))?.name || 'N/A';
        const selectedAreaName = areas.find(ar => ar.id === parseInt(formData.area))?.name || 'N/A';

        // Store form data for later submission after OTP verification
        console.log("Setting pendingFormData:", apiData);
        setPendingFormData(apiData);
        
        // Call checkMobile API to send OTP
        try {
            const mobileNumber = formData.contact_no.trim();
            dispatch(setregistermobile(mobileNumber));
            const result = await dispatch(checkmobileotp({ mobile: mobileNumber }));
            
            if (result.payload.status === "success") {
                // Show OTP verification modal
                dispatch(setotpmodal(true));
            } else {
                toast.error(result.payload.message || "Failed to send OTP");
                setSubmissionStatus({ message: result.payload.message || 'Failed to send OTP. Please try again.', type: 'error' });
            }
        } catch (error) {
            console.error("OTP send error:", error);
            toast.error("Failed to send OTP. Please try again.");
            setSubmissionStatus({ message: 'Failed to send OTP. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to submit form after OTP verification
    const submitFormAfterOTP = async () => {
        console.log("submitFormAfterOTP called with data:", pendingFormData);
        if (!pendingFormData) {
            console.log("No pending form data, returning early");
            return;
        }
        
        setIsSubmitting(true);
        try {
            console.log("Calling addFeed API...");
            const result = await addFeed(pendingFormData);
            console.log("addFeed API response:", result);
            
            if (result.data.status === "success") {
                // --- Success ---
                setSubmissionStatus({ message: result.message || 'Order submitted successfully!', type: 'success' });
                toast.success("Order submitted successfully!")
                
                // Push to data layer for successful order submission
                const selectedLocationName = locations.find(loc => loc.id === parseInt(pendingFormData.emirate))?.name || 'N/A';
                pushToDataLayer("submitted_feed_order", currentcountry.name, {
                    form_name: pendingFormData.form_name,
                    contact_no: pendingFormData.contact_no,
                    product: pendingFormData.product,
                    emirate: pendingFormData.emirate,
                    area: pendingFormData.area,
                    delivery_address: pendingFormData.delivery_address,
                    source: pendingFormData.orderfrom,
                    price: pendingFormData.price,
                    quantity: pendingFormData.quantity,
                    sku_id: product?.sku,
                    product_name: product?.name,
                    product_price: `${currentcountry.currency} ${product?.display_price || '0.00'}`,
                    location: selectedLocationName,
                    order_id: result.data.order_id || '',
                    order_status: 'submitted',
                });

                // Reset form and states
                setFormData({
                    form_name: '', contact_no: '', quantity: '1', location: '',
                    area: '', delivery_address: '',
                    product: product?.sku || '', price: product?.special_price || '0.00',
                    orderfrom: queryParams?.orderfrom || 'WebFeed', source: queryParams?.source || '',
                    medium: queryParams?.medium || '', campaign: queryParams?.campaign || '',
                    content: queryParams?.content || '', term: queryParams?.term || '',
                });
                setAreas([]); // Clear areas dropdown
                setMapCoords(null); // Reset map coordinates
                setPendingFormData(null); // Clear pending data
                dispatch(setotpmodal(false)); // Close OTP modal
                dispatch(setregisterapicall(false)); // Reset Redux OTP verification state
                
                // Clear the map search input (if it exists)
                const searchInput = document.querySelector('input[placeholder*="Search for a location"]');
                if (searchInput) searchInput.value = '';
            } else {
                // --- Submission Failure (API returned error) ---
                setSubmissionStatus({ message: result.message || 'Submission failed. Please try again.', type: 'error' });
                toast.error("Submission failed. Please try again.")
            }
        } catch (error) {
            // --- Submission Error (Network or unexpected issue) ---
            console.error("Submission catch error:", error);
            setSubmissionStatus({ message: 'An unexpected error occurred during submission.', type: 'error' });
        } finally {
            setIsSubmitting(false); // Re-enable submit button
        }
    };


    // --- Render JSX ---
    return (
        <div className="w-full p-0">
            <p className="text-xs text-gray-500 mb-4">*Fill out the form to request an order, our team will review your details and contact you to confirm pricing, availability, and next steps.</p>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Name Input */}
                <div className="space-y-2">
                    <label htmlFor="form_name" className="block text-sm font-semibold text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="form_name"
                        name="form_name"
                        value={formData.form_name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            errors.form_name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter Full name"
                        disabled={isSubmitting}
                        required
                    />
                    {errors.form_name && (
                        <div className="text-sm text-red-600 mt-1">{errors.form_name}</div>
                    )}
                </div>

                {/* Phone Number and Quantity Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="contact_no" className="block text-sm font-semibold text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                {currentcountry.country_code}
                            </span>
                            <input
                                type="tel"
                                id="contact_no"
                                name="contact_no"
                                value={formData.contact_no}
                                onChange={handleChange}
                                className={`flex-1 px-3 py-2 border rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                    errors.contact_no ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                                }`}
                                placeholder={getPhonePlaceholder(country)}
                                maxLength={getMaxLength(country)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                        {errors.contact_no && (
                            <div className="text-sm text-red-600 mt-1">{errors.contact_no}</div>
                        )}
                    </div>

                    {/* Quantity Input */}
                    <div className="space-y-2">
                        <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700">
                            Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                errors.quantity ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                            }`}
                            min="1"
                            disabled={isSubmitting}
                            required
                        />
                        {errors.quantity && (
                            <div className="text-sm text-red-600 mt-1">{errors.quantity}</div>
                        )}
                    </div>
                </div>

                {/* Location Select */}
                <div className="space-y-2">
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
                        Location <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            errors.location ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting || loadingLocations}
                        required
                    >
                        <option value="">Select Location</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
                    {loadingLocations && (
                        <div className="flex items-center mt-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                            <span className="ml-2 text-sm text-gray-500">Loading locations...</span>
                        </div>
                    )}
                    {errors.location && (
                        <div className="text-sm text-red-600 mt-1">{errors.location}</div>
                    )}
                </div>

                {/* Area Select */}
                <div className="space-y-2">
                    <label htmlFor="area" className="block text-sm font-semibold text-gray-700">
                        Area <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            errors.area ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting || loadingAreas || !formData.location}
                        required
                    >
                        <option value="">Select Area</option>
                        {areas.map(area => (
                            <option key={area.id} value={area.id}>
                                {area.name}
                            </option>
                        ))}
                    </select>
                    {loadingAreas && (
                        <div className="flex items-center mt-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                            <span className="ml-2 text-sm text-gray-500">Loading areas...</span>
                        </div>
                    )}
                    {errors.area && (
                        <div className="text-sm text-red-600 mt-1">{errors.area}</div>
                    )}
                </div>

                {/* Delivery Address */}
                <div className="space-y-2">
                    <label htmlFor="delivery_address" className="block text-sm font-semibold text-gray-700">
                        Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="delivery_address"
                        name="delivery_address"
                        value={formData.delivery_address}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            errors.delivery_address ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                        }`}
                        rows="3"
                        placeholder="Enter your delivery address"
                        disabled={isSubmitting}
                        required
                    />
                    {errors.delivery_address && (
                        <div className="text-sm text-red-600 mt-1">{errors.delivery_address}</div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="w-full">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Submitting...
                            </>
                        ) : (
                            'Submit Order'
                        )}
                    </button>
                </div>

                {/* Submission Status Message */}
                {submissionStatus.message && (
                    <div className={`p-4 rounded-md ${
                        submissionStatus.type === 'success' 
                            ? 'bg-green-50 border border-green-200 text-green-800' 
                            : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                        {submissionStatus.message}
                    </div>
                )}
            </form>
            
            {/* OTP Verification is handled by the centralized Modal component */}
        </div>
    );
};

export default ProductForm;