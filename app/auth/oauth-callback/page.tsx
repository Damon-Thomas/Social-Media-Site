"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function OAuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    const provider = params.get("provider");
    if (code && provider) {
      const formData = new FormData();
      formData.append("oauthProvider", provider);
      formData.append("oauthCode", code);

      fetch("/api/auth/oauth", {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        if (res.redirected) {
          // If the server responded with a redirect, follow it
          window.location.href = res.url;
          return;
        }
        // Only try to parse JSON if not redirected
        try {
          const data = await res.json();
          if (data.success) {
            router.push("/dashboard");
          } else {
            // Show a user-friendly error if no email was found
            if (data.errors?.login?.includes("no email found")) {
              alert(
                "We couldn't get your email from GitHub. Please make sure your GitHub account has a verified email address, or try another login method."
              );
            }
            router.push("/auth?error=oauth");
          }
        } catch (e) {
          // If parsing fails, fallback to auth page
          console.log("Error parsing response:", e);
          router.push("/auth?error=oauth");
        }
      });
    }
  }, [params, router]);

  return <div>Signing you in...</div>;
}

import { Suspense } from "react";
export default function OAuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthCallbackInner />
    </Suspense>
  );
}
