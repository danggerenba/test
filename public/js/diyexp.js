

var style = document.createElement('style');
style.textContent = '@media print { body { display: none; } }';
document.head.appendChild(style);

bodycopy = true;  //复制
resultvip=true;  // 粘贴

/**
 * 图片路径转成canvas
 * @param {图片url} url
 */
// console.log=function(){}
$(document).ready(function() {
    var lastOption;

    // 判断设备类型
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

    // 如果是电脑设备，执行电脑设备的代码
    if (!isMobile) {
        var lastOption;
        $(document).on('mouseup', function(e) {
            var selectedText = document.getSelection().toString();
            if (selectedText) {
                var x = e.pageX;
                var y = e.pageY;
                var option = $('<div>').text('收藏').addClass('collect-option');
                option.css({
                    'position': 'absolute',
                    'left': x + 'px',
                    'top': y + 'px',
                    'padding': '5px',
                    'background-color': '#fff',
                    'border': '1px solid #ccc',
                    'border-radius': '3px',
                    'cursor': 'pointer'
                });
                option.on('click', function() {
                    var savedData = localStorage.getItem($.cookie('kj'));
                    var newData = savedData ? savedData + '\n' + JSON.stringify(selectedText) : JSON.stringify(selectedText);
                    localStorage.setItem($.cookie('kj'), newData);
                    option.remove();
                });
                $('body').append(option);
                if (lastOption) {
                    lastOption.remove();
                }
                lastOption = option;
            } else {
                if (lastOption && !$(e.target).hasClass('collect-option')) {
                    lastOption.remove();
                    lastOption = null;
                }
            }
        });


    }
    // 如果是手机设备，执行手机设备的代码
    else {

        var lastOption;
        $('body').on('mousedown touchstart', function(e) {
            var selectedText = document.getSelection().toString();
            if (selectedText) {
                var x = e.pageX || e.touches[0].pageX;
                var y = e.pageY || e.touches[0].pageY;
                var option = $('<div>').text('收藏').addClass('collect-option');
                option.css({
                    'position': 'absolute',
                    'left': x + 'px',
                    'top': y + 'px',
                    'padding': '5px',
                    'background-color': '#fff',
                    'border': '1px solid #ccc',
                    'border-radius': '3px',
                    'cursor': 'pointer'
                });
                option.on('click touchstart', function() {
                    var savedData = localStorage.getItem($.cookie('kj'));
                    var newData = savedData ? savedData + '\n' + JSON.stringify(selectedText) : JSON.stringify(selectedText);
                    localStorage.setItem($.cookie('kj'), newData);
                    option.remove();
                });
                $('body').append(option);
                if (lastOption) {
                    lastOption.remove();
                }
                lastOption = option;
            }
        }).on('touchmove', function() {
            if (lastOption) {
                lastOption.remove();
                lastOption = null;
            }
        });
    }

});

async function imgToCanvas(url) {
    // 创建img元素
    const img = document.createElement("img");
    img.src = url;
    img.setAttribute("crossOrigin", "anonymous"); // 防止跨域引起的 Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
    await new Promise((resolve) => (img.onload = resolve));
    // 创建canvas DOM元素，并设置其宽高和图片一样
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    // 坐标(0,0) 表示从此处开始绘制，相当于偏移。
    canvas.getContext("2d").drawImage(img, 0, 0);
    return canvas;
}

//画布添加水印
const drawWaterMark = (canvas, textArray) => {
    const ctx = canvas.getContext("2d");
    let wmConfig = {
        font: 'microsoft yahei',
        textArray: textArray,
        density: 2 //水印间距
    }
    let fontSize = 8;
    let imgWidth = canvas.width;
    let imgHeight = canvas.height;

    ctx.fillStyle = "red";
    ctx.font = `${fontSize}px ${wmConfig.font}`;
    ctx.lineWidth = 1;
    ctx.fillStyle = "#e1e1e1";//导出图片水印颜色
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    // //文字坐标
    const maxPx = Math.max(imgWidth, imgHeight);
    const stepPx = Math.floor(maxPx / wmConfig.density);
    let arrayX = [0];//初始水印位置 canvas坐标 0 0 点
    while (arrayX[arrayX.length - 1] < maxPx / 2) {

        arrayX.push(arrayX[arrayX.length - 1] + stepPx);
    }
    arrayX.push(...arrayX.slice(1, arrayX.length).map((el) => {

        return -el;
    }));

    for (let i = 0; i < arrayX.length; i++) {

        for (let j = 0; j < arrayX.length; j++) {

            ctx.save();
            ctx.translate(imgWidth / 2, imgHeight / 2); ///画布旋转原点 移到 图片中心
            ctx.rotate(-Math.PI / 5);
            if (wmConfig.textArray.length > 3) { //最多显示三行水印，也可以根据需要自定义
                wmConfig.textArray = wmConfig.textArray.slice(0, 3);
            }
            wmConfig.textArray.forEach((el, index) => {
                let offsetY = fontSize * index + 2;
                ctx.fillText(el, arrayX[i], arrayX[j] + offsetY);
            });
            ctx.restore();
        }
    }
};


