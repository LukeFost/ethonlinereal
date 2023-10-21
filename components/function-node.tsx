import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "./drop-down";

export function TextUpdaterNode({ data, isConnectable }) {
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value);
  }, []);
  const [network, setNetwork] = React.useState("none");

  const [selectedNetwork, setSelectedNetwork] = React.useState("None");
  const [selectedProtocol, setSelectedProtocol] = React.useState("None");
  const [selectedFunction, setSelectedFunction] = React.useState("None");

  const [networkValue, setNetworkValue] = React.useState("none");
  const [protocolValue, setProtocolValue] = React.useState("none");
  const [functionValue, setFunctionValue] = React.useState("none");

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

  const setSpecificValue = (value, options, setDisplay, setValue) => {
    const selectedOption = options.find(
      ([optionValue]) => optionValue === value
    );
    setDisplay(selectedOption ? selectedOption[1] : "None");
    setValue(value);
  };

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
    <div className="text-updater-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
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

        <br />
        <label htmlFor="address">Token Address</label>
        <Input
          id="address"
          name="address"
          placeholder="0x00"
          onChange={onChange}
          type="number"
          className="nodrag"
        />
        <label htmlFor="amount">Token Amount</label>
        <Input
          id="amount"
          name="amount"
          placeholder="0.00"
          onChange={onChange}
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
