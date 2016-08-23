var APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhle-PX-nb9GK_a3z0Zv4hOFSP8mHeoaKe3Gws_KsFvX2pYf0/exec';

var USE_PROXY = true;

var Board = 'qdkuj3Bf';

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
    tent: '57b817e684e677fd36018ce8',      // Label - A字營
    yurt: '57b817e784e677fd36018cef',      // Label - 蒙古包
    tentpeg: '57b817e784e677fd36018cf1',   // Label - 營釘
    fly: '57b817e784e677fd36018cf0',       // Label - 天幕
    cookset: '5781327284e677fd36740338',   // Label - Cookset
    stove: '57b817cd84e677fd36018cb6',     // Label - 爐頭
    other: '57b817cd84e677fd36018cb5'      // Label - 其他
};

var ADMIN_EMAIL = 'scout81_leader@emaildodo.com';
