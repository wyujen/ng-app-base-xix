import { Injectable, effect, signal } from '@angular/core';

export interface IAlertVM {
    alertMessage: string;
    submitText: string;
    backText: string;
    isTwoOption: boolean;
    submitCallBack?: () => void;
}

export const InitAlert: IAlertVM = {
    alertMessage: '測試',
    submitText: '確定',
    backText: '取消',
    isTwoOption: true,
}
@Injectable({ providedIn: 'root' })
export class AlertStore {

    private _alertWS = signal<IAlertVM>(InitAlert);

    private _isOpenWS = signal<boolean>(false);

    alertS = this._alertWS.asReadonly();
    isOpenS = this._isOpenWS.asReadonly();

    constructor() {
    }

    openAlert(vm: IAlertVM = InitAlert) {
        this._alertWS.set(vm)
        this._isOpenWS.set(true);
    }
    updateMessage(currentMessage: string) {
        this._alertWS.update(c => ({
            ...c,
            alertMessage: currentMessage
        }))
    }

    closeAlert() {
        this._isOpenWS.set(false);
        this._alertWS.set(InitAlert)
    }

    // 讓 modal 的「確定」按下去會執行 callback，然後關閉
    submit() {
        const cb = this._alertWS().submitCallBack;
        try {
            cb?.();
            console.log('try action')
        } finally {
            this.closeAlert();
        }
    }
}
