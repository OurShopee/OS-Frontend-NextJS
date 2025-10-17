// app/[...not_found]/page.js
import { notFound } from "next/navigation";

export default function NotFoundCatchAll() {
  notFound();
}
