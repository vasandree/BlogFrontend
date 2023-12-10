import AbstractView from "./AbstractView.js";
import { loadProfile } from "../profile.js";
import { loadNavbar } from "../navbar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.pathName = "/views/profile.html";
    }
    start(){
        loadNavbar();
        loadProfile();
    }
}