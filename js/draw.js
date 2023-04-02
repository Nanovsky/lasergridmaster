const $Grid = document.getElementById("grid");

let oGrid,
    iInitialLeft = 30,
    iInitialTop = 30,
    iTop = iInitialTop,
    iLeft = iInitialLeft,
    iX = 40,
    iY = 40,
    iGapX = 10,
    iGapY = 10,
    iRow = 1,
    iCol = 1;

let getTitleTopBox = (sText, iTop, iLeft, iCol) => {
    let sTemplate = `<div class="title top tCol${iCol}" style="top: ${iTop}px;left: ${iLeft}px;">${sText}</div>`;
    return sTemplate;
};
let getHTitle = (aTitles) => {
    iLeft += iX + (iGapX * 2);

    let sTittles = aTitles.map((sTitle, i) => {
        let sBox = getTitleTopBox(sTitle, iTop, iLeft, ++i);

        iLeft += iX + iGapX;

        return sBox;
    }).join("");

    iLeft = iInitialLeft;
    iTop += iY; // No need for a gap for the title

    return sTittles;
};

let getTitleLeftBox = (sText, iTop, iLeft, iRow) => {
    let sTemplate = `<div class="title left tRow${iRow}" style="top: ${iTop}px;left: ${iLeft}px;">${sText}</div>`;
    return sTemplate;
};

let getVTitle = (aTitles) => {
    iTop += iGapY;

    let sTittles = aTitles.map((sTitle, i) => {
        let sBox = getTitleLeftBox(sTitle, iTop, iLeft, ++i);

        iTop += iY + iGapY;

        return sBox;
    }).join("");

    iLeft = iInitialLeft + iX + (iGapX * 2);
    iTop = iInitialTop + iY + iGapY;

    return sTittles;
};

let getBox = (iTop, iLeft, fSimulate) => {
    let fSim = fSimulate / 100,
        sStyle;

    if (oGrid.values.simulate) {
        sStyle = `top: ${iTop}px;left: ${iLeft}px; opacity: ${fSim};`;
    } else {
        sStyle = `top: ${iTop}px;left: ${iLeft}px;`;
    }

    return `<div data-row="${iRow}" data-col="${iCol}" class="box row${iRow} col${iCol}" style="${sStyle}"></div>`;
};

let getRow = (oRow) => {
    let aRow = oRow.cols.map(oCol => {
            let oBox = getBox(iTop, iLeft, oCol.simulate);

            iLeft += iX + iGapX;
            iCol++;

            return oBox;
        });

    iTop += iY + iGapY;
    iLeft = iInitialLeft + iX + (iGapX * 2);
    iRow++;
    iCol = 1;

    return aRow.join("\n");
};

let getLegendX = () => {
    let iGridX = oGrid.values.gridX,
        iSizeX = (iGridX * iX) + (iGridX * iGapX) - iGapX,
        iOffsetLeft = iLeft+(iGapX * 2)+iX;

    if (iSizeX < 80) {
        iSizeX = 80;
    }

    if (iGridX === 1) {
        iOffsetLeft -= 20;
    }

    return `<div id="legendX" style="left:${iOffsetLeft}px;width:${iSizeX}px;">Power %</div>`;
};

let getLegendY = () => {
    let iGridY = oGrid.values.gridY,
        iSizeY = (iGridY * iY) + (iGridY * iGapY) - iGapY,
        iOffsetTop = iTop+iGapY+iY;

    if (iGridY < 2) {
        iOffsetTop = iTop+iGapY+(iGridY * 5);
    }

    if (iGridY < 3) {
        iSizeY = 110;
    }

    return `<div id="legendY" style="top:${iOffsetTop}px;height:${iSizeY}px;">Speed ${oGrid.values.speedUnit}</div>`;
};

