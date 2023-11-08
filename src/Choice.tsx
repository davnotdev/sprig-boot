import {
  Accessor,
  For,
  Setter,
  Show,
  createResource,
  createSignal,
} from "solid-js";
import { GenerateData } from "./App";
import { GameFetchData, fetchGames } from "../lib/fetch";
import GameCard from "./GameCard";

export interface ChoiceGenerate {
  games: GameFetchData[];
}

export default function Choice({
  generateData,
  setGenerateData,
}: {
  generateData: Accessor<GenerateData>;
  setGenerateData: Setter<GenerateData>;
}) {
  const [games, _] = createSignal([] as GameFetchData[]);
  const [gamesData] = createResource(games, async () => await fetchGames());

  return (
    <>
      <Show when={!gamesData.loading} fallback={<>Fetching Games...</>}>
        <For each={gamesData()} fallback={<>Loading...</>}>
          {(game) => (
            <GameCard
              game={game}
              generateData={generateData}
              setGenerateData={setGenerateData}
            />
          )}
        </For>
      </Show>
    </>
  );
}
