import { computed, Signal } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export type SearchLogic = 'AND' | 'OR';
export type SearchType =
    | 'keyword'
    | 'boolean'
    | 'exactMatchString'
    | 'exactNotMatchString'
    | 'notInSet';

export interface SearchOption {
    /** 是否啟用該條件 */
    enabled: boolean;
    /** 匹配類型：關鍵字、布林、字串等值、字串排除等值 */
    type: SearchType;
    /** 欄位路徑（dot path：例如 'user.name'） */
    key: string;
    /** 查詢值（依 type 決定實際使用方式） */
    value: string | boolean | Set<string>;
    /** 與其他條件的邏輯關係 */
    mold: SearchLogic;
}

export interface SearchParam {
    /** 狀態：'search' 時才會執行過濾與排序 */
    state: 'init' | 'search';
    /** 搜尋條件列表 */
    optionList: SearchOption[];
    /** 排序鍵（dot path），預設 'timestamps' */
    sortKey?: string;
    /** 排序方向，預設 'DESC'（新到舊） */
    sortOrder?: 'ASC' | 'DESC';
}


/** 匹配器：回傳 true/false 表示是否符合條件 */
type Matcher = (itemValue: unknown, targetValue: string | boolean | Set<string>) => boolean;
const matchers: Record<SearchType, Matcher> = {


    /** 關鍵字包含（大小寫不敏感；空字串視為不限制） */
    keyword: (recordValue, queryValue) => {
        const queryText = toLowerString(queryValue);
        if (!queryText) return true; // 空字串等於不限制
        const recordText = toLowerString(recordValue);
        return recordText.includes(queryText);
    },


    /** 布林等值（支援 'true'/'false'/'1'/'0' 與數字 1/0） */
    boolean: (recordValue, queryValue) => {
        const left = toBoolean(recordValue);
        const right = toBoolean(queryValue);
        return left !== undefined && right !== undefined && left === right;
    },


    /**
   * 字串嚴格等值（大小寫敏感且空白敏感）
   * 型別不為字串時，回傳 false 並警告
   */
    exactMatchString: (recordValue, queryValue) => {
        if (
            typeof recordValue !== 'string'
            || typeof queryValue !== 'string'
        ) {
            console.warn(
                '[Search]-[exactMatchString] value is not string',
                'recordValue :', recordValue,
                'recordValueType :', typeof recordValue,
                'queryValue :', queryValue,
                'queryValueType :', typeof queryValue
            )
            return false;
        }
        return recordValue === queryValue;
    },


    /**
   * 字串嚴格不等於（大小寫敏感且空白敏感）
   * 型別不為字串時，視為「不過濾」（回傳 true）並警告
   */
    exactNotMatchString: (recordValue, queryValue) => {
        if (
            typeof recordValue !== 'string'
            || typeof queryValue !== 'string'
        ) {
            console.warn(
                '[Search]-[exactNotMatchString] value is not string',
                'recordValue :', recordValue,
                'recordValueType :', typeof recordValue,
                'queryValue :', queryValue,
                'queryValueType :', typeof queryValue
            )
            return true;
        }
        return recordValue !== queryValue;
    },


    notInSet: (recordValue, queryValue) => {

        if (!(queryValue instanceof Set)) {
            console.warn('[Search]-[notInSet] queryValue is not a Set', queryValue);
            return true; // 沒給正確型別 → 視為不過濾
        }
        if (typeof recordValue !== 'string') {
            console.warn('[Search]-[notInSet] recordValue is not a string', recordValue)
            return true; // 沒給正確型別 → 視為不過濾
        }

        // 判斷 recordValue 是否在 set 裡
        const exists = queryValue.has(recordValue);
        return !exists; // 不在 set 裡 → true
    }
};


/**
 * 建立可彈性配置的搜尋/篩選/排序 Signal：
 * - state !== 'search' 或無啟用條件 → 回傳原清單
 * - AND 群組：全部條件需通過
 * - OR 群組：若存在，至少一條需通過（若不存在，忽略 OR）
 * - 排序：預設以 'timestamps' 做 DESC（新到舊）
 */
export const createFlexibleSearchSignal = <T extends object>(
    listSignal: Signal<T[]>,
    paramSignal: Signal<SearchParam>
): Signal<T[]> => {
    return computed(() => {
        const list = listSignal();
        const {
            state,
            optionList,
            sortKey = 'timestamps',
            sortOrder = 'DESC'
        } = paramSignal();
        const enableOptionList = optionList.filter(option => option.enabled == true)

        if (state !== 'search' || enableOptionList.length === 0) return list;
        const andOptions = enableOptionList.filter(o => o.mold === 'AND');
        const orOptions = enableOptionList.filter(o => o.mold === 'OR');

        // 篩選
        const filteredList = list.filter(item => {
            const andPass = andOptions.every(opt =>
                matchers[opt.type]?.(getValueByPath(item, opt.key), opt.value) === true
            );
            if (!andPass) return false;
            const orPass = orOptions.length === 0 || orOptions.some(opt =>
                matchers[opt.type]?.(getValueByPath(item, opt.key), opt.value) === true
            );
            return orPass;
        });

        const sortedList = [...filteredList].sort((a, b) => {
            const va = getValueByPath(a, sortKey);
            const vb = getValueByPath(b, sortKey);
            const diff = compareValues(va, vb);
            return sortOrder === 'ASC' ? diff : -diff;
        });

        return sortedList
    });
}


