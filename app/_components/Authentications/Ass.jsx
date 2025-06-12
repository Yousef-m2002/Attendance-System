"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");
  const code = searchParams.get("code");

  useEffect(() => {
    console.log("Running useEffect - userId:", userId, "code:", code);

 
    window.history.replaceState(null, "", "/auth/verify-email-address");

    if (userId && code) {
      const verifyEmail = async () => {
        try {
          console.log("Verifying email...");
          const response = await fetch("http://baseattendence.runasp.net/api/Auth/ConfirmEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, userId }),
          });

          let responseText = await response.text();
          let errorMessage = "Verification failed.";

          try {
            const jsonData = JSON.parse(responseText);
            errorMessage = jsonData.errors?.[0]?.description || "Verification failed.";
          } catch {
            errorMessage = responseText;
          }

          if (response.ok) {
            Swal.fire({
              title: "Success!",
              text: "Your email has been successfully verified.",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              console.log("Redirecting in 5 seconds...");
              router.push("/auth/signin");
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: errorMessage,
              icon: "error",
              confirmButtonText: "Try Again",
            }).then(() => {
              console.log("Redirecting in 5 seconds...");
              router.push("/auth/create-acount");
            });
          }
        } catch (error) {
          console.error("Request Error:", error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while verifying your email.",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            console.log("Redirecting in 5 seconds...");
            router.push("/auth/create-acount");
          });
        }
      };

      verifyEmail();
    }
  }, [userId, code, router]);

  return (
    <div className="text-center align-middle text-green-600 font-bold mt-10">
      <h1>Verifying email...</h1>
    </div>
  );
};

export default VerifyEmail;
