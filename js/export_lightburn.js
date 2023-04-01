import calc from "./calc";
import util from "./util.js";

let iInitialLeft = 30,
    iInitialTop = 30,
    iTop = iInitialTop,
    iLeft = iInitialLeft,
    iX = 10,
    iY = 10,
    iGapX = 3,
    iGapY = 3,
    aCut = [],
    aShape = [],
    iCutIndex = 0,
    iPriority = 0;

let Grid,
    o = `<?xml version="1.0" encoding="UTF-8"?>
<LightBurnProject AppVersion="1.3.01" FormatVersion="0" MaterialHeight="0" MirrorX="False" MirrorY="True">
    <VariableText>
        <Start Value="0"/>
        <End Value="999"/>
        <Current Value="0"/>
        <Increment Value="1"/>
        <AutoAdvance Value="0"/>
    </VariableText>
    %%CUT%%
    %%SHAPE%%
    <Notes ShowOnLoad="0" Notes=""/>
</LightBurnProject>
`;

let getIndex = (bNew) => {
    if (bNew) iCutIndex++;
    return iCutIndex;
};

let getPriority = (bNew) => {
    if (bNew) iPriority++;
    return iPriority;
};

let getFill = (iIndex, iSpeed, iPower, iPasses) => {
    let sName = iIndex === 0 ? "Labels" : "Row " + iIndex;
    return `<CutSetting type="Scan">
                <index Value="${iIndex}"/>
                <name Value="${sName}"/>
                <maxPower Value="${iPower}"/>
                <maxPower2 Value="${iPower}"/>
                <speed Value="${iSpeed}"/>
                <numPasses Value="${iPasses}"/>
                <priority Value="${getPriority(true)}"/>
            </CutSetting>`;
};

let getCut = (iIndex, iSpeed, iPower, iPasses) => {
    let sName = "Row " + iIndex;
    return `<CutSetting type="Cut">
                <index Value="${iIndex}"/>
                <name Value="${sName}"/>
                <maxPower Value="${iPower}"/>
                <maxPower2 Value="${iPower}"/>
                <speed Value="${iSpeed}"/>
                <numPasses Value="${iPasses}"/>
                <priority Value="${getPriority(true)}"/>
            </CutSetting>`;
};

let createTitleBox = (sText, iTop, iLeft, iVert, ah = 1, av = 1) => {
    let sRotate;
    switch (iVert) {
        case 1:
            sRotate = "0 -1 1 0";
            break;
        case 2:
            sRotate = "0 1 -1 0";
            break;
        case 0:
        default:
            sRotate = "1 0 0 1";
            break;
    }
    let sShape = `<Shape Type="Text" CutIndex="0" Font="Arial,-1,100,5,50,0,0,0,0,0" Str="${sText}" H="4" LS="0" LnS="0" Ah="${ah}" Av="${av}" Weld="1">
                            <XForm>${sRotate} ${iLeft} ${iTop}</XForm>
                        </Shape>`;

    aShape.push(sShape);
};
let createColTitles = () => {
    iLeft += iX + iGapX;

    Grid.colTitles.forEach((sTitle) => {
        let i;

        // + (sText.length < 3 ? sText.length * 1.5 : 1.5)
        if (sTitle.length === 1) {
            i = iLeft + 4.5;
        } else if (sTitle.length === 2) {
            i = iLeft + 3;
        } else {
            i = iLeft + 1.5;
        }

        createTitleBox(sTitle, (iTop + 1.5), i, 0, 0);
        iLeft += iX + iGapX;
    });

    iLeft = iInitialLeft + (iGapX * 2);
    iTop += (iY - iGapY); // No need for a gap for the title
};

let getTitleOffset = (sTitle, iLeft) => {
    let oWidths = {
            "0": 2,
            "1": 1.7,
            "2": 1.9,
            "3": 1.9,
            "4": 2.1,
            "5": 1.8,
            "6": 1.9,
            "7": 1.9,
            "8": 1.9,
            "9": 1.8,
            ".": 1.2,
            "k": 2.1,
            "P": 1.9,
            "p": 1.7,
            "a": 1.5,
            "s": 1.4,
            "e": 1.7,
            ":": 0.5,
            " ": 0.7
        },
        iSpacing = sTitle.length * 0.1,
        iText = sTitle.split("").reduce((a, v) => a + oWidths[v], 0);

    return (iX - (iText + iSpacing)) + iLeft;
};

let createRowTitles = () => {
    Grid.rowTitles.forEach((sTitle) => {
        createTitleBox(sTitle, iTop + 3.5, getTitleOffset(sTitle, iLeft), 0, 0);
        iTop += iY + iGapY;
    });
    iTop += iGapY;

    iLeft = iInitialLeft + iX + (iGapX * 2);
    iTop = iInitialTop + iY + iGapY;
};

let getPowerScale = (iPower) => {
    return (iPower / Grid.values.powerMax) * 100;
};

let getOffset = (iOriginal, iSize) => {
    return iOriginal + Math.floor((iSize / 2));
}

