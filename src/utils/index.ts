import { assert } from "console";
import moment from "moment";
import { VideoParseInfo } from "../types";

export function getToken(): string {
  return window.localStorage.getItem("playedu-backend-token") || "";
}

export function setToken(token: string) {
  window.localStorage.setItem("playedu-backend-token", token);
}

export function clearToken() {
  window.localStorage.removeItem("playedu-backend-token");
}

export function dateFormat(dateStr: string) {
  return moment(dateStr).format("YYYY-MM-DD HH:mm");
}

export function generateUUID(): string {
  let guid = "";
  for (let i = 1; i <= 32; i++) {
    let n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    if (i === 8 || i === 12 || i === 16 || i === 20) guid += "-";
  }
  return guid;
}

export function transformBase64ToBlob(
  base64: string,
  mime: string,
  filename: string
): File {
  const arr = base64.split(",");
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function parseVideo(file: File): Promise<VideoParseInfo> {
  return new Promise((resolve, reject) => {
    let video = document.createElement("video");
    video.muted = true;
    video.setAttribute("src", URL.createObjectURL(file));
    video.setAttribute("autoplay", "autoplay");
    video.setAttribute("crossOrigin", "anonymous"); //设置跨域 否则toDataURL导出图片失败
    video.setAttribute("width", "400"); //设置大小，如果不设置，下面的canvas就要按需设置
    video.setAttribute("height", "300");
    video.currentTime = 7; //视频时长，一定要设置，不然大概率白屏
    video.addEventListener("loadeddata", function () {
      let canvas = document.createElement("canvas"),
        width = video.width, //canvas的尺寸和图片一样
        height = video.height;
      canvas.width = width; //画布大小，默认为视频宽高
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject("无法捕获视频帧");
      }
      ctx.drawImage(video, 0, 0, width, height); //绘制canvas
      let dataURL = canvas.toDataURL("image/png"); //转换为base64
      video.remove();
      let info: VideoParseInfo = {
        poster: dataURL,
        duration: parseInt(video.duration + ""),
      };
      return resolve(info);
    });
  });
}

export function getHost() {
  return window.location.protocol + "//" + window.location.host + "/";
}

export function inStrArray(array: string[], value: string): boolean {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return true;
    }
  }
  return false;
}

export function ValidataCredentials(value: any) {
  let regIdCard =
    /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  if (regIdCard.test(value)) {
    if (value.length === 18) {
      var idCardWi = new Array(
        7,
        9,
        10,
        5,
        8,
        4,
        2,
        1,
        6,
        3,
        7,
        9,
        10,
        5,
        8,
        4,
        2
      ); //将前17位加权因子保存在数组里
      var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
      var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
      for (var i = 0; i < 17; i++) {
        idCardWiSum += value.substring(i, i + 1) * idCardWi[i];
      }
      var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
      var idCardLast = value.substring(17); //得到最后一位身份证号码
      //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
      if (idCardMod === 2) {
        if (idCardLast === "X" || idCardLast === "x") {
          return true;
        } else {
          return false;
        }
      } else {
        //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
        if (idCardLast === idCardY[idCardMod]) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}
