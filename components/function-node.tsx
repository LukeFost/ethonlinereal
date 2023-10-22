import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./drop-down";
import { useRecoilState } from "recoil";
import { stemDataNode } from "./atom";

type ValueArray = (string | number)[];

export function TextUpdaterNode({ data, isConnectable }) {
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value);
  }, []);

  const [theDataNode, setTheDataNode] = useRecoilState(stemDataNode);

  const [selectedNetwork, setSelectedNetwork] = React.useState("None");
  const [selectedProtocol, setSelectedProtocol] = React.useState("None");
  const [selectedFunction, setSelectedFunction] = React.useState("None");

  const [networkValue, setNetworkValue] = React.useState("none");
  const [protocolValue, setProtocolValue] = React.useState("none");
  const [functionValue, setFunctionValue] = React.useState("none");
  const [addressValue, setAddressValue] = useState("");
  const [amountValue, setAmountValue] = useState("");

  const networkDisplay: [string, string][] = [
    ["polygon", "Polygon"],
    ["arbitrum", "Arbitrum"],
  ];
  const protocolDisplay: [string, string][] = [
    ["compound", "Compound"],
    ["uniswap", "Uniswap"],
    ["maker", "Maker"],
  ];
  const functionOptionsLookup = {
    compound: [
      ["cFunc1", "Compound Function 1"],
      ["cFunc2", "Compound Function 2"],
    ],
    uniswap: [
      ["uFunc1", "Uniswap Function 1"],
      ["uFunc2", "Uniswap Function 2"],
    ],
    maker: [
      ["mFunc1", "Maker Function 1"],
      ["mFunc2", "Maker Function 2"],
    ],
  };

  const networkToProtocols = {
    polygon: ["compound", "uniswap"],
    arbitrum: ["maker"],
  };

  const functionDisplay = functionOptionsLookup[protocolValue] || [];
  const availableProtocolDisplay = protocolDisplay.filter(([value]) =>
    networkToProtocols[networkValue]?.includes(value)
  );

  // Update this handler to set the addressValue
  const handleAddressChange = useCallback((evt: { target: { value: any } }) => {
    setAddressValue(evt.target.value);
  }, []);

  // Update this handler to set the amountValue
  const handleAmountChange = useCallback((evt: { target: { value: any } }) => {
    setAmountValue(evt.target.value);
  }, []);

  const setSpecificValue = (
    value: string,
    options: any[],
    setDisplay: {
      (value: React.SetStateAction<string>): void;
      (value: React.SetStateAction<string>): void;
      (value: React.SetStateAction<string>): void;
      (arg0: any): void;
    },
    setValue: {
      (value: React.SetStateAction<string>): void;
      (value: React.SetStateAction<string>): void;
      (value: React.SetStateAction<string>): void;
      (arg0: any): void;
    }
  ) => {
    const selectedOption = options.find(
      ([optionValue]) => optionValue === value
    );
    setDisplay(selectedOption ? selectedOption[1] : "None");
    setValue(value);
  };

  useEffect(() => {
    if (
      networkValue !== "none" &&
      protocolValue !== "none" &&
      functionValue !== "none" &&
      addressValue !== "" &&
      amountValue !== ""
    ) {
      const datavalue = data.label;
      const valuesArray: ValueArray = [
        networkValue,
        protocolValue,
        functionValue,
        addressValue,
        amountValue,
        datavalue,
      ];
      setTheDataNode((prevDataNode) => {
        // Find the index of the inner array that has the same datavalue
        const dataIndex = prevDataNode.findIndex(
          (arr) => arr[arr.length - 1] === datavalue
        );

        // Create a new array from the previous data node
        let newDataNode = [...prevDataNode];

        // If found, remove the old array
        if (dataIndex !== -1) {
          newDataNode = [
            ...newDataNode.slice(0, dataIndex),
            ...newDataNode.slice(dataIndex + 1),
          ];
        }

        // Add the new valuesArray
        return [...newDataNode, valuesArray];
      });
    }
  }, [networkValue, protocolValue, functionValue, addressValue, amountValue]);

  useEffect(() => {
    const functionOptions = functionOptionsLookup[protocolValue] || [];
    const functionExists = functionOptions.some(
      ([funcValue]) => funcValue === functionValue
    );
    const availableProtocols = networkToProtocols[networkValue] || [];
    const protocolExists = availableProtocols.includes(protocolValue);

    if (!functionExists) {
      setSelectedFunction("None");
      setFunctionValue("none");
    }
    if (!protocolExists) {
      setSelectedProtocol("None");
      setProtocolValue("none");
      setSelectedFunction("None");
      setFunctionValue("none");
    }
  }, [protocolValue, networkValue]);

  return (
    <div className="rounded border-dashed border-2 p-2">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-4"
      />
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
        <label>Protocol</label>
        <ModeToggle
          buttonDisplay={<>{selectedProtocol}</>}
          dropDownOptions={availableProtocolDisplay}
          dropDownValue={(value) =>
            setSpecificValue(
              value,
              protocolDisplay,
              setSelectedProtocol,
              setProtocolValue
            )
          }
          isIconSize={false}
        />
        <label>Function</label>
        <ModeToggle
          buttonDisplay={<>{selectedFunction}</>}
          dropDownOptions={functionDisplay}
          dropDownValue={(value) =>
            setSpecificValue(
              value,
              functionDisplay,
              setSelectedFunction,
              setFunctionValue
            )
          }
          isIconSize={false}
        />
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

export default TextUpdaterNode;
