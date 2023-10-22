import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRecoilValue } from "recoil";
import { dataNode, letConnections, stemDataNode } from "./atom";
import {
  type Address,
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import { instructionFacet_abi_arbg, managerFacet_abi_arbg } from "./contracts";
import { isError } from "lodash";

interface WagmiButtonProps {
  textButton: string;
}

export function WagmiButton(props: WagmiButtonProps) {
  const inputData = useRecoilValue(dataNode);
  const stemData = useRecoilValue(stemDataNode);
  const nodeList = useRecoilValue(letConnections);
  const [ultiArgment, setUltiArgment] = useState<Array>([]);
  const [instrucGet, setInstrucGet] = useState<string>("");
  const [resultsArray, setResultsArray] = useState<string[]>([]);
  const [functionValue, setFunctionValue] = useState<string>("");
  const [contractsList, setContractsList] = useState<any[]>([]);

  // Search for a non-null value at position [3] and [5] in any of the inner arrays of stemData
  const valueToInput = stemData.find(
    (innerArray) => innerArray[3] !== null && innerArray[5] !== null
  )?.[3];

  const valueToInputTwo = stemData.find(
    (innerArray) => innerArray[3] !== null && innerArray[5] !== null
  )?.[5];
  // iterate through each stemData array and check their stemData[i][2]

  // iterate through each stemData array and check their stemData[i][2]
  const valuesFromStemData = stemData.map((array) => array[2]);
  const valueList = [...valuesFromStemData];

  // Only set args if valueToInput exists and matches the required pattern.
  const args1 =
    valueToInput && valueToInput.startsWith("0x") ? [valueToInput] : undefined;
  // Only set args if valueToInput exists and matches the required pattern.
  const args2 =
    valueToInputTwo && valueToInputTwo.startsWith("0x")
      ? [valueToInputTwo]
      : undefined;

  const contractCalls = stemData.map((innerArray) => {
    return {
      ...managerFacet_abi_arbg,
      functionName: innerArray[2], // Using stemData[i][2] as the functionName
      args: innerArray[2] === functionValue ? args1 : args2, // This assumes you want to use args1 or args2 based on some condition. Adjust as needed.
    };
  });

  // Initial contract reads without the dependent call
  const { data, isSuccess, refetch, isError } = useContractReads({
    contracts: [
      ...contractCalls,
      {
        ...instructionFacet_abi_arbg,
        functionName: instrucGet,
      },
    ],
  });

  // Update the contracts list when data changes
  useEffect(() => {
    if (data) {
      // Check if data exists before updating the contracts
      const updatedContracts = [
        ...contractCalls,
        {
          ...instructionFacet_abi_arbg,
          functionName: instrucGet,
        },
        {
          ...managerFacet_abi_arbg,
          functionName: "addDataToFront",
          args: [ultiArgment, data[2]],
        },
      ];
      setContractsList(updatedContracts);
    }
  }, [contractCalls, data, instrucGet, ultiArgment]);

  const { config, isError: prepError } = usePrepareContractWrite({
    ...managerFacet_abi_arbg,
    functionName: "startWorking",
    args: data ? data[3] : undefined, // Check if data is available before accessing it
  });

  const { write, error } = useContractWrite(config);

  useEffect(() => {
    if (error) {
      console.error("Error initializing contract write:", error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return; // Early return if data is not available

    refetch();
    const newUltiArgment = stemData.map((array) => [
      data[0],
      data[1],
      array[4],
      array[6],
    ]);
    setUltiArgment(newUltiArgment);
  }, [refetch, stemData, data]);

  useEffect(() => {
    if (!data) return; // Early return if data is not available

    let tempArray: string[] = [];
    valueList.forEach((value) => {
      if (data[4]) {
        tempArray.push(data[4]);
      }
    });
    setResultsArray(tempArray);
  }, [data, valueList]);
  if (isError) {
    console.error("An error has occurred during contract reading");
  }

  useEffect(() => {
    console.log("UltiArgment updated:", ultiArgment);
    console.log("InstrucGet updated:", instrucGet);
    console.log("ResultsArray updated:", resultsArray);
    console.log("FunctionValue updated:", functionValue);
    console.log("ContractsList updated:", contractsList);
  }, [ultiArgment, instrucGet, resultsArray, functionValue, contractsList]);

  useEffect(() => {
    console.log("Contract write config:", config);
  }, [config]);

  function wagmiRead() {
    try {
      if (!write) {
        throw new Error("Write function is not available."); // Check for write function availability
      }
      write?.();
      console.log("Write operation initiated."); // Confirmation that write has been called
    } catch (error) {
      console.error("An error occurred during wagmiRead execution:", error); // Error logging for wagmiRead function
    }
  }

  useEffect(() => {
    console.log(
      "Write function status:",
      write ? "available" : "not available"
    );
  }, [write]);

  return <Button onClick={wagmiRead}>{props.textButton}</Button>;
}
