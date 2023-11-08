//
//  Courtesy of Hack Club
//  Copied with <3
//

const getPort = async (): Promise<SerialPort> => {
    if (!navigator.serial) {
        const msg =
            "Your browser does not support the Web Serial API. Please try again in a recent version of a Chromium-based browser, such as Chrome, Edge, or Arc.";
        alert(msg);
        throw new Error(msg);
    }

    // getPorts() returns all the ports granted access to this origin.
    // If there's only one, it's probably a Sprig. This should allow
    // only one button press to upload a game.
    const ports = await navigator.serial.getPorts();
    if (ports.length === 1) return ports[0]!;

    return await navigator.serial.requestPort();
};

export const uploadToSerial = async (
    message: string,
    writer: WritableStreamDefaultWriter<ArrayBuffer>,
) => {
    const buf = new TextEncoder().encode(message);

    console.log("[UPLOAD > SERIAL] Checkpoint 1");
    await writer.ready;
    console.log("[UPLOAD > SERIAL] Checkpoint 1 - writing startup sequence");
    await writer.write(new Uint8Array([0, 1, 2, 3, 4]).buffer);

    console.log("[UPLOAD > SERIAL] Checkpoint 2");
    await writer.ready;
    console.log("[UPLOAD > SERIAL] Checkpoint 2 - writing length");
    await writer.write(new Uint32Array([buf.length]).buffer);

    console.log("[UPLOAD > SERIAL] Checkpoint 3");
    await writer.ready;
    console.log("[UPLOAD > SERIAL] Checkpoint 3 - writing source code");
    const ticker = setInterval(
        () => console.warn("[UPLOAD > SERIAL] 300ms passed writing source code"),
        300,
    );
    await writer.write(buf);
    clearInterval(ticker);
    console.log(`[UPLOAD > SERIAL] Wrote ${buf.length} chars`);

    // Ensure everything is written before continuing
    await writer.ready;
};

export const upload = async (code: string): Promise<void> => {
    let port: SerialPort | undefined;
    try {
        console.log("[UPLOAD] Prompting user for port...");
        port = await getPort();

        console.log("[UPLOAD] Port found, opening serial stream...");
        const start = Date.now();

        await port.open({ baudRate: 115200 });
        console.log("[UPLOAD] Connected to RP2040, starting upload");

        // Listen to data coming from the serial port.
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable!.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();

        const receivedEOT = new Promise<void>((resolve) => {
            (async () => {
                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        if (value.indexOf("ALL_GOOD") >= 0) resolve();
                        if (value.trim().length > 0)
                            console.log(`%c< ${value.trim()}`, "color: #999");
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    reader.releaseLock();
                }
            })();
        });

        const writer = port.writable!.getWriter();
        await uploadToSerial(code, writer);
        await receivedEOT;

        reader.cancel();
        console.log("[UPLOAD] Waiting on stream close and writer lock release...");
        await readableStreamClosed;
        writer.releaseLock();

        const elapsed = ((Date.now() - start) / 1000).toFixed(2);
        console.log(`[UPLOAD] Upload complete in ${elapsed}s!`);
    } catch (error) {
        console.log("[UPLOAD] Error uploading!");
        console.error(error);
    }
    if (port) await port.close();
};
