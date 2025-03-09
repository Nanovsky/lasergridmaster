import { v4 as uuidv4 } from 'uuid';
import calc from "./calc";
import util from "./util.js";

let iInitialLeft = 30,
    iInitialTop = 30,
    iTop = iInitialTop,
    iLeft = iInitialLeft,
    iX = 10,
    iY = 10,
    iGapX = 3,
    iGapY = 3;

// let sGroupUUID;

let Grid,
    o = {
        "canvasId": "00000000-0000-0000-0000-000000000000",
        "canvas": [
            {
                "id": "00000000-0000-0000-0000-000000000000",
                "title": "{panel}1",
                "layerData": {
                    "#00befe": {
                        "name": "{Cyan}",
                        "order": 1,
                        "visible": true
                    }
                },
                "groupData": {},
                "displays": [],
                "extendInfo": {
                    "version": "2.13.75",
                    "rulerPluginData": {
                        "rulerGuide": []
                    },
                    "gridOptions": {
                        "color": "normal",
                        "isShow": true
                    }
                }
            }
        ],
        "extId": "F1Ultra",
        "extName": "F1 Ultra",
        "device": {
            "id": "F1Ultra",
            "power": [
                20,
                20
            ],
            "data": {
                "dataType": "Map",
                "value": [
                    [
                        "00000000-0000-0000-0000-000000000000",
                        {
                            "mode": "LASER_PLANE",
                            "data": {
                                "LASER_PLANE": {
                                    "material": 0,
                                    "lightSourceMode": "blue",
                                    "thickness": null,
                                    "isProcessByLayer": false,
                                    "pathPlanning": "auto",
                                    "fillPlanning": "separate",
                                    "dreedyTsp": false,
                                    "avoidSmokeModal": false,
                                    "scanDirection": "topToBottom",
                                    "xcsUsed": []
                                }
                            },
                            "displays": {
                                "dataType": "Map",
                                "value": []
                            }
                        }
                    ]
                ]
            },
            "materialList": []
        },
        "version": "2.4.27",
        "created": 1678013263087,
        "modify": 1678013263087,
        "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) xToolCreativeSpace/2.4.27 Chrome/116.0.5845.228 Electron/26.6.3 Safari/537.36",
        "meta": [
            {
                "version": "2.4.27",
                "date": 1741519125426,
                "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) xToolCreativeSpace/2.4.27 Chrome/116.0.5845.228 Electron/26.6.3 Safari/537.36"
            },
            {
                "version": "2.4.27",
                "date": 1741525262520,
                "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) xToolCreativeSpace/2.4.27 Chrome/116.0.5845.228 Electron/26.6.3 Safari/537.36"
            }
        ]
    };

let setCanvasUUID = () => {
    // Canvas UUID
    let sCanvas = uuidv4();
    o.canvasId = sCanvas;
    o.canvas[0].id = sCanvas;
    o.device.data.value[0][0] = sCanvas;
};

let getFill = (sUUID, iSpeed, iPower, iPasses) => {
    return [
        sUUID,
        {
            "processingType": "FILL_VECTOR_ENGRAVING",
            "data": {
                "FILL_VECTOR_ENGRAVING": {
                    "materialType": "customize",
                    "planType": "official",
                    "parameter": {
                        "customize": {
                            "bitmapEngraveMode": "normal",
                            "processingLightSource": "blue",
                            "power": iPower,
                            "speed": iSpeed,
                            "repeat": iPasses,
                            "dotDuration": 100,
                            "dpi": 500,
                            "density": 100,
                            "bitmapScanMode": "zMode",
                            "frequency": 30,
                            "scanAngle": 0,
                            "angleType": 2,
                            "crossAngle": false
                        }
                    }
                }
            },
            "type": "RECT",
            "isFill": false
        }
    ];

}

