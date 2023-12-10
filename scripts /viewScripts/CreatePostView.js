import AbstractView from "./AbstractView.js";
import { loadCreatePost } from "../createPost.js";
import { loadNavbar } from "../navbar.js";

export default class extends AbstractView{
    constructor(params){
        super(params);
        this.pathName = "/views/createPost.html";
    }
    start(){
        loadNavbar();
        loadCreatePost();
    }
}