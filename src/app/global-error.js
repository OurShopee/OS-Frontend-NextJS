"use client";
import Error from "./error"; // You can reuse your nice UI!

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        {/* This replaces the entire HTML document if the RootLayout crashes */}
        <Error error={error} reset={reset} />
      </body>
    </html>
  );
}
