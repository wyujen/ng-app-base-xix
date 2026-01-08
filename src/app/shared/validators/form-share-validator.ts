import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

/**
 * 驗證指定欄位的值是否在 FormArray 中唯一
 * @param formArray 需要檢查重複的 FormArray
 * @param field 要檢查的欄位名稱
 * @returns 如果欄位值重複則返回錯誤物件，否則返回 null
 * 
 * 使用範例：
 * 假設我們有一個 `FormArray` 裡面的每個項目都是一個 `FormGroup`，並且每個項目都有 `name` 這個欄位，
 * 我們希望確保 `name` 這個欄位的值不會重複。
 * 
 * 例如，當你想要為 `FormArray` 裡面的每個項目添加 `name` 的唯一性驗證時，你可以這樣使用：
 * 
 * ```ts
 * get items() {
 *  return this.form.get('items') as FormArray;
 *  }
 * const form = this._fb.group({
 *   items: [item.name, [Validators.required, uniqueFieldValidator(this.items, 'name')]],
 * });
 * ```
 * 
 * 這會檢查 `this.items` 中的所有項目，確保 `name` 的值不重複。如果有重複，將返回 `{ duplicateItem: true }` 的錯誤。
 */
export function uniqueFieldValidator(formArray: FormArray, field: string) {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) {
            return null; // 如果沒有值，不進行驗證
        }

        // 記錄有重複值的項目
        let duplicateCount = 0;

        // 檢查 FormArray 中是否有相同欄位的值，排除自己
        const isDuplicate = formArray.controls.some((itemControl: AbstractControl, index: number) => {
            const itemGroup = itemControl as FormGroup;

            // 確保不與自己比較
            if (itemGroup.get(field)?.value === value) {
                duplicateCount++;
            }

            // 當重複次數大於 1，返回錯誤
            return duplicateCount > 1;
        });

        // 如果有重複，返回錯誤物件
        return duplicateCount > 1 ? { duplicateItem: true } : null;
    };
}


/**
 * FormArray 內兩個欄位的「複合唯一」驗證器（Row-level）
 *
 * 功能：
 *   檢查 keyA + keyB 是否重複
 *   將錯誤標記到「重複的 FormGroup / 指定欄位」
 *   讓畫面能用 is-invalid 正確標示
 *
 * @param keyA 第一個欄位（例：acy）
 * @param keyB 第二個欄位（例：f8_b）
 */
export function uniqueCompositeValidator(
    keyA: string,
    keyB: string
) {
    return (control: AbstractControl): ValidationErrors | null => {

        if (!(control instanceof FormArray)) {
            return null;
        }

        const map = new Map<string, FormGroup[]>();

        // 先清掉舊的 duplicate 錯誤（避免殘留）
        control.controls.forEach(group => {
            const ctrlB = group.get(keyB);
            if (ctrlB?.hasError('duplicate')) {
                const errors = { ...ctrlB.errors };
                delete errors['duplicate'];
                ctrlB.setErrors(Object.keys(errors).length ? errors : null);
            }
        });

        // 收集所有 keyA + keyB 組合
        control.controls.forEach(group => {
            const valueA = group.get(keyA)?.value;
            const valueB = group.get(keyB)?.value;

            if (!valueA || !valueB) {
                return;
            }

            const key = `${valueA}__${valueB}`;

            if (!map.has(key)) {
                map.set(key, []);
            }

            map.get(key)!.push(group as FormGroup);
        });

        // 將重複的 group 標記錯誤
        let hasDuplicate = false;

        map.forEach(groups => {
            if (groups.length > 1) {
                hasDuplicate = true;

                groups.forEach(group => {
                    const ctrlB = group.get(keyB);
                    ctrlB?.setErrors({
                        ...(ctrlB.errors || {}),
                        duplicate: true
                    });
                });
            }
        });

        return hasDuplicate
            ? { duplicateComposite: { keyA, keyB } }
            : null;
    };
}