/**
 * canvas转成img
 * @param {canvas对象} canvas
 */
function convasToImg(canvas) {
    // 新建Image对象，可以理解为DOM
    var image = new Image();
    // canvas.toDataURL 返回的是一串Base64编码的URL
    // 指定格式 PNG
    image = canvas.toDataURL("image/png");
    return image;
}

// 加水印运行示例
async function run(imgdata64) {
    // alert(imgdata64)
    // console.log(imgdata64)

    const imgUrl = imgdata64;
    // 1.图片路径转成canvas
    const tempCanvas = await imgToCanvas(imgUrl);
    // 2.canvas添加水印
    drawWaterMark(tempCanvas, ['这里是水印'])

    // 3.canvas转成img

    imgbasedata = convasToImg(tempCanvas);
    // console.log(imgbasedata)
    return  imgbasedata

    // document.body.appendChild(img);
    //     console.log(imgtest)
}

// var demoimg=
// console.log(demoimg);



(function () {
    var oldData;
    var html = '';
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

    html += '<a href="" class="diy baocun" data-type="json">保存数据</a>';
    html += '<a href="" class="diy export" data-type="svg">勾画导图</a>';
    html += '<a href="" class="diy export" data-type="png">导出png</a>';
    html += '<a class="diy" onclick="openNoteInput()" style="cursor: pointer;">切换笔记</a>';
    html += '<a href="" class="diy export" data-type="json">导出数据</a>',
    html += `
            <div class="diy">
                <label class="input" style="font-weight:normal;cursor:pointer;">
                    导入数据
                    <input type="file" id="fileInput" accept=".km,.txt,.md,.json" style="display:none">
                </label>
            </div>
        `;
    html += '<a href="javascript:void(0)" class="diy qkdata" data-type="pdf">清空数据</a>';

    $('.editor-title').append(html);

    $(".daochu").click(function(){
        alert('请加左边微信号领取');
    });

    $('.diy').css({
        // 'height': '30px',
        // 'line-height': '30px',
        'margin-top': '0px',
        'float': 'right',
        'background-color': '#fff',
        'min-width': '60px',
        'text-decoration': 'none',
        color: '#999',
        'padding': '0 10px',
        border: 'none',
        'border-right': '1px solid #ccc',
    });
    $('.input').css({
        'overflow': 'hidden',
        'position': 'relative',
    }).find('input').css({
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'inline-block',
        opacity: 0
    });


    $(".qkdata").click(function(){
        var result = window.confirm("警告:点击确定会清空您的本页导图笔记 还原到初始导图笔记 请再次确认是否已经把笔记导出备份 ");
        if(result ==true){

            let url = window.location.href;
            var namevar=location.search.split("=")[1];
            if(typeof namevar == 'undefined'){
                str = urls.split("/").pop();
                namevar=str.substring(0, str.indexOf('.'))
            }


            try {
                localStorage.removeItem('数据'+namevar)
                alert('已清空 请刷新')
            } catch(e) {
                alert('存储空间快用完了')
            }


        }
        else{
            alert("你选择了取消");
        }

    });

    window.addEventListener('keydown', function (e) {
        // alert(1)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();  // 阻止默认的保存行为
            document.querySelector('.baocun').click();  // 触发保存数据按钮的点击事件
        }
    });




    $(document).on('click', '.baocun', function (event) {
        event.preventDefault();
        var $this = $(this),
            type = $this.data('type'),
            exportType;
        switch (type) {
            case 'km':
                exportType = 'json';
                break;
            case 'md':
                exportType = 'markdown';
                break;
            case 'svg':
                exportType = 'svg';
                break;
            case 'txt':
                exportType = 'text';
                break;
            case 'png':
                exportType = 'png';
                break;
            case 'swdt':
                exportType = 'json';
                break;
            default:
                exportType = type;
                break;
        }


        editor.minder.exportData(exportType).then(function (content) {
            var contentdata=content
            let url = window.location.href;
            var namevar=location.search.split("=")[1];
            if(typeof namevar == 'undefined'){
                str = urls.split("/").pop();
                namevar=str.substring(0, str.indexOf('.'))
            }


            try {
                localStorage.setItem('数据'+namevar, contentdata);
                alert('已保存')
            } catch(e) {
                alert('存储空间快用完了')
            }




        });
    });







    let count = 0;
    $(document).on('click', '.export', function (event) {
        event.preventDefault();
        var $this = $(this),
            type = $this.data('type'),
            exportType;
        switch (type) {
            case 'km':
                exportType = 'json';
                break;
            case 'md':
                exportType = 'markdown';
                break;
            case 'svg':
                exportType = 'svg';
                $(".btn.btn-default.expand").click();
                break;
            case 'txt':
                exportType = 'text';
                break;
            case 'png':
                exportType = 'png';
                break;
            case 'swdt':
                //这里是判断关键
                exportType = 'json';
                break;
            default:
                exportType = type;
                break;
        }




        editor.minder.exportData(exportType).then(function (content) {
            switch (exportType) {
                case 'json':
                    var contentdata=content;
                    break;
                case 'svg':
                    $('div.minder-editor-container').remove();
                    $('.editor-title').remove();
                    // console.log(content)
                    $('body').append(content);

                    applyColorStyle();

                    return;
                    break;
                default:
                    break;
            }
            var blob = new Blob();
            switch (exportType) {
                case 'png':
                    resultimgdata=run(content)
//              console.log();
                    resultimgdata.then(res=>{
                        ddds=res
                    })

                    blob =  dataURLtoBlob(ddds);
                    break;
                case 'json':
                    blob = new Blob([content]);
                    break;

                default:
                    //导出
                    blob = new Blob([content]);
                    break;
            }
            var a = document.createElement("a"); //建立标签，模拟点击下载
            a.download = $('#node_text1').text() + '.' + type;
            a.href = URL.createObjectURL(blob);
            a.click();

            if(count == 0) {
                // 执行动作
                var  cookieid=Base64.decode($.cookie("kj"));
                if(cookieid = 202112313458) {
                    urls = window.location.href;
                    namevars=location.search.split("=")[1];
                    //测试网页不支持导出
                    if(typeof namevars == 'undefined'){
                        alert('不支持')
                    }else {
                        alert('出错了')


                    }

                }
                count += 1;
                setTimeout(function() {
                    count = 0;
                }, 6000);  // 1000毫秒之内不允许点击
            }else {
                // alert("请求太频繁！");
            }
        });
    });


    // 导入
    window.onload = function () {
        var fileInput = document.getElementById('fileInput');

        fileInput.addEventListener('change', function (e) {
            var file = fileInput.files[0],
                // textType = /(md|km)/,
                fileType = file.name.substr(file.name.lastIndexOf('.') + 1);
            // console.log(file);
            switch (fileType) {
                case 'md':
                    fileType = 'markdown';
                    break;
                case 'txt':
                    fileType = 'text';
                    break;
                case 'km':
                case 'json':
                    fileType = 'json';
                    break;
                default:
                    // console.log("File not supported!");
                    alert('只支持.km、.md、、text、.json文件');
                    return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var content = reader.result;
                // var strdata=content
                //导入
                var strdata=content
                content = strdata.replace(/\s*/g,"");
                editor.minder.importData(fileType, content).then(function (data) {
                    // console.log(data)
                    $(fileInput).val('');
                });
            }
            reader.readAsText(file);
        });
    }


    // 在DOM加载完成后绑定点击事件
// // $(document).ready(function() {
    $("#checkUpdate").click(function(event) {
// //         event.preventDefault(); // 阻止默认行为

//         // 弹出确认框
        if (confirm('查看更新会把当前页的导图临时替换成最新版本 请先保存您的数据再点击确认 如果需要同时查看更新数据和您的数据 再开一个同URL链接的窗口就行了  ')) {
            // 执行代码2
            $.ajax({
                type:'post',
                url: '',//API请求
                data: {"id": namevars},
                dataType:'json',
                async:false,
                success: function(data) {
                    swdtdata = data;
                },
                error:function (data){
                    console.log(data);
                }
            });
            strdatas = swdtdata
            contents = strdatas.replace(/\s*/g,"");
            content = contents;
            fileType = 'json';
            editor.minder.importData(fileType, content).then(function (data) {
                $(fileInput).val('');
            });

            // 隐藏 "保存数据" 按钮
            $(".baocun").hide();
            $(".qkdata").hide();

        }
// //         // 如果点击取消则什么都不做
    });
// // });


})();





