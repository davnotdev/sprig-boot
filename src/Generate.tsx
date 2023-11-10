import { GenerateData } from "./App";
import { Accessor, Show, createSignal } from "solid-js";

import { fetchGames, fetchGameCode } from "../lib/fetch.ts";
import { genBootCode } from "../lib/builder.ts";
import { upload } from "../lib/upload.ts";
import { SurpriseGenerate } from "./Surprise.tsx";
import { ChoiceGenerate } from "./Choice.tsx";

export default function Generate({
  generateData,
}: {
  generateData: Accessor<GenerateData>;
}) {
  let [bootCode, setBootCode] = createSignal(null as string | null);
  let [isLoading, setIsLoading] = createSignal(false);
  return (
    <div class="flex flex-row justify-center">
      <div class="flex flex-col w-80 space-x-4">
        <button
          onclick={async () => {
            let untypedData = generateData();
            if ((untypedData as SurpriseGenerate).gameCount) {
              setIsLoading(true);
              let data = untypedData as SurpriseGenerate;
              let games = await fetchGames();
              let hardLimit = 20;
              let randomGames: number[] = [];

              for (let i = 0; i < data.gameCount && hardLimit; i++) {
                let rand = Math.floor(Math.random() * data.gameCount);
                if (randomGames.includes(rand)) {
                  hardLimit--;
                  i--;
                } else {
                  randomGames.push(rand);
                }
              }

              let gameCodes = await Promise.all(
                randomGames.map((gameIndex) => fetchGameCode(games[gameIndex])),
              );
              let bootCode = await genBootCode(gameCodes);
              setBootCode(bootCode);
              setIsLoading(false);
            }

            if ((untypedData as ChoiceGenerate).games) {
              setIsLoading(true);
              let data = untypedData as ChoiceGenerate;
              let gameCodes = await Promise.all(
                data.games.map((game) => fetchGameCode(game)),
              );
              let bootCode = await genBootCode(gameCodes);
              setBootCode(bootCode);
              setIsLoading(false);
              window.scrollBy(0, 100);
            }
          }}
        >
          Generate
        </button>

        <br />

        <Show when={isLoading()}>Processing...</Show>
        <Show when={bootCode() != null}>
          <div class="flex flex-row justify-center space-x-4">
            <button
              onclick={() => {
                navigator.clipboard.writeText(bootCode()!);
              }}
            >
              Copy
            </button>
            <button
              onclick={() => {
                try {
                  upload(bootCode()!);
                } catch (e) {
                  alert("Upload to Sprig Failed! Check console.");
                }
              }}
            >
              Upload to Sprig
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}
