"use client";

import { formAuth } from "@/app/actions/auth";
import { useActionState, useState } from "react";

// type AuthErrors = {
//   longin?: string[];
//   name?: string[];
//   email?: string[];
//   password?: string[];
//   confirmpassword?: string[];
// };

export default function AuthForm() {
  const [state, action, pending] = useActionState(formAuth, undefined);
  const [login, setLogin] = useState(true);

  return (
    <form action={action}>
      <input type="hidden" name="login" value={login ? "true" : "false"} />
      {login && (
        <>
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" placeholder="Name" />
          </div>
          {state?.errors?.name && <p>{state.errors.name}</p>}
        </>
      )}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      {!login && (
        <>
          <div>
            <label htmlFor="confirmpassword">Confirm Password</label>
            <input
              id="confirmpassword"
              name="confirmpassword"
              type="password"
            />
          </div>
          {state?.errors?.confirmpassword && (
            <p>{state.errors.confirmpassword}</p>
          )}
        </>
      )}
      <button type="button" onClick={() => setLogin(!login)}>
        {!login
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </button>

      <button disabled={pending} type="submit">
        {login ? "Login" : "Signup"}
      </button>
    </form>
  );
}
