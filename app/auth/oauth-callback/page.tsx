"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/loading";

function OAuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const code = params.get("code");
    const provider = params.get("provider");

    if (!code || !provider) {
      setError("Missing authentication parameters");
      setIsProcessing(false);
      return;
    }

    const processOAuth = async () => {
      try {
        const formData = new FormData();
        formData.append("oauthProvider", provider);
        formData.append("oauthCode", code);

        console.log("Starting OAuth authentication...");

        const res = await fetch("/api/auth/oauth", {
          method: "POST",
          body: formData,
          // Important: set redirect to manual to handle redirects in JS
          redirect: "manual",
        });

        console.log("OAuth API response:", res.status, res.statusText);

        // Check for redirect responses (status codes 3xx)
        if (res.status >= 300 && res.status < 400) {
          // Get the Location header
          const location = res.headers.get("Location");
          console.log("Redirect location:", location);

          if (location) {
            // Ensure it's an absolute URL or make it one
            const redirectUrl = location.startsWith("/")
              ? `${window.location.origin}${location}`
              : location;

            console.log("Redirecting to:", redirectUrl);
            window.location.href = redirectUrl;
            // Don't set isProcessing to false here - we're redirecting
            return;
          }
        }

        // Handle normal JSON responses
        if (res.ok) {
          const data = await res.json();
          console.log("OAuth success response:", data);

          if (data.success) {
            router.push("/dashboard");
            // Don't set isProcessing to false here - we're redirecting
            return;
          } else {
            if (data.errors?.login?.includes("no email found")) {
              setError(
                "We couldn't get your email. Please make sure your account has a verified email address."
              );
            } else {
              setError("Authentication failed");
            }
          }
        } else {
          console.error("OAuth error response:", res.status, res.statusText);
          setError(`Authentication error: ${res.statusText}`);
        }
      } catch (e) {
        console.error("OAuth error:", e);
        setError("An unexpected error occurred during authentication");
      } finally {
        // Only set isProcessing to false if we haven't redirected
        setIsProcessing(false);
      }
    };

    processOAuth();
  }, [params, router]);

  // Show loading state when processing
  if (isProcessing && !error) {
    return <Loading message="Signing you in..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
          <h2 className="text-red-800 text-lg font-medium mb-2">
            Authentication Error
          </h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.push("/auth")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Fallback loading state (this should rarely be reached)
  return <Loading message="Finalizing authentication..." />;
}

export default function OAuthCallback() {
  return <OAuthCallbackInner />;
}
