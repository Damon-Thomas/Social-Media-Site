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
          window.location.replace(res.url);
          return;
        }
        // Only try to parse JSON if not redirected
        try {
          const data = await res.json();
          if (data.success) {
            window.location.replace("/dashboard");
          } else {
            // Show a user-friendly error if no email was found
            if (data.errors?.login?.includes("no email found")) {
              alert(
                "We couldn't get your email from GitHub. Please make sure your GitHub account has a verified email address, or try another login method."
              );
            }
            window.location.replace("/auth?error=oauth");
          }
        } catch (e) {
          // If parsing fails, fallback to auth page
          console.error("Error parsing response:", e);
          window.location.replace("/auth?error=oauth");
        }
      });
    }
  }, [params, router]);

  return <div>Signing you in...</div>;
}

import { Suspense } from "react";
import Loading from "@/app/loading";
export default function OAuthCallback() {
  return (
    <Suspense fallback={<Loading />}>
      <OAuthCallbackInner />
    </Suspense>
  );
}
