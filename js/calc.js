import convert from "convert";
import curve from "./curve.js";

let oMultipliers;

let getValues = () => {
  let sSpeed = document.getElementById("speed_unit")
        .selectedItem.textContent,
      sMode = document.getElementById("mode")
        .selectedItem.getAttribute("id");

    return {
        gridX: document.getElementById("grid_x").value,
        gridY: document.getElementById("grid_y").value,
        powerMin: document.getElementById("power_min").value,
        powerMax: document.getElementById("power_max").value,
        speedMin: document.getElementById("speed_min").value,
        speedMax: document.getElementById("speed_max").value,
        speedUnit: sSpeed,
        labelSpeed: document.getElementById("label_speed").value,
        labelPower: document.getElementById("label_power").value,
        passes: parseInt(document.getElementById("passes").value),
        mode: sMode,
        logo: document.getElementById("logo").checked,
        simulate: document.getElementById("simulate").checked
    }
};

let getRangePercent = (iMin, iMax, iValue, bFromStart) => {
    let iRange = iMax - (bFromStart ? 1 : iMin);

    return ((iValue - iMin) / iRange) * 100;
};

let getSimulatedPower = (oValues, iPower, iSpeed) => {
    let fPower = iPower,
        fSpeed = getRangePercent(oValues.speedMin, oValues.speedMax, iSpeed, true);

    // Reverse speed effect
    fSpeed = 100 - fSpeed;

    return getRangePercent(0, 200, fPower + fSpeed);
};

let getCols = (oValues, iSpeed) => {
    let aCols = [];

    let iStep = Math.floor((oValues.powerMax - oValues.powerMin) / (oValues.gridX - 1));
    let iPower = oValues.powerMin;

    for (let i = 0;i < (oValues.gridX - 1); i++) {
        aCols.push({
            title: iPower.toString(),
            power: iPower,
            speed: iSpeed,
            step: iStep,
            simulate: getSimulatedPower(oValues,iPower, iSpeed)
        });

        iPower += iStep;
    }

    iPower = oValues.powerMax;

    aCols.push({
        title: iPower.toString(),
        power: iPower,
        speed: iSpeed,
        step: iStep,
        simulate: getSimulatedPower(oValues, iPower, iSpeed)
    });

    return aCols;
};

let formatSpeed = iSpeed => {
    return Intl.NumberFormat('en-US', {
        notation: "compact",
        maximumFractionDigits: 2
    }).format(iSpeed).toLowerCase();
}

let getRows = (oValues) => {
    if (!oValues) return;

    let aRows = [];
    let iStep = Math.floor((oValues.speedMax - oValues.speedMin) / (oValues.gridY - 1));
    let iSpeed = oValues.speedMin;

    for (let i = 0;i < (oValues.gridY - 1); i++) {
        let iFinalSpeed = Math.round(iSpeed * oMultipliers.x[i]);

        aRows.push({
            title: formatSpeed(iFinalSpeed),
            speed: iFinalSpeed,
            step: iStep,
            passes: oValues.passes,
            cols: getCols(oValues, iSpeed)
        });

        iSpeed += iStep;
    }

    iSpeed = oValues.speedMax;

    aRows.push({
        title: formatSpeed(iSpeed),
        speed: iSpeed,
        step: iStep,
        passes: oValues.passes,
        cols: getCols(oValues, iSpeed)
    });

    return aRows;
};

let validateValues = (oValues) => {
    return true; // TODO: Implement validation
};

let getColTitles = (aGrid) => {
    return aGrid[0].cols.map(oCol => oCol.title);
};

let getRowTitles = (aGrid) => {
    return aGrid.map(oRow => oRow.title);
}

let updateMultipliers = oValues => {
    oMultipliers = curve.getMultipliers(oValues.gridX, oValues.gridY);
};

let getGrid = () => {
    let oValues = getValues();

    // Reconfigure curve if needed
    curve.configure(oValues.gridX, oValues.gridY);
    updateMultipliers(oValues);

    if (!validateValues(oValues)) return false;

    let oGrid = {
        version: 2,
        values: oValues,
        grid: getRows(oValues)
    };

    oGrid.colTitles = getColTitles(oGrid.grid);
    oGrid.rowTitles = getRowTitles(oGrid.grid);

    return oGrid;
}

let convertUnit = (iValue, sFrom, sTo) => {
    if (sFrom === sTo) return iValue;

    iValue = convert(iValue, sFrom).to(sTo);

    return iValue;
};

let convertTime = (iValue, sFrom, sTo) => {
    if (sFrom === sTo) return iValue;
    if (sFrom === "s") {
        return iValue * 60;
    }
    return iValue / 60;
};

let convertSpeed = (iValue, sFrom, sTo) => {
    let [sFromUnit, sFromTime] = sFrom.split("/"),
        [sToUnit, sToTime] = sTo.split("/");

    iValue = convertUnit(iValue, sFromUnit, sToUnit);
    iValue = convertTime(iValue, sFromTime, sToTime);

    return iValue;
};

export default {
    getGrid,
    getValues,
    convertSpeed
}
