import { blogByCatId, getAreasApi, getblogs, getLocationsApi } from "@/api/others";
import { getbannerlistapi, Navigationapi } from "@/api/products";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getnavigation = createAsyncThunk("navigation/fetchNavigation", async () => {
    const res = await Navigationapi();
    return res.data
});
export const getblogsapi = createAsyncThunk("fetchgetblogs", async () => {
    const res = await getblogs();
    return res.data
});

export const getbannerlistapilist = createAsyncThunk("bannerlist/fetchbannerlist", async () => {
    const res = await getbannerlistapi();
    return res.data
});

export const getLocations = createAsyncThunk("bannerlist/getLocations", async () => {
    const res = await getLocationsApi();
    return res.data.data
});

export const getAreas = createAsyncThunk("bannerlist/getAreas", async (id) => {
    const res = await getAreasApi(id);
    if(res.status == 204){
        return []
    }
    return res.data.data
});
export const blogByCatIdapi = createAsyncThunk("fetchblogcatdata", async (input_data) => {
    const res = await blogByCatId(input_data);
  
    return res.data
});

// export const masterjson = createAsyncThunk("masterjson/fetchmasterjson", async () => {
//     const res = await masterjsonapi();
//     return res.data
// })

const globalslice = createSlice({
    name: "globalslice",
    initialState: {
        data: [],
        masterdata: [],
        locationsdata: [],
        countryDropdown: [],
        currentcountry: {},
        blogdata:[],
        blogcatdata:[],
        areadata: [],
        loading: false,
        loading1: false,
        loading2: false,
        error: null,
        sidebarstatus: false,
        formmodal: false,
       
    },
    reducers: {
        setsidebar: (state) => {
            state.sidebarstatus = true; // Update hastoggle to true
        },
        setformmodal: (state, action) => {
            state.formmodal = action.payload;
        },
        setcountryDropdown: (state, action) => {
            state.countryDropdown = action.payload;
        },
        setcurrentcountry: (state, action) => {
            state.currentcountry = action.payload;
        },
    
    },
    extraReducers: (builder) => {
        builder
            .addCase(getnavigation.pending, (state) => {
                state.loading = true;
            })
            .addCase(getnavigation.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getnavigation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(getbannerlistapilist.pending, (state) => {
                state.loading = true
            })
            .addCase(getbannerlistapilist.fulfilled, (state, action) => {
                state.loading = false;
                state.masterdata = action.payload;
            })
            .addCase(getbannerlistapilist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })


            .addCase(getblogsapi.pending, (state) => {
                state.loading = true
            })
            .addCase(getblogsapi.fulfilled, (state, action) => {
                state.loading = false;
                state.blogdata = action.payload;
            })
            .addCase(getblogsapi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(blogByCatIdapi.pending, (state) => {
                state.loading = true
            })
            .addCase(blogByCatIdapi.fulfilled, (state, action) => {
                state.loading = false;
                state.blogcatdata = action.payload;
            })
            .addCase(blogByCatIdapi.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(getLocations.pending, (state) => {
                state.loading1 = true
            })
            .addCase(getLocations.fulfilled, (state, action) => {
                state.loading1 = false;
                state.locationsdata = action.payload;
            })
            .addCase(getLocations.rejected, (state, action) => {
                state.loading1 = false;
                state.error = action.error.message;
            })

            .addCase(getAreas.pending, (state) => {
                state.loading2 = true
            })
            .addCase(getAreas.fulfilled, (state, action) => {
                state.loading2 = false;
                state.areadata = action.payload;
            })
            .addCase(getAreas.rejected, (state, action) => {
                state.loading2 = false;
                state.error = action.error.message;
            })
    }
});
export const { setformmodal,setcountryDropdown,setcurrentcountry } = globalslice.actions
export default globalslice.reducer;
