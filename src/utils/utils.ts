import store from "@/store";
import axios from "axios";

export default {
  //处理子节点为空的数据，将子节点删除
  removeEmptyChildren(data: any) {
    // console.log(data);
    data.forEach((item: any) => {
      if (item.children && item.children.length) {
        this.removeEmptyChildren(item.children);
      } else {
        item.children = null;
      }
    });
  },
  //返回数组的最后一个元素
  lastOfArr(arr: any) {
    if (arr.length > 0) {
      return arr[arr.length - 1];
    }
    return null;
  },
  //将数据库返回的自定义信息转换成el格式
  convertFromExtInfoVO(extInfoVO: any) {
    if (extInfoVO) {
      extInfoVO.forEach((item: any) => {
        switch (item.attrType) {
          case "multiSelect":
            item.value = item.value ? item.value.split(",") : "";
            break;
          case "image":
            item.value = item.value ? JSON.parse(item.value) : [];
        }
        item.dataRange = JSON.parse(item.dataRange);
      });
    }
  },
  //将el格式自定义数据转换成数据库格式
  convertToExtInfo(extInfoVO: any) {
    extInfoVO.forEach((item: any) => {
      switch (item.attrType) {
        case "multiSelect":
          item.value = item.value.toString();
          break;
        case "image":
          //处理上传图片
          item.value = JSON.stringify(item.value);
          // item.value.forEach((file: any) => {
          //   file = {
          //     name: file.response.data.fileName,
          //     url: file.response.data.accessUrl
          //   };
          // });
          break;
      }
    });
  },
  // 删除数组指定元素
  removeArrItemByValue(arr: any, value: any) {
    let idx = arr.indexOf(value);
    arr.splice(idx, 1);
  },
  //组装图片上传form
  createUploadForm(file: any) {
    let res = {
      config: {
        headers: {
          accessToken: "Bearer " + store.getters[`getToken`],
          "Content-Type": "multipart/form-data"
        }
      },
      formData: {}
    }; //添加请求头
    let formData = new FormData();
    formData.append("file", file);
    res.formData = formData;
    return res;
  },
  //合并对象
  mapValue(obj: any, data: any) {
    for (let i in data) {
      // if (i in obj) {
        obj[i] = data[i];
      // }
    }
  }
};
