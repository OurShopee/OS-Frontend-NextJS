"use client";
import Modal from "react-bootstrap/Modal";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setformmodal, setotpmodal, setprofilenotupdate } from "../../redux/formslice";
import { AddressForm } from "../Common";
import ForgotPssword from "./ForgotPssword";
import Login from "./Login";
import OTPVerification from "./OtpVerifiaction";
import Register from "./Register";

function Example() {
  const formmodal = useSelector((state) => state.formslice.formmodal);
  const optmodalopen = useSelector((state) => state.formslice.optmodalopen);
  const formstatus = useSelector((state) => state.formslice.formstatus);
  const profilenotupdate = useSelector(
    (state) => state.formslice.profilenotupdate
  );
  const dispatch = useDispatch();

  const otpmodalhandle = () => {
    dispatch(setotpmodal(!optmodalopen));
    dispatch(setprofilenotupdate(!profilenotupdate));
  };

  const handleClose = () => dispatch(setotpmodal(false));
  const handleClose1 = () => dispatch(setformmodal(false));

  return (
    <>
      <Modal
        show={formmodal}
        onHide={handleClose1}
        keyboard={false}
        size={formstatus == 3 && "lg"}
        centered
        className={optmodalopen && "z-30"}
      >
        <div className="modalclose flex cursor-pointer justify-end pr-2 pt-2">
          <IoClose
            size={20}
            onClick={() => {
              dispatch(setformmodal(!formmodal));
            }}
          />
        </div>

        {formstatus == 1 && <Login />}
        {formstatus == 2 && <Register />}
        {formstatus == 3 && <AddressForm />}
        {formstatus == 4 && <ForgotPssword />}
      </Modal>

      <Modal show={optmodalopen} onHide={handleClose} keyboard={false} centered>
        <div className="modalclose cursor-pointer flex justify-end pr-2 pt-2">
          <IoClose size={20} onClick={otpmodalhandle} />
        </div>
        <OTPVerification />
      </Modal>
    </>
  );
}

export default Example;
