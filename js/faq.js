import "../css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "@ui5/webcomponents/dist/Panel";
(() => {
    // Copyright
    document.getElementById("copy_year").textContent = new Date().getFullYear();
})();