import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  changePassword,
  CheckEmail,
  checkmobileotp,
  forgetPassword,
  getMyProfile,
  logiapi,
  resetpassword,
  Signup,
  trackdatabyreferencid,
  trackdataorderid,
  updateMyProfile,
  verifyMobileOtp,
} from "@/api/user";
import { addComplaint, getComplaint, getnationality } from "@/api/others";

export const getnationalitydata = createAsyncThunk(
  "fetchgetnationality",
  async () => {
    const res = await getnationality();
    return res.data;
  }
);
export const getMyProfileapi = createAsyncThunk(
  "fetchgetMyProfile",
  async () => {
    const res = await getMyProfile();
    return res;
  }
);
export const checkmobileotpapi = createAsyncThunk(
  "fetchmobileotp",
  async (input_data) => {
    const res = await checkmobileotp(input_data);
    return res;
  }
);
export const changePasswordapi = createAsyncThunk(
  "fetchchangePassword",
  async (input_data) => {
    const res = await changePassword(input_data);
    return res;
  }
);
export const trackdatabyorderidapi = createAsyncThunk(
  "fetchtrackdatabyorderidapi",
  async (input_data) => {
    const res = await trackdataorderid(input_data);
    return res;
  }
);
export const addComplaintapi = createAsyncThunk(
  "addComplaintapi",
  async (input_data) => {
    const res = await addComplaint(input_data);
    return res;
  }
);
export const getComplaintapi = createAsyncThunk(
  "fetchtrackdatabyorderidapi",
  async (input_data) => {
    const res = await getComplaint(input_data);
    return res;
  }
);
export const trackdatabyreferencidapi = createAsyncThunk(
  "fetchtrackdatabyorderidapi",
  async (input_data) => {
    const res = await trackdatabyreferencid(input_data);
    return res;
  }
);
export const CheckEmailapi = createAsyncThunk(
  "fetchcheckemailotp",
  async (input_data) => {
    const res = await CheckEmail(input_data);
    return res;
  }
);
// export const checkMobileapi = createAsyncThunk("fetchcheckMobileapi", async (input_data) => {
//     const res = await checkMobile(input_data);
//     return res;
// });
export const updateMyProfileapi = createAsyncThunk(
  "fetchgetupdate",
  async (input_data) => {
    const res = await updateMyProfile(input_data);
    return res;
  }
);

export const verifyMobileOtpapi = createAsyncThunk(
  "fetchverifyMobileOtpapi",
  async (input_data) => {
    const res = await verifyMobileOtp(input_data); // Fix function call
    return res;
  }
);
export const Signupapi = createAsyncThunk(
  "fetchSignupapi",
  async (input_data) => {
    const res = await Signup(input_data); // Fix function call
    return res;
  }
);
export const loginapidata = createAsyncThunk(
  "fetchloginapi",
  async (input_data) => {
    const res = await logiapi(input_data);
    return res;
  }
);
export const forgetPasswordapi = createAsyncThunk(
  "fetchforgetPasswordapi",
  async (input_data) => {
    const res = await forgetPassword(input_data);
    return res;
  }
);
export const resetpasswordapi = createAsyncThunk(
  "fetchresetpasswordapi",
  async (input_data) => {
    const res = await resetpassword(input_data);
    return res;
  }
);

