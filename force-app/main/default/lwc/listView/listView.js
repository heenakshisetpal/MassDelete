import { LightningElement, wire ,api,track} from 'lwc';
import getProjectList from '@salesforce/apex/ListView.getProjectList';
import delSelectedCons from '@salesforce/apex/ListView.deleteprojects';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';

const columns = [
    { label: 'Project Name', fieldName:'Project_name__c',type:'Text'},
    { label: 'Project Type', fieldName:'Project_type__c', type: 'Picklist' },
    { label: 'Status', fieldName:'status__c', type: 'Picklist' },
    { label: 'Priority', fieldName:'Priority__c', type: 'Picklist' },
    { label: 'Owner', fieldName: 'owner__c', type: 'Picklist' },
    { label: 'DESCRIPTION', fieldName: 'description__c', type:'Rich Text Area' },
    { label: 'End date', fieldName: 'End_date__c', type: 'Date' }
];

export default class ListView extends LightningElement {
    @track error;
    @track List;
    @track isTrue = false;
    @track recordsCount = 0;
    @track buttonLabel = 'Mass Delete';

    // non-reactive variables
    selectedRecords = [];
    refreshTable;
    error;
    columns = columns;

     @wire(getProjectList)
     Wiredprojects({error,
        data}){
         if (data) {
            this.List = data;
        } else if (error) {
            this.error = error;
        }
    
}
getSelectedRecords(event) {
    
    const selectedRows = event.detail.selectedRows;
    
    this.recordsCount = event.detail.selectedRows.length;

   
    let conIds = new Set();

  
    for (let i = 0; i < selectedRows.length; i++) {
        conIds.add(selectedRows[i].Id);
    }

  
    this.selectedRecords = Array.from(conIds);

    window.console.log('selectedRecords ====> ' +this.selectedRecords);
}
deleteprojects() {
    if (this.selectedRecords) {
        // setting values to reactive variables
        this.buttonLabel = 'Processing....';
        this.isTrue = true;

        // calling apex class to delete selected records.
        delSelectedCons({lstConIds: this.selectedRecords})
        .then(result => {
            window.console.log('result ====> ' + result);

            this.buttonLabel = 'Delete Selected Contacts';
            this.isTrue = false;

            // showing success message
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!', 
                    message: this.recordsCount + ' Projects are deleted.', 
                    variant: 'success'
                }),
            );
            
            // Clearing selected row indexs 
            this.template.querySelector('lightning-datatable').selectedRows = [];

            this.recordsCount = 0;

            // refreshing table data using refresh apex
            return refreshApex(this.refreshTable);

        })
        .catch(error => {
            window.console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while getting Contacts', 
                    message: error.message, 
                    variant: 'error'
                }),
            );
        });
    }
    
}

}