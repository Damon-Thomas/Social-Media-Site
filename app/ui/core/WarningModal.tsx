import { useState } from "react";
import Modal from "./Modal";

export default function WarningModal({
  hidden,
  setHidden,
  warningMessage,
  onConfirm,
  onCancel,
  typeVerificationText, // Optional prop
}: {
  hidden: boolean;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  warningMessage: string;
  onConfirm: () => void;
  onCancel: () => void;
  typeVerificationText?: string;
}) {
  const [typed, setTyped] = useState("");
  const needsVerification = !!typeVerificationText;
  const isVerified = !needsVerification || typed === typeVerificationText;
  return (
    <Modal
      hidden={hidden}
      setHidden={setHidden}
      className="bg-[var(--darkgrey)] text-[var(--dmono)] rounded-2xl shadow-lg border-2 border-[var(--greyRing)] min-w-[320px] max-w-[90vw] p-6 flex flex-col items-center"
    >
      <h2 className="text-xl font-bold text-[var(--danger)] mb-4">Warning</h2>
      <p className="text-[var(--aWhite)] mb-6 text-center">{warningMessage}</p>
      {needsVerification && (
        <div className="w-full flex flex-col items-center mb-4">
          <p className="text-base text-[var(--danger)] mb-2 text-center">
            Please type{" "}
            <span className="font-mono font-bold">{typeVerificationText}</span>{" "}
            to confirm.
          </p>
          <input
            className="border-2 border-[var(--greyRing)] rounded px-2 py-1 w-full text-center bg-transparent text-[var(--aWhite)] focus:outline-none focus:border-[var(--aWhite)]"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={typeVerificationText}
            autoFocus
          />
        </div>
      )}
      <div className="flex gap-4 w-full justify-center">
        <button
          className={`bg-[var(--danger)] text-[var(--aBlack)] rounded-lg px-4 py-2 font-bold transition ${
            !isVerified ? "opacity-30 cursor-not-allowed" : ""
          }`}
          onClick={isVerified ? onConfirm : undefined}
          disabled={!isVerified}
        >
          Confirm
        </button>
        <button
          className="bg-[var(--primary)] text-[var(--aBlack)] rounded-lg px-4 py-2 font-bold  transition"
          onClick={() => {
            setTyped("");
            onCancel();
          }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