//base64转换为图片blob
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(',');
    //注意base64的最后面中括号和引号是不转译的
    var _arr = arr[1].substring(0, arr[1].length - 2);
    var mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(_arr),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    // alert(1)
    // alert(u8arr)
    // cv=run( u8arr)

    // console.log(u8arr);
    return new Blob([u8arr], {
        type: mime
    });
}


$(document).ready(function() {
    var selectedElement = null;  // 保存选中的元素
    var mouseDownPos = null;     // 保存鼠标按下时的位置

    $(document).on('mousedown', function(event) {
        // 保存鼠标按下时的位置
        mouseDownPos = {x: event.clientX, y: event.clientY};
        // 获取选中的元素
        selectedElement = $(event.target);
    });

    $(document).on('mouseup', function(event) {
        // 判断鼠标抬起时的位置是否在选中的元素内
        var mouseUpPos = {x: event.clientX, y: event.clientY};
        if (mouseDownPos && mouseUpPos &&
            mouseDownPos.x === mouseUpPos.x && mouseDownPos.y === mouseUpPos.y &&
            selectedElement && selectedElement.is(event.target)) {
            // 鼠标按下和抬起的位置相同且在同一个元素内，则选中了该元素
            var elementInfo = "选中的元素是：" + selectedElement.prop('tagName');
            var elementInfoname = selectedElement.prop('tagName');

            if (elementInfoname == 'image') {
                var imageUrl = selectedElement.attr('xlink:href');
                // console.log(imageUrl);

                // 动态创建一个图片元素并设置样式
                var img = document.createElement('img');
                img.src = imageUrl;
                img.style.position = 'fixed';
                img.style.left = '50%';
                img.style.top = '50%';
                img.style.transform = 'translate(-50%, -50%) scale(1.2)';
                img.style.zIndex = '9999';
                img.style.maxWidth = '80%';
                img.style.maxHeight = '80%';
                img.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';

                // 动态创建一个关闭图片放大功能的按钮，并设置样式
                var closeButton = document.createElement('button');
                closeButton.innerHTML = '&times;';
                closeButton.style.position = 'fixed';
                closeButton.style.right = '20px';
                closeButton.style.top = '20%';
                closeButton.style.fontSize = '24px';
                closeButton.style.border = 'none';
                closeButton.style.background = 'transparent';
                closeButton.style.color = '#fff';
                closeButton.style.cursor = 'pointer';
                closeButton.style.zIndex = '10000';
                closeButton.style.color = '#000000';

                // 点击按钮关闭放大功能

                document.addEventListener('keydown', function(event) {
                    // 判断是否按下的是空格键（keyCode 32）
                    if (event.keyCode === 32) {
                        document.body.removeChild(img);
                        document.body.removeChild(closeButton);
                    }
                });

                closeButton.addEventListener('click', function() {
                    document.body.removeChild(img);
                    document.body.removeChild(closeButton);
                });

                // 将图片和按钮添加到页面中
                document.body.appendChild(img);
                document.body.appendChild(closeButton);
            }
        }

        // 重置选中的元素和鼠标按下时的位置
        selectedElement = null;
        mouseDownPos = null;
    });
});




