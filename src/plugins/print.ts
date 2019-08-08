// 打印类属性、方法定义
/* eslint-disable */
const Print: any = function (dom: any, options: any) {
  if (!(this instanceof Print)) return new Print(dom, options);

  this.options = this.extend({
    'noPrint': '.no-print'
  }, options);

  if ((typeof dom) === "string") {
    this.dom = document.querySelector(dom);
  } else {
    this.isDOM(dom)
    this.dom = this.isDOM(dom) ? dom : dom.$el;
  }

  this.init();
};
Print.prototype = {
  init: function () {
    var content: any = this.getStyle() + this.getHtml();
    this.writeIframe(content);
  },
  extend: function (obj: any, obj2: any) {
    for (var k in obj2) {
      obj[k] = obj2[k];
    }
    return obj;
  },

  getStyle: function () {
    var str: any = "",
      styles: any = document.querySelectorAll('style,link');
    for (var i: any = 0; i < styles.length; i++) {
      str += styles[i].outerHTML;
    }
    str += "<style>" + (this.options.noPrint ? this.options.noPrint : '.no-print') + "{display:none;}</style>";

    return str;
  },

  getHtml: function () {
    var inputs: any = document.querySelectorAll('input');
    var textareas: any = document.querySelectorAll('textarea');
    var selects: any = document.querySelectorAll('select');

    for (var k: any = 0; k < inputs.length; k++) {
      if (inputs[k].type == "checkbox" || inputs[k].type == "radio") {
        if (inputs[k].checked == true) {
          inputs[k].setAttribute('checked', "checked")
        } else {
          inputs[k].removeAttribute('checked')
        }
      } else if (inputs[k].type == "text") {
        inputs[k].setAttribute('value', inputs[k].value)
      } else {
        inputs[k].setAttribute('value', inputs[k].value)
      }
    }

    for (var k2: any = 0; k2 < textareas.length; k2++) {
      if (textareas[k2].type == 'textarea') {
        textareas[k2].innerHTML = textareas[k2].value
      }
    }

    for (var k3: any = 0; k3 < selects.length; k3++) {
      if (selects[k3].type == 'select-one') {
        var child: any = selects[k3].children;
        for (var i in child) {
          if (child[i].tagName == 'OPTION') {
            if (child[i].selected == true) {
              child[i].setAttribute('selected', "selected")
            } else {
              child[i].removeAttribute('selected')
            }
          }
        }
      }
    }

    return this.dom.outerHTML;
  },

  writeIframe: function (content: any) {
    var w: any, doc: any, iframe: any = document.createElement('iframe'),
      f: any = document.body.appendChild(iframe);
    iframe.id = "myIframe";
    //iframe.style = "position:absolute;width:0;height:0;top:-10px;left:-10px;";
    iframe.setAttribute('style', 'position:absolute;width:0;height:0;top:-10px;left:-10px;');
    w = f.contentWindow || f.contentDocument;
    doc = f.contentDocument || f.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();
    var _this: any = this
    iframe.onload = function(){
      _this.toPrint(w);
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 100)
    }
  },

  toPrint: function (frameWindow: any) {
    try {
      setTimeout(function () {
        frameWindow.focus();
        try {
          if (!frameWindow.document.execCommand('print', false, null)) {
            frameWindow.print();
          }
        } catch (e) {
          frameWindow.print();
        }
        frameWindow.close();
      }, 10);
    } catch (err) {
      console.log('err', err);
    }
  },
  isDOM: (typeof HTMLElement === 'object') ?
    function (obj: any) {
      return obj instanceof HTMLElement;
    } :
    function (obj: any) {
      return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    }
};
const MyPlugin: any = {}
MyPlugin.install = function (Vue: any, options: any) {
  // 4. 添加实例方法
  Vue.prototype.$print = Print;
}
export default MyPlugin
