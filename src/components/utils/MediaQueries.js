import { useMediaQuery } from "react-responsive";

const MediaQueries = () => {
      const isLaptop = useMediaQuery({ query: `(max-width: 991px)` });
      const isTablet = useMediaQuery({ query: `(max-width: 768px)` });
      const isMobile = useMediaQuery({ query: `(max-width: 576px)` });
    return {
        isLaptop: isLaptop,
        isTablet: isTablet,
        isMobile:isMobile
    }
}

export default MediaQueries;
