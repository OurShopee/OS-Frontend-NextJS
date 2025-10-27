import { postpostPlaceOrder, postSingleCheckout } from "@/api/payments";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const usePayment = () => {
  const router = useRouter();

  const postpostPlaceOrderapi = async (input_data) => {
    const response = await postpostPlaceOrder(input_data);
    if (response.hasOwnProperty("status")) {
      if (response.status === "success") {
        if (response.data.pmode === "cash") {
          router.push(
            `/order/thanks/${response?.data.orderRefId}?callUpdate=${response?.data?.callUpdateStatus}`
          );
        }

        if (response.data.pmode === "credit_payfort") {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = response.data.payfortURL;

          const params = response.data.params;
          const orderId = params.merchant_extra
            .split(";")
            .find((item) => item.startsWith("orderId_"))
            ?.split("_")[1];
          const fields = {
            merchant_identifier: params.merchant_identifier,
            access_code: params.access_code,
            merchant_extra: params.merchant_extra,
            merchant_reference: params.merchant_reference,
            amount: params.amount,
            currency: params.currency,
            customer_email: params.customer_email,
            command: params.command,
            language: params.language,
            signature: params.signature,
            return_url: params.return_url,
            // return_url: `${window.location.origin}/order/thanks/${orderId}`,
          };

          for (const key in fields) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = fields[key];
            form.appendChild(input);
          }
          document.body.appendChild(form);
          form.submit();
        }

        if (response.data.action === "REDIRECT" && response.data.hasOwnProperty("redirectionURL"))  {
          window.location.href = response.data.redirectionURL;
        }
      }
    } else {
      toast.warn(
        response.message == "" || Object.keys(response).length <= 0
          ? "something went wrong"
          : response.message,
        {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  const SingleCheckout = async (input_data) => {
    const response = await postSingleCheckout(input_data);
    if (response.hasOwnProperty("status")) {
      if (response.status === "success") {
        if (response.data.pmode === "cash") {
          router.push(
            `/order/thanks/${response?.data?.orderRefId}?callUpdate=${response?.data?.callUpdateStatus}`
          );
        }

        if (response.data.pmode === "credit_payfort") {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = response.data.payfortURL;

          const params = response.data.params;
          const orderId = params.merchant_extra
            .split(";")
            .find((item) => item.startsWith("orderId_"))
            ?.split("_")[1];
          const fields = {
            merchant_identifier: params.merchant_identifier,
            access_code: params.access_code,
            merchant_extra: params.merchant_extra,
            merchant_reference: params.merchant_reference,
            amount: params.amount,
            currency: params.currency,
            customer_email: params.customer_email,
            command: params.command,
            language: params.language,
            signature: params.signature,
            return_url: params.return_url,
            // return_url: `${window.location.origin}/order/thanks/${orderId}`,
          };

          for (const key in fields) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = fields[key];
            form.appendChild(input);
          }
          document.body.appendChild(form);
          form.submit();
        }

        if (
          response.data.pmode === "tabby" &&
          response.data.hasOwnProperty("redirectionURL")
        ) {
          window.location.href = response.data.redirectionURL;
        }
      }
    } else {
      toast.warn(
        response.message == "" || Object.keys(response).length <= 0
          ? "something went wrong"
          : response.message,
        {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  return { postpostPlaceOrderapi, SingleCheckout };
};

export default usePayment;
