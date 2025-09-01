// app/auth/newPassword/page.tsx
import { Suspense } from "react";
import NewPassword from "../../_components/Authentications/NewPassword";

export const dynamic = "force-dynamic"; 

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPassword />
    </Suspense>
  );
}
