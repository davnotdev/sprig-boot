// var entries = [
//   {
//     name: "My Game",
//     by: "Me",
//     code: `console.log("hi")`,
//   },
// ];

var selectionIndex = 0;
var booted = false;

function init() {
    setLegend([
        "b",
        `
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`,
    ]);

    setMap("b");

    onInput("w", () => {
        if (!booted) {
            moveSelection(-1);
        }
    });

    onInput("s", () => {
        if (!booted) {
            moveSelection(1);
        }
    });

    onInput("i", () => {
        if (!booted) {
            bootSelected();
        }
    });

    renderEntries(0);
}

function renderEntries(currentIndex) {
    clearText();

    addText("Sprig Boot", {
        x: 5,
        y: 1,
        color: "2",
    });

    const startX = 1;
    const startY = 3;
    const screenCount = 4;
    const maxTitleLength = 18;
    const preAuthorString = "by: ";
    const maxAuthorLength = maxTitleLength - preAuthorString.length;

    let topIndex = currentIndex - screenCount / 2;
    let bottomIndex = currentIndex + screenCount / 2;
    if (topIndex < 0) {
        bottomIndex += currentIndex - topIndex;
        if (bottomIndex > screenCount) {
            bottomIndex = screenCount;
        }
        topIndex = 0;
    }

    for (let i = topIndex; i < bottomIndex; i++) {
        if (entries[i]) {
            let entry = entries[i];
            addText(
                `${capString(
                    entry.name,
                    maxTitleLength,
                )}\n${preAuthorString}${capString(entry.by, maxAuthorLength)}`,
                {
                    x: startX,
                    y: startY + (i - topIndex) * 3,
                    color: currentIndex == i ? "3" : "2",
                },
            );
        }
    }
}

function bootSelected() {
    clearText();
    setMap(`.`);
    booted = true;
    let entry = entries[selectionIndex];
    eval(entry.code);
}

function moveSelection(direction) {
    selectionIndex += direction;
    if (selectionIndex < 0) {
        selectionIndex = entries.length - 1;
    }
    if (selectionIndex >= entries.length) {
        selectionIndex = 0;
    }
    renderEntries(selectionIndex);
}

function capString(s, len) {
    if (s.length > len - 2) {
        return s.substring(0, len - 2) + "..";
    } else {
        return s;
    }
}

init();
