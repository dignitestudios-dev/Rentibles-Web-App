import { Suspense } from "react";
import TrackingClient from "./TrackingClient";
import Loader from "@/src/components/common/Loader";

export default function Page() {
  return (
    <Suspense fallback={<Loader show={true} />}>
      <TrackingClient />
    </Suspense>
  );
}
