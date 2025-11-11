import { useRef, useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { MultiSelect } from "react-multi-select-component";
import DoubleGradientButton from "@/components/Common/DoubleGradientButton";
import { getLocationsApi } from "@/api/others";
import { getAllAreasByEmirateId, getAllCategoryList } from "@/api/products";

const BusinessDetailsForm = ({ formData, setFormData, onBack, onNext }) => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedOtherCategories, setSelectedOtherCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [allAreas, setAllAreas] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const serviceableLocationsRef = useRef(null);
  const serviceableAreasRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const getLocationFunction = async () => {
      try {
        const response = await getLocationsApi();
        if (response && response?.data) {
          setLocationData(response?.data?.data);
        } else {
          console.error("API response is missing data property:", response);
          setLocationData([]);
        }
      } catch (error) {
        console.error("API call failed:", error);
        setLocationData([]);
      }
    };
    const getCategoryList = async () => {
      try {
        const response = await getAllCategoryList();
        if (response && response?.data) {
          setCategoryOptions(response?.data?.data);
        } else {
          console.error("API response is missing data property:", response);
          setCategoryOptions([]);
        }
      } catch (error) {
        console.error("API call failed:", error);
        setCategoryOptions([]);
      }
    };
    getLocationFunction();
    getCategoryList();
  }, []);

  const scrollToElement = (elementRef) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  };

  const categoryOptionsForSelect = categoryOptions.map((cat) => ({
    label: cat.category_name,
    value: cat.categoryid,
  }));

  const locationOptionsForSelect = locationData.map((location) => ({
    label: location.name,
    value: location.id,
  }));

  useEffect(() => {
    if (formData.category_id && formData.category_id.trim() !== "") {
      const categoryIds = formData.category_id
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
      const selectedCats = categoryOptionsForSelect.filter((cat) =>
        categoryIds.includes(cat.value)
      );
      setSelectedOtherCategories(selectedCats);
    }

    if (formData.emirate_id && formData.emirate_id.trim() !== "") {
      const locationIds = formData.emirate_id
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
      const selectedLocs = locationOptionsForSelect.filter((loc) =>
        locationIds.includes(loc.value)
      );
      setSelectedLocations(selectedLocs);

      if (locationIds.length > 0) {
        getAreas(locationIds);
      }
    }
  }, [locationData, categoryOptions, formData.category_id]);

  useEffect(() => {
    if (formData.area_id && formData.area_id.trim() !== "") {
      const areaIds = formData.area_id
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
      const selectedAreasData = areaOptionsForSelect.filter((area) =>
        areaIds.includes(area.value)
      );
      setSelectedAreas(selectedAreasData);
    }
  }, [allAreas, locationData, formData.area_id]);

  const areaOptionsForSelect = allAreas.map((area) => {
    const emirate = locationData.find((loc) => loc.id == area.emirateid);
    const emirateName = emirate ? emirate.name : "Unknown Emirate";

    return {
      label: `${area.name} - ${emirateName}`,
      value: area.id,
    };
  });

  const handleAreaChange = (selected) => {
    setSelectedAreas(selected);
    const areaIds = selected.map((item) => item.value);
    setFormData({
      ...formData,
      area_id: areaIds.join(","),
    });
  };

  const removeSelectedArea = (areaIdToRemove) => {
    const updatedAreas = selectedAreas.filter(
      (area) => area.value !== areaIdToRemove
    );
    setSelectedAreas(updatedAreas);
    const areaIds = updatedAreas.map((item) => item.value);
    setFormData((prevData) => ({
      ...prevData,
      area_id: areaIds.join(","),
    }));
  };

  const getAreaNameById = (areaId) => {
    const area = allAreas.find((area) => area.id === areaId);
    return area ? area.name : `Area ${areaId}`;
  };

  const selectedAreaValues = selectedAreas.map((item) => item.value);


  const getAreas = async (selectedLocationIds) => {
    try {
      const locationIdsString = selectedLocationIds.join(",");
      const response = await getAllAreasByEmirateId(locationIdsString);
      if (response && response?.data) {
        setAllAreas(response?.data?.data);
      } else {
        console.error("API response is missing data property:", response);
        setAllAreas([]);
      }
    } catch (error) {
      console.error("API call failed:", error);
      setAllAreas([]);
    }
  };

  const handleLocationChange = (selected) => {
    setSelectedLocations(selected);
    const locationIds = selected.map((item) => item.value);
    setFormData({
      ...formData,
      emirate_id: locationIds.join(","),
    });

    // Clear selected areas when locations change
    setSelectedAreas([]);
    setFormData((prev) => ({
      ...prev,
      area_id: "",
    }));

    if (selected.length > 0) {
      getAreas(locationIds);
    } else {
      setAllAreas([]);
    }
  };

  const handleCategoryChange = (selected) => {
    setSelectedOtherCategories(selected);
    const categoryValues = selected.map((item) => item.value);
    setFormData({
      ...formData,
      category_id: categoryValues.join(","),
    });
  };

  const handleCategoryButtonClick = (categoryType) => {
    if (categoryType === "all") {
      setSelectedOtherCategories([]);
      setFormData({
        ...formData,
        category: "all",
        category_id: "",
      });
    } else {
      setFormData({
        ...formData,
        category: "other",
      });
    }
  };

  const removeSelectedLocation = (locationIdToRemove) => {
    const updatedLocations = selectedLocations.filter(
      (loc) => loc.value !== locationIdToRemove
    );
    setSelectedLocations(updatedLocations);
    const locationIds = updatedLocations.map((item) => item.value);
    setFormData((prevData) => ({
      ...prevData,
      emirate_id: locationIds.join(","),
    }));

    setSelectedAreas([]);
    setFormData((prev) => ({
      ...prev,
      area_id: "",
    }));

    if (locationIds.length > 0) {
      getAreas(locationIds);
    } else {
      setAllAreas([]);
    }
  };

  const removeSelectedCategory = (categoryIdToRemove) => {
    const updatedCategories = selectedOtherCategories.filter(
      (cat) => cat.value !== categoryIdToRemove
    );
    setSelectedOtherCategories(updatedCategories);
    const categoryValues = updatedCategories.map((item) => item.value);
    setFormData((prevData) => ({
      ...prevData,
      category_id: categoryValues.join(","),
    }));
  };

  const selectedLocationValues = selectedLocations.map((item) => item.value);
  const selectedCategoryValues = selectedOtherCategories.map(
    (item) => item.value
  );

  const getCategoryNameById = (categoryId) => {
    const category = categoryOptions.find(
      (cat) => cat.categoryid === categoryId
    );
    return category ? category.category_name : `Category ${categoryId}`;
  };

  const getLocationNameById = (locationId) => {
    const location = locationData.find((loc) => loc.id === locationId);
    return location ? location.name : `Location ${locationId}`;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="flex flex-col gap-2.5 mb-7">
        <h2 className="font-bold text-3xl mb-0">Tell Us About Your Business</h2>
        <hr className="h-1 bg-[#E5E5E5] !m-0" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <label className="block font-bold">
            What are you looking to sell?
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-5">
            <button
              type="button"
              className={`flex items-center gap-3 px-3.5 py-2.5 !rounded-[4px] border-2 seller-sell-type-grid-border
                ${
                  formData?.category === "all"
                    ? "seller-category-selected bg-[#FCFCFC]"
                    : "seller-sell-type-grid-border bg-[#FCFCFC]"
                }`}
              onClick={() => handleCategoryButtonClick("all")}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="30" height="30" fill="url(#pattern0_86_2208)" />
                <defs>
                  <pattern
                    id="pattern0_86_2208"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlinkHref="#image0_86_2208"
                      transform="scale(0.0078125)"
                    />
                  </pattern>
                  <image
                    id="image0_86_2208"
                    width="128"
                    height="128"
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
              <span
                className={`font-medium text-[#656565] ${
                  formData?.category === "all"
                    ? "seller-category-selected !border-none"
                    : ""
                }`}
              >
                All categories
              </span>
            </button>
            <button
              type="button"
              className={`flex items-center gap-3 px-3.5 py-2.5 !rounded-[4px] border-2 seller-sell-type-grid-border
                ${
                  formData?.category === "other"
                    ? "seller-category-selected bg-[#FCFCFC]"
                    : "seller-sell-type-grid-border bg-[#FCFCFC]"
                }`}
              onClick={() => handleCategoryButtonClick("other")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <rect width="22" height="22" fill="url(#pattern0_86_2209)" />
                <defs>
                  <pattern
                    id="pattern0_86_2209"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlinkHref="#image0_86_2209"
                      transform="scale(0.0078125)"
                    />
                  </pattern>
                  <image
                    id="image0_86_2209"
                    width="128"
                    height="128"
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
              <span
                className={`font-medium text-[#656565] ${
                  formData?.category === "other"
                    ? "seller-category-selected !border-none"
                    : ""
                }`}
              >
                Specify Others
              </span>
            </button>
          </div>
        </div>

        {formData?.category === "other" && (
          <div className="flex flex-col gap-2.5">
            <label className="font-bold">
              Select Categories<span className="text-red-500">*</span>
            </label>

            {selectedCategoryValues.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {selectedCategoryValues.map((categoryId) => (
                  <span
                    key={categoryId}
                    className="inline-flex items-center justify-between gap-2 bg-[#f3f1fc] text-primary text-sm px-3 py-1.5 rounded-full"
                  >
                    {getCategoryNameById(categoryId)}
                    <button
                      type="button"
                      onClick={() => removeSelectedCategory(categoryId)}
                      className="text-primary border-none rounded-full"
                    >
                      <MdClose className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative">
              <MultiSelect
                options={categoryOptionsForSelect}
                value={selectedOtherCategories}
                onChange={handleCategoryChange}
                labelledBy="Select categories"
                hasSelectAll={false}
                disableSearch={false}
                className="w-100 seller-sell-type-grid-border"
                valueRenderer={() => "Search categories..."}
                overrideStrings={{
                  selectSomeItems: "Search categories...",
                  allItemsAreSelected: "All categories selected",
                  selectAll: "Select All",
                  search: "Search...",
                }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <label className="block font-bold">
            Business Name<span className="text-red-500">*</span>
          </label>
          <input
            className="block seller-sell-type-grid-border px-4 py-2 w-full"
            type="text"
            name="business_name"
            value={formData?.business_name || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                business_name: e.target.value.replace(/[^A-Za-z\s]/g, ""),
              })
            }
            placeholder="Enter your business name"
            required
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="font-bold">
            Business Location<span className="text-red-500">*</span>
          </label>
          <input
            className="block seller-sell-type-grid-border px-4 py-2 w-full"
            type="text"
            name="business_address"
            value={formData?.business_address || ""}
            onChange={handleChange}
            placeholder="Enter your business location"
            required
          />
        </div>

        <div className="flex flex-col gap-2.5" ref={serviceableLocationsRef}>
          <label className="font-bold">
            Serviceable Locations<span className="text-red-500">*</span>
          </label>

          {selectedLocationValues.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {selectedLocationValues.map((locationId) => (
                <span
                  key={locationId}
                  className="inline-flex items-center justify-between gap-2 bg-[#f3f1fc] text-primary text-sm px-3 py-1.5 rounded-full"
                >
                  {getLocationNameById(locationId)}
                  <button
                    type="button"
                    onClick={() => removeSelectedLocation(locationId)}
                    className="text-primary border-none rounded-full"
                  >
                    <MdClose className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="relative">
            <MultiSelect
              options={locationOptionsForSelect}
              value={selectedLocations}
              onChange={handleLocationChange}
              labelledBy="Select serviceable locations"
              hasSelectAll={false}
              disableSearch={false}
              onMenuToggle={(isOpen) => {
                if (isOpen) {
                  setTimeout(
                    () => scrollToElement(serviceableLocationsRef),
                    100
                  );
                }
              }}
              className="w-full seller-sell-type-grid-border"
              valueRenderer={() => "Search serviceable locations..."}
              overrideStrings={{
                selectSomeItems: "Search serviceable locations...",
                allItemsAreSelected: "All locations selected",
                selectAll: "Select All",
                search: "Search...",
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <label className="font-bold">
            Serviceable Areas<span className="text-red-500">*</span>
          </label>

          {selectedAreaValues.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {selectedAreaValues.map((areaId) => (
                <span
                  key={areaId}
                  className="inline-flex items-center justify-between gap-2 bg-[#f3f1fc] text-primary text-sm px-3 py-1.5 rounded-full"
                >
                  {getAreaNameById(areaId)}
                  <button
                    type="button"
                    onClick={() => removeSelectedArea(areaId)}
                    className="text-primary border-none rounded-full"
                  >
                    <MdClose className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="relative" ref={serviceableAreasRef}>
            <MultiSelect
              disabled={allAreas?.length === 0}
              options={areaOptionsForSelect}
              value={selectedAreas}
              onChange={handleAreaChange}
              labelledBy="Select serviceable areas"
              hasSelectAll={false}
              disableSearch={false}
              onMenuToggle={(isOpen) => {
                if (isOpen) {
                  setTimeout(() => scrollToElement(serviceableAreasRef), 100);
                }
              }}
              className={`w-full seller-sell-type-grid-border`}
              valueRenderer={() => "Search serviceable areas..."}
              overrideStrings={{
                selectSomeItems: "Search serviceable areas...",
                allItemsAreSelected: "All areas selected",
                selectAll: "Select All",
                search: "Search...",
              }}
            />
          </div>
        </div>

        <DoubleGradientButton title="Next" className="!mt-0" />
      </div>
    </form>
  );
};

export default BusinessDetailsForm;