$(document).ready(function () {
    $('#zuoti').on('click', function () {
        toggleContent('[?]');
    });






// $('g[id^="node_outline"]').on('click', function () {
    // $('g[id^="minder_node"]').on('click', function () {
    $('g[id^="minder_node"]').on('click', function () {

        // alert('S')
        var textElement = $(this).find('span');
        if (textElement.is(':visible')) {
            textElement.css('display', 'none');
        } else {
            textElement.css('display', 'initial');
        }
    });


    function toggleContent(pattern, context) {
        $('text', context).each(function () {
            var text = $(this).html();
            // alert(text)

            var regex = /\[\?(.*?)\]/g;
            var matches = text.match(regex); //

            // alert(matches[0])
            // alert(matches[1])
            if (matches) {
                var content = matches[0];
                var newText = `___<span style="display: none;">${content}</span>`;
                $(this).html(text.replace(matches[0], newText));
            }
        });
    }

});



$(document).ready(function () {
    $('#xjnt').on('click', function () {
        alert('点击切换新建脑图')
    });



});




$(document).ready(function () {
    document.getElementById('openPopupai').onclick = function() {
        const popup = document.getElementById('popupai');
        const overlay = document.getElementById('overlayai');

        if (popup.style.display === 'block') {
            // 如果弹窗已经打开，关闭它
            popup.style.display = 'none';
            overlay.style.display = 'none';
        } else {
            // 否则打开弹窗
            popup.style.display = 'block';
            overlay.style.display = 'block';
            document.getElementById('showLabel').style.display = 'none'; // 隐藏标签
        }
    };

    document.getElementById('closePopupai').onclick = function() {
        document.getElementById('popupai').style.display = 'none';
        document.getElementById('overlayai').style.display = 'none';
        document.getElementById('showLabel').style.display = 'block'; // 显示标签
    };

    // 拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    const popup = document.getElementById('popupai');

    popup.onmousedown = function(e) {
        isDragging = true;
        offsetX = e.clientX - popup.getBoundingClientRect().left;
        offsetY = e.clientY - popup.getBoundingClientRect().top;
        document.body.style.cursor = 'move';
    };

    document.onmousemove = function(e) {
        if (isDragging) {
            popup.style.left = (e.clientX - offsetX) + 'px';
            popup.style.top = (e.clientY - offsetY) + 'px';
        }
    };

    document.onmouseup = function() {
        isDragging = false;
        document.body.style.cursor = 'default';
    };

    // 双击隐藏iframe
    document.addEventListener('dblclick', function(event) {
        const popup = document.getElementById('popupai');
        if (popup.style.display === 'block' && !popup.contains(event.target)) {
            popup.style.display = 'none';
            document.getElementById('overlayai').style.display = 'none';
            document.getElementById('showLabel').style.display = 'block'; // 显示标签
        }
    });

    // 点击标签显示iframe
    document.getElementById('showLabel').onclick = function() {
        const popup = document.getElementById('popupai');
        const overlay = document.getElementById('overlayai');
        popup.style.display = 'block';
        overlay.style.display = 'block';
        this.style.display = 'none'; // 隐藏标签
    };
});




