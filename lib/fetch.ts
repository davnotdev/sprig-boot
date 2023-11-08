import { minify } from "terser";

const sprigGithubGames =
  "https://api.github.com/repos/hackclub/sprig/contents/games";

export interface GameFetchData {
  name: string;
  size: number;
  downloadUrl: string;
}

export async function fetchGames(): Promise<GameFetchData[]> {
  let res = await fetch(sprigGithubGames);
  let resGames = await res.json();
  let games = resGames
    .filter((game: any) => game.name.match(".js$") && game.type == "file")
    .map((game: any) => {
      return {
        name: game.name,
        size: game.size,
        downloadUrl: game.download_url,
      } as GameFetchData;
    });
  return games;
}

export interface GameCode {
  name: string;
  size: number;
  author: string;
  contents: string;
}

export async function fetchGameCode(data: GameFetchData): Promise<GameCode> {
  function tryFindName(contents: string): string | null {
    let match = contents.match(/@title:\s(.*?)\n/);
    if (!match) {
      return null;
    }

    let res = "";
    for (let i = 1; i < match.length; i++) {
      res += match[i] + " ";
    }

    return res;
  }

  function tryFindAuthor(contents: string): string | null {
    let match = contents.match(/@author:\s(.*?)\n/);
    if (!match) {
      return null;
    }

    let res = "";
    for (let i = 1; i < match.length; i++) {
      res += match[i] + " ";
    }

    return res;
  }
  let res = await fetch(data.downloadUrl);
  let contents = await res.text();

  let name =
    tryFindName(contents) || data.name.substring(0, data.name.length - 3);
  let author = tryFindAuthor(contents) || "Unknown";

  let minifiedRes = await minify(contents, {
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
  });
  let minifiedContents = minifiedRes.code!;

  return {
    author,
    name,
    size: data.size,
    contents: minifiedContents,
  };
}