export const createACBaseDisplaySignal = (
    mapSignal: Signal<Record<string, any>>,
    displayKey: string = 'name'
): Signal<(id: string) => string> => {
    return computed(() => {

        const map = mapSignal();
        return (id: string): string => {
            const item = map[id];
            return item ? item[displayKey] : '';
        };

    });
}


export const createACFlexibleDisplaySignal = (
    mapSignal: Signal<Record<string, any>>,
    displayTextList: string[] = ['名稱'],
    displayKeyList: string[] = ['name']
): Signal<(id: string) => string> =>
    computed(() => {
        const map = mapSignal();

        return (id: string): string => {
            const item = map[id];
            if (!item) return '';

            return displayKeyList.map((key, i) => {
                const label = displayTextList[i] ?? '';
                const value = getValueByPath(item, key);
                return `${label} ${value ?? ''}`;
            }).join(' ');
        };
    });


/**
 * 建立一個驗證器（ValidatorFn），用來檢查表單輸入值是否存在於指定的資料映射中。
 *
 * 驗證邏輯：
 * 1. 如果 `required` 為 `false` 且值為空，視為通過驗證。
 * 2. 如果 `required` 為 `true` 且值為空，回傳 `{ required: true }` 錯誤。
 * 3. 如果值不在 `recordSignal` 的鍵中，回傳 `{ idNotFound: true }` 錯誤。
 * 4. 其他情況下驗證通過，回傳 `null`。
 *
 * @param required - 是否為必填欄位。
 * @param recordSignal - `Signal`，包含鍵值對資料（Record<string, any>），用於驗證輸入值是否存在。
 * @returns 一個 Angular `ValidatorFn`，可用於 Reactive Form 驗證。
 */


export const idInMapValidator = (
    required: boolean,
    recordSignal: Signal<Record<string, any>>
): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (!required && (value === null || value === '')) {
            return null;
        }

        if (required && (!value || value === '')) {
            return { required: true };
        }

        if (!recordSignal()[value]) {
            return { idNotFound: true };
        }

        return null;
    };





/**
 * 依照 dot path 由物件安全取值。
 * 注意：目前不支援陣列索引（例如 'items.0.name'）。
 */
export const getValueByPath = (obj: any, path: string): unknown => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

/**
 * 將任意值轉成小寫字串，用於比對時統一格式。
 * - null / undefined → ''
 * - 物件 / 陣列 → JSON.stringify 後再轉小寫
 * - 其他型別 → String(v).trim().toLowerCase()
 */
const toLowerString = (v: unknown): string => {
    if (v === null || v === undefined) {
        console.warn('[Search] value is null|undefined', v)
        return ''
    }
    // 如果是物件或陣列，避免輸出 [object Object]
    if (typeof v === 'object') {
        try {
            console.warn('[Search] value is object', v)
            return JSON.stringify(v).trim().toLowerCase();
        } catch {
            return '';
        }
    }

    return String(v).trim().toLowerCase();
};

/**
 * 將任意值嘗試轉成布林值。
 * - 布林值 → 原樣回傳
 * - 字串 'true' / 'false'（不分大小寫，允許前後空白） → true / false
 * - 數字 1 / 0 → true / false
 * - 其他無法解析 → undefined
 */
const toBoolean = (v: unknown): boolean | undefined => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') {
        console.warn('[Search] value is not boolean', v)
        if (v === 1) return true;
        if (v === 0) return false;
        return undefined;
    }

    if (typeof v === 'string') {
        const s = v.trim().toLowerCase();
        if (s === 'true' || s === '1') return true;
        if (s === 'false' || s === '0') return false;
        console.warn('[Search] value is not boolean', v)
        return undefined;
    }
    console.warn('[Search] value is not boolean', v)
    return undefined;
};

/**
 * 通用比較器（供排序使用）。
 * 規則：
 * - 若有數字 → 以數字比較（可嘗試 Number(...)），NaN 視為 undefined
 * - 若是字串 → 以字典序比較
 * - null/undefined 視為「缺值」：在 ASC 時較小、在 DESC 時較大
 * - 其他型別 → 轉字串再比較（保底策略）
 */
const compareValues = (a: unknown, b: unknown): number => {
    // number 優先比較
    if (typeof a === 'number' || typeof b === 'number') {
        const na = typeof a === 'number' ? a : Number(a);
        const nb = typeof b === 'number' ? b : Number(b);
        // NaN 處理：把 NaN 視為 undefined
        const va = Number.isFinite(na) ? na : undefined;
        const vb = Number.isFinite(nb) ? nb : undefined;
        if (va === undefined && vb === undefined) return 0;
        if (va === undefined) return -1;
        if (vb === undefined) return 1;
        return va - vb;
    }
    // string
    if (typeof a === 'string' && typeof b === 'string') {
        return a < b ? -1 : a > b ? 1 : 0;
    }
    // 其他型別：把缺值排到前/後（由呼叫端 ASC/DESC 決定方向）
    if (a === undefined || a === null) {
        return (b === undefined || b === null) ? 0 : -1;
    }
    if (b === undefined || b === null) {
        return 1;
    }
    // 其他型別：字串化比較
    const sa = String(a);
    const sb = String(b);
    return sa < sb ? -1 : sa > sb ? 1 : 0;
};