function applyColorStyle() {
    $('svg text').each(function() {
        var text = $(this).text();
        const regex = /\[(1|2|3|4|5|6|7|8|9)(.*?)\]/g; //
        var matches = text.match(regex); // 使用match方法匹配字符串中的目标文字

        if (matches) {
            var styledText = text;
            for (var i = 0; i < matches.length; i++) {
                var colornumber = matches[i][1]; // 获取方括号内的数字
                var colorValue = ''; // 初始化颜色值
                switch (colornumber) {
                    case '1':
                        colorValue = '#e91e63';
                        break;
                    case '2':
                        colorValue = '#9c27b0';
                        break;
                    case '3':
                        colorValue = '#ff9800';
                        break;
                    case '4':
                        colorValue = '#4caf50';
                        break;
                    case '5':
                        colorValue = '#cddc39';
                        break;
                    case '6':
                        colorValue = '#3f51b5';
                        break;
                    case '7':
                        colorValue = '#ff5722';
                        break;
                    case '8':
                        colorValue = '#2196f3';
                        break;
                    case '9':
                        colorValue = '#795548';
                        break;
                    // default:
                    // colorValue = '#000000'; // 若数字不为1、2、3，则使用默认颜色
                }

                var content = matches[i].replace(/\[(\d)([^\]]*)\]/g, '$2').replace(/\[|\]/g, '');
                styledText = styledText.replace(matches[i], `<tspan fill="${colorValue}">${content}</tspan>`); // 替换目标文字为带颜色的tspan标签
            }
            $(this).html(styledText);
        }
    });
}
$(document).on('click', 'path', function() {
    applyColorStyle();
});


var cookieids = Base64.decode($.cookie("kj"));




// alert(cookieids)
if (bodycopy) {
    // 允许复制
    document.body.oncopy = null;
    document.body.oncut = null;
}

// alert(resultvip)

