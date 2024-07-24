import { LightningElement, wire, api} from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';

import {subscribe, unsubscribe, MessageContext} from 'lightning/messageService';
import ProductsFiltered from '@salesforce/messageChannel/ProductsFiltered__c';

import getProductList from '@salesforce/apex/ProductController.getProductList';


export default class HelloForEach extends LightningElement {

    @api recordId

    // @wire(getProductList, {recordId: 'a02WU000001jIbXYAU', fields:['Product__c.Name', 'Product__c.Description__c', 'Product__c.Price__c', 'Product__c.Type__c', 'Product__c.Family__c', 'Product__c.Product_Image__c']})
    // products;


    keySearch = ``;
    subscription = null;
    checkedFamily = [];
    checkedType = [];
    filters = {
        keySearch:'',
        checkedFamily: [],
        checkedType: []
    };


    @wire(getProductList, {Key:'$keySearch', family:'$checkedFamily', type:'$checkedType'})
    products;



    @wire(MessageContext) messageContext
    // This function is called when component is loaded in Document Object Model (DOM)
    connectedCallback()
    {
        this.handleSubscribe();
    }

    disconnectedCallback()
    {
        this.handleUnsubscribe();
    }

    handleSubscribe(){
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext, ProductsFiltered,
                (parameter)=>
                {
                    // this.filters.set(keySearch, parameter.searchkey)
                    // this.filters.set(checkedFamily, parameter.checkedfamily)
                    // this.filters.set(searchkey,parameter.checkedtype)
                    this.checkedFamily=parameter.checkedfamily
                    this.checkedType=parameter.checkedtype
                    this.keySearch=parameter.searchkey
                }
            );
        }
    }


    handleUnsubscribe(){
        unsubscribe(this.subscription);
        this.subscription=null;
    }

}