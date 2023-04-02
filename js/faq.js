import '../css/style.scss'
import * as bootstrap from 'bootstrap'
import "@ui5/webcomponents/dist/Panel";
(() => {
    // Copyright
    document.getElementById("copy_year").textContent = new Date().getFullYear();
})();