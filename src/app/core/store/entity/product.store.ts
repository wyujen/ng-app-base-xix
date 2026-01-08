import { computed, inject, Injectable, signal } from '@angular/core';
import { IProduct } from '../../../shared/models/product.model';
import { ProductApi } from '../../http/product.api';

@Injectable({
    providedIn: 'root'
})
export class ProductStore {

    private _productListWS = signal<IProduct[]>([])
    private _productMapListWS = signal<Record<string, IProduct>>({})

    productListSignal = this._productListWS.asReadonly();
    productMapListSignal = this._productMapListWS.asReadonly()

    private _productHS = inject(ProductApi)

    loadProduct() {
        if (this._productListWS.length > 0) return
        this._productHS.getAll().subscribe({
            next: (res) => {
                if (res?.data) {
                    const list = res.data
                    this._productListWS.set(list)

                    const record = list.reduce((
                        acc: Record<string, IProduct>,
                        item: IProduct
                    ) => {
                        acc[item.id] = item;
                        return acc
                    }, {})
                    this._productMapListWS.set(record);
                }
            },
            error: (error) => {
                console.error('Failed to fetch list:', error);
            }
        })
    }

}