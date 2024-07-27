import { LightningElement, wire, api } from 'lwc';

// // Lightning Message Service and a message channel
import { MessageContext, publish } from 'lightning/messageService';
import ProductsFiltered from '@salesforce/messageChannel/ProductsFiltered__c';

// The delay used when debouncing event handlers before firing the event
const DELAY = 350;


export default class ProductFilter extends LightningElement {

    animals = ['Bears', 'Cats', 'Penguins'];
    sizes = ['80 cm', '110 cm', '130 cm', '150 cm'];
    searchKey='';


    @wire(MessageContext) messageContext;

    valueFamily = ['Bears', 'Cats', 'Penguins'];
    valueType = ['80 cm', '110 cm', '130 cm', '150 cm'];

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


    handleSearchKeyChange(event){
        this.searchKey=event.target.value
        this.fireChangeEvent();
    }


    handleCheckboxChange(event){

        if(this.animals.includes(event.detail.value[0])){
            this.valueFamily=[];
            this.valueFamily=event.detail.value
        }else if(this.sizes.includes(event.detail.value[0])){
            this.valueType=[];
            this.valueType=event.detail.value
        }

        if(event.detail.value.length==0){
            this.valueFamily=[];
            this.valueType=[];
        }


        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            const filters = {
                searchkey: this.searchKey,
                checkedfamily: this.valueFamily,
                checkedtype: this.valueType
            };
            publish(this.messageContext, ProductsFiltered, filters);
        }, DELAY);
    }



    fireChangeEvent() {
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            const filters = {
                searchkey: this.searchKey,
                checkedfamily: this.valueFamily,
                checkedtype: this.valueType
            };
            publish(this.messageContext, ProductsFiltered, filters);
        }, DELAY);
    }

}