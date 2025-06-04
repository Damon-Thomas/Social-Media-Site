"use client";

import SettingsContainer from "@/app/ui/settings/SettingsContainer";
import ThemeSwitch from "@/app/ui/settings/ThemeSwitch";

export default function SettingsPage() {
  return (
    <SettingsContainer>
      <ThemeSwitch />
    </SettingsContainer>
  );
}

// Things to add
//
// hide theme icon
// set theme
// delete account (unless test account)
// connect with the developer
