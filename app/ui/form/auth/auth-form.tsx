"use client";

import { useActionState, useState, useEffect } from "react";
import { authenticate, AuthState } from "../../../lib/action";
import InputWrapper from "../InputWrapper";
import Input from "../Input";
import ErrorMessage from "../ErrorMessage";
import GoogleButton from "./GoogleButton";
import GithubButton from "./GithubButton";

export default function AuthForm() {
  const [state, action, pending] = useActionState(
    authenticate,
    undefined as AuthState | undefined
  );
  const [login, setLogin] = useState(true);

  // Form state to persist values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    guest: false,
  });

  // Update form data when inputs change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target as HTMLInputElement & {
      id: keyof typeof formData;
    };

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  function guestLogin() {
    const formData = new FormData();
    formData.append("guest", "true");
    authenticate(undefined, formData);
  }

  const getError = (key: string) =>
    state?.errors && typeof state.errors === "object" && key in state.errors
      ? (state.errors as Record<string, string>)[key] ?? ""
      : "";

  // When server returns validation errors, prefill the form with submitted values
  useEffect(() => {
    if (state && "serverFormData" in state && state.serverFormData) {
      setFormData({
        name: state.serverFormData.name || "",
        email: state.serverFormData.email || "",
        password: state.serverFormData.password || "",
        confirmpassword: state.serverFormData.confirmpassword || "",
        guest: false,
      });
    }
  }, [state]);

  useEffect(() => {
    if (state && state.success && !pending) {
      // If state is undefined and not pending, assume successful login
      window.location.replace("/dashboard");
    }
  }, [state, pending]);

  return (
    <div className="auth-form-container min-w-[300px] flex justify-center">
      <form
        className="p-4 md:p-8 rounded-md flex flex-col gap-2 justify-start bg-[var(--grey)] text-[var(--aWhite)] shadow-[15px_15px_50px_black] border border-zinc-700 w-full sm:w-[450px]"
        action={action}
      >
        <h2 className="text-lg font-semibold md:text-xl transition-colors duration-300">{`Welcome to Zuno, ${
          login ? "login" : "register"
        } with`}</h2>
        <div className="flex justify-around py-2 gap-6">
          <GoogleButton />
          <GithubButton />
        </div>
        <div className="flex items-center text-[var(--light-grey)] transition-colors duration-300">
          <div className="h-[1px] bg-[var(--light-grey)] grow"></div>
          <p className="w-fit px-2">Or continue with email</p>
          <div className="h-[1px] bg-[var(--light-grey)] grow"></div>
        </div>
        <div className="flex flex-col my-2">
          <input type="hidden" name="login" value={login ? "true" : "false"} />
          {!login && (
            <InputWrapper>
              <Input
                type="text"
                label="Name"
                id="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <ErrorMessage>{getError("name")}</ErrorMessage>
            </InputWrapper>
          )}
          <InputWrapper>
            <Input
              type="text"
              label="Email"
              id="email"
              placeholder="hello@zuno.dev"
              value={formData.email}
              onChange={handleInputChange}
            />
            <ErrorMessage>{getError("email")}</ErrorMessage>
          </InputWrapper>
          <InputWrapper>
            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="Your Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <ErrorMessage>{getError("password")}</ErrorMessage>
          </InputWrapper>
          {!login && (
            <InputWrapper>
              <Input
                label="Confirm Password"
                type="password"
                id="confirmpassword"
                placeholder="Confirm Password"
                value={formData.confirmpassword}
                onChange={handleInputChange}
              />
              <ErrorMessage>{getError("confirmpassword")}</ErrorMessage>
            </InputWrapper>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-x-10 gap-y-4 justify-between">
            <button
              className="w-fit no-button-effects"
              type="button"
              onClick={() => setLogin(!login)}
            >
              <div className="w-full transition-colors duration-300">
                {!login ? (
                  <>
                    Already have an account?{" "}
                    <span className="text-[var(--primary)] font-bold">
                      Login
                    </span>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <span className="text-[var(--primary)] font-bold">
                      Register
                    </span>
                  </>
                )}
              </div>
            </button>
            <button
              className="py-2 px-4 w-[100px] rounded-lg font-bold text-[var(--aBlack)] bg-[var(--primary)]"
              disabled={pending}
              type="submit"
            >
              {login ? "Log in" : "Register"}
            </button>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-4 justify-between items-center">
            <div className="max-w-[235px]">
              <p>Want to see what all the hype is about? Log in as a guest</p>
            </div>
            <button
              className="py-2 flex items-center justify-center px-4 w-[100px] h-[36.5px] rounded-lg font-bold border-1 border-[var(--light-grey)] text-[var(--primary)] bg-[var(--grey)] transition-colors duration-300"
              disabled={pending}
              type="button"
              onClick={() => {
                guestLogin();
              }}
            >
              Guest
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
