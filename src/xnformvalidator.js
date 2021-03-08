//! XNColorPicker.js
//！ 仙女颜色选择器
//! https://github.com/fanaiai/xnNumberTurner
//! version : 1.0.0
//! authors : 范媛媛
//! create date:2021/03/05
//! update date:2021/03/05 发布
function dynamicLoadCss(urllist) {
    for (let i = 0; i < urllist.length; i++) {
        let url = urllist[i];
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
    }
}

var scripts = document.getElementsByTagName("script")
var script = scripts[scripts.length - 1];
var s = document.querySelector ? script.src : script.getAttribute("src", 4)//IE8直接.src
var csspath = s.substr(0, s.lastIndexOf('/') - 0);
var csslist = ["//at.alicdn.com/t/font_2330183_hjqs7adohe.css"]
dynamicLoadCss(csslist);
import './xnquery.js'
import './xnnumberturner.css'

(function (window, $) {
    var option = {
        css: {
            height: 40,
            backgroundColor: '#efefef',
            borderColor: 'red',
            borderWidth: 1,
            borderStyle: 'solid',
            backgroundImage: '',
            backgroundSize: 'auto',
            width: 30,
            textAlign: 'center',
            marginRight: 4,
            borderRadius: 4,
            fontSize: 22,
            fontFamily: 'fantasy',
            color: '#11ccdd'
        },
        animate: {
            type: 'linerUp',//
            // linerUp：匀速向上翻转，sameTimeUp：总时间相同向上翻转，linerChange:匀速数字变化，sameTimeChange:总时长相同数字变化,easyChange
            speedTimeLength: 2,
            sleepTime: 10,
            totalTime: 1000,//总时长
        }
    }

    function XNFormValidator(dom, options) {
        this.option = $.extend({}, option, options);
        this.dom = dom;
        this.arry = String(this.option.number).split('').reverse();
        this.currentNumber=0;
        this.easyChange()
    }

    XNFormValidator.prototype = {
        init: function () {
            this.dom.innerHTML = '';
            var cont = document.createElement('div');
            cont.classList.add('xnnumbertruner');
            var innerHtml = '';
            var numberlist = '';
            for (let i = 0; i < 10; i++) {
                numberlist += `<p class="number${i} ${i == 0 ? 'current-number' : ''}">${i}</p>`
            }
            for (let i = 0; i < this.arry.length; i++) {
                let t = numberlist;
                if (!$.isNumber(this.arry[i])) {
                    t = `<p>${this.arry[i]}</p>`;
                }
                innerHtml += `
        <div class="number-turner-item" data-key="${i}"><div>${t}</div></div>
        `
            }
            cont.innerHTML = innerHtml;
            this.dom.appendChild(cont);
            for (let i = 0; i < this.arry.length; i++) {
                this.turnNumber(this.arry[i], i)
            }
            this.dom.querySelectorAll('.number-turner-item').forEach((ele) => {
                $.setCss(ele, this.option)
            })
        },
        easyChange(){
            this.dom.innerHTML = '';
            var cont = document.createElement('div');
            cont.classList.add('xnnumbertruner');
            this.dom.appendChild(cont);
            this.easyChangeturnAnimate(cont,this.option.number)
        },
        easyChangeturnAnimate(cont,totalnumber){
            let step = parseInt(totalnumber*20 / this.option.animate.totalTime);
            var currentNumber=this.currentNumber;
            let interval = window.setInterval(() => {
                currentNumber+=step;
                var innerHtml = '';
                let arry=String(currentNumber).split('')
                for (let i = 0; i < arry.length; i++) {
                    let t = `<p>${arry[i]}</p>`;
                    innerHtml += `
        <div class="number-turner-item" data-key="${i}"><div>${t}</div></div>
        `
                }
                cont.innerHTML = innerHtml;
                if (currentNumber >= this.option.number) {
                    clearInterval(interval)
                }
            }, 20)
            this.dom.querySelectorAll('.number-turner-item').forEach((ele) => {
                $.setCss(ele, this.option)
            })
        },
        sameTimeUp() {

        },
        turnNumber(dirnum, key) {
            if (!$.isNumber(dirnum)) {
                return;
            }
            let dom = this.dom.querySelector(".number-turner-item[data-key='" + key + "']>div")
            let currentIndex = parseInt(dom.querySelector(".current-number").innerHTML);
            let turnStep = currentIndex - dirnum;
            let dir = turnStep > 0 ? 1 : -1;
            this.sameTimeUpturnAnimate(dom, turnStep, currentIndex, dir, dirnum);
        },
        turnAnimate(dom, turnStep, currentIndex, dir, dirnum) {
            if (currentIndex == dirnum) {
                return;
            }
            window.setTimeout(() => {
                let curheight = 0
                let interval = window.setInterval(() => {
                    dom.style.top = parseInt(dom.style.top || 0) + dir + 'px';
                    curheight++;
                    if (curheight >= this.option.css.height) {
                        clearInterval(interval)
                        currentIndex -= dir;
                        if (currentIndex != dirnum) {
                            this.turnAnimate(dom, turnStep, currentIndex, dir, dirnum);
                        } else {
                            dom.querySelector(".current-number").classList.remove("current-number");
                            dom.querySelector(".number" + dirnum).classList.add("current-number")
                        }
                    }
                }, this.option.animate.speedTimeLength)

            }, this.option.animate.sleepTime)
        },
        sameTimeUpturnAnimate(dom, turnStep, currentIndex, dir, dirnum) {
            if (currentIndex == dirnum) {
                return;
            }
            let curheight = 0;
            let dirHeight = (Math.abs(turnStep) * this.option.css.height);
            let speed = this.option.animate.totalTime / dirHeight;
            let interval = window.setInterval(() => {
                dom.style.top = parseInt(dom.style.top || 0) + dir + 'px';
                curheight++;
                if (curheight >= dirHeight) {
                    clearInterval(interval)
                    dom.querySelector(".current-number").classList.remove("current-number");
                    dom.querySelector(".number" + dirnum).classList.add("current-number")
                }
            }, speed)
        },
        updateNumber(number) {
            let newArry = String(number).split('');
            if (newArry.length != this.arry.length) {
                this.arry = newArry;
                this.init(newArry);
                return;
            }
            for (let i = 0; i < newArry.length; i++) {
                this.turnNumber(newArry[i], i)
            }
        },


    }
    window.XNFormValidator = XNFormValidator;
})(window, XNQuery)
