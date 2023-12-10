import AbstractView from "./AbstractView.js";
import { loadMainPage } from "../posts.js";
import { loadNavbar } from "../navbar.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        this.setTitle("Главная");
        this.pathName = "/views/posts.html";
    }
    start(){
        loadNavbar();
        loadMainPage();
    }
}