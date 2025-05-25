import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>লোড হচ্ছে...</div>}>
      <SuccessClient />
    </Suspense>
  );
}