let getCut = (sUUID, iSpeed, iPower, iPasses) => {
    return [
        sUUID,
        {
            "processingType": "VECTOR_CUTTING",
            "data": {
                "VECTOR_CUTTING": {
                    "materialType": "customize",
                    "processIgnore": false,
                    "parameter": {
                        "customize": {
                            "power": iPower,
                            "speed": iSpeed,
                            "repeat": iPasses
                        }
                    }
                }
            },
            "type": "RECT",
            "isFill": false
        }
    ];
}

let createTitleBox = (sText, iTop, iLeft, iRotate) => {
    let sUUID = uuidv4(),
        oText = {
            "id": sUUID,
            "name": null,
            "type": "TEXT",
            "x": iLeft,
            "y": iTop,
            "angle": iRotate ? iRotate : 0,
            "scale": {
                "x": 0.20833333333333334,
                "y": 0.20833333333333334
            },
            "skew": {"x": 0,"y": 0},
            "pivot": {"x": 0,"y": 0},
            "localSkew": {"x": 0,"y": 0},
            "offsetX": iLeft,
            "offsetY": iTop,
            "lockRatio": true,
            "isClosePath": true,
            "zOrder": 0,
            "isFill": true,
            "lineColor": 16421416,
            "fillColor": 16421416,
            "layerTag": "#00befe",
            "layerColor": "#00befe",
            // "groupTag": sGroupUUID,
            "text": sText,
            "resolution": 1,
            "style": {
                "fontSize": 11,
                "fontFamily": "Lato",
                "fontSubfamily": "Regular",
                "fontSource": "build-in",
                "letterSpacing": 0,
                "leading": 0,
                "align": "left"
            }
        },
        oFill = [
            sUUID,
            {
                "isFill": true,
                "type": "TEXT",
                "processingType": "FILL_VECTOR_ENGRAVING",
                "data": {
                    "FILL_VECTOR_ENGRAVING": {
                        "materialType": "customize",
                        "planType": "official",
                        "parameter": {
                            "customize": {
                                "power": Grid.values.labelPower,
                                "speed": Grid.values.labelSpeed,
                                "repeat": 1,
                                "dotDuration": 100,
                                "processingLightSource": "blue",
                                "dpi": 500,
                                "density": 100,
                                "bitmapScanMode": "zMode",
                                "frequency": 30,
                                "scanAngle": 0,
                                "angleType": 2,
                                "crossAngle": false
                            }
                        }
                    }
                },
                "processIgnore": false
            }
        ];

    o.canvas[0].displays.push(oText);
    o.device.data.value[0][1].displays.value.push(oFill);
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

        createTitleBox(sTitle, iTop, i);
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

let getLegendYLength = (sText) => {
    let oWidths = {
        "Speed mm/s": 20.4,
        "Speed mm/m": 21.8,
        "Speed in/s": 17.2,
        "Speed in/m": 18.6
    };

    return oWidths[sText];
};

let createRowTitles = () => {
    Grid.rowTitles.forEach((sTitle) => {
        createTitleBox(sTitle, iTop + 3.5, getTitleOffset(sTitle, 33));
        iTop += iY + iGapY;
    });
    iTop += iGapY;

    iLeft = iInitialLeft + iX + (iGapX * 2);
    iTop = iInitialTop + iY + iGapY;
};


let createBox = (iTop, iLeft, iPower, iSpeed, iPasses) => {
    let sUUID = uuidv4(),
        bCut = Grid.values.mode === "cut",
        iColor = bCut ? 10036991 : 16421416,
        oBox = {
            "id": sUUID,
            "type": "RECT",
            "x": iLeft,
            "y": iTop,
            "angle": 0,
            "scale": {"x": 1,"y": 1},
            "skew": {"x": 0,"y": 0},
            "pivot": {"x": 0,"y": 0},
            "localSkew": {"x": 0,"y": 0},
            "offsetX": iLeft,
            "offsetY": iTop,
            "lockRatio": true,
            "isClosePath": true,
            "zOrder": 0,
            "width": iX,
            "height": iY,
            // "groupTag": sGroupUUID,
            "isFill": !bCut,
            "lineColor": iColor,
            "fillColor": iColor
        };

    let oProcess = bCut ? getCut(sUUID, iSpeed, iPower, iPasses) : getFill(sUUID, iSpeed, iPower, iPasses);

    o.canvas[0].displays.push(oBox);
    o.device.data.value[0][1].displays.value.push(oProcess);
};

let createRow = (oRow) => {
    iLeft = iInitialLeft + iX + (iGapX * 3);

    oRow.cols.forEach(oCol => {
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
        iPosX = iInitialLeft + iX + (iGapX * 3) + (iWidth / 2) - 7.2 /* Width of text */;

    createTitleBox("Power %", iTop, iPosX);

    iTop = iInitialTop + (iGapY * 2);
};

let createLegendY = () => {
    let sTitle = `Speed ${Grid.values.speedUnit}`,
        iGridY = Grid.values.gridY,
        iGaps = (iGridY - 1) * iGapY,
        iHeight = (iGridY * iY) + iGaps,
        iText = getLegendYLength(sTitle),
        iPosY = iInitialTop + iY + iGapY + (iHeight / 2) - (iText / 2);

    // Positioning is relative to top left corner of text block even when rotated
    iPosY += iText;

    createTitleBox(sTitle, iPosY, iInitialLeft, 270);

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
        iText = getTitleOffset(sTitle, 15),
        iPosY = iInitialTop + iY + iGapY + (iHeight / 2) - (iText / 2),
        iGapsX = (iGridX - 1) * iGapX,
        iWidthX = (iGridX * iX) + iGapsX,
        iPosX = iInitialLeft + iX + (iGapX * 5) + iWidthX;

    createTitleBox(sTitle, iPosY, iPosX, 90);
}

let createLogo = () => {
    let iGridX = Grid.values.gridX,
        iGridY = Grid.values.gridY,
        iGapsX = (iGridX - 1) * iGapX,
        iGapsY = (iGridY - 1) * iGapY,
        iWidth = (iGridX * iX) + iGapsX,
        iHeight = (iGridY * iY) + iGapsY,
        iPosX = iInitialLeft + iX + (iGapX * 3) + (iWidth / 2) - 18.25 /* Width of text */,
        iPosY = iInitialTop + iY + (iGapY * 2) + iHeight;

    if (iGridY === 1 && iGridX < 4) {
        iPosY += 5;
    }

    createTitleBox("LaserGridMaster.com", iPosY, iPosX);
};

let reset = () => {
    iLeft = iInitialLeft;
    iTop = iInitialTop;
};

let convertGridSpeed = () => {
    let sFrom = Grid.values.speedUnit,
        sTo = "mm/s";

    Grid.grid.forEach(oRow => {
        let iSpeed = calc.convertSpeed(oRow.speed, sFrom, sTo);

        iSpeed = Math.round(iSpeed);
        oRow.speed = iSpeed;
        oRow.cols.forEach(oCol => oCol.speed = iSpeed);
    });
};

let setTime = () => {
    let iTime = new Date().getTime();
    o.created = iTime;
    o.modify = iTime;
};

let getJSON = () => {
    // Reset
    o.canvas[0].displays = [];

    // Consider this under a switch
    // sGroupUUID = uuidv4();

    if (Grid.values.speedUnit !== "mm/s") {
        convertGridSpeed();
    }

    setCanvasUUID();
    setTime();
    createLegendX();
    createLegendY();
    createPasses();
    createColTitles();
    createRowTitles();
    createRows();

    if (Grid.values.logo) {
        createLogo();
    }

    reset();

    return o;
};

let downloadFile = () => {
    let blob = new Blob([JSON.stringify(getJSON())], {
        type: "application/json",
    });

    let sFile = util.getFileName(Grid, "xcs");

    util.downloadBlob(blob, sFile);

    return sFile;
}

let getFile = (oGrid) => {
    Grid = oGrid;
    return {
        blob: new Blob([JSON.stringify(getJSON())], {
            type: "application/json",
        }),
        file: util.getFileName(Grid, "xcs")
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