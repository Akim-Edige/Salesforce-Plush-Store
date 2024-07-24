import {LightningElement, wire, api} from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi';

export default class header extends LightningElement {

    @api recordId
    @wire(getRecord, {recordId:'001WU00000ITRVVYA5', fields:['Account.Name', 'Account.AccountNumber']})
    accinfo;

    newName='';
    newPrice = '';
    newDescription = '';
    newImage = '';
    newFamily = '';
    newType = '';

    IsCreateClicked = false;

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


    handleCart(){
        console.log("handling cart")
    }

    handleCloseButton(){
        this.IsCreateClicked = false;
    }

    handleCreateProduct(){
        this.IsCreateClicked = true;
    }


    handleInputName(event){
        this.newName=event.target.value;
    }

    handleFamilyMenu(event) {

    }

    handleTypeMenu(event) {

    }

    handleInputPrice(){

    }

    handleInputDescription(){

    }

    handleInputImage(){

    }

}