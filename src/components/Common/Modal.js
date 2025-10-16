"use client";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import {
  setformmodal,
  setotpmodal,
  setprofilenotupdate,
} from "../../redux/formslice";
import { AddressForm } from "../Common";
import ForgotPssword from "./ForgotPssword";
import Login from "./Login";
import OTPVerification from "./OtpVerifiaction";
import Register from "./Register";
import Modal from "./Modals/Modal";

function Example() {
  const formmodal = useSelector((state) => state.formslice.formmodal);
  const optmodalopen = useSelector((state) => state.formslice.optmodalopen);
  const formstatus = useSelector((state) => state.formslice.formstatus);
  const profilenotupdate = useSelector(
    (state) => state.formslice.profilenotupdate
  );
  const dispatch = useDispatch();

  // Refs for modal content
  const formModalRef = useRef(null);
  const otpModalRef = useRef(null);

  const otpmodalhandle = () => {
    dispatch(setotpmodal(!optmodalopen));
    dispatch(setprofilenotupdate(!profilenotupdate));
  };

  const handleClose = () => dispatch(setotpmodal(false));
  const handleClose1 = () => dispatch(setformmodal(false));

  // Handle outside click for form modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        formModalRef.current &&
        !formModalRef.current.contains(event.target) &&
        formmodal
      ) {
        handleClose1();
      }
    };

    if (formmodal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formmodal]);

  // Handle outside click for OTP modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        otpModalRef.current &&
        !otpModalRef.current.contains(event.target) &&
        optmodalopen
      ) {
        handleClose();
      }
    };

    if (optmodalopen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optmodalopen]);

  return (
    <>
      <Modal
        show={formmodal}
        onHide={handleClose1}
        keyboard={false}
        size={formstatus === 3 ? "lg" : "md"}
        centered
        className={optmodalopen ? "z-30" : ""}
      >
        <div ref={formModalRef}>
          <div className="modalclose flex cursor-pointer justify-end pr-2 pt-2">
            <IoClose
              size={20}
              onClick={() => {
                dispatch(setformmodal(!formmodal));
              }}
            />
          </div>

          {formstatus === 1 && <Login />}
          {formstatus === 2 && <Register />}
          {formstatus === 3 && <AddressForm />}
          {formstatus === 4 && <ForgotPssword />}
        </div>
      </Modal>

      <Modal show={optmodalopen} onHide={handleClose} keyboard={false} centered>
        <div ref={otpModalRef}>
          <div className="modalclose cursor-pointer flex justify-end pr-2 pt-2">
            <IoClose size={20} onClick={otpmodalhandle} />
          </div>
          <OTPVerification />
        </div>
      </Modal>
    </>
  );
}

export default Example;
