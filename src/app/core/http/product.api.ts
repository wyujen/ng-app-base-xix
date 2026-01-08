import { Injectable } from "@angular/core";
import { BaseHttpService } from "./base-http.service";
import { CreateProductDto, IProduct } from "../../shared/models/product.model";
import { ApiResponse } from "../../shared/models/api-response.model";

@Injectable({ providedIn: 'root' })
export class ProductApi extends BaseHttpService {

    getAll() {
        return this.get<ApiResponse<IProduct[]>>('/products')
    }
    getById(id: string) {
        return this.get<ApiResponse<IProduct[]>>(`/products/${id}`);
    }

    create(payload: CreateProductDto) {
        return this.post<ApiResponse<IProduct>>(`/products`, payload);
    }
    update(payload: IProduct) {
        return this.post<ApiResponse<IProduct>>(`/products`, payload);
    }
    delete(id: string) {
        return this.del<ApiResponse<string[]>>(`/products/${id}`);
    }


}