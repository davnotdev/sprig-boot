import { Setter } from "solid-js";
import { GenerateData, SelectionType } from "./App";

export type SelectionChoice = "choice" | "surprise";

export default function Selection({
  setState,
  setGenerateData,
}: {
  setState: Setter<SelectionType>;
  setGenerateData: Setter<GenerateData>;
}) {
  return (
    <div class="flex flex-row space-x-3 justify-center">
      <button
        onclick={() => {
          setState("choice");
          setGenerateData(null);
        }}
      >
        Choose Games
      </button>{" "}
      <p>or</p>
      <button
        onclick={() => {
          setState("surprise");
          setGenerateData(null);
        }}
      >
        Surprise me!
      </button>
    </div>
  );
}
