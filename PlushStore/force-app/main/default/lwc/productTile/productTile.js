import {LightningElement, api, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { MessageContext, publish } from 'lightning/messageService';

import ProductAdd from '@salesforce/messageChannel/ProductAdd__c';

const DELAY = 350;

export default class PropertyTile extends NavigationMixin(LightningElement) {
    // @api product;
    @api productName
    @api productTileImage
    @api productDescription
    @api productFamily
    @api productType
    @api productPrice

    product = {name:this.productName, price:this.productPrice, type:this.productType, family:this.productFamily}

    isDetailsClicked = false;

    @wire(MessageContext) messageContext;


    handleProductSelected() {
        this.isDetailsClicked=true;
    }
    handleAdd(){

        this.delayTimeout = setTimeout(() => {
            const order = {
                product: this.product,
            };
            publish(this.messageContext, ProductAdd, order);
        }, DELAY);
    }


    handleAddINSIDE(){
        console.log("Adding")
        this.isDetailsClicked=false;


        this.delayTimeout = setTimeout(() => {
            const order = {
                product: this.product,
            };
            publish(this.messageContext, ProductAdd, order);
        }, DELAY);

    }

    handleCloseButton(){
        this.isDetailsClicked=false;
    }

    get backgroundImageStyle() {

        var parser = new DOMParser();
        var doc = parser.parseFromString(this.productTileImage, 'text/html');
        var imgElement = doc.querySelector('img'); // Selects the <img> element
        var src = imgElement.src; // Gets the 'src' attribute


        return `background-image:url(${src})`;
    }
}