/* SPDX-License-Identifier: GPL-3.0-or-later */
import {suggestPins} from './pin-solver.mjs';
self.onmessage=({data})=>{
 try{self.postMessage({id:data.id,result:suggestPins(data.board,data.requests,data.pins,data.options)});}
 catch{self.postMessage({id:data.id,error:true});}
};
