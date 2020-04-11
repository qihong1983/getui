'use strict';

var GeTui = require('gt-push-sdk/GT.push');
var Target = require('gt-push-sdk/getui/Target');

var APNTemplate = require('gt-push-sdk/getui/template/APNTemplate');
var BaseTemplate = require('gt-push-sdk/getui/template/BaseTemplate');
var APNPayload = require('gt-push-sdk/payload/APNPayload');
var DictionaryAlertMsg = require('gt-push-sdk/payload/DictionaryAlertMsg');
var SimpleAlertMsg = require('gt-push-sdk/payload/SimpleAlertMsg');
var NotyPopLoadTemplate = require('gt-push-sdk/getui/template/NotyPopLoadTemplate');
var LinkTemplate = require('gt-push-sdk/getui/template/LinkTemplate');
var NotificationTemplate = require('gt-push-sdk/getui/template/NotificationTemplate');
var PopupTransmissionTemplate = require('gt-push-sdk/getui/template/PopupTransmissionTemplate');
var TransmissionTemplate = require('gt-push-sdk/getui/template/TransmissionTemplate');

var SingleMessage = require('gt-push-sdk/getui/message/SingleMessage');
var AppMessage = require('gt-push-sdk/getui/message/AppMessage');
var ListMessage = require('gt-push-sdk/getui/message/ListMessage');
var Notify = require('gt-push-sdk/getui/template/notify/Notify');

var HOST = 'http://sdk.open.api.igexin.com/apiex.htm';
//消息推送Demo   for apns 通道下发。
//在线走个推通道下发，需要客户端在透传回调处接收到后自己实现通知栏展示
//离线走apns通道下发，消息会直接展示的(1.客户端通知设置打开；2.检查客户端cid与devicetoken是否绑定。)



var APPID = 'iYL8wf8rlJ6UY9dv6rpjq4';
var APPKEY = 'JUqYCqINyhApUuuZgzCZJ3';            
var MASTERSECRET = '3tYtDZY93S7mhfjiaHLUs2';  
var CID = '';
var DEVICETOKEN='';
var alias='';

var gt = new GeTui(HOST, APPKEY, MASTERSECRET);
//getUserStatus();
// pushMessageToSingle();
//pushMessageToSingleBatch();
//pushMessageToList();
   pushMessageToApp();
//    stoptask();
//    setClientTag();

//别名绑定操作
//aliasBind();
//queryCID();
//queryAlias();
//aliasBatch();
//    aliasUnBind();
//    aliasUnBindAll();

//结果查询操作
getResultDemo();

function getResultDemo(){
    gt.queryAppPushDataByDate(APPID,"20150525",function(err, res){
        console.log(res);
    });
    //gt.getPushResult("",)
    //console.log( gt.queryAppUserDataByDate(APPID,"20150525",res));


}


//推送任务停止
function stoptask() {
    gt.stop('taskId', function (err, res) {
        console.log(res);
    });
}
function setClientTag() {
    gt.setClientTag(APPID, CID, ['aa','哔哔','》？》','！@#￥%……&*（）'], function (err, res) {
        console.log(res);
    })
}
function getUserStatus() {
    gt.getClientIdStatus(APPID, CID, function (err, res) {
        console.log(res);
    });
}

