"use client";
import React from "react";
import { Moon, Sun } from "lucide-react";
import { ModeToggle } from "./drop-down";
import ConnectButton from "./web3button";
import { useTheme } from "next-themes";

export function MainNav() {
  const [value, setValue] = React.useState("system");
  const optionsDisplay: [string, string][] = [
    ["light", "Light"],
    ["dark", "Dark"],
    ["system", "System"],
  ];
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setTheme(value);
  }, [value, setTheme]);

  return (
    <div className="flex justify-between px-8 py-6 bg-muted rounded-md bevel">
      {/* Left side component */}
      <div className="flex space-x-8"></div>

      {/* Right-side components */}
      <div className="flex space-x-4">
        <ConnectButton />
        <ModeToggle
          buttonDisplay={
            <>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </>
          }
          dropDownOptions={optionsDisplay}
          dropDownValue={setValue}
          isIconSize={true}
        />
      </div>
    </div>
  );
}
