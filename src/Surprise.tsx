import { GenerateData } from "./App";
import { Setter, createSignal } from "solid-js";

export interface SurpriseGenerate {
  gameCount: number;
}

export default function Surprise({
  setGenerateData,
}: {
  setGenerateData: Setter<GenerateData>;
}) {
  let [gameCount, setGameCount] = createSignal(0);
  return (
    <>
      <input
        type="range"
        min="0"
        max="300"
        value="0"
        step="1"
        onchange={(e) => {
          setGenerateData({
            gameCount: parseInt(e.target.value),
          });
          setGameCount(parseInt(e.target.value));
        }}
      ></input>
      <p>We will be loading {gameCount()} games!</p>
    </>
  );
}
