import { Component } from '@angular/core';
import { GoodsReceipt, PO_ITEM, ER_RESPONSE, PO_DETAILS, IR_PO_DATA, PoItem, PO_SERVICE_REQUEST} from '../injectables';
import {PostsService} from '../services/posts.service';
import {Http} from '@angular/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'po',
  templateUrl: './po.component.html',
  providers: [PostsService]
})
export class POComponent  { 

poID : string;
currentPO : PO_DETAILS;
backupPO : PO_DETAILS;
USER : string;
STATUS : string;
change : string;
makeChanges : boolean;
currentlySending : boolean;
poItemSearch : boolean;
displayAll : boolean;
displayNewest : boolean;
REVERSE_PO_ITEMS : PO_ITEM[];
searchProjectID : string;
IR_PO_DATA : IR_PO_DATA;
finalResponseCode : string;
finalResponseMessage : string;
//sample PO Number: 9001256730


    constructor(private PostsService: PostsService)
    {
        this.currentPO = { ER_RESPONSE: { PO_NUMBER: "", RESPONSE_CODE: "", RESPONSE_MESSAGE: "", BEELINE_ID: "", SOW_ID: "", VENDOR_NUMBER: "", SUBORDINATE_VENDOR: "", ASSIGNMENT_START_DATE: "", ASSIGNMENT_END_DATE: "", PO_ITEMS: [] } };
        this.IR_PO_DATA = {BEELINE_ID : "", SOW_ID : "", PO_NUMBER : "", VENDOR_NUMBER : "", SUBORDINATE_VENDOR : "", FY : "", LABOR_TYPE : "", ASSIGNMENT_START_DATE : "", ASSIGNMENT_END_DATE : "", PO_ITEMS : []}
        this.USER = "USER123";
        this.STATUS = "READ/WRITE";
        this.change = "Enable"; //Button Text
        this.makeChanges = false;
        this.currentlySending = false;
        this.displayAll = false;
        this.displayNewest = false;
        this.poItemSearch = false;
    }


    LaborTypeCheck(po : PO_DETAILS)
    {
        if(po.ER_RESPONSE.SOW_ID)
        {
            this.IR_PO_DATA.LABOR_TYPE = "SOW";
            console.log("LOG ::: PO object stored of type: 'SOW'");
        }
        else
        {
            this.IR_PO_DATA.LABOR_TYPE = "StaffAug";
            console.log("LOG ::: PO object stored of type: 'Time & Materials'");
        }
    }


    EqualityCheck(a : Object, b : Object)
    {
        if (JSON.stringify(a) == JSON.stringify(b))
        {
            return true;
        }
        else
        {
            return false;
        }
    }


