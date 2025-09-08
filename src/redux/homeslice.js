import { bundle_clearance_saleApi, getbannerApi, getbrand_weekApi, getcategory_itemsApi, getdeal_offersApi, getDealOfTheDayApi, getSaverZoneApi, gettop_selling_productsApi, getTopPicksApi, getTopSellingApi } from "@/api/products";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getbannerList = createAsyncThunk("getbannerList", async () => {
    const res = await getbannerApi();
    return res.data.data
});

export const getdeal_offersList = createAsyncThunk("getdeal_offersList", async () => {
    const res = await getdeal_offersApi();
    return res.data.data
});

export const getDealOfTheDayList = createAsyncThunk("getDealOfTheDayList", async () => {
    const res = await getDealOfTheDayApi();
    return res.data.data
});

export const getbrand_week = createAsyncThunk("getbrand_week", async () => {
    const res = await getbrand_weekApi();
    return res.data
});

export const getSaverZoneList = createAsyncThunk("getSaverZoneList", async () => {
    const res = await getSaverZoneApi();
    return res.data.data
});

export const getTopSellingList = createAsyncThunk("getTopSellingList", async () => {
    const res = await getTopSellingApi();
    return res.data.data
});

export const getTopPicksList = createAsyncThunk("getTopPicksList", async () => {
    const res = await getTopPicksApi();
    return res.data.data
});

export const getcategory_items = createAsyncThunk("getcategory_items", async () => {
    const res = await getcategory_itemsApi();
    return res.data.data
});


export const gettop_selling_product = createAsyncThunk("gettop_selling_product", async (page) => {
    const res = await gettop_selling_productsApi(page);
    return res.data.data
});

export const getbundle_clearance_sale = createAsyncThunk("getbundle_clearance_sale", async () => {
    const res = await bundle_clearance_saleApi();
    return res.data
});

const homeslice = createSlice({
    name: "homeslice",
    initialState: {
        bannerList: [],
        DealOfTheDay: [],
        TopSelling: [],
        saver_zone: [],
        top_picks: [],
        home_category_items: [],
        deal_of_the_day_items: {},
        clearence_sale_items: {},
        trending_products:[],
        bundle_clearance_sale: {},
        brand_week: [],
        deals_offers: {},
        loading: true,
        loading1: true,
        loading2: true,
        loading3: true,
        loading4: true,
        loading5: true,
        loading6: true,
        loading7: true,
        loading8: true,
        loading9: true,
        loading10: true,
        error: null
    },
    reducers: {
        setloading7: (state, action) => {
            state.loading7 = action.payload;
        },
        setloading10: (state, action) => {
            state.loading10 = action.payload;
        },
        setdeal_of_the_day_items: (state, action) => {
            state.deal_of_the_day_items = action.payload;
        },
        setclearence_sale_items: (state, action) => {
            state.clearence_sale_items = action.payload;
        },
        settrending_products: (state, action) => {
            state.trending_products = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getbannerList.pending, (state) => {
                state.loading = true;
            })
            .addCase(getbannerList.fulfilled, (state, action) => {
                state.loading = false;
                state.bannerList = action.payload;
            })
            .addCase(getbannerList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(getdeal_offersList.pending, (state) => {
                state.loading1 = true;
            })
            .addCase(getdeal_offersList.fulfilled, (state, action) => {
                state.loading1 = false;
                state.deals_offers = action.payload;
            })
            .addCase(getdeal_offersList.rejected, (state, action) => {
                state.loading1 = false;
                state.error = action.error.message;
            })

            .addCase(getDealOfTheDayList.pending, (state) => {
                state.loading2 = true;
            })
            .addCase(getDealOfTheDayList.fulfilled, (state, action) => {
                state.loading2 = false;
                state.DealOfTheDay = action.payload;
            })
            .addCase(getDealOfTheDayList.rejected, (state, action) => {
                state.loading2 = false;
                state.error = action.error.message;
            })
            .addCase(getSaverZoneList.pending, (state) => {
                state.loading3 = true;
            })
            .addCase(getSaverZoneList.fulfilled, (state, action) => {
                state.loading3 = false;
                state.saver_zone = action.payload;
            })
            .addCase(getSaverZoneList.rejected, (state, action) => {
                state.loading3 = false;
                state.error = action.error.message;
            })
            .addCase(getTopSellingList.pending, (state) => {
                state.loading4 = true;
            })
            .addCase(getTopSellingList.fulfilled, (state, action) => {
                state.loading4 = false;
                state.TopSelling = action.payload;
            })
            .addCase(getTopSellingList.rejected, (state, action) => {
                state.loading4 = false;
                state.error = action.error.message;
            })

            .addCase(getTopPicksList.pending, (state) => {
                state.loading5 = true;
            })
            .addCase(getTopPicksList.fulfilled, (state, action) => {
                state.loading5 = false;
                state.top_picks = action.payload;
            })
            .addCase(getTopPicksList.rejected, (state, action) => {
                state.loading5 = false;
                state.error = action.error.message;
            })

            .addCase(getcategory_items.pending, (state) => {
                state.loading6 = true;
            })
            .addCase(getcategory_items.fulfilled, (state, action) => {
                state.loading6 = false;
                state.home_category_items = action.payload;
            })
            .addCase(getcategory_items.rejected, (state, action) => {
                state.loading6 = false;
                state.error = action.error.message;
            })

            .addCase(gettop_selling_product.pending, (state) => {
                state.loading7 = true;
            })
            .addCase(gettop_selling_product.fulfilled, (state, action) => {
                state.loading7 = false;
                state.deal_of_the_day_items = action.payload;
            })
            .addCase(gettop_selling_product.rejected, (state, action) => {
                state.loading7 = false;
                state.error = action.error.message;
            })

            .addCase(getbrand_week.pending, (state) => {
                state.loading8 = true;
            })
            .addCase(getbrand_week.fulfilled, (state, action) => {
                state.loading8 = false;
                state.brand_week = action.payload;
            })
            .addCase(getbrand_week.rejected, (state, action) => {
                state.loading8 = false;
                state.error = action.error.message;
            })

            .addCase(getbundle_clearance_sale.pending, (state) => {
                state.loading9 = true;
            })
            .addCase(getbundle_clearance_sale.fulfilled, (state, action) => {
                state.loading9 = false;
                state.bundle_clearance_sale = action.payload;
            })
            .addCase(getbundle_clearance_sale.rejected, (state, action) => {
                state.loading9 = false;
                state.error = action.error.message;
            })
    }
});

export const { setloading7,setdeal_of_the_day_items,settrending_products,setclearence_sale_items,setloading10 } = homeslice.actions
export default homeslice.reducer;
