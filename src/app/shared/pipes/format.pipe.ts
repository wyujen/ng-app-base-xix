import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';
import { DateTime } from 'luxon';

@Pipe({
    name: 'replace',
    pure: false
})
export class ReplacePipe implements PipeTransform {

    transform(value: any, mapping: { [key: string]: string }): string {
        if (!value || !mapping || typeof value !== 'string') {
            return '-';
        }
        const result = mapping[value] ?? value
        return result;
    }
}
@Pipe({
    name: 'dateOnly',
    pure: false
})
export class DateOnlyPipe implements PipeTransform {
    transform(value: any): string {
        if (typeof value !== 'number' || isNaN(value)) {
            return '-';
        }
        const date = new Date(value);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }
}

@Pipe({
    name: 'timeOnly',
    pure: false
})
export class TimeOnlyPipe implements PipeTransform {
    transform(value: any): string {
        if (typeof value !== 'number' || isNaN(value)) {
            return '-';
        }
        const date = new Date(value);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}

/**
* **RecordToListPipe**
* 
* 這個 Pipe 將物件的值轉換為一個陣列，並根據提供的鍵 (key) 和排序方向 (order) 進行排序。
* 
* @usageNotes
* **用法範例：**
* 
* ```html
* <div *ngFor="let item of record | recordToList: true : 'name' : 'asc'">
*   {{ item.name }}
* </div>
* ```
* 
* 
* @param value 需要轉換的物件，通常是 key-value 格式的物件
* @param isOrderBy 是否需要排序 (預設為 false)
* @param key 排序的 key (例如 'name', 'value' 等)
* @param order 排序的方向 ('asc' 或 'desc'，預設為 'asc')
* @returns 回傳轉換後的陣列，若 `isOrderBy` 為 `true`，則進行排序
*/

@Pipe({
    name: 'recordToList',
    pure: false
})
export class RecordToListPipe implements PipeTransform {

    transform(
        value: any,
        isOrderBy: boolean = false,
        key: string = '',
        order: 'asc' | 'desc' = 'asc'
    ): any[] {
        if (!value) {
            return [];
        }
        const dataList = Object.values(value);
        if (isOrderBy && key) {
            return orderBy(dataList, [key], [order])
        } else {
            return dataList
        }
    }
}

@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

    transform(
        dataList: any[],
        key: string,
        order: 'asc' | 'desc' = 'desc'
    ): any[] {
        if (!Array.isArray(dataList)) {
            return [];
        }
        if (key) {
            return orderBy(dataList, [key], [order])
        } else {
            return dataList
        }

    }
}

@Pipe({
    name: 'truncate',
    pure: false
})
export class TruncatePipe implements PipeTransform {

    transform(value: number): number {
        if (!value) {
            return 0; // 防止 null 或 undefined
        }
        return Math.floor(value); // 無條件捨去，保留整數部分
    }

}


@Pipe({
    name: 'durationNumberToHour',
    pure: false
})
export class DurationNumberToHour implements PipeTransform {

    transform(value: any): string {

        if (typeof value !== 'number' || isNaN(value) || value < 0) {
            return '-';
        }

        // 計算時間單位
        const millisecondsPerHour = 60 * 60 * 1000;

        const totalHours = Math.floor(value / millisecondsPerHour);


        return totalHours.toString() || '-'; // 如果沒有任何值，顯示0天
    }
}

@Pipe({
    name: 'durationNumberToMonthDay',
    pure: false
})
export class DurationNumberToMonthDay implements PipeTransform {

