import { Accessor, Setter } from "solid-js";
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
  let image =
    game.thumbnailUrl ||
    "https://raw.githubusercontent.com/hackclub/sprig/main/public/SPRIGDINO.png";

  return (
    <div>
      <img src={image} width={80}></img>
      <div>{game.name}</div>
      <input
        type="checkbox"
        onchange={(e) => {
          let checked = e.target.checked;

          if (checked) {
            let data = generateData() as ChoiceGenerate;
            data.games = [...(data.games || []), game];
          } else {
            let data = generateData() as ChoiceGenerate;
            let newGames = (data.games || []).filter(
              (listGame) => listGame.downloadUrl == game.downloadUrl,
            );
            setGenerateData({ games: newGames });
          }
        }}
      ></input>
    </div>
  );
}
