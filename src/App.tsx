import "./App.css";
import { Show, createSignal } from "solid-js";

import Generate from "./Generate.tsx";
import Selection, { SelectionChoice } from "./Selection.tsx";
import Surprise, { SurpriseGenerate } from "./Surprise.tsx";
import Choice, { ChoiceGenerate } from "./Choice.tsx";

export type SelectionType = null | SelectionChoice;
export type GenerateData = null | SurpriseGenerate | ChoiceGenerate;

function App() {
    let [state, setState] = createSignal(null as SelectionType);
    let [generateData, setGenerateData] = createSignal(null as GenerateData);

    return (
        <>
            <h1>Sprig Boot</h1>
            <h2>Load multiple games on your little sprig!</h2>
            <Selection setState={setState} setGenerateData={setGenerateData} />
            <Show when={state() == "choice"}>
                <Choice generateData={generateData} setGenerateData={setGenerateData} />
            </Show>
            <Show when={state() == "surprise"}>
                <Surprise setGenerateData={setGenerateData} />
            </Show>
            <Show when={generateData() != null}>
                <Generate generateData={generateData} />
            </Show>
        </>
    );
}

export default App;
