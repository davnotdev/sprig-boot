//  @ts-ignore
import bootGame from "./game.js?raw";
import { minify } from "terser";
import { GameCode } from "./fetch";

export async function genBootCode(codes: GameCode[]): Promise<string> {
  let entries = codes.map((code) => {
    return {
      name: code.name,
      by: code.author,
      code: code.contents,
    };
  });

  let entriesString = `let entries = ${JSON.stringify(entries)};`;
  let minifiedRes = await minify(
    entriesString + bootGame.substring(0, bootGame.length),
    {
      compress: {
        passes: 3,
        unsafe: true,
      },
      mangle: {
        toplevel: true,
      },
      output: {
        beautify: false,
      },
    },
  );
  return minifiedRes.code!;
}
