import AbstractView from "./AbstractView.js";
import { loadNavbar } from "../navbar.js";
import { loadPostPage } from "../post.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.pathName = "/views/post.html";
    }
    start(){
        loadNavbar();
        loadPostPage(this.params.postId);
    }
}