let getPasses = oGrid => {
    let iGridY = oGrid.values.gridY,
        iGridX = oGrid.values.gridX,
        iPasses = oGrid.values.passes,
        iSizeY = (iGridY * iY) + (iGridY * iGapY) - iGapY,
        iSizeX = iLeft + (iGridX * iX) + (iGridX * iGapX),
        iOffsetTop = iTop;

    if (iGridY < 2) {
        iOffsetTop = iTop - (iSizeY / 2);
    }

    if (iGridY < 3) {
        iSizeY = 90;
    }

    return `<div id="passes" class="passes_${iPasses}" style="top:${iOffsetTop}px;left:${iSizeX}px;height:${iSizeY}px;">Passes: ${iPasses}</div>`;
}

let attachListeners = () => {

    $Grid.querySelectorAll(".box").forEach(oBox => {
        let sRow = oBox.dataset.row,
            sCol = oBox.dataset.col;

        oBox.addEventListener("mouseenter", oEvent => {
            document.querySelectorAll(`#grid .box.col${sCol}`).forEach(oBox => {
                oBox.classList.add("hover");
            });
            document.querySelectorAll(`#grid .box.row${sRow}`).forEach(oBox => {
                oBox.classList.add("hover");
            });

            let oCol = document.querySelector(`#grid .tCol${sCol}`),
                oRow = document.querySelector(`#grid .tRow${sRow}`);

            oCol.style.setProperty("font-weight", "bold");
            oCol.style.setProperty("font-size", "larger");

            oRow.style.setProperty("font-weight", "bold");
            oRow.style.setProperty("font-size", "larger");
        });
        oBox.addEventListener("mouseleave", oEvent => {
            document.querySelectorAll(`#grid .box.col${sCol}`).forEach(oBox => {
                // oBox.style.removeProperty("background-color");
                oBox.classList.remove("hover");
            });
            document.querySelectorAll(`#grid .box.row${sRow}`).forEach(oBox => {
                // oBox.style.removeProperty("background-color");
                oBox.classList.remove("hover");
            });

            let oCol = document.querySelector(`#grid .tCol${sCol}`),
                oRow = document.querySelector(`#grid .tRow${sRow}`);

            oCol.style.removeProperty("font-weight");
            oCol.style.removeProperty("font-size");

            oRow.style.removeProperty("font-weight");
            oRow.style.removeProperty("font-size");
        });
    });
}

let getLogo = () => {
    let iGridX = oGrid.values.gridX,
        iGridY = oGrid.values.gridY,
        iSizeX = (iGridX * iX) + (iGridX * iGapX) - iGapX,
        iSizeY = (iGridY * iY) + (iGridY * iGapY) - iGapY,
        iOffsetLeft = (iGridX > 2 ? iLeft : 0)+(iGapX * 2)+iX,
        iTop = iSizeY+(iGapY/6)+(iY * 2),
        sText = "LaserGridMaster.com";

    if (iGridX < 4) {
        iTop += iGridY === 1 ? 40 : 10;
    }

    if (iSizeX < 80) {
        iSizeX = 80;
    }

    if (iGridX === 1) {
        iOffsetLeft -= 30;
    }

    return `<div id="logo" style="top:${iTop}px;left:${iOffsetLeft}px;width:${iSizeX}px;">${sText}</div>`;
};

let go = (grid) => {
    let aElements = [];

    oGrid = grid;

    // Engrave / Cut mode
    if (grid.values.mode === "engrave") {
        $Grid.classList.remove("cut");
        $Grid.classList.add("engrave");
    } else {
        $Grid.classList.remove("engrave");
        $Grid.classList.add("cut");
    }

    // Legend
    aElements.push(getLegendX());
    aElements.push(getLegendY());

    // Logo
    if (oGrid.values.logo) {
        aElements.push(getLogo());
    }

    // Get Horizontal titles
    aElements.push(getHTitle(grid.colTitles));
    aElements.push(getVTitle(grid.rowTitles));

    // Passes
    aElements.push(getPasses(grid));

    // Get actual grid
    grid.grid.forEach(oRow => {
        aElements.push(getRow(oRow));
    });

    // Render grid
    $Grid.innerHTML = aElements.join("\n");

    attachListeners();

    // Reset
    iTop = iInitialTop;
    iLeft = iInitialLeft;
    iRow = 1;
    iCol = 1;
};

export default {go};