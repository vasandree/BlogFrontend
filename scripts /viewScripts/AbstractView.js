export default class {
    constructor(params) {
        this.params = params;
        this.pathName = "";
    }

    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return fetch(this.pathName).then((response) => response.text());
    }

    start() {
        
    }
}