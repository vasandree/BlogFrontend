import AbstractView from "./AbstractView.js";
import { loadAuthors } from "../authors.js";
import { loadNavbar } from "../navbar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("Авторы");
        this.pathName = "/views/authors.html";
    }
    start(){
        loadNavbar();
        loadAuthors();
    }
}