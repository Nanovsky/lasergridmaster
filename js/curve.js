import {Bezier} from "bezier-js";

const iEndAngle = 6.283185307179586,
      iDpr = window.devicePixelRatio;

let iPadding = 40,
    iMarker = 6,
    iMarkerInteraction = iMarker * 6,
    iEndPoint = 7,
    oCanvas,
    oContext,
    iWidth,
    iHeight,
    iDrawWidth = 0,
    iDrawHeight = 0,
    oCanvasP = null,
    oCP1 = {x: 0.325, y: 0.325},
    oCP2 = {x: 0.675, y: 0.675},
    oPosition = {x: 0, y: 0},
    oTarget = null,
    fnChange,
    sStrokeColor,
    sMarkerStrokeColor,
    sMarkerFill,
    sMarkerStroke = 3,
    sEndPointStroke = 5,
    aBaseX,
    aBaseY,
    iGridX,
    iGridY;

let initSize = () => {
    iDrawWidth = iWidth - iPadding * 2;
    iDrawHeight = iHeight - iPadding * 2;

    oCanvas.width = iWidth * iDpr;
    oCanvas.height = iHeight * iDpr;

    oContext.scale(iDpr, iDpr);

    oCanvasP = oCanvas.getBoundingClientRect();

    draw();
}

let updatePosition = evt => {
    if (evt.touches) {
        evt = evt.touches[0];
    }
    oPosition.x = evt.clientX - oCanvasP.left;
    oPosition.y = evt.clientY - oCanvasP.top;
}

let onStart = evt => {
    let iPoint2,
        iPoint1,
        iToPoint2Y,
        iToPoint2X,
        iToPoint1Y,
        iToPoint1X;

    updatePosition(evt);

    iToPoint1X = oPosition.x - (iPadding + oCP1.x * iDrawWidth);
    iToPoint1Y = oPosition.y - (iPadding + (1 - oCP1.y) * iDrawHeight);

    iToPoint2X = oPosition.x - (iPadding + oCP2.x * iDrawWidth);
    iToPoint2Y = oPosition.y - (iPadding + (1 - oCP2.y) * iDrawHeight);

    iPoint1 = Math.sqrt((iToPoint1X * iToPoint1X) + (iToPoint1Y * iToPoint1Y));
    iPoint2 = Math.sqrt((iToPoint2X * iToPoint2X) + (iToPoint2Y * iToPoint2Y));

    if (iPoint1 < iMarkerInteraction) {
        oTarget = oCP1;
    } else if (iPoint2 < iMarkerInteraction) {
        oTarget = oCP2;
    }

    if (oTarget) {
        evt.preventDefault();
    }
}

let onMove = evt => {
    if (!oTarget) return;

    evt.preventDefault();
    updatePosition(evt);

    let iX = limit(oPosition.x, iPadding, iPadding + iDrawWidth),
        iY = limit(oPosition.y, 0,iPadding + (iPadding * 0.5) + iDrawHeight);

    oTarget.x = (iX - iPadding) / iDrawWidth;
    oTarget.y = 1 - ((iY - iPadding) / iDrawHeight);

    if (fnChange) {
        fnChange();
    }

    draw();
}

let onEnd = () => {
    oTarget = null;
}

function limit(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function getCurve() {
    return {p1x: oCP1.x, p1y: oCP1.y, p2x: oCP2.x, p2y: oCP2.y, iDrawWidth: iDrawWidth, iDrawHeight: iDrawHeight};
}

function clear() {
    oContext.clearRect(0, 0, iWidth, iHeight);
}

function draw() {
    clear();
    drawCurve();
    drawMarkerLines();
    drawMarkers();
    drawEndpoints();
}

function drawCurve() {
    oContext.save();
    oContext.translate(iPadding + 0.5, iPadding + 0.5);

    oContext.strokeStyle = sStrokeColor;
    oContext.lineWidth = 5;

    oContext.beginPath();
    oContext.moveTo(0, iDrawHeight);

    let cp1x = oCP1.x * iDrawWidth,
        cp1y = (1 - oCP1.y) * iDrawHeight,
        cp2x = oCP2.x * iDrawWidth,
        cp2y = (1 - oCP2.y) * iDrawHeight;

    oContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, iDrawWidth, 0);
    oContext.stroke();
    oContext.closePath();

    oContext.restore();
}

function drawMarkerLines() {
    oContext.save();
    oContext.translate(iPadding + 0.5, iPadding + 0.5);

    oContext.strokeStyle = sStrokeColor;

    oContext.beginPath();
    oContext.moveTo(0, iDrawHeight);
    oContext.lineTo(oCP1.x * iDrawWidth, (1 - oCP1.y) * iDrawHeight);
    oContext.stroke();

    oContext.moveTo(iDrawWidth, 0);
    oContext.lineTo(oCP2.x * iDrawWidth, (1 - oCP2.y) * iDrawHeight);
    oContext.stroke();
    oContext.closePath();

    oContext.restore();
}

