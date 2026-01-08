import { computed, Injectable, signal } from '@angular/core';
import { IProduct } from '../../../shared/models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductStore {

    private _productListWS = signal<IProduct[]>([])
    private _productMapListWS = signal<Record<string, IProduct>>({})

    productListSignal = this._productListWS.asReadonly();
    productMapListSignal = this._productMapListWS.asReadonly()





    loadProduct(){
        if(this._productListWS.length > 0) return

    }

}