    transform(value: any): string {

        if (typeof value !== 'number' || isNaN(value) || value < 0) {
            return '-';
        }

        // 計算時間單位
        const daysInMonth = 30; // 假設一個月為30天
        const millisecondsPerDay = 24 * 60 * 60 * 1000;

        const totalDays = Math.floor(value / millisecondsPerDay);
        const months = Math.floor(totalDays / daysInMonth);
        const days = totalDays % daysInMonth;

        // 構建顯示結果
        let result = '';
        if (months > 0) {
            result += `${months}個月`;
        }
        if (days > 0) {
            result += `${days}天`;
        }

        return result || '-'; // 如果沒有任何值，顯示0天
    }
}
@Pipe({
    name: 'numberToDate',
    pure: false
})
export class NumberToDatePipe implements PipeTransform {
    transform(value: any, addValue?: any): any {
        // console.log('value', value)
        if (typeof value !== 'number' || isNaN(value) || value < 0) {
            return value;
        }
        if (typeof addValue !== 'number' || isNaN(value) || value < 0) {
            addValue = 0
        }
        value = value + addValue

        try {
            // 使用 Luxon 將毫秒級時間戳轉換為日期
            const date = DateTime.fromMillis(value);
            if (!date.isValid) {
                return 'Invalid Date';
            }

            // 格式化為 yyyy-MM-dd
            return date.toFormat('yyyy-MM-dd');
        } catch {
            return 'Invalid Date';
        }

        // 返回格式化後的日期
    }
}
@Pipe({
    name: 'numberToDateTime',
    pure: false
})
export class NumberToDateTimePipe implements PipeTransform {
    transform(value: any, addValue?: any): any {
        // console.log('value', value)
        if (typeof value !== 'number' || isNaN(value) || value < 0) {
            return value;
        }
        if (typeof addValue !== 'number' || isNaN(value) || value < 0) {
            addValue = 0
        }
        value = value + addValue

        try {
            // 使用 Luxon 將毫秒級時間戳轉換為日期
            const date = DateTime.fromMillis(value);
            if (!date.isValid) {
                return 'Invalid Date';
            }

            // 格式化為 yyyy-MM-dd HH:mm
            return date.toFormat('yyyy-MM-dd HH:mm');
        } catch {
            return 'Invalid Date';
        }

        // 返回格式化後的日期
    }
}
@Pipe({
    name: 'numberToPercent',
    pure: false
})
export class NumberToPercentPipe implements PipeTransform {
    transform(value: any, addValue?: any): string {
        if (typeof value !== 'number' || isNaN(value) || value < 0) {
            return '-%';
        }
        try {
            value = Math.round((value + Number.EPSILON) * 10000) / 10000
            value = (value * 100).toFixed(2).toString()
            value = value + '%'
            return value
        } catch {
            return '-%';
        }
    }
}
/**
 * FilterPipe - 用於根據指定的屬性和值，對物件列表進行過濾。
 * 
 * 參數說明:
 * @param list - 需要過濾的物件列表 (Array of objects)。
 * @param mode - 過濾模式，'eq' 表示等於，'neq' 表示不等於。
 * @param propertyName - 物件中要篩選的屬性名稱 (如 'name', 'status' 等)。
 * @param value - 要用於篩選的值。
 * 
 * 使用方式:
 * 篩選 `status` 等於 'active' 的物件列表:
 * list | filterByKeyValue: 'eq': 'status': 'active'
 * 
 * 篩選 `status` 不等於 'inactive' 的物件列表:
 * list | filterByKeyValue: 'neq': 'status': 'inactive'
 */
@Pipe({
    name: 'filterByKeyValue'
})
export class FilterByKeyValuePipe implements PipeTransform {

    transform(list: any[], mode: 'eq' | 'neq' | 'contains', propertyName: string, value: any): any[] {
        if (!Array.isArray(list) || !propertyName || !mode) {
            return [];
        }
        if (value === 'ALL') {
            return list
        }

        // 過濾條件
        switch (mode) {
            case 'eq':
                return list.filter(item => item[propertyName] === value);
            case 'neq':
                return list.filter(item => item[propertyName] !== value);
            case 'contains':
                // 對屬性值進行部分匹配 (使用 includes 進行模糊搜尋)，並忽略空格
                return list.filter(item => {
                    const itemValue = item[propertyName];
                    if (typeof itemValue === 'string') {
                        // 去除空格並進行大小寫不敏感匹配
                        return itemValue.replace(/\s+/g, '').toLowerCase().includes(value.replace(/\s+/g, '').toLowerCase());
                    }
                    // 對其他類型（如數字、布爾值等）進行轉換後匹配，去除空格後比較
                    return String(itemValue).replace(/\s+/g, '').toLowerCase().includes(String(value).replace(/\s+/g, '').toLowerCase());
                });
            default:
                return list;
        }
    }

}

