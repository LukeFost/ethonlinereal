import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./drop-down";
import { Button } from "./ui/button";
import { useRecoilState } from "recoil";
import { dataNode } from "./atom";

type ValueArray = (string | number)[];
type otherValuesArray = string[];

export function TextUpdaterNode2({ data, isConnectable }) {
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value);
  }, []);
  const [network, setNetwork] = React.useState("none");
  const [theDataNode, setTheDataNode] = useRecoilState(dataNode);

  const [selectedNetwork, setSelectedNetwork] = React.useState("None");
  const [selectedTrigger, setSelectedTrigger] = React.useState("None");
  const [selectedFunction, setSelectedFunction] = React.useState("None");

  const [networkValue, setNetworkValue] = React.useState("none");
  const [triggerValue, setTriggerValue] = React.useState("none");
  const [functionValue, setFunctionValue] = React.useState("none");

  const networkDisplay: [string, string][] = [
    ["polygon", "Polygon"],
    ["arbitrum", "Arbitrum"],
  ];
  const triggerDisplay: [string, string][] = [
    ["afterswap", "After Swap"],
    ["user", "User Initiated"],
  ];

  const [addressValue, setAddressValue] = useState("");
  const [amountValue, setAmountValue] = useState("");

  const handleAddressChange = useCallback((evt: { target: { value: any } }) => {
    setAddressValue(evt.target.value);
  }, []);

  const handleAmountChange = useCallback((evt: { target: { value: any } }) => {
    setAmountValue(evt.target.value);
  }, []);

  useEffect(() => {
    if (triggerValue === "afterswap") {
      if (
        networkValue !== "none" &&
        triggerValue !== "none" &&
        addressValue !== "" &&
        amountValue !== ""
      ) {
        const valuesArray: ValueArray = [];
        valuesArray.push(networkValue, triggerValue, addressValue, amountValue);
        setTheDataNode(valuesArray);
      }
    } else if (triggerValue === "user") {
      if (networkValue !== "none" && triggerValue !== "none") {
        const otherValuesArray: otherValuesArray = [];
        otherValuesArray.push(networkValue, triggerValue);
        setTheDataNode(otherValuesArray);
      }
    }
  }, [networkValue, triggerValue, addressValue, amountValue]);

  const setSpecificValue = (value, options, setDisplay, setValue) => {
    const selectedOption = options.find(
      ([optionValue]) => optionValue === value
    );
    setDisplay(selectedOption ? selectedOption[1] : "None");
    setValue(value);
  };

  return (
    <div className="rounded border-dashed border-2 p-2">
      <div className="flex flex-col gap-2">
        <label>Network</label>
        <ModeToggle
          buttonDisplay={<>{selectedNetwork}</>}
          dropDownOptions={networkDisplay}
          dropDownValue={(value) =>
            setSpecificValue(
              value,
              networkDisplay,
              setSelectedNetwork,
              setNetworkValue
            )
          }
          isIconSize={false}
        />
        <label>Trigger</label>
        <ModeToggle
          buttonDisplay={<>{selectedTrigger}</>}
          dropDownOptions={triggerDisplay}
          dropDownValue={(value) =>
            setSpecificValue(
              value,
              triggerDisplay,
              setSelectedTrigger,
              setTriggerValue
            )
          }
          isIconSize={false}
        />
        {triggerValue === "afterswap" && (
          <>
            <label htmlFor="address">Token Address</label>
            <Input
              id="address"
              name="address"
              placeholder="0x00"
              onChange={handleAddressChange}
              type="string"
              className="nodrag"
            />
            <label htmlFor="amount">Token Amount</label>
            <Input
              id="amount"
              name="amount"
              placeholder="0.00"
              onChange={handleAmountChange}
              type="number"
              className="nodrag"
            />
          </>
        )}
        {triggerValue === "user" && <Button>Activate</Button>}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode2;
