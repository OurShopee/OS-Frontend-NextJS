import { useDispatch, useSelector } from "react-redux";
import { setformmodal, setformstatus } from "../../redux/formslice";
export const normalizeUrl = (url = window.location.href) => {
  try {
    const parsedUrl = new URL(url);
    // Remove 'www.' if present
    let hostname = parsedUrl.hostname.replace(/^www\./, "");
    return `https://${hostname}`;
  } catch (error) {
    console.error("Invalid URL provided:", url);
    return "";
  }
};

// utils/commonFunctions.js

export const useLoginModal = () => {
  const dispatch = useDispatch();
  const formmodal = useSelector((state) => state.globalslice.formmodal);

  const openLoginModal = () => {
    dispatch(setformmodal(!formmodal));
    dispatch(setformstatus(1)); // 1 = login
  };

  return { openLoginModal };
};

export const getImageUrl = (image) => {
  if (image.startsWith("https")) {
    return image;
  } else {
    const baseUrl = process.env.NEXT_PUBLIC_S3_PREFIX;
    return `${baseUrl}${image}`;
  }
};
