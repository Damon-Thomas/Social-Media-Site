"use client";

import Modal from "@/app/ui/core/Modal";
import { useState } from "react";

export default function SettingsPage() {
  const [isModalHidden, setIsModalHidden] = useState(true);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-lg">This is the settings page.</p>
      <Modal hidden={isModalHidden}>
        <div className=" flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-2xl font-bold">Modal</h1>
          <p className="text-lg">Testing the modal.</p>
          <button
            className="bg-[var(--rdmono)] py-2 px-4 rounded text-[var(--dmono)] mt-4"
            onClick={() => setIsModalHidden(!isModalHidden)}
          >
            Toggle Modal
          </button>
        </div>
      </Modal>
      <button
        className="bg-[var(--dmono)] py-2 px-4 rounded text-[var(--rdmono)] mt-4"
        onClick={() => setIsModalHidden(!isModalHidden)}
      >
        Toggle Modal
      </button>
      <div className="themeButtons flex gap-0"></div>
    </div>
  );
}

// Things to add
//
// hide theme icon
// set theme
// delete account (unless test account)
// connect with the developer