let createBox = (iTop, iLeft, iPower, iSpeed, iPasses) => {
    let i = getIndex(),
        oBox = `<Shape Type="Rect" CutIndex="${i}" PowerScale="${getPowerScale(iPower)}" W="${iX}" H="${iY}" Cr="0">
                    <XForm>1 0 0 1 ${getOffset(iLeft, iX)} ${getOffset(iTop, iY)}</XForm>
                </Shape>`;

    aShape.push(oBox);
};

let createRow = (oRow) => {
    iLeft = iInitialLeft + iX + (iGapX * 3);

    // New index on every new row
    let i = getIndex(true),
        bCut = Grid.values.mode === "cut";

    oRow.cols.forEach(oCol => {
        /* CUT */
        if (bCut) {
            aCut.push(getCut(i, oCol.speed, oCol.power, Grid.values.passes));
        } else {
            aCut.push(getFill(i, oCol.speed, oCol.power, Grid.values.passes));
        }

        createBox(iTop, iLeft, oCol.power, oCol.speed, Grid.values.passes);
        iLeft += iX + iGapX;
    });

    iTop += iY + iGapY;
};

let createRows = () => {
    // Get actual grid
    Grid.grid.forEach(oRow => createRow(oRow));
};

let createLegendX = () => {
    let iGridX = Grid.values.gridX,
        iGaps = (iGridX - 1) * iGapX,
        iWidth = (iGridX * iX) + iGaps,
        iPosX = iInitialLeft + iX + (iGapX * 3) + (iWidth / 2),
        iOffsetTop = iTop + 1.5;

    createTitleBox("Power %", iOffsetTop, iPosX);

    iTop = iInitialTop + (iGapY * 2);
};

let createLegendY = () => {
    let sTitle = `Speed ${Grid.values.speedUnit}`,
        iGridY = Grid.values.gridY,
        iGaps = (iGridY - 1) * iGapY,
        iHeight = (iGridY * iY) + iGaps,
        iPosY = iInitialTop + iY + iGapY + (iHeight / 2);

    createTitleBox(sTitle, iPosY, iInitialLeft, 1);

    iLeft += iGapX * 2;
};

let createPasses = () => {
    if (Grid.values.passes <= 1) {
        return;
    }
    let sTitle = `Passes: ${Grid.values.passes}`,
        iGridY = Grid.values.gridY,
        iGridX = Grid.values.gridX,
        iGaps = (iGridY - 1) * iGapY,
        iHeight = (iGridY * iY) + iGaps,
        iText = getTitleOffset(sTitle, 0),
        iPosY = iInitialTop + iY + iGapY + (iHeight / 2) - (iText / 2),
        iGapsX = (iGridX - 1) * iGapX,
        iWidthX = (iGridX * iX) + iGapsX,
        iPosX = iInitialLeft + iX + (iGapX * 5) + iWidthX;

    createTitleBox(sTitle, iPosY, iPosX, 2);
}

let createLogo = () => {
    let iGridX = Grid.values.gridX,
        iGridY = Grid.values.gridY,
        iGapsX = (iGridX - 1) * iGapX,
        iGapsY = (iGridY - 1) * iGapY,
        iWidth = (iGridX * iX) + iGapsX,
        iHeight = (iGridY * iY) + iGapsY,
        iPosX = iInitialLeft + iX + (iGapX * 3) + (iWidth / 2),
        iPosY = iInitialTop + iY + (iGapY * 2) + iHeight,
        iOffsetY = iPosY + 1.5;

    if (iGridY === 1 && iGridX < 4) {
        iOffsetY += 5;
    }

    createTitleBox("LaserGridMaster.com", iOffsetY, iPosX);
};

let reset = () => {
    iLeft = iInitialLeft;
    iTop = iInitialTop;
    iPriority = 0;
    iCutIndex = 0;
};

let convertGridSpeed = () => {
    let sFrom = Grid.values.speedUnit,
        sTo = "mm/s";

    Grid.grid.forEach(oRow => {
        let iSpeed = calc.convertSpeed(oRow.speed, sFrom, sTo);

        iSpeed = iSpeed;
        oRow.speed = iSpeed;
        oRow.cols.forEach(oCol => oCol.speed = iSpeed);
    });
};

let getXML = () => {
    // Reset
    aCut = [
        // Take care of labels
        getFill(0, Grid.values.labelSpeed, Grid.values.labelPower, 1)
    ];
    aShape = [];

    if (Grid.values.speedUnit !== "mm/s") {
        convertGridSpeed();
    }

    createLegendX();
    createLegendY();
    createPasses();
    createColTitles();
    createRowTitles();
    createRows();

    if (Grid.values.logo) {
        createLogo();
    }

    let sFile = o.replace("%%CUT%%", aCut.join("\t"))
                 .replace("%%SHAPE%%", aShape.join("\t"));

    reset();

    return sFile;
};

let downloadFile = () => {
    let blob = new Blob([getXML()], {
        type: "application/xml",
    });

    let sFile = util.getFileName(Grid, "lbrn");

    util.downloadBlob(blob, sFile);

    return sFile;
}

let getFile = (oGrid) => {
    Grid = oGrid;
    return {
        blob: new Blob([getXML()], {
            type: "application/xml",
        }),
        file: util.getFileName(Grid, "lbrn")
    };
}

let download = (oGrid, bZip) => {
    Grid = oGrid;
    return downloadFile(bZip);
};

export default {
    download,
    getFile
}