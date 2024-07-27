import {LightningElement, wire, api, track} from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';

import createProduct from '@salesforce/apex/CreateController.createProduct';
import {subscribe, unsubscribe, MessageContext} from 'lightning/messageService';
import OrderAdd from '@salesforce/messageChannel/OrderAdd__c';
import Reset from '@salesforce/messageChannel/Reset__c';

import getOrderItemList from '@salesforce/apex/ProductController.getOrderItemList'
import getOrderInfo from '@salesforce/apex/ProductController.getOrderInfo'
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getIsManager from '@salesforce/apex/UserInfoController.getIsManager';


const DELAY = 350;

export default class header extends LightningElement {


 //   DISPLAYING ACCOUNT NAME AND NUMBER
    @api recordId
    @wire(getRecord, {recordId:'001WU00000ITRVVYA5', fields:['Account.Name', 'Account.AccountNumber']})
    accinfo;


    get getName(){
        if (this.accinfo.data) {
            return getFieldValue(this.accinfo.data, 'Account.Name')
        }else if(this.accinfo.error){
            return this.accinfo.error
        }
    }

    get getNumber(){
        if (this.accinfo.data) {
            return getFieldValue(this.accinfo.data, 'Account.AccountNumber')
        }else if(this.accinfo.error){
            return this.accinfo.error
        }
    }

    @track isManager = false;

    @wire(getIsManager)
    wiredIsManager({ error, data }) {
        if (data) {
            this.isManager = data;
        } else if (error) {
            console.error('Error retrieving IsManager:', error);
        }
    }

    // PART FOR CREATING NEW PRODUCT

    newName='';
    newPrice = '';
    newDescription = '';
    newImage = '';
    newFamily = '';
    newType = '';

    IsCreateClicked = false;


    get optionsFamily() {
        return [
            { label: 'Bears', value: 'Bears' },
            { label: 'Cats', value: 'Cats' },
            { label: 'Penguins', value: 'Penguins'},
        ];
    }

    get optionsType() {
        return [
            { label: '80 cm', value: '80 cm' },
            { label: '110 cm', value: '110 cm' },
            { label: '130 cm', value: '130 cm'},
            { label: '150 cm', value: '150 cm'},
        ];
    }



    handleCloseButton(){
        this.IsCreateClicked = false;
    }

    handleCreateProduct(){
        this.IsCreateClicked = true;
    }

    handleInputName(event){
        this.newName=event.target.value
    }

    handleFamilyMenu(event) {
        this.newFamily=event.target.value;
    }

    handleTypeMenu(event) {
        this.newType=event.target.value;
    }

    handleInputPrice(event){
        this.newPrice=event.target.value;
    }

    handleInputDescription(event){
        this.newDescription=event.target.value;
    }

    handleInputImage(event){
        this.newImage = event.target.value
    }


    async handleCreate(){
        let res = await createProduct({name:this.newName, price: this.newPrice, description:this.newDescription, family:this.newFamily, type:this.newType, image:this.newImage});


        this.IsCreateClicked=false;
        this.newName='';
        this.newPrice = '';
        this.newDescription = '';
        this.newImage = '';
        this.newFamily = '';
        this.newType = '';
    }


    // PART FOR MANAGING the cart



    handleCartCloseButton(){
        this.isCartClicked = false;
    }



    totalProductCount = 1
    newOrder = true
    orderId = ''
    subscription = null;
    isCartClicked = false;


    @wire(getOrderItemList, { orderId : '$orderId', totalcount:'$totalProductCount'})
    orderitems;



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
            this.subscription = subscribe(this.messageContext, OrderAdd,
                (parameter)=>
                {
                    this.orderId=parameter.orderid
                    this.newOrder=parameter.neworder
                    this.totalProductCount = parameter.totalcount
                }
            );

        }
    }

    handleUnsubscribe(){
        unsubscribe(this.subscription);
        this.subscription=null;
    }

    // getting TotalCount and TotalPrice
    @wire(getOrderInfo, { orderId : '$orderId', totalcount:'$totalProductCount'})
    orderinfo;


    get getTotalPrice(){
        if (this.accinfo.data) {
            return getFieldValue(this.orderinfo.data, 'Order__c.TotalPrice__c')
        }else if(this.accinfo.error){
            return this.accinfo.error
        }
    }

    get getTotalCount(){
        if (this.accinfo.data) {
            return getFieldValue(this.orderinfo.data, 'Order__c.TotalProductCount__c')
        }else if(this.accinfo.error){
            return this.accinfo.error
        }
    }
    handleCart(){
        this.isCartClicked = true;
    }


    handleClear(){
        this.resetting();
    }


    handleBuy(event){

        this.resetting();

        const evt = new ShowToastEvent({
            title: 'Success!',
            message: 'Thank you for the Purchase!',
            variant: 'success',
        });
        this.dispatchEvent(evt);

    }

    resetting(){
        this.orderId='';
        this.isCartClicked=false;
        this.newOrder=true;
        this.totalProductCount=1;


        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            const order = {
                orderid: this.orderId,
                totalcount: this.totalCount,
                neworder: this.newOrder
            };
            publish(this.messageContext, Reset, order);
        }, DELAY);
    }

}

