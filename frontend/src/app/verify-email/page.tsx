"use client";

import { Suspense } from "react";
import VerifyEmailContent from "./VerifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
