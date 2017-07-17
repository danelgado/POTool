import {Injectable} from '@angular/core';

@Injectable()
export class callObject{
        URL : string;
        parameters : string;
        callType : string;
        constructor(URL : string, parameters : string, callType : string){
            this.URL = URL;
            this.parameters = parameters;
            this.callType = callType;
        }
    }


@Injectable()
export class webSpaceObject{
        webSpace : string;
        webSpaceName : string;
        constructor(webSpace : string, webSpaceName : string){
            this.webSpace = webSpace;
            this.webSpaceName = webSpaceName;
        }
    }


@Injectable()
export class appObject{
    appName : string;
    springValues : string[];
    numberID : string;
    constructor(appName : string, springValues : string[], numberID : string){
        this.appName = appName;
        this.springValues = springValues;
        this.numberID = numberID;
    }
}


export interface GoodsReceipt{
    BEELINE_INVOICE? : string;
	BILLING_PERIOD? : string;
    QTY_RECEIVED? : string;
    AMT_RECEIVED? : string;
}


export interface PO_ITEM{
    PO_ITEM? : string;
    RESOURCE? : string;
    MILESTONE_TYPE? : string;
    JOB? : string;
    MILESTONE_ID? : string;
    UOM? : string;
    QTY? : string;
    COST_CENTER? : string;
    REQ_COST_CENTER? : string;
    PROJECT_ID? : string;
	CAP_EXP? : string;
	AVAIL_BUDGET? : string;
	AVAIL_QUANTITY? : string;
	UNIT_PRICE? : string;
	RATE_TYPE? : string;
	START_DATE? : string;
	END_DATE? : string;
	ALLOCATION? : string;
	GOODS_RECEIPTS? : GoodsReceipt[];
}



export interface ER_RESPONSE{
    PO_NUMBER? : string;
	RESPONSE_CODE? : string;
	RESPONSE_MESSAGE? : string;
    BEELINE_ID? : string;
    SOW_ID? : string;
    VENDOR_NUMBER? : string;
    SUBORDINATE_VENDOR? : string;
    ASSIGNMENT_START_DATE? : string;
    ASSIGNMENT_END_DATE? : string;
	PO_ITEMS? : PO_ITEM[];
}


export interface PO_DETAILS{
    ER_RESPONSE? : ER_RESPONSE;
}


@Injectable()
export class PO_SERVICE_REQUEST{
    IR_PO_DATA : IR_PO_DATA;
}


@Injectable()
export class IR_PO_DATA{
    BEELINE_ID? : string;
    SOW_ID? : string;
    PO_NUMBER? : string;
    VENDOR_NUMBER? : string;
    SUBORDINATE_VENDOR? : string;
    FY? : string;
    LABOR_TYPE? : string;
    ASSIGNMENT_START_DATE? : string;
    ASSIGNMENT_END_DATE? : string;
    PO_ITEMS? : PoItem[];
}



@Injectable()
export class PoItem{
    PO_ITEM             : string;
    PO_ITEM_RESOURCE    : string;          
    MILESTONE_TYPE      : string;       
    MILESTONE_ID        : string;     
    PO_ITEM_JOB         : string;     
    PO_ITEM_UOM         : string;      
    PO_ITEM_QTY         : string;    
    PO_ITEM_UNIT_PRICE  : string;           
    PO_ITEM_CAP_EXP     : string;        
    PO_ITEM_COST_CENTER : string;            
    PO_ITEM_PROJECT_ID  : string;          
    PO_ITEM_RATE_TYPE   : string;          
    PO_ITEM_START_DATE  : string;          
    PO_ITEM_END_DATE    : string;        
    PO_ITEM_ALLOCATION  : string;             

}
/*
//PO Nested Objects GoodsReceipt[] -> PO_ITEM[] -> poObject
@Injectable()
export class GoodsReceipt{
    BEELINE_INVOICE : string;
	BILLING_PERIOD : string;
    QTY_RECEIVED : string;
    AMT_RECEIVED : string;
}


@Injectable()
export class PO_ITEM{
    PO_ITEM : string;
    RESOURCE : string;
    MILESTONE_TYPE : string;
    JOB : string;
    MILESTONE_ID : string;
    UOM : string;
    QTY : string;
    COST_CENTER : string;
    REQ_COST_CENTER : string;
    PROJECT_ID : string;
	CAP_EXP : string;
	AVAIL_BUDGET : string;
	AVAIL_QUANTITY : string;
	UNIT_PRICE : string;
	RATE_TYPE : string;
	START_DATE : string;
	END_DATE : string;
	ALLOCATION : string;
	GOODS_RECEIPTS : GoodsReceipt[];
}


@Injectable()
export class poObject{
    PO_NUMBER : string;
	RESPONSE_CODE : string;
	RESPONSE_MESSAGE : string;
    BEELINE_ID : string;
    SOW_ID : string;
    VENDOR_NUMBER : string;
    SUBORDINATE_VENDOR : string;
    ASSIGNMENT_START_DATE : string;
    ASSIGNMENT_END_DATE : string;
	PO_ITEMS : PO_ITEM[];
}*/