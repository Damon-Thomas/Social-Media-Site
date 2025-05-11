// import { useActionState } from "react";
import LongInput from "../LongInput";
import Input from "../Input";
import InputWrapper from "../InputWrapper";
import Button from "../../core/Button";

export default function EditProfileForm() {
  //   const [state, action, pending] = useActionState(placholder, undefined);

  function action() {
    return;
  }

  return (
    <form action={action}>
      <InputWrapper>
        <Input id="name"></Input>
      </InputWrapper>
      <InputWrapper>
        <LongInput id="bio"></LongInput>
      </InputWrapper>
      <Button type="submit">Submit</Button>
    </form>
  );
}
