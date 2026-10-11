import { useRef } from 'react';
export default function Reader() {
  const dialog = useRef(null);
  return <main>
    <h1>Reading room</h1>
    <p>A small online-first example. Read and select this text, resize it, or zoom the page. It does not store private content or promise offline access.</p>
    <label htmlFor="note">Practice note (not saved)</label>
    <input id="note" name="note" autoComplete="off" />
    <button type="button" onClick={() => dialog.current.showModal()}>About this example</button>
    <dialog ref={dialog} aria-labelledby="dialog-title">
      <h2 id="dialog-title">About the reading room</h2>
      <p>This dialog uses the browser platform. Press Escape or choose Close to return to the reading page.</p>
      <form method="dialog"><button>Close</button></form>
    </dialog>
  </main>;
}