function pushMessageToSingle() {
    var template = TransmissionTemplateDemo();
//    var template = LinkTemplateDemo();
//    var template = NotificationTemplateDemo();
//    var template = NotyPopLoadTemplateDemo();

    //个推信息体
    var message = new SingleMessage({
        isOffline: true,                        //是否离线
        offlineExpireTime: 3600 * 12 * 1000,    //离线时间
        data: template                          //设置推送消息类型
    });

    //接收方
    var target = new Target({
        appId: APPID,
        clientId: CID
//        alias:'_lalala_'
    });
    //target.setAppId(APPID).setClientId(CID);

    try {
        gt.pushMessageToSingle(message, target, function (err, res) {
            console.log("demo print", res);
        });
    }catch(e){
        if(e instanceof RequestError){
            gt.pushMessageToSingle(message, target, e.requestId, function (err, res) {
                console.log("demo print", res);
            });
        }
        console.log(e)
    }

}
function pushMessageToSingleBatch() {
    process.env.gexin_pushSingleBatch_needAsync=true;
    var Batch=gt.getBatch();

    var template = TransmissionTemplateDemo();
//    var template = LinkTemplateDemo();
//    var template = NotificationTemplateDemo();
//    var template = NotyPopLoadTemplateDemo();

    //个推信息体
    var message = new SingleMessage({
        isOffline: true,                        //是否离线
        offlineExpireTime: 3600 * 12 * 1000,    //离线时间
        data: template                          //设置推送消息类型
    });

    //接收方
    var target = new Target({
        appId: APPID,
        clientId: CID
//        alias:'_lalala_'
    });
    Batch.add(message,target);

    Batch.submit(function (err, res) {
        if(err != null){
            Batch.retry(function (err, res) {
                console.log("demo batch retry", res);
            });
        }
        console.log("demo batch submit", res);
    });

}

function pushMessageToList() {
    //process.env.gexin_pushList_needDetails = true;
    process.env.gexin_pushList_needAsync=true;
    //process.env.=true;
    // var taskGroupName = 'test';
    var taskGroupName = "toList任务组名";

    //消息类型 :状态栏链接 点击通知打开网页
    var template = LinkTemplateDemo();

    //个推信息体
    var message = new ListMessage({
        isOffline: true,
        offlineExpireTime: 3600 * 12 * 1000,
        data: template
    });

    gt.getContentId(message, taskGroupName, function (err, res) {
        var contentId = res;
        //接收方1
        var target1 = new Target({
            appId: APPID,
            clientId: CID
//            alias:'_lalala_'
        });

        var targetList = [target1];
//        gt.needDetails = true;

        console.log("getContentId", res);
        gt.pushMessageToList(contentId, targetList, function (err, res) {
            console.log(res);
        });
    });
}

function pushMessageToApp() {
    // var taskGroupName = 'test';
    var taskGroupName = null;

    //消息类型 : 状态栏通知 点击通知启动应用
    // var template = NotificationTemplateDemo();
    var template = TransmissionTemplateDemo();

    

    //个推信息体
    //基于应用消息体
    var message = new AppMessage({
        isOffline: false,
        offlineExpireTime: 3600 * 12 * 1000,
        data: template,
        appIdList: [APPID]
//        phoneTypeList: ['IOS'],
//        provinceList: ['浙江'],
        //tagList: ['阿百川']
//        speed: 1
    });


    // gt.getContentId(message, taskGroupName, function (err, res) {
    //     console.log(err, res, 'err, res');
    // });

    gt.pushMessageToApp(message, taskGroupName, function (err, res) {
        console.log(err,res, 'resres');
    });
}

//消息模版：
// 1.TransmissionTemplate:透传功能模板
// 2.LinkTemplate:通知打开链接功能模板
// 3.NotificationTemplate：通知透传功能模板
// 4.NotyPopLoadTemplate：通知弹框下载功能模板

function NotyPopLoadTemplateDemo() {
    var template = new NotyPopLoadTemplate({
        appId: APPID,
        appKey: APPKEY,
        notyTitle: '个推',
        notyContent: '个推最新版点击下载',
        notyIcon: 'http://wwww.igetui.com/logo.png',    // 通知栏logo
        isRing: true,
        isVibrate: true,
        isClearable: true,
        popTitle: '弹框标题',
        setPopContent: '弹框内容',
        popImage: '',
        popButton1: '下载',                             // 左键
        popButton2: '取消',                             // 右键
        loadIcon: 'http://www.photophoto.cn/m23/086/010/0860100017.jpg', // 弹框图片
        loadUrl: 'http://dizhensubao.igexin.com/dl/com.ceic.apk',
        loadTitle: '地震速报下载',
        autoInstall: false,
        actived: true
    });
    return template;
}

