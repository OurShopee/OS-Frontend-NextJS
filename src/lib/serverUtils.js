import { headers } from "next/headers";

export const getServerSideHeaders = async () => {
  const headersList = await headers();
  return {
    headers: {
      host: headersList.get("host") || headersList.get("x-forwarded-host"),
      "x-forwarded-proto": headersList.get("x-forwarded-proto"),
      "x-forwarded-port": headersList.get("x-forwarded-port"),
      cookie: headersList.get("cookie"),
    },
  };
};
