import { Tasks } from '../api/tasks.js';
import{App}from './App'
export function load({ filters, options }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
       var 

  
        if (filters.title) {
          myData = myData.filter(
            el => el.title.search(new RegExp(filters.title, "i")) > -1
          );
        }
        if (options && (options.skip || options.limit)) {
          resolve(myData.slice(options.skip, options.skip + options.limit));
        }
        resolve(myData);
      }, 50);
    });
  }
  
  export function count(filters) {
    return new Promise((resolve, reject) => {
      load({filters}).then(data => {
        resolve(data.length);
      })
    })
  }
  