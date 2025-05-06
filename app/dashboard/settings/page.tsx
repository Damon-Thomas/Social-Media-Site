"use client";

import Modal from "@/app/ui/core/Modal";
import { useState } from "react";

export default function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-lg">This is the settings page.</p>
      <Modal hidden={isModalOpen}>
        <div className=" flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-2xl font-bold">Modal</h1>
          <p className="text-lg">Testing the modal.</p>
          <button
            className="bg-[var(--rdmono)] py-2 px-4 rounded text-[var(--dmono)] mt-4"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Toggle Modal
          </button>
        </div>
      </Modal>
      <button
        className="bg-[var(--dmono)] py-2 px-4 rounded text-[var(--rdmono)] mt-4"
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        Toggle Modal
      </button>
    </div>
  );
}
