const EVENT_NAME = "onEditorChange";

export function dispatchEditorChanges() {
  const event = new Event(EVENT_NAME);
  document.dispatchEvent(event);
}

export function subscribeEditorChanges(listener: () => void) {
  document.addEventListener(EVENT_NAME, listener);
}

export function unsubscribeEditorChanges(listener: () => void) {
  document.removeEventListener(EVENT_NAME, listener);
}
