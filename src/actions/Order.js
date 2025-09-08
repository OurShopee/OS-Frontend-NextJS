import { myorder } from "@/api/user";
import { useDispatch, useSelector } from "react-redux";
import { setorderlistdata } from "@/redux/formslice";

const Order = () => {
  const orderlistdata = useSelector((state) => state.cartslice.orderlistdata);
  const dispatch = useDispatch();

  const myorderapi = async (input_data) => {
    const response = await myorder(input_data);
    if (response.status === "success") {
      if (input_data.page == 1) {
        dispatch(setorderlistdata(response));
      } else {
        dispatch(setorderlistdata([...(orderlistdata || []), ...response]));
      }
    }
  };

  return { myorderapi };
};

export default Order;
