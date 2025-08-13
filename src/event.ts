/**
 * 事件回调
 */
export type EventHandle<T1, T2> = (data: T1, e?: T2) => void;

/**
 * 事件
 */
export class Event<T1, T2> {
    /**
     * 事件回调数组
     * @private
     */
    private handles: EventHandle<T1, T2>[] = [];

    /**
     * 订阅事件
     *
     * @param handle
     */
    public subscribe(handle: EventHandle<T1, T2>) {
        this.handles.push(handle);

    }

    /**
     * 解除订阅事件
     *
     * @param handle
     */
    public unsubscribe(handle: EventHandle<T1, T2>) {
        this.handles = this.handles.filter(h => h !== handle);
    }

    /**
     * 清除所有事件
     */
    public clear_subscribe(){
        this.handles = [];
    }

    /**
     * 触发事件
     *
     * @template T
     *
     * @param {T} data 通知信息
     * @param {any?} e 事件附加内容
     */
    public emit(data: T1, e?: T2){
        for(let i = 0; i < this.handles.length; i++){
            const fn = this.handles[i];

            fn(data, e);
        }
    }
}