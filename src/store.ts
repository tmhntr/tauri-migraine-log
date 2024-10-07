// import { createStore } from '@tauri-apps/plugin-store';
// // when using `"withGlobalTauri": true`, you may use
// // const { createStore } = window.__TAURI__.store;

// // create a new store or load the existing one
// const store = await createStore('store.bin', {
//   // we can save automatically after each store modification
//   autoSave: true,
// });

// // Set a value.
// await store.set('some-key', { value: 5 });

// // Get a value.
// const val = await store.get<{ value: number }>('some-key');
// console.log(val); // { value: 5 }

// // You can manually save the store after making changes.
// // Otherwise, it will save upon graceful exit as described above.
// await store.save();