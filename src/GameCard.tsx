import { Accessor, Setter, createSignal } from "solid-js";
import { GenerateData } from "./App";
import { ChoiceGenerate } from "./Choice";
import { GameFetchData } from "../lib/fetch";

export default function GameCard({
  game,
  generateData,
  setGenerateData,
}: {
  game: GameFetchData;
  generateData: Accessor<GenerateData>;
  setGenerateData: Setter<GenerateData>;
}) {
  let [selected, setSelected] = createSignal(false);

  let image =
    game.thumbnailUrl ||
    "https://raw.githubusercontent.com/hackclub/sprig/main/public/SPRIGDINO.png";

  return (
    <div
      class={`flex flex-col border-2 rounded-sm p-2 hover:scale-105 ${
        selected() ? "border-rose-500" : "border-rose-50"
      }`}
      onclick={() => {
        let data = generateData() as ChoiceGenerate;
        data ||= { games: [] };

        if (!selected()) {
          data.games = [...data.games, game];
          setSelected(true);
          setGenerateData(data);
        } else {
          let newGames = data.games.filter(
            (listGame) => listGame.downloadUrl != game.downloadUrl,
          );
          setSelected(false);
          setGenerateData({ games: newGames });
        }
      }}
    >
      <div class="w-18 overflow-auto">{game.name}</div>
      <img src={image} class="h-40 object-scale-down p-2"></img>
    </div>
  );
}
