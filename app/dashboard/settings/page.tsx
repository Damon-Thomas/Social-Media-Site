"use client";

import AboutTheDeveloper from "@/app/ui/settings/AboutTheDeveloper";
import ContactDeveloper from "@/app/ui/settings/ContactDeveloper";
import DeleteAccount from "@/app/ui/settings/DeleteAccount";
import SettingsContainer from "@/app/ui/settings/SettingsContainer";
import ThemeSwitch from "@/app/ui/settings/ThemeSwitch";

export default function SettingsPage() {
  return (
    <SettingsContainer>
      <ThemeSwitch />
      <AboutTheDeveloper />
      <ContactDeveloper />
      <DeleteAccount />
    </SettingsContainer>
  );
}

// Things to add
//
// hide theme icon
// set theme
// delete account (unless test account)
// connect with the developer
