import ResetPasswordPage from '../../_components/Authentications/ResetPassword'


import { Suspense } from "react";
export const dynamic = "force-dynamic"; // يمنع Static Generation

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage/>
    </Suspense>
  );
}
