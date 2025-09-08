import { deleteUserAddress, getalladdresses, postUserAddressApi, saveDefaultAddress } from "@/api/user";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getalladdressesapi = createAsyncThunk("fetchaddresslistdata", async (input_data) => {
    const res = await getalladdresses(input_data);
    return res;
});
export const deleteUserAddressapi = createAsyncThunk("fetchdeleteaddressdata", async (input_data) => {
    const res = await deleteUserAddress(input_data);
    return res;
});
export const saveDefaultAddressapi = createAsyncThunk("fetchsaveDefaultAddressdata", async (input_data) => {
    const res = await saveDefaultAddress(input_data);
    return res;
});

export const postUserAddress = createAsyncThunk("postUserAddress", async (input_data) => {
    const res = await postUserAddressApi(input_data);
    return res;
});

const addresslice = createSlice({
    name: "cartslice",
    initialState: {
        loading: false,
        loading1: false,
        mobile_address_modal: false,
        address_header: '',
        error: null,
        addresslistdata: []
    },
    reducers: {
        setAddressButtonLoading: (state, action) => {
            state.loading1 = action.payload;
        },
        setaddress_header: (state, action) => {
            state.address_header = action.payload;
        },
        toggleMobileAddressModal: (state, action) => {
            state.mobile_address_modal = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            //....................national names
            .addCase(getalladdressesapi.pending, (state) => {
                state.loading = true;
            })
            .addCase(getalladdressesapi.fulfilled, (state, action) => {
                state.loading = false;
                state.addresslistdata = action.payload;
                // if (action.payload.status === "success") {
                //     state.cartlistdata = action.payload;
                // }
            })
            .addCase(getalladdressesapi.rejected, (state, action) => {
                state.loading = false;
            })



            .addCase(deleteUserAddressapi.fulfilled, (state, action) => {
                
                if (action.payload.status === "success") {
                    // getalladdresses(0)
                }
            })


            .addCase(postUserAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(postUserAddress.fulfilled, (state, action) => {
                state.loading1 = false;
                // if (action.payload.status === "success") {
                //     state.cartlistdata = action.payload;
                // }
            })
            .addCase(postUserAddress.rejected, (state, action) => {
                state.loading = false;
            })



    }
})
export const { setAddressButtonLoading,setaddress_header,toggleMobileAddressModal } = addresslice.actions
export default addresslice.reducer;
