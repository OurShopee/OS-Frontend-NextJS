import {
  clearance_saleApi,
  getAllItemsApi,
  getdeal_of_the_dayApi,
  getfiltered_items,
  getInfinteScrollItemsApi,
  getSectionPagesApi,
  gettop_selling_productsApi,
} from "@/api/products";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setcatloading,
  setdisplayed_products,
  sethas_more,
  setscrolled_products,
  setsection_pages_Data,
  setsectionloading,
  setsubcategoryScreen,
} from "@/redux/categoryslice";
import {
  setclearence_sale_items,
  setdeal_of_the_day_items,
  setloading10,
  setloading7,
  settrending_products,
} from "@/redux/homeslice";

const Category = () => {
  const dispatch = useDispatch();
  const displayed_products = useSelector(
    (state) => state.categoryslice.displayed_products
  );
  const scrolled_products = useSelector(
    (state) => state.categoryslice.scrolled_products
  );
  const trending_products = useSelector(
    (state) => state.homeslice.trending_products
  );
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getSubCatScreenList = async (input_data) => {
    if (input_data.page < 1) {
      dispatch(setcatloading(true));
    }
    if (pathname.split("/")[1] == "brands") {
      var response = await filtered_items({
        ...input_data,
        searchString: input_data.slug || input_data.searchString,
      });
      // var response = await getAllBrandItemsApi(input_data);
    } else if (pathname.split("/")[1] == "search-result") {
      const subcategoryValue = searchParams.get("subcategory");
      const subcategoryId = subcategoryValue
        ? subcategoryValue.split("_")[0]
        : "search";
      input_data.subcategoryId = subcategoryId;
      var response = await filtered_items({
        ...input_data,
        searchString: input_data.slug || input_data.searchString,
      });
      // var response = await getSearchResultApi(input_data); // old
    } else {
      // var response = await getSubCatScreenApi(input_data);
      var response = await filtered_items({
        ...input_data,
        searchString: input_data.slug || input_data.searchString,
      });
    }
    if (response?.data?.status == "success") {
      if (response.data.data.hasOwnProperty("redirect_url")) {
        dispatch(setcatloading(true));
        if (response.data.data.type == "subcategory") {
          router.push(`/products-category/${response.data.data.redirect_url}`);
        } else if (response.data.data.type == "brands") {
          router.push(`/brands/${response.data.data.redirect_url}`);
        } else {
          router.push(new URL(response.data.data.redirect_url).pathname);
        }
      } else {
        dispatch(setsubcategoryScreen(response.data.data));
        if (input_data.page === 0) {
          if (response.data.data.display_items.products.length === 0) {
            dispatch(setdisplayed_products([]));
          } else {
            dispatch(
              setdisplayed_products(response.data.data.display_items.products)
            );
          }
        } else {
          dispatch(
            setdisplayed_products([
              ...displayed_products,
              ...response.data.data.display_items.products,
            ])
          );
        }
        if (response.data.data.display_items.products.length < 10) {
          dispatch(sethas_more(false));
        } else {
          dispatch(sethas_more(true));
        }
        dispatch(setcatloading(false));
        return response.data.data;
      }
    } else {
      dispatch(setcatloading(true));
    }
    return null;
  };

  const getInfiniteScrollList = async (type, page, sethas_more) => {
    if (page <= 1) {
      dispatch(setcatloading(true));
    }
    var response = await getInfinteScrollItemsApi(type, page);
    if (response.data.data.length == 0) {
      sethas_more(false);
    }
    if (page <= 1) {
      dispatch(setscrolled_products(response.data.data));
    }
    if (page > 1) {
      dispatch(
        setscrolled_products([...scrolled_products, ...response.data.data])
      );
    }
  };

  const getAllItems = async (slug, page, sethas_more) => {
    if (page <= 1) {
      dispatch(setcatloading(true));
    }
    var response = await getAllItemsApi(slug, page);
    if (response.data.data.length == 0) {
      sethas_more(false);
    }
    if (page <= 1) {
      dispatch(setscrolled_products(response.data.data));
    }
    if (page > 1) {
      dispatch(
        setscrolled_products([...scrolled_products, ...response.data.data])
      );
    }
  };

  const getdeal_of_the_dayList = async (page, sethas_more) => {
    if (page <= 1) {
      dispatch(setloading7(true));
    }
    var response = await getdeal_of_the_dayApi(page);
    dispatch(setloading7(false));
    if (page <= 1) {
      dispatch(setdeal_of_the_day_items(response.data.data));
      dispatch(settrending_products(response.data.data.trending_products));
    }
    if (response.data.data.trending_products == 0) {
      sethas_more(false);
    }
    if (page > 1) {
      dispatch(
        settrending_products([
          ...trending_products,
          ...response.data.data.trending_products,
        ])
      );
    }
  };

  const getclearence_Sale_List = async (page, sethas_more, limit = 4) => {
    if (page <= 1) {
      dispatch(setloading10(true));
    }
    var response = await clearance_saleApi(page, limit);
    dispatch(setloading10(false));
    if (page <= 1) {
      dispatch(setclearence_sale_items(response.data.data));
      dispatch(settrending_products(response.data.data.items));
    }
    if (response.data.data.items == 0) {
      sethas_more(false);
    }
    if (page > 1) {
      dispatch(
        settrending_products([
          ...trending_products,
          ...response.data.data.items,
        ])
      );
    }
  };

  const gettop_selling_product = async (page, sethas_more) => {
    if (page <= 1) {
      dispatch(setloading7(true));
    }
    var response = await gettop_selling_productsApi(page);
    dispatch(setloading7(false));
    if (page <= 1) {
      dispatch(setdeal_of_the_day_items(response.data.data));
      dispatch(settrending_products(response.data.data.top_Selling_products));
    }
    if (response.data.data.top_Selling_products == 0) {
      sethas_more(false);
    }
    if (page > 1) {
      dispatch(
        settrending_products([
          ...trending_products,
          ...response.data.data.top_Selling_products,
        ])
      );
    }
  };

  const getSectionPages = async (id, eidSale) => {
    dispatch(setsectionloading(true));
    const response = await getSectionPagesApi(id, eidSale);
    if (response.data.status == "success") {
      dispatch(setsection_pages_Data(response.data.data));
      dispatch(setsectionloading(false));
    } else {
      dispatch(setsectionloading(false));
    }
  };

  const filtered_items = async (input_data) => {
    const response = await getfiltered_items(input_data);
    if (response.data.status == "success") {
      dispatch(
        setdisplayed_products(response.data.data.display_items.products)
      );
      if (response.data.data.display_items.products.length < 10) {
        dispatch(sethas_more(false));
      }
      if (input_data.page > 0) {
        dispatch(
          setdisplayed_products([
            ...displayed_products,
            ...response.data.data.display_items.products,
          ])
        );
      }
      return response;
    } else {
    }
  };

  return {
    getSubCatScreenList,
    getclearence_Sale_List,
    filtered_items,
    getAllItems,
    getInfiniteScrollList,
    getSectionPages,
    getdeal_of_the_dayList,
    gettop_selling_product,
  };
};

export default Category;
