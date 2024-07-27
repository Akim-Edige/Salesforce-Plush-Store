import {LightningElement, api, wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { MessageContext, publish } from 'lightning/messageService';

import OrderAdd from '@salesforce/messageChannel/OrderAdd__c';
import createOrder from '@salesforce/apex/CreateController.createOrder';
import createOrderItem from '@salesforce/apex/CreateController.createOrderItem';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const DELAY = 350;

export default class PropertyTile extends NavigationMixin(LightningElement) {
    // @api product;

    @api productName
    @api productTileImage
    @api productDescription
    @api productFamily
    @api productType
    @api productPrice
    @api productId
    @api newOrder
    @api orderId
    @api totalCount

    neworderId = ''
    productCount = 1
    orderItemId = ''


    isDetailsClicked = false;

    @wire(MessageContext) messageContext;


    async handleAdd(){
        if(this.newOrder){

            console.log("Creating an order");
            this.neworderId = await createOrder();

            console.log("ID of order", this.neworderId);

            this.orderItemId = await createOrderItem({name:this.productName, orderId:this.neworderId, price:this.productPrice, productId:this.productId, quantity:1, family:this.productFamily, type:this.productType})
            console.log("Id of orderItem", this.orderItemId)



            // sending new order Id to header component
            window.clearTimeout(this.delayTimeout);
            this.delayTimeout = setTimeout(() => {
                const order = {
                    orderid: this.neworderId,
                    totalcount: this.totalCount,
                    neworder: this.newOrder
                };
                publish(this.messageContext, OrderAdd, order);
            }, DELAY);


            // sending new order id to parent component (TileList)
            this.dispatchEvent(new CustomEvent('ordercreated', {
                detail: this.neworderId
            }));

        }else{
            this.orderItemId = await createOrderItem({name:this.productName, orderId:this.orderId, price:this.productPrice, productId:this.productId, quantity:1, family:this.productFamily, type:this.productType})
            console.log("Id of orderItem", this.orderItemId)
            console.log("Id of old order", this.orderId)

            this.totalCount +=1;

            this.dispatchEvent(new CustomEvent('countadd', {
                detail: this.totalCount
            }));

            window.clearTimeout(this.delayTimeout);
            this.delayTimeout = setTimeout(() => {
                const order = {
                    orderid: this.orderId,
                    totalcount: this.totalCount,
                    neworder: this.newOrder
                };
                publish(this.messageContext, OrderAdd, order);
            }, DELAY);

        }


        const evt = new ShowToastEvent({
            title: 'Succesfully Added!',
            message: 'You have added ' + this.productName + ' to your cart',
            variant: 'success',
        });
        this.dispatchEvent(evt);

    }


    handleSuccess(event){
        console.log('Id of new order:', event.detail.id)
    }
    handleAddINSIDE(){

        this.isDetailsClicked=false;
        this.handleAdd();
    }

    handleProductSelected() {
        this.isDetailsClicked=true;
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