    AvailableQuantityBool(quantityString : String)
    {
        if (parseInt(quantityString.valueOf()) > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }


    POCall(poID : string)
    {
        this.currentlySending = true;
        this.poID = poID;
        let callSent = false;
        console.log("LOG ::: Attempting to send POCall ... Attempt 1");
        this.PostsService.sendCall("GET", environment.urlViewQA + poID, "Parameters N/A").subscribe(res=>{
            console.log("LOG ::: response received from POCall...");
            let po = <PO_DETAILS>res.json();
            this.SetPO(po);
            callSent = true;
        });
        setTimeout(()=>
        { 
            if (callSent == false)
            {
                console.log("WARNING ::: Attempt 1 to send POCall failed");
                console.log("LOG ::: Attempting to send POCall ... Attempt 2");
                this.PostsService.sendCall("GET", environment.urlViewQA + poID, "Parameters N/A").subscribe(res=>{
                    console.log("LOG ::: response received from POCall...");
                    let po = <PO_DETAILS>res.json();
                    this.SetPO(po);
                    callSent = true;
                });
                setTimeout(()=>
                { 
                    if (callSent == false)
                    {
                        console.log("WARNING ::: Attempt 2 to send POCall failed");
                        console.log("LOG ::: Attempting to send POCall ... Attempt 3");
                        this.PostsService.sendCall("GET", environment.urlViewQA + poID, "Parameters N/A").subscribe(res=>{
                            console.log("LOG ::: response received from POCall...");
                            let po = <PO_DETAILS>res.json();
                            this.SetPO(po);
                            callSent = true;
                        });
                        setTimeout(()=>
                        { 
                            if (callSent == false)
                            {
                                console.log("ERROR ::: All Attempts to send POCall failed");
                                this.currentlySending = false;
                            }
                        }, 6000);
                    } 
                }, 4000);
            } 
        }, 2000);
        if (callSent != false)
        {
            console.log("LOG ::: Attempt to send POCall was successful");
        }
        console.log("LOG ::: Completed initial POCall");
    }


    SetPO(po : PO_DETAILS)
    {
        this.currentPO = po;
        this.currentPO.ER_RESPONSE.PO_ITEMS.forEach(poItem => {
            poItem.QTY = poItem.QTY.trim();
            poItem.AVAIL_BUDGET = poItem.AVAIL_BUDGET.trim();
            poItem.AVAIL_QUANTITY = poItem.AVAIL_QUANTITY.trim();
            poItem.UNIT_PRICE = poItem.UNIT_PRICE.trim();
            poItem.GOODS_RECEIPTS.forEach(gReceipt =>{
                gReceipt.QTY_RECEIVED = gReceipt.QTY_RECEIVED.trim();
                gReceipt.AMT_RECEIVED = gReceipt.AMT_RECEIVED.trim();
            });
        
        });
        this.backupPO = JSON.parse(JSON.stringify(this.currentPO));
        this.REVERSE_PO_ITEMS = this.backupPO.ER_RESPONSE.PO_ITEMS.slice().reverse();
        console.log("LOG ::: response object being stored : ");
        console.log(po);
        console.log("LOG ::: currentPO : ");
        console.log(this.currentPO);
        this.currentlySending = false;
        this.LaborTypeCheck(po);
    }


    EnableChanges()
    {
        if(true)
        {
            if (this.makeChanges == false)
            {
                this.makeChanges = true;
                this.change = "Disable"; //Button Text
                console.log("LOG ::: Changes Enabled...");
            }
            else
            {
                this.makeChanges = false;
                this.change = "Enable" //Button Text
                console.log("LOG ::: Changes Disabled...");
            }
        }
    }


    NewPOItem()
    {
        let temp : PO_ITEM;
        if(this.currentPO.ER_RESPONSE.PO_ITEMS[0].JOB)//If PO = Time and Materials
        {
            temp = {PO_ITEM : "",
            RESOURCE : this.currentPO.ER_RESPONSE.PO_ITEMS[0].RESOURCE,
            MILESTONE_TYPE : "",
            JOB : this.currentPO.ER_RESPONSE.PO_ITEMS[0].JOB,
            MILESTONE_ID : "",
            UOM : this.currentPO.ER_RESPONSE.PO_ITEMS[0].UOM,
            QTY : "",
            COST_CENTER : "",
            REQ_COST_CENTER : "",
            PROJECT_ID : "",
            CAP_EXP : "",
            AVAIL_BUDGET : "",
            AVAIL_QUANTITY : "",
            UNIT_PRICE : "",
            RATE_TYPE : "",
            START_DATE : "",
            END_DATE : "",
            ALLOCATION : "",
            GOODS_RECEIPTS : []}
        }
        else//If PO = SOW
        {
            temp = {PO_ITEM : "",
            RESOURCE : "",
            MILESTONE_TYPE : "",
            JOB : "",
            MILESTONE_ID : "",
            UOM : this.currentPO.ER_RESPONSE.PO_ITEMS[0].UOM,
            QTY : "",
            COST_CENTER : "",
            REQ_COST_CENTER : "",
            PROJECT_ID : "",
            CAP_EXP : "",
            AVAIL_BUDGET : "",
            AVAIL_QUANTITY : "",
            UNIT_PRICE : "",
            RATE_TYPE : "",
            START_DATE : "",
            END_DATE : "",
            ALLOCATION : "",
            GOODS_RECEIPTS : []}
        }
        this.currentPO.ER_RESPONSE.PO_ITEMS.push(temp);
        this.REVERSE_PO_ITEMS.reverse().push(temp);
        this.REVERSE_PO_ITEMS.reverse();
        this.EnableChanges();
        setTimeout(()=>{ this.EnableChanges(); }, 25); //Refreshing ngModel input fields
        console.log("LOG ::: New PO_ITEM generated...");
    }


    NewPOItemCheck(index : number)
    {//if current PO_ITEM is one of the elements exceeding the size of the original PO_ITEM[]       ---->    return true
        if (index < this.currentPO.ER_RESPONSE.PO_ITEMS.length - this.backupPO.ER_RESPONSE.PO_ITEMS.length)
        {
            return true;
        }
    }


    DeletePOItem(index : number)
    {
        this.REVERSE_PO_ITEMS.splice(index, 1);
        this.currentPO.ER_RESPONSE.PO_ITEMS.splice(this.currentPO.ER_RESPONSE.PO_ITEMS.length - index - 1, 1);
        console.log("LOG ::: New PO_ITEM deleted...");
    }


    RestorePOItem(revIndex)
    {
        console.log("LOG ::: Restore() initiated on index " + revIndex);
        let index = this.currentPO.ER_RESPONSE.PO_ITEMS.length - 1 - revIndex;
        this.currentPO.ER_RESPONSE.PO_ITEMS[index] = JSON.parse(JSON.stringify(this.backupPO.ER_RESPONSE.PO_ITEMS[index])); 
        console.log("LOG ::: currentPO of index " + index + " restored to initial value.");
    }


    RestorePOObject()
    {
        this.currentPO = JSON.parse(JSON.stringify(this.backupPO));
        this.REVERSE_PO_ITEMS = JSON.parse(JSON.stringify(this.backupPO.ER_RESPONSE.PO_ITEMS.slice().reverse()));
        console.log("LOG ::: PO object restored to original state...");
    }

// Methods beneath this comment refer to PO Service Request creation/submission
    SendChanges()
    {
        //header creation
        this.IR_PO_DATA.BEELINE_ID = this.currentPO.ER_RESPONSE.BEELINE_ID;
        this.IR_PO_DATA.SOW_ID = this.currentPO.ER_RESPONSE.SOW_ID;
        this.IR_PO_DATA.PO_NUMBER = this.currentPO.ER_RESPONSE.PO_NUMBER;
        this.IR_PO_DATA.VENDOR_NUMBER = this.currentPO.ER_RESPONSE.VENDOR_NUMBER;
        this.IR_PO_DATA.SUBORDINATE_VENDOR = this.currentPO.ER_RESPONSE.SUBORDINATE_VENDOR;
        this.IR_PO_DATA.ASSIGNMENT_START_DATE = this.currentPO.ER_RESPONSE.ASSIGNMENT_START_DATE;
        this.IR_PO_DATA.ASSIGNMENT_END_DATE = this.currentPO.ER_RESPONSE.ASSIGNMENT_END_DATE;
        this.StoreChangedPOItems();
        console.log("LOG ::: Value of final PO service request stored...");
        console.log(this.IR_PO_DATA);
        this.POChangeSubmit();
        /*this.PostsService.sendCall("POST","API ENDPOINT", "Parameters N/A").subscribe(res=>{
            console.log("SendChanges() initiated. Sending modified PO_ITEM(s)...");
            console.log(res);
        });*/
    }


    StoreChangedPOItems()
    {
        console.log("LOG ::: Compiling changed PO_ITEM(s)...");
        this.IR_PO_DATA.PO_ITEMS = [];
        let index = 0;
        this.currentPO.ER_RESPONSE.PO_ITEMS.forEach(poItem =>{
            try
            {
                if(!this.EqualityCheck(poItem,this.backupPO.ER_RESPONSE.PO_ITEMS[index]))
                {
                    if (poItem.COST_CENTER){
                        this.IR_PO_DATA.PO_ITEMS.push(this.generateFinalPOItem(poItem.PO_ITEM, poItem.RESOURCE, poItem.MILESTONE_TYPE, poItem.MILESTONE_ID, poItem.JOB, poItem.UOM, poItem.QTY, poItem.UNIT_PRICE, poItem.CAP_EXP, poItem.COST_CENTER, poItem.PROJECT_ID, poItem.RATE_TYPE, poItem.START_DATE, poItem.END_DATE, poItem.ALLOCATION));
                    }
                    else{
                        this.IR_PO_DATA.PO_ITEMS.push(this.generateFinalPOItem(poItem.PO_ITEM, poItem.RESOURCE, poItem.MILESTONE_TYPE, poItem.MILESTONE_ID, poItem.JOB, poItem.UOM, poItem.QTY, poItem.UNIT_PRICE, poItem.CAP_EXP, poItem.REQ_COST_CENTER, poItem.PROJECT_ID, poItem.RATE_TYPE, poItem.START_DATE, poItem.END_DATE, poItem.ALLOCATION));
                    }
                }
            }
            finally
            {
                index +=1;
            }
        });
        
    }


    generateFinalPOItem(PO_ITEM : string,PO_ITEM_RESOURCE : string,MILESTONE_TYPE : string,MILESTONE_ID : string,PO_ITEM_JOB : string,PO_ITEM_UOM : string,PO_ITEM_QTY : string,PO_ITEM_UNIT_PRICE : string,PO_ITEM_CAP_EXP : string,PO_ITEM_COST_CENTER : string,PO_ITEM_PROJECT_ID : string,PO_ITEM_RATE_TYPE : string,PO_ITEM_START_DATE : string,PO_ITEM_END_DATE : string,PO_ITEM_ALLOCATION : string)
    {
        let poItem : PoItem;
        poItem = {"PO_ITEM" : PO_ITEM,"PO_ITEM_RESOURCE" : PO_ITEM_RESOURCE,"MILESTONE_TYPE" : MILESTONE_TYPE,"MILESTONE_ID" : MILESTONE_ID,"PO_ITEM_JOB" : PO_ITEM_JOB,"PO_ITEM_UOM" : PO_ITEM_UOM,"PO_ITEM_QTY" : PO_ITEM_QTY,"PO_ITEM_UNIT_PRICE" : PO_ITEM_UNIT_PRICE,"PO_ITEM_CAP_EXP" : PO_ITEM_CAP_EXP,"PO_ITEM_COST_CENTER" : PO_ITEM_COST_CENTER,"PO_ITEM_PROJECT_ID" : PO_ITEM_PROJECT_ID,"PO_ITEM_RATE_TYPE" : PO_ITEM_RATE_TYPE,"PO_ITEM_START_DATE" : PO_ITEM_START_DATE,"PO_ITEM_END_DATE" : PO_ITEM_END_DATE,"PO_ITEM_ALLOCATION" : PO_ITEM_ALLOCATION};
        console.log("LOG ::: Final PO_ITEM being generated...");
        return poItem;
    }


    POChangeSubmit()//QA space call
    {   
        console.log("LOG ::: Beginning POChangeSubmit()...")
        let PO_SERVICE_REQUEST : PO_SERVICE_REQUEST;
        PO_SERVICE_REQUEST = {IR_PO_DATA : this.IR_PO_DATA};
        let stringParam = JSON.stringify(PO_SERVICE_REQUEST);
        this.PostsService.sendCall("POST", environment.urlModifyQA, stringParam).subscribe(res=>{
            let response = <PO_DETAILS>res.json();
            console.log("LOG ::: response received with RESPONSE_CODE " + response.ER_RESPONSE.RESPONSE_CODE + " and RESPONSE_MESSAGE '" + response.ER_RESPONSE.RESPONSE_MESSAGE + "' ...");
            console.log(response);
            this.finalResponseCode = response.ER_RESPONSE.RESPONSE_CODE;
            this.finalResponseMessage = response.ER_RESPONSE.RESPONSE_MESSAGE;
            if (this.finalResponseCode == "0")
            {
                this.POCall(this.poID);
                this.EnableChanges();
            }
        });
    }
}