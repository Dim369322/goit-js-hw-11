export default class LoadMoreButton {
    constructor({selector , hidden = false}){
        this.refs = this.getRefs(selector);

        hidden && this.hide();
    }

    getRefs(selector){
        const refs = {};
        refs.button = document.querySelector(selector);

        return refs;
    }

    show(){
        this.refs.button.classList.add('load-more');
        this.refs.button.classList.remove('active');
    }

    hide(){
        this.refs.button.classList.remove('load-more');
        this.refs.button.classList.add('active');
    }

}