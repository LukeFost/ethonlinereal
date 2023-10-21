"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DialogCreateProps = {
  theButton: React.ReactElement;
  childDescription: React.ReactElement;
  childTitle: React.ReactElement;
};

export function DialogCreate({
  theButton,
  childDescription,
  childTitle,
}: DialogCreateProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{theButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{childTitle}</DialogTitle>
          <DialogDescription>{childDescription}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
