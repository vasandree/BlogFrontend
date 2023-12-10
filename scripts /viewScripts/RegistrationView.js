import AbstractView from "./AbstractView.js";
import { loadRegister } from "../authorization.js";
import { loadNavbar } from "../navbar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.pathName = "/views/register.html";
    }
    start(){
        loadNavbar();
        loadRegister();
    }
}