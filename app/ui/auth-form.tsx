"use client";

// import { formAuth } from "@/app/actions/auth";
import { useActionState, useState } from "react";
import { authenticate } from "../lib/action";
import InputWrapper from "./form/InputWrapper";
import Input from "./form/Input";
import ErrorMessage from "./form/ErrorMessage";
import Google from "next-auth/providers/google";
import GoogleButton from "./form/GoogleButton";
import GithubButton from "./form/GithubButton";

// type AuthErrors = {
//   longin?: string[];
//   name?: string[];
//   email?: string[];
//   password?: string[];
//   confirmpassword?: string[];
// };

export default function AuthForm() {
  const [state, action, pending] = useActionState(authenticate, undefined);
  const [login, setLogin] = useState(true);

  return (
    <div className="auth-form-container min-w-[300px]">
      <form
        // className={`p-4 md:p-8 rounded-md flex flex-col gap-2 justify-start bg-[var(--color-foreground)] text-[var(--text-color)] shadow-[10px_10px_25px_black]`}
        // className="p-4 md:p-8 rounded-md flex flex-col gap-2 justify-start bg-[var(--rmono)] text-[var(--mono)]  shadow-[10px_10px_25px_black]"
        className="p-4 md:p-8 rounded-md flex flex-col gap-2 justify-start bg-[var(--darkgrey)] text-[var(--offWhite)] shadow-[15px_15px_50px_black]"
        action={action}
      >
        <h2 className="text-lg font-semibold md:text-xl text-white">{`Welcome to Zuno, ${
          login ? "login" : "register"
        } with`}</h2>
        <div className="flex justify-around py-2 gap-6">
          <GoogleButton />
          <GithubButton />
        </div>
        <div className="flex items-center text-[var(--light-grey)]">
          <div className="h-[1px] bg-[var(--light-grey)] grow "></div>
          <p className="w-fit px-2">Or continue with email</p>
          <div className="h-[1px] bg-[var(--light-grey)] grow "></div>
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
              />
              <ErrorMessage>{state?.errors?.name || ""}</ErrorMessage>
            </InputWrapper>
          )}
          <InputWrapper>
            <Input
              type="text"
              label="Email"
              id="email"
              placeholder="hello@zuno.dev"
            />
            <ErrorMessage>{state?.errors?.email}</ErrorMessage>
          </InputWrapper>
          <InputWrapper>
            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="Your Password"
            />
            <ErrorMessage>{state?.errors?.password || ""}</ErrorMessage>
          </InputWrapper>
          {!login && (
            <InputWrapper>
              <Input
                label="Confirm Password"
                type="password"
                id="confirmpassword"
                placeholder="Confirm Password"
              />
              <ErrorMessage>
                {state?.errors?.confirmpassword || ""}
              </ErrorMessage>
            </InputWrapper>
          )}
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4 justify-baseline">
          <button
            className="w-fit"
            type="button"
            onClick={() => setLogin(!login)}
          >
            <div className="">
              {!login ? (
                <>
                  Already have an account?{" "}
                  <span className="text-[var(--primary)] font-bold">Login</span>
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
            className="w-fit py-2 px-4 rounded-lg font-bold text-[var(--text-color)] bg-[var(--background)] "
            disabled={pending}
            type="submit"
          >
            {login ? "Log in" : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
