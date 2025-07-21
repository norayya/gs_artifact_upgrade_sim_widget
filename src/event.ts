/**
 * 事件回调
 */
export type EventHandle<T> = (data: T, e?: any) => any;

/**
 * 事件
 */
export class Event<T> {
    /**
     * 事件回调数组
     * @private
     */
    private handles: EventHandle<T>[] = [];

    /**
     * 订阅事件
     *
     * @param handle
     */
    public subscribe(handle: EventHandle<T>) {
        this.handles.push(handle);

    }

    /**
     * 解除订阅事件
     *
     * @param handle
     */
    public unsubscribe(handle: EventHandle<T>) {
        this.handles = this.handles.filter(h => h !== handle);
    }

    /**
     * 触发事件
     *
     * @template T
     *
     * @param {T} data 通知信息
     * @param {any?} e 事件附加内容
     */
    public emit(data: T, e?: any){
        for(let i = 0; i < this.handles.length; i++){
            const fn = this.handles[i];

            fn(data, e);
        }
    }
}