function LinkTemplateDemo() {
    var template = new LinkTemplate({
        appId: APPID,
        appKey: APPKEY,
        title: '个推',
        text: '个推最新版点击下载',
        logo: 'http://wwww.igetui.com/logo.png',
        logoUrl: 'https://www.baidu.com/img/bdlogo.png',
        isRing: true,
        isVibrate: true,
        isClearable: true,
        url: 'http://www.igetui.com'
    });

    return template;
}

function NotificationTemplateDemo() {
    var template = new NotificationTemplate({
        appId: APPID,
        appKey: APPKEY,
        title: '234234',
        text: 'f2323',
        logo: 'https://ask.dcloud.net.cn/account/identicon/8fce0ca3c812afce8e43c8cbba769a75.png',
        isRing: true,
        isVibrate: true,
        isClearable: true,
        transmissionType: 2,
        transmissionContent: '测试离线'
    });
    return template;
}

function TransmissionTemplateDemo() {
    var template =  new TransmissionTemplate({
        appId: APPID,
        appKey: APPKEY,
        transmissionType: 2,
        transmissionContent: '离线内容9'
    });
    //APN简单推送
//     var payload = new APNPayload();
//     var alertMsg = new SimpleAlertMsg();
//     // var alertMsg = new DictionaryAlertMsg();
//     alertMsg.alertMsg={"title": "测试5", "body": "测试测试5"};
//     // alertMsg.alertMsg={"title": "测试3", "body": "con32tent4"};
// //        alertMsg.title = "Title1";
// //    alertMsg.titleLocKey = "TitleLocKey123";
// //    alertMsg.titleLocArgs = Array("TitleLocArg323");
//     payload.alertMsg = alertMsg;
//     payload.badge=5;
//     payload.contentAvailable =0;
//     payload.category="";
//     payload.sound="";
//     //payload.customMsg.payload1="";
//     template.setApnInfo(payload);

    //APN高级推送
    var payload = new APNPayload();
    var alertMsg = new DictionaryAlertMsg();
    alertMsg.body = "测试内容4";
    alertMsg.actionLocKey = "actionLocKey";
    alertMsg.locKey = "locKey";
    alertMsg.locArgs = Array("locArgs");
    alertMsg.launchImage = "AppIcon";
    //ios8.2以上版本支持
    alertMsg.title = "测试4";
    alertMsg.titleLocKey = "titleLocKey";
    alertMsg.titleLocArgs = Array("titleLocArgs");
    
    payload.alertMsg=alertMsg;
    payload.badge=11;
   payload.contentAvailable =1;
   payload.category="";
   payload.sound="";
   payload.customMsg.payload1="payload";
   template.setApnInfo(payload);
    return template;
}

function aliasBind() {
    gt.bindAlias(APPID, alias, CID, function(err, res) {
        console.log(res);
    });
}

function aliasBatch() {
//    var target = new Target()
//        .setClientId(CID)
//        .setAlias('_lalala_');
    var target2 = new Target({
        alias: alias,
        clientId: CID
    });
    var targetList = [target2];
    gt.bindAlias(APPID, targetList, function(err, res) {
        console.log(res);
    });
}



function queryCID() {
    gt.queryClientId(APPID, alias, function(err, res) {
        console.log(res, 'queryCID');
    });
}

function queryAlias() {
    gt.queryAlias(APPID, CID, function(err, res) {
        console.log(res);
    });
}

function aliasUnBind() {
    gt.unBindAlias(APPID, alias, CID, function(err, res) {
        console.log(res);
    });
}

function aliasUnBindAll() {
    gt.unBindAlias(APPID, alias, function(err, res) {
        console.log(res);
    });
}