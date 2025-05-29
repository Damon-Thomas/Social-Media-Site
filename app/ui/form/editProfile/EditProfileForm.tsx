import LongInput from "../LongInput";
import InputWrapper from "../InputWrapper";
import Button from "../../core/Button";
import { useCurrentUser, useRefreshUser } from "@/app/context/UserContext";
import { useActionState } from "react";
import Image from "next/image";
import defaultProfileWhite from "@/public/defaultProfileDark.svg";
import { saveBio } from "@/app/actions/profileActions";
import type { formState } from "@/app/actions/profileActions";

export default function EditProfileForm({
  longText,
  setLongText,
  onSuccess,
  refreshProfileData,
}: {
  longText?: string;
  setLongText?: React.Dispatch<React.SetStateAction<string>>;
  onSuccess?: () => void;
  refreshProfileData?: () => Promise<void>;
}) {
  const user = useCurrentUser();
  const refreshUser = useRefreshUser();

  const [state, action, isPending] = useActionState(
    actionHandler,
    null as formState | null
  );

  async function actionHandler(
    _state: formState | null,
    payload: FormData
  ): Promise<formState> {
    try {
      if (!user?.id) {
        return {
          success: false,
          errors: { bio: "User ID is required" },
          message: null,
        };
      }
      const userId = user.id;
      const bio = payload.get("bio") as string;
      const response = await saveBio({ userId, bio });

      // The saveBio function returns an actionState with prevState property
      if (response?.prevState) {
        // Check if the update was successful
        if (response.prevState.success) {
          // Refresh user data to update the UI immediately
          if (refreshUser) {
            await refreshUser();
          }
          // Refresh profile data to update the userData
          if (refreshProfileData) {
            await refreshProfileData();
          }
          // Close the modal
          onSuccess?.();
        }
        return response.prevState;
      } else {
        // Fallback success case
        if (refreshUser) {
          await refreshUser();
        }
        if (refreshProfileData) {
          await refreshProfileData();
        }
        onSuccess?.();
        return {
          success: true,
          errors: undefined,
          message: "Bio updated successfully",
        };
      }
    } catch (error) {
      console.error("Error saving bio:", error);
      return {
        success: false,
        errors: { bio: "Failed to save bio" },
        message: null,
      };
    }
  }

  return (
    <form
      action={action}
      className="border border-zinc-700 rounded-md p-4 md:p-8 flex flex-col gap-2 justify-start bg-[var(--grey)] text-[var(--aWhite)]  w-full"
    >
      <h1 className=" text-lg font-semibold md:text-xl mb-1 md:mb-2 pb-1 md:pb-2 border-b-1">
        Edit Profile
      </h1>
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={user?.image || defaultProfileWhite}
          alt="User profile picture"
          width={40}
          height={40}
          className="rounded-full flex-shrink-0 h-10 w-10"
        />
        <h3 className="text-md font-semibold md:text-lg ">{user?.name}</h3>
      </div>
      <InputWrapper>
        <LongInput
          label="Bio"
          placeholder={`Tell the world about yourself`}
          id="bio"
          className="border border-[var(--greyRing)] rounded-xs text focus:outline focus:ring-2 focus:ring-[var(--aWhite)] focus:border-transparent p-2"
          text="text-md"
          rows={3}
          value={longText}
          onChange={(e) => setLongText?.(e.target.value)}
        />
      </InputWrapper>
      <div className="flex gap-2 justify-between">
        <div className="grow flex flex-wrap">
          {state?.errors?.bio && (
            <span className="text-red-500 text-sm">{state.errors.bio}</span>
          )}
          {state?.message && state.success && (
            <span className="text-green-500 text-sm">{state.message}</span>
          )}
        </div>
        <Button
          className="font-bold text-[var(--aBlack)] mt-2"
          type="submit"
          style="primary"
        >
          {isPending ? "Saving..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