const userslice = createSlice({
  name: "userslice",
  initialState: {
    nationalitydata: [],
    mobileotodata: [],
    logindata: [],
    loginincorrectdata: [],
    formstatus: 1,
    loading: false,
    user: [],
    profilenotupdate: false,
    error: null,
    authstatus: false,
    optmodalopen: false,
    updateMyProfileapidata: "",
    changePasswordapidata: "",
    formmodal: false,
    loginerrorstatus: false,
    incorrectemailstatus: false,
    incorrectpasswordstatus: false,
    registerapicall: false,
    changeprifilenumber: false,
    checkemailerror: "",
    registermobile: "",
    checkotperror: "",
    orderlistdata: [],
    trackorderlistdata: [],
    snplmodal: false,
    bankoffermodal: false,
    addressnumber: false,
  },
  reducers: {
    setotpmodal: (state, action) => {
      state.optmodalopen = action.payload;
    },
    setotperror: (state, action) => {
      state.checkotperror = action.payload;
    },
    setbankoffermodal: (state, action) => {
      state.bankoffermodal = action.payload;
    },
    setsnplmodal: (state, action) => {
      state.snplmodal = action.payload;
    },
    setorderlistdata: (state, action) => {
      state.orderlistdata = action.payload;
    },
    setprofilenotupdate: (state, action) => {
      state.profilenotupdate = action.payload;
    },
    setformmodal: (state, action) => {
      state.formmodal = action.payload;
    },
    setformstatus: (state, action) => {
      state.formstatus = action.payload;
    },
    setauthstatus: (state, action) => {
      state.authstatus = action.payload;
    },
    setlogindata: (state, action) => {
      state.logindata = action.payload;
    },
    setcheckemailerror: (state, action) => {
      state.checkemailerror = action.payload;
    },
    setregistermobile: (state, action) => {
      state.registermobile = action.payload;
    },
    setaddressnumber: (state, action) => {
      state.addressnumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //....................national names
      .addCase(getnationalitydata.pending, (state) => {
        state.loading = true;
      })
      .addCase(getnationalitydata.fulfilled, (state, action) => {
        state.loading = false;
        state.nationalitydata = action.payload;
      })
      .addCase(getnationalitydata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //.....................otpapi
      .addCase(checkmobileotpapi.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkmobileotpapi.fulfilled, (state, action) => {
        state.loading = false;
        state.optmodalopen = true;
        state.mobileotodata = action.payload;
      })
      .addCase(checkmobileotpapi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //.........................loginapi
      .addCase(loginapidata.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginapidata.fulfilled, (state, action) => {
        state.loading = false;
        state.optmodalopen = false;

        if (action.payload.status === "success") {
          state.formmodal = false;
          state.incorrectpasswordstatus = false;
          state.incorrectemailstatus = false;

          // Save token to cookie
          Cookies.set("jwt_token", action.payload.data.token, { path: "/" });

          // Read token from cookie and decode it
          const tokenFromCookie = Cookies.get("jwt_token");

          if (tokenFromCookie) {
            state.authstatus = true;
            state.logindata = jwtDecode(tokenFromCookie);
          } else {
            // fallback or error handling
            state.logindata = null;
          }
        } else {
          state.loginincorrectdata = action.payload;
          if (action.payload.message == "Incorrect password") {
            state.incorrectpasswordstatus = true;
            state.incorrectemailstatus = false;
          }

          if (action.payload.message == "This email does not exist") {
            state.incorrectemailstatus = true;
            state.incorrectpasswordstatus = false;
          }
          state.loginerrorstatus = true;
        }
        // state.formmodal = false;
      })
      .addCase(loginapidata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //.....................forgetPasswordapi
      .addCase(forgetPasswordapi.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgetPasswordapi.fulfilled, (state, action) => {
        state.loading = false;
        state.optmodalopen = false;
        window.location.href = "/reset-password";
        // if (action.payload.status === "success") {
        //     state.checkemailerror = ""
        // }
        // else {
        //     state.checkemailerror = action.payload.message;
        // }
        // state.formmodal = false;
      })
      .addCase(forgetPasswordapi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(resetpasswordapi.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetpasswordapi.fulfilled, (state, action) => {
        state.loading = false;
        // state.optmodalopen = false;
        window.location.href = "/";
        // if (action.payload.status === "success") {
        //     state.checkemailerror = ""
        // }
        // else {
        //     state.checkemailerror = action.payload.message;
        // }
        // state.formmodal = false;
      })
      .addCase(resetpasswordapi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //.....................checkemail
      .addCase(CheckEmailapi.pending, (state) => {
        state.loading = true;
      })
      .addCase(CheckEmailapi.fulfilled, (state, action) => {
        state.loading = false;
        state.optmodalopen = false;

        if (action.payload.status === "success") {
          state.checkemailerror = "";
        } else {
          state.checkemailerror = action.payload.message;
        }
        // state.formmodal = false;
      })
      .addCase(CheckEmailapi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(verifyMobileOtpapi.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.status === "success") {
          state.optmodalopen = false;
          state.registerapicall = true;
          state.changeprifilenumber = true;
          state.addressnumber = true;
        } else {
          state.checkotperror = action.payload.message;
          state.registerapicall = false;
        }
        // state.formmodal = false;
      })
      //...........signup
      .addCase(Signupapi.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.status === "success") {
          state.formmodal = false;
        } else {
          state.checkotperror = action.payload.message;
        }
        // state.formmodal = false;
      })
      .addCase(addComplaintapi.fulfilled, (state, action) => {
        if (action.payload.status === "success") {
          window.location.href = "/success-complaints";
        }

        // state.formmodal = false;
      })

      //.............getMyProfileapi
      .addCase(getMyProfileapi.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.status === "success") {
          state.user = action.payload.data[0];
        }

        // state.formmodal = false;
      })
      //.............updateMyProfileapi
      .addCase(updateMyProfileapi.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.status === "success") {
          state.updateMyProfileapidata = action.payload.message;
        }

        // state.formmodal = false;
      })
      //.............changePasswordapi
      .addCase(changePasswordapi.fulfilled, (state, action) => {
        state.loading = false;

        // if (action.payload.status === "success") {
        state.changePasswordapidata = action.payload.message;
        // }
        // state.formmodal = false;
      })
      //.............orders
      .addCase(trackdatabyreferencidapi.fulfilled, (state, action) => {
        // if (action.payload.status === "success") {
        state.trackorderlistdata = action.payload;
        // }
        // state.formmodal = false;
      });
  },
});
export const {
  setotperror,
  setotpmodal,
  setsnplmodal,
  setbankoffermodal,
  setformmodal,
  setorderlistdata,
  setprofilenotupdate,
  setformstatus,
  setauthstatus,
  setlogindata,
  setcheckemailerror,
  setregistermobile,
  setaddressnumber,
} = userslice.actions;
export default userslice.reducer;
