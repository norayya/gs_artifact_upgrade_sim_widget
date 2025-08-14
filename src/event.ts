/**
 * 事件回调
 */
export type EventHandle<T1, T2> = (data: T1, e?: T2) => void;

/**
 * 事件类型
 */
export type Event<T1, T2> = {
    /**
     * 订阅事件函数
     * @param handle 当事件触发时执行的函数
     */
    Subscribe(handle: EventHandle<T1, T2>): void;
    /**
     * 卸载事件函数
     * @param handle 当事件触发时执行的函数
     */
    Unsubscribe(handle: EventHandle<T1, T2>): void;
    /**
     * 清除事件列表
     */
    CleanSubscribe(): void;
    /**
     * 触发事件
     * @param data 传递给事件的数据
     * @param e 附加数据
     */
    Emit(data: T1, e?: T2): void
}

/**
 * 创建一个事件
 */
export function NewEvent<T1, T2>(): Event<T1, T2> {
    // 事件处理函数数组
    let eventHandles: EventHandle<T1, T2>[] ;

    return {
        Subscribe(handle: EventHandle<T1, T2>): void {
            eventHandles.push(handle);
        },
        Unsubscribe(handle: EventHandle<T1, T2>): void {
            eventHandles = eventHandles.filter(h => h !== handle);
        },
        CleanSubscribe(): void {
            eventHandles = [];
        },
        Emit(data: T1, e?: T2): void {
            for(let i = 0; i< eventHandles.length; i++) {
                const event = eventHandles[i];
                event(data, e);
            }
        }
    }

}