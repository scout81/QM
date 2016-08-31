var APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhle-PX-nb9GK_a3z0Zv4hOFSP8mHeoaKe3Gws_KsFvX2pYf0/exec';

var USE_PROXY = true;
if (window.location.href.substring(0,4) == 'http' && localStorage.trelloLogin == 'Y') {
	USE_PROXY = false;
}

var Board = 'qdkuj3Bf';
var BoardId = '57b8179df74cb02ee3dc84ba';

var List = {
    inSchool: [
        '57b817c1e5efd79f06506e60', // List - 木櫃A
        '57b817da224f3da97c35f338', // List - 木櫃B
        '57b817ed2bb2d4e9636b2787', // List - 木櫃C
        '57b81800bebfde60691aa8e5', // List - 木櫃外
        '57b8181053a83691eca8821e'  // List - 校內晾曬中
    ],
    cupboardA: '57b817c1e5efd79f06506e60',  // List - 木櫃A
    cupboardB:'57b817da224f3da97c35f338',   // List - 木櫃B
    cupboardC:'57b817ed2bb2d4e9636b2787',   // List - 木櫃C
    cupboardOut:'57b81800bebfde60691aa8e5', // List - 木櫃外
    drying: '57b8181053a83691eca8821e',     // List - 校內晾曬中
    pending: '57b8183261eab17748dbf709',    // List - Pending
    completed: '57b81855a8eec91df124d236',  // List - Completed
    repair: '57b81822ac6ac7373ffc4171',     // List - 維修中
};

var Label = {
    borrowRec: '57b8186084e677fd36018d94', // Label - 借用記錄
    repairRec: '57b8186184e677fd36018d95', // Label - 維修記錄
    
    damaged: '57b817ce84e677fd36018cbd',   // Label - 損壞
    broken: '57b8180884e677fd36018d07',    // Label - 不能使用
    cleaning: '57bbc561c004a341318a3bf4',  // Label - 清洗中
    borrowed: '57c52b96b8eefda96da1ee97',  // Label - 借用中
    
    tent: '57b817e684e677fd36018ce8',      // Label - A字營
    yurt: '57b817e784e677fd36018cef',      // Label - 蒙古包
    tentpeg: '57b817e784e677fd36018cf1',   // Label - 營釘
    fly: '57b817e784e677fd36018cf0',       // Label - 天幕
    cookset: '57b817cc84e677fd36018cb4',   // Label - Cookset
    stove: '57b817cd84e677fd36018cb6',     // Label - 爐頭
    other: '57b817cd84e677fd36018cb5',     // Label - 其他

    tent_tent: '57c52bd05b80891e728cac78', // Label - A字營 (營)
    tent_pole: '57c52bd82a182e156b9da236', // Label - A字營 (營柱)
    tent_shelter: '57c52bc89c76af08f2609d79', // Label - A字營 (天幕)
    
    borrowProcess: '57c52ba114753d549c4ce185', // Label - 借用處理中
    active: '57c52babe243333e605e0cb9'     // Label - 進行中
};

//var ADMIN_EMAIL = 'scout81_leader@emaildodo.com';
var ADMIN_EMAIL = 'm.jacky@gmail.com';
