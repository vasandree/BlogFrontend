import AbstractView from "./AbstractView.js";
import { loadGroupList } from "../groupsList.js";
import { loadNavbar } from "../navbar.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        this.setTitle("Группы");
        this.pathName = "/views/groupsList.html";
    }
    start(){
        loadNavbar();
        loadGroupList();
    }
}