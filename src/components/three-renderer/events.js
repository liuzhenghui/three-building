
export const Events = {
    Export: 'Three_Event_Export',
    Import: 'Three_Event_Import',
    Clear: 'Three_Event_Clear',
}

export function addEventListener(eventName, callback) {
    window.addEventListener(eventName, e => {
        console.log('ThreeEvent Listener', eventName, e.detail)
        if (typeof callback === 'function') {
            callback(e.detail)
        }
    })
}

export function dispatchEvent(eventName, data) {
    let event = new CustomEvent(eventName, {
        detail: data
    })
    window.dispatchEvent(event)
}