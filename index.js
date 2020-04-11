'use strict';

var GeTui = require('gt-push-sdk/GT.push');
var Target = require('gt-push-sdk/getui/Target');
var BaseTemplate = require('gt-push-sdk/getui/template/BaseTemplate');
var TransmissionTemplate = require('gt-push-sdk/getui/template/TransmissionTemplate');
var AppMessage = require('gt-push-sdk/getui/message/AppMessage');


var APNTemplate = require('gt-push-sdk/getui/template/APNTemplate');


var APNPayload = require('gt-push-sdk/payload/APNPayload');
var AlertMsg = require('gt-push-sdk/payload/AlertMsg');


var NotificationTemplate = require('gt-push-sdk/getui/template/NotificationTemplate');
// http的域名
var HOST = 'http://sdk.open.api.igexin.com/apiex.htm';

//https的域名
// var HOST = 'https://api.getui.com/apiex.htm';

//定义常量, appId、appKey、masterSecret 采用本文档 "第二步 获取访问凭证 "中获得的应用配置
 

var APPID = 'iYL8wf8rlJ6UY9dv6rpjq4';
var APPKEY = 'JUqYCqINyhApUuuZgzCZJ3';            
var MASTERSECRET = '3tYtDZY93S7mhfjiaHLUs2';    

var gt = new GeTui(HOST, APPKEY, MASTERSECRET);

pushMessageToApp();


function pushMessageToApp() {
    // var taskGroupName = 'test';
    var taskGroupName = '';
    // 定义"点击链接打开通知模板"，并设置透传内容，透传形式
    var template = TransmissionTemplateDemo();

    console.log(template);

    //定义"AppMessage"类型消息对象，设置消息内容模板、发送的目标App列表、是否支持离线发送、以及离线消息有效期(单位毫秒)
    var message = new AppMessage({
        isOffline: true,
        offlineExpireTime: 3600 * 12 * 1000,
        data: template,
        appIdList: [APPID],
//        phoneTypeList: ['IOS'],
//        provinceList: ['浙江'],
        //tagList: ['阿百川']
        speed: 10000
    });

    gt.pushMessageToApp(message, taskGroupName, function (err, res) {
        console.log(res);
    });
}
function TransmissionTemplateDemo() {



    // var alertMsg = new AlertMsg({
    //     alertMsg: 'sdfadsf'
    // });


    // console.log(alertMsg, 'alertMsg');
    var apnpayload = new APNPayload();
    
    apnpayload.alertMsg = new AlertMsg("asdfasdfff2223");

    var template =  new TransmissionTemplate({
        appId: APPID,
        // appKey: APPKEY,
        appkey: APPKEY,
        transmissionType: 2,
        transmissionContent: '测试测试',
        setAPNInfo: apnpayload
    });

    // template.setAPNInfo(apnpayload);

    // var apnTemplate = new 
    // var template = new APNTemplate({
    //     setAppID: APPID,
    //     setAppkey: APPKEY,
    //     appkey: APPKEY,
    //     appId: APPID,
    //     setDuration: 3600 * 12 * 1000,
    //     setAPNInfo: apnpayload
    // }); 

//     setAppID	String		是		设定接收的应用
// setAppkey	String		是		用于鉴定身份是否合法
// setDuration	String		否		收到消息的展示时间 (格式yyyy-MM-dd HH:mm:ss)
// setAPNInfo			否		iOS推送使用该字段，详见iOS模板说明


    // var template = new NotificationTemplate({
    //     appId: APPID,
    //     // appKey: APPKEY,
    //     appkey: APPKEY,
    //     title: '请填写通知标题7',
    //     text: '请填写通知内容7',
    //     isRing: true,
    //     isVibrate: true,
    //     isClearable: false,
    //     transmissionType: 2,
    //     transmissionContent: '测试离线'
    // });

    return template;
}