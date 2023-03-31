import "../css/style.css";
import "../resources/grid.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents/dist/Slider.js";
import "@ui5/webcomponents/dist/SegmentedButton.js";
import "@ui5/webcomponents/dist/SegmentedButtonItem.js";
import "@ui5/webcomponents/dist/StepInput.js";
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator";
import "@ui5/webcomponents/dist/ComboBox";
import "@ui5/webcomponents/dist/Icon";
import "@ui5/webcomponents/dist/Dialog";
import "@ui5/webcomponents-icons/dist/download.js";
import "@ui5/webcomponents-icons/dist/sys-cancel-2.js";
import "@ui5/webcomponents-icons/dist/alert.js";

import { setLanguage } from "@ui5/webcomponents-base/dist/config/Language.js";
setLanguage("en");

import calc from "./calc.js";
import draw from "./draw.js";
import toLightBurn from "./export_lightburn.js";
import toXCS from "./export_xcs.js";
import util from "./util.js";

// Handle in app warning message
import InApp from 'detect-inapp';
const inapp = new InApp(navigator.userAgent || navigator.vendor || window.opera);

(() => {
    let sLastUnit = "mm/s",
        sFromUnit = "",
        sToUnit = "";

    const $GridCont = document.getElementById("grid_container");
    const $Grid = document.getElementById("grid");

    let updateControls = oGrid => {
        let Power = document.getElementById("power_controls"),
            Speed = document.getElementById("speed_controls");

        Power.classList.toggle("hide", oGrid.values.gridX === 1);
        Speed.classList.toggle("hide", oGrid.values.gridY === 1);
    }

    // Attach change event listeners
    let aElements = document.querySelectorAll(".change"),
        updateGrid = oEvent => {
            let oGrid = calc.getGrid();

            updateControls(oGrid);

            draw.go(oGrid);

            if (import.meta.env.DEV || window.location.href.includes("debug=true")) {
                console.log(oGrid);
            }
        },
        updateSpeedControls = bImperial => {
            let sVP = bImperial ? 2 : 0,
                sStep = bImperial ? 1 : 10,
                oMin = document.getElementById("speed_min"),
                oMax = document.getElementById("speed_max");

            oMin.setAttribute("value-precision", sVP);
            oMin.setAttribute("step", sStep);

            oMax.setAttribute("value-precision", sVP);
            oMax.setAttribute("step", sStep);
        },
        updateSegmentedButton = oEvent => {
            let sUnit = oEvent.detail.selectedItem.textContent;

            if (oEvent.target.getAttribute("id") !== "speed_unit") {
                return updateGrid(oEvent);
            }

            updateSpeedControls(sUnit.startsWith("in"));

            sFromUnit = sLastUnit;
            sToUnit = sUnit;

            document.getElementById("convert_button").style.display = "inline-flex";
            updateGrid(oEvent);

            sLastUnit = sUnit;
        };

    document.getElementById("convert_button").addEventListener("click", oEvent => {
        let oValues = calc.getValues(),
            iSpeedMin = calc.convertSpeed(oValues.speedMin, sFromUnit, sToUnit),
            iSpeedMax = calc.convertSpeed(oValues.speedMax, sFromUnit, sToUnit);

        document.getElementById("speed_min").value = iSpeedMin;
        document.getElementById("speed_max").value = iSpeedMax;

        updateGrid();

        document.getElementById("convert_button").style.display = "none";
    });

    document.getElementById("zip").addEventListener("change", oEvent => {
        let bChecked = oEvent.currentTarget.checked;
        if (bChecked) {
            document.getElementById("download_lightburn").style.display = "none";
            document.getElementById("download_xcs_dialog_button").style.display = "none";
            document.getElementById("download_zip").style.display = "inline-block";
        } else {
            document.getElementById("download_lightburn").style.display = "inline-block";
            document.getElementById("download_xcs_dialog_button").style.display = "inline-block";
            document.getElementById("download_zip").style.display = "none";
        }
        document.getElementById("dialog_download_zip").classList.toggle("display_none", !bChecked);
        document.getElementById("download_xcs").classList.toggle("display_none", bChecked);
    });

    document.getElementById("download_lightburn").addEventListener("click", oEvent => {
        let oGrid = calc.getGrid(),
            sEvent = util.getEventName(oGrid, "l"),
            sFile = toLightBurn.download(oGrid);

        gtag('event', sEvent, {
            'file': sFile
        });
    });

    let dialog = document.getElementById("download_xcs_dialog");
    document.getElementById("download_xcs").addEventListener("click", oEvent => {
        let oGrid = calc.getGrid(),
            sEvent = util.getEventName(oGrid, "x"),
            sFile = toXCS.download(calc.getGrid());

        if (dialog.isOpen()) {
            dialog.close();
        }

        // Log some info for analysis
        gtag('event', sEvent, {
            'file': sFile
        });
    });

    document.getElementById("dialog_download_zip").addEventListener("click", e => {
        let oGrid = calc.getGrid(),
            sEvent = util.getEventName(oGrid, "x"),
            oXCS = toXCS.getFile(oGrid),
            oLBRN = toLightBurn.getFile(oGrid),
            sFile = util.getFileName(oGrid, "zip");

        if (dialog.isOpen()) {
            dialog.close();
        }

        util.downloadAsZip([oXCS, oLBRN], sFile);

        // Log some info for analysis
        gtag('event', sEvent, {
            'zip': `true`,
            'file': sFile
        });
    });

    document.getElementById("download_xcs_dialog_button").addEventListener("click", () => {
        dialog.show();
    });

    document.getElementById("download_zip").addEventListener("click", () => {
        dialog.show();
    });

    document.getElementById("download_xcs_cancel").addEventListener("click", () => {
        dialog.close();
    });

    // Tab container
    document.getElementById("tabs").addEventListener("tab-select", (oEvent) => {
        $Grid.classList.toggle("highlight_labels", oEvent.detail.tab.getAttribute("id") === "labels_tab");
    });

    aElements.forEach(oElement => {
        if (oElement.tagName !== "UI5-SEGMENTED-BUTTON") {
            oElement.addEventListener("change", updateGrid);
        } else {
            oElement.addEventListener("selection-change", updateSegmentedButton);
        }
    });

    // Handle Grid/scale responsiveness
    let fnGridResize = () => {
        let iContainer = $GridCont.clientWidth,
            iScale = ((iContainer / 620) * 100) - 5;

        if (iContainer < 630) {
            $Grid.style.setProperty("transform", `scale(${iScale}%)`);
            $Grid.style.removeProperty("width");
        } else {
            $Grid.style.removeProperty("transform");
            $Grid.style.setProperty("width", "100%");
        }
    }

    const resizeObserver = new ResizeObserver(fnGridResize);

    resizeObserver.observe($GridCont);

    // Initial grid
    window.addEventListener("load", () => {
        setTimeout(updateGrid, 500);
        fnGridResize();
    });

    let $Power = document.getElementById("power_controls");
    $Power.addEventListener("mouseenter", () => {
        $Grid.classList.add("focus_power");
    });
    $Power.addEventListener("mouseleave", () => {
        $Grid.classList.remove("focus_power");
    });

    let $Speed = document.getElementById("speed_controls");
    $Speed.addEventListener("mouseenter", () => {
        $Grid.classList.add("focus_speed");
    });
    $Speed.addEventListener("mouseleave", () => {
        $Grid.classList.remove("focus_speed");
    });

    let $Passes = document.getElementById("passes"),
        bPassesFocused = false;

    $Passes.addEventListener("mouseenter", () => {
        $Grid.classList.add("focus_passes");
    });
    $Passes.addEventListener("focusin", () => {
        $Grid.classList.add("focus_passes");
        bPassesFocused = true;
    });
    $Passes.addEventListener("mouseleave", () => {
        if (!bPassesFocused) {
            $Grid.classList.remove("focus_passes");
        }
    });
    $Passes.addEventListener("focusout", () => {
        $Grid.classList.remove("focus_passes");
        bPassesFocused = false;
    });

    if (inapp.isInApp) {
        document.getElementById("in_app_warning").style.display = "block";
        document.getElementById("download_group").classList.add("warn");
    }

    // Copyright
    document.getElementById("copy_year").textContent = new Date().getFullYear();
})();