function drawMarkers() {

    oContext.save();
    oContext.translate(iPadding, iPadding);

    oContext.fillStyle = sMarkerFill;
    oContext.strokeStyle = sMarkerStrokeColor;
    oContext.lineWidth = sMarkerStroke;

    oContext.beginPath();
    oContext.arc(oCP1.x * iDrawWidth, (1 - oCP1.y) * iDrawHeight, iMarker, 0, iEndAngle);
    oContext.closePath();
    oContext.fill();
    oContext.stroke();

    oContext.beginPath();
    oContext.arc(oCP2.x * iDrawWidth, (1 - oCP2.y) * iDrawHeight, iMarker, 0, iEndAngle);
    oContext.closePath();
    oContext.fill();
    oContext.stroke();

    oContext.restore();
}

function drawEndpoints() {

    oContext.save();
    oContext.translate(iPadding, iPadding);

    oContext.fillStyle = sMarkerFill;
    oContext.strokeStyle = sMarkerStrokeColor;
    oContext.lineWidth = sEndPointStroke;

    oContext.beginPath();
    oContext.arc(0, iDrawHeight, iEndPoint, 0, iEndAngle);
    oContext.closePath();
    oContext.fill();
    oContext.stroke();

    oContext.beginPath();
    oContext.arc(iDrawWidth, 0, iEndPoint, 0, iEndAngle);
    oContext.closePath();
    oContext.fill();
    oContext.stroke();

    oContext.restore();
}

function attachListeners() {
    oCanvas.addEventListener('touchstart', onStart);
    oCanvas.addEventListener('touchmove', onMove);
    oCanvas.addEventListener('touchend', onEnd);

    oCanvas.addEventListener('mousedown', onStart);
    oCanvas.addEventListener('mousemove', onMove);
    oCanvas.addEventListener('mouseup', onEnd);
    oCanvas.addEventListener('mouseleave', onEnd);
}

let create = (
    {
        target = false,
        width = 600,
        height = 600,
        marker = 7,
        markerEnd = 8,
        point1 = {x: 0.325, y: 0.325},
        point2 = {x: 0.675, y: 0.675},
        change = false,
        strokeColor = "#999",
        markerStrokeColor = "rgb(200, 121, 44)",
        markerFillColor = "#FFF"
    } = {}
) => {
    if (!target) return;

    oCanvas = target;
    oContext = oCanvas.getContext('2d');
    iWidth = width;
    iHeight = height;
    iMarker = marker;
    iEndPoint = markerEnd;
    oCP1 = point1;
    oCP2 = point2;
    sStrokeColor = strokeColor;
    sMarkerStrokeColor = markerStrokeColor;
    sMarkerFill = markerFillColor;

    if (change) {
        fnChange = change;
    }

    attachListeners();
    initSize();
    configure(iGridX, iGridY, true);
};

let fnGetXMultiplier = (oPoint, i) => {
    let iDiff = 1;
    if (aBaseX && iGridX > 2) {
        let iXBase = aBaseX[i].x;
        let iX = oPoint.x;

        if (iXBase < iX) {
            let iWidth = iDrawWidth - iXBase,
                iMove = iX - iXBase;

            iDiff = 1 + (iMove / iWidth);
        } else if (iXBase > iX) {
            iDiff = iX / iXBase;
        }
    }

    return iDiff;
};

let fnGetYMultiplier = (oPoint, i) => {
    let iDiff = 1;
    if (aBaseY && iGridY > 2) {
        let iYBase = aBaseY[i].y;
        let iY = oPoint.y;

        if (iYBase < iY) {
            let iHeight = iDrawHeight - iYBase,
                iMove = iY - iYBase;

            iDiff = 1 + (iMove / iHeight);
        } else if (iYBase > iY) {
            iDiff = iY / iYBase;
        }
    }

    return iDiff;
};

let getMultipliers = () => {
    const oCurve = new Bezier(
            0,
            iDrawHeight,
            oCP1.x * iDrawWidth,
            (1 - oCP1.y) * iDrawHeight,
            oCP2.x * iDrawWidth,
            (1 - oCP2.y) * iDrawHeight,
            iDrawWidth,
            0
        );

    let iLutX = iGridX - 1,
        iLutY = iGridY - 1;

    if (iGridX < 3) {
        iLutX = 1;
    }

    if (iLutY < 3) {
        iLutY = 1;
    }

    let aLUTX = oCurve.getLUT(iLutX),
        aLUTY = oCurve.getLUT(iLutY);

    if (!aBaseX) {
        aBaseX = aLUTX;
    }

    if (!aBaseY) {
        aBaseY = aLUTY;
    }

    console.clear();
    console.log(aLUTX.map((o, i) => fnGetXMultiplier(o, i)));

    return {
        x: aLUTX.map((o, i) => fnGetXMultiplier(o, i)),
        y: aLUTY.map((o, i) => fnGetYMultiplier(o, i))
    };
};

let configure = (iX, iY, bForce) => {
    if (!bForce && iGridX === iX && iGridY === iY) {
        return; // No need to recalculate
    }

    iGridX = iX;
    iGridY = iY;

    aBaseX = false;
    aBaseY = false;

    let oRealCP1 = oCP1,
        oRealCP2 = oCP2;

    oCP1 = {x: 0.325, y: 0.325};
    oCP2 = {x: 0.675, y: 0.675};

    getMultipliers(iX, iY);

    oCP1 = oRealCP1;
    oCP2 = oRealCP2;
}

export default {
    create,
    getCurve,
    getMultipliers,
    configure
}