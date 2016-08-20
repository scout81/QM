var APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhle-PX-nb9GK_a3z0Zv4hOFSP8mHeoaKe3Gws_KsFvX2pYf0/exec';

var USE_PROXY = true;

var Board = 'OPFLEvqH';

var List = {
    inSchool: [
        '5781353e2adfa093b77818bc', // List - 木櫃A
        '578277ca48b1999e7ec8e9b8', // List - 木櫃B
        '5780d6699daac89930dde53f', // List - 木櫃C
        '57812d4492e051d3bd9dbdd1', // List - 木櫃外
        '578f3cbf80ae36f057747cde'  // List - 校內晾曬中
    ],
    cupboardA: '5781353e2adfa093b77818bc',  // List - 木櫃A
    cupboardB:'578277ca48b1999e7ec8e9b8',   // List - 木櫃B
    cupboardC:'5780d6699daac89930dde53f',   // List - 木櫃C
    cupboardOut:'57812d4492e051d3bd9dbdd1', // List - 木櫃外
    drying: '578f3cbf80ae36f057747cde',     // List - 校內晾曬中
    pending: '5788f02751619a8ccafcd442',    // List - Pending
    completed: '5787bae25f65acee6fef6abd',  // List - Completed
    repair: '57812d761a3098af76c8b2be',     // List - 維修中
};

var Label = {
    borrowRec: '5787b74784e677fd368578df', // Label - 借用記錄
    repairRec: '5787b3e184e677fd36856b72', // Label - 維修記錄
    damaged: '5780d65784e677fd36737247',   // Label - 損壞
    broken: '5781209484e677fd3673e50a',    // Label - 不能使用
    cleaning: '5780d65784e677fd36737245',  // Label - 清洗中
    tent: '5780d7d084e677fd3673747b',      // Label - A字營
    yurt: '578277dd84e677fd367594b9',      // Label - 蒙古包
    tentpeg: '5781336184e677fd367404f3',   // Label - 營釘
    fly: '578131ea84e677fd36740230',       // Label - 天幕
    cookset: '5781327284e677fd36740338',   // Label - Cookset
    stove: '578136e584e677fd36740a0f',     // Label - 爐頭
    other: '578133eb84e677fd367405aa'      // Label - 其他
};

var ADMIN_EMAIL = 'm.jacky@gmail.com';
