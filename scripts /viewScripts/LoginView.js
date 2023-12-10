import AbstractView from "./AbstractView.js";
import { loadLogin } from "../authorization.js";
import { loadNavbar } from "../navbar.js";

export default class extends AbstractView{
    constructor(params){
        super(params)
        this.pathName = "/views/login.html";
    }
    start(){
        loadNavbar();
        loadLogin();
    }
}