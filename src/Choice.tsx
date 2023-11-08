import {
    Accessor,
    For,
    Setter,
    Show,
    createResource,
    createSignal,
    onMount,
} from "solid-js";
import { GenerateData } from "./App";
import { GameFetchData, fetchGames } from "../lib/fetch";

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
                        <div>
                            <div>Name: {game.name}</div>
                            <div>Size: {game.size}</div>
                            <input
                                type="checkbox"
                                onchange={(e) => {
                                    let checked = e.target.checked;

                                    if (checked) {
                                        let data = generateData() as ChoiceGenerate;
                                        data.games = [...(data.games ? data.games : []), game];
                                    } else {
                                        let data = generateData() as ChoiceGenerate;
                                        let newGames = (data.games ? data.games : []).filter(
                                            (listGame) => listGame.downloadUrl == game.downloadUrl,
                                        );
                                        setGenerateData({ games: newGames });
                                    }
                                }}
                            ></input>
                        </div>
                    )}
                </For>
            </Show>
        </>
    );
}