/**
 * FilterPipe
 * 
 * 用於根據物件中是否包含指定的屬性來過濾列表。
 * 
 * @param {any[]} list - 需要過濾的物件陣列。
 * @param {'has' | 'hasnot'} mode - 過濾模式，'has' 表示篩選出包含該屬性的物件，'hasnot' 表示篩選出不包含該屬性的物件。
 * @param {string} propertyName - 需要檢查的屬性名稱。
 * 
 * @returns {any[]} 返回篩選後的物件陣列。
 * 
 * @example
 * // HTML 使用範例：
 * // 假設有一個 users 陣列：
 * // [{name: 'Alice', age: 25}, {name: 'Bob'}, {name: 'Charlie', age: 30}]
 * // 只篩選出包含 'age' 屬性的物件：
 * // <div *ngFor="let user of users | filterByPropertyName:'has':'age'">
 * //   {{ user.name }} - {{ user.age }}
 * // </div>
 */

@Pipe({
    name: 'filterByPropertyName'
})
export class FilterByPropertyName implements PipeTransform {

    transform(list: any[], mode: 'has' | 'hasnot', propertyName: string): any[] {
        if (!Array.isArray(list) || !propertyName || !mode) {
            return [];
        }

        // 過濾條件
        switch (mode) {
            case 'has':
                return list.filter(item => item.hasOwnProperty(propertyName));
            case 'hasnot':
                return list.filter(item => !item.hasOwnProperty(propertyName));
            default:
                return list;
        }
    }

}

@Pipe({
    name: 'sumBy',
    pure: true,
})
export class SumByPipe implements PipeTransform {

    /**
     * 對 list 陣列裡的每個元素，根據指定的 keyPath 取值並加總
     * - 會自動忽略 null、undefined、NaN、空字串
     * - 如果值是字串數字（例如 '12.3'），會自動轉成數字
     * - 如果 keyPath 為巢狀結構（例如 'price.afterTax'），也能處理
     *
     * @param list 要加總的陣列
     * @param keyPath 指定要取值的屬性路徑（支援 'a.b.c'）
     * @returns number 加總結果
     * 
     *  @example
     * //HTML 使用範例：
     * // 假設有一個 products 陣列：
     * // [
     * //   { name: 'Book', price: 120 },
     * //   { name: 'Pen', price: null },
     * //   { name: 'Bag', price: '300' },
     * //   { name: 'Shoes' } // 沒有 price
     * // ]
     * //
     * // 加總所有 price 屬性：
     * // <div>
     * //   總價：{{ products | sumBy:'price' }}
     * // </div>
     * //
     * // 假設物件結構更複雜：
     * // [
     * //   { name: 'A', price: { afterTax: 105.5 } },
     * //   { name: 'B', price: { afterTax: '200' } },
     * //   { name: 'C', price: {} }
     * // ]
     * //
     * // 加總巢狀屬性 price.afterTax：
     * // <div>
     * //   稅後總價：{{ products | sumBy:'price.afterTax' }}
     * // </div>
     */
    transform<T extends Record<string, any>>(list: T[] | null | undefined, keyPath: string): number {
        if (!Array.isArray(list) || !keyPath) return 0;

        return list.reduce((acc, item) => {
            const val = this.getByPath(item, keyPath);  // 取出指定 key 的值
            return acc + this.toNumberSafe(val);        // 轉成數字後累加
        }, 0);
    }

    /**
     * 根據路徑字串（a.b.c）安全地取出物件的巢狀屬性值
     */
    private getByPath(obj: any, path: string): any {
        return path.split('.').reduce((o, k) => (o?.[k]), obj);
    }

    /**
     * 將輸入值安全轉換成數字
     * - null / undefined → 0
     * - NaN → 0
     * - 空字串 → 0
     * - 字串數字（例如 '12.3'）→ 正常轉換
     * - 其他型別嘗試 Number()，失敗就回傳 0
     */
    private toNumberSafe(value: any): number {
        if (value == null) return 0;            // null / undefined
        if (typeof value === 'number') {
            return Number.isFinite(value) ? value : 0;
        }
        if (typeof value === 'string') {
            const s = value.trim();
            if (!s) return 0;                     // 空字串
            const n = Number(s);
            return Number.isFinite(n) ? n : 0;
        }
        // 其他型別（boolean / Date / 物件）嘗試轉數字，不可用則 0
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    }
}
