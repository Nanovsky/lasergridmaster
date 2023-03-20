import {downloadZip} from "client-zip";

let getFileName = (oGrid, sExt) => {
    let v = oGrid.values,
        a = [];

    // Grid size
    a.push(`${v.gridX}x${v.gridY}`);

    // Power
    a.push(`power_${v.powerMin}-${v.powerMax}`);

    // Speed
    a.push(`speed_${v.speedMin}-${v.speedMax}`);

    // Unit
    a.push(v.speedUnit.replace("/", "-"));

    // Passes
    a.push(`passes-${v.passes}`);

    // Mode
    a.push(v.mode);

    return `MT_${a.join("_")}.${sExt}`;
};

let getEventName = (oGrid, sFormat) => {
    let v = oGrid.values,
        a = [];

    // Grid size
    a.push(`${v.gridX}x${v.gridY}`);

    // Power
    a.push(`${v.powerMin}-${v.powerMax}`);

    // Speed
    a.push(`${v.speedMin}-${v.speedMax}`);

    // Unit
    a.push(v.speedUnit.replace("/", "-"));

    // Passes
    a.push(`${v.passes}`);

    // Mode
    a.push(v.mode === "engrave" ? "e" : "c");

    a.push(sFormat);

    return a.join(",").slice(0, 40);
};

async function downloadAsZip(bBlob, name) {
    let blob = await downloadZip([{
        name: name,
        lastModified: new Date(),
        input: bBlob
    }]).blob();

    // make and click a temporary link to download the Blob
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name.replace(".xcs", ".zip").replace(".lbrn", ".zip");
    link.click();
    link.remove();
}


let downloadBlob = (blob, name) => {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");

    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = name;

    // Append link to the body
    document.body.appendChild(link);

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );

    // Remove link from body
    document.body.removeChild(link);
}

export default {
    getFileName,
    getEventName,
    downloadAsZip,
    downloadBlob
}
