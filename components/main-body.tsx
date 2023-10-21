import React from "react";
import { Button } from "./ui/button";
import { DialogCreate } from "./dialog-create";
import { DialogBody } from "./dialog-body";

export function MainBody() {
  return (
    <>
      <div className="flex items-start justify-center w-full h-full bg-muted rounded-sm bevel my-16">
        <DialogCreate
          theButton={<Button className="mt-4">CREATE</Button>}
          childDescription={<DialogBody />}
          childTitle="Create Flow!"
        ></DialogCreate>
      </div>
    </>
  );
}
