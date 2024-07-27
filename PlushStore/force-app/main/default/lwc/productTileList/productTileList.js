import { LightningElement, wire, api} from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';

import {subscribe, unsubscribe, MessageContext} from 'lightning/messageService';
import ProductsFiltered from '@salesforce/messageChannel/ProductsFiltered__c';
import Reset from '@salesforce/messageChannel/Reset__c';

import getProductList from '@salesforce/apex/ProductController.getProductList';



export default class HelloForEach extends LightningElement {

    @api recordId


    keySearch = ``;
    productsFilteredSubscription = null;
    ResetSubscription = null;
    checkedFamily = [];
    checkedType = [];


    @wire(getProductList, {Key:'$keySearch', family:'$checkedFamily', type:'$checkedType'})
    products;


    // Cart managing

    orderId = ''
    newOrder=true;
    totalCount=1;

    // Handling custom events from child component

    handleOrderCreated(event){
        this.orderId= event.detail
        console.log("Received orderId here in tile list: ", this.orderId)
        this.newOrder=false;

    }

    handleCountAdd(event){
        this.totalCount = event.detail
    }

    // Message Controlling

    @wire(MessageContext) messageContext
    // This function is called when component is loaded in Document Object Model (DOM)
    connectedCallback() {
        this.subscribeToMessageChannels();
    }

    subscribeToMessageChannels() {

        if (!this.ResetSubscription) {
            this.ResetSubscription = subscribe(this.messageContext, Reset,
                (parameter)=>
                {
                    this.orderId=parameter.orderid
                    this.newOrder=parameter.neworder
                    this.totalCount=parameter.totalcount

                    console.log("HERE RESTART", this.orderId)
                }
            );
        }

        if (!this.productsFilteredSubscription) {
            this.productsFilteredSubscription = subscribe(this.messageContext, ProductsFiltered,
                (parameter)=>
                {
                    this.checkedFamily=parameter.checkedfamily
                    this.checkedType=parameter.checkedtype
                    this.keySearch=parameter.searchkey
                }
            );
        }

    }


    disconnectedCallback() {
        unsubscribe(this.productsFilteredSubscription);
        this.productsFilteredSubscription = null;
        unsubscribe(this.ResetSubscription);
        this.ResetSubscription = null;
    }
}