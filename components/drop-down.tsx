"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ModeToggleProps = {
  dropDownOptions: Array<[string, string]>;
  buttonDisplay: React.ReactElement;
  dropDownValue: (value: string) => void;
  isIconSize: boolean;
};

export function ModeToggle({
  dropDownOptions,
  buttonDisplay,
  dropDownValue,
  isIconSize,
}: ModeToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" {...(isIconSize ? { size: "icon" } : {})}>
          {buttonDisplay}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...(isIconSize ? { align: "end" } : {})}>
        {dropDownOptions.map(([value, label]) => (
          <DropdownMenuItem key={value} onClick={() => dropDownValue(value)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
