
"use strict";


import { urlEncode } from "./urlEncode.js";




export const updateUrl = (filterObj, searchType) => {
  setTimeout(() => {
    const root = window.location.origin;
    const searchQuery = urlEncode(filterObj);

    window.location = `${root}/search?type=${searchType}&${searchQuery}`;
  }, 500);
};