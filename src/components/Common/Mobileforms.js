"use client";
import leftarrow from "@/images/Arrow - Left 2.png";
import { setformmodal, setotpmodal, setprofilenotupdate } from "@/redux/formslice";
import { useRouter } from "next/navigation";
import Modal from "react-bootstrap/Modal";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import ForgotPssword from "./ForgotPssword";
import Login from "./Login";
import OTPVerification from "./OtpVerifiaction";
import Register from "./Register";

const Mobileforms = () => {
  const formmodal = useSelector((state) => state.formslice.formmodal);
  const optmodalopen = useSelector((state) => state.formslice.optmodalopen);
  const formstatus = useSelector((state) => state.formslice.formstatus);
  const profilenotupdate = useSelector(
    (state) => state.formslice.profilenotupdate
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const otpmodalhandle = () => {
    dispatch(setotpmodal(!optmodalopen));
    dispatch(setprofilenotupdate(!profilenotupdate));
  };

  const modalbackaction = () => {
    dispatch(setformmodal(!formmodal));
    // if(formstatus == 1){
    //     dispatch(setformmodal(!formmodal))
    // }
    // else{
    // }
  };

  return (
    <div>
      <div className={`formsidebar ${formmodal ? "open" : ""}`}>
        <div className="form-topcontent">
          <div className="modalclose formmodal-topicons">
            <img
              src={leftarrow}
              alt="Back arrow"
              onClick={modalbackaction}
              className="cursor-pointer"
            />
            <IoClose
              size={20}
              onClick={() => {
                dispatch(setformmodal(!formmodal));
              }}
            />
          </div>
          <div className="mobile-form-titles">
            <div className="FormHeading">
              {formstatus == 1 && "Login"}
              {formstatus == 2 && "Create an account"}
              {formstatus == 4 && "Forgot Password"}
            </div>
            <div className="formsubheading">
              {formstatus == 1 &&
                "If you have an account with us, please login."}
              {formstatus == 2 && "Looks like you're new here!"}
              {formstatus == 4 && "Please fill the form to get your password"}
            </div>
          </div>
        </div>
        {formstatus == 1 && <Login />}
        {formstatus == 2 && <Register />}
        {formstatus == 4 && <ForgotPssword />}
        <Modal
          show={optmodalopen}
          onHide={!optmodalopen}
          backdrop="static"
          keyboard={false}
          centered
        >
          <div className="modalclose flex justify-end pr-2 pt-2">
            <IoClose size={20} onClick={otpmodalhandle} />
          </div>
          <OTPVerification />
        </Modal>
      </div>
    </div>
  );
};

export default Mobileforms;
