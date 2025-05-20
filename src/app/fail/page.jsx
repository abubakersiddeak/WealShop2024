import React from "react";

export default function FailPage() {
  return (
    <div className="h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-4xl text-red-600 font-bold">❌ Payment Failed!</h1>
        <p className="mt-4">Please try again or contact support.</p>
      </div>
    </div>
  );
}
