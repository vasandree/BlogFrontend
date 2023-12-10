import AbstractView from "./AbstractView.js";
import { loadCommunityPage } from "../community.js";
import { loadNavbar } from "../navbar.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        this.setTitle("Cообщество");
        this.pathName = "/views/community.html";
    }
    start(){
        loadNavbar();
        loadCommunityPage(this.params.communityId);
    }
}