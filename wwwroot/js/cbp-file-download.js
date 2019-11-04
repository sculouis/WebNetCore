var _peopleInfoTemplate;
var _existData = [];
//IE11 bug: Reset input file by script will trigger its change function, cause multiple alert.
var rv = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent)
$(function () {
    getFileInfo()
    $.each($('div.esunfileList'), function (index, item) {
        var temp = $.extend(true, {}, $(item)).attr('id');
        var kind = $.extend(true, {}, $(item)).attr('kind');
        if (urlParam[1].toLocaleLowerCase() == "readonly") {
            $(item).replaceWith(fileZoneReadOnlyTemplate(temp, item, index));
        } else {
            if (kind != undefined & (kind.includes('EPP') || kind.includes('ENP') || kind.includes('ESP') || kind.includes('EPO') || kind.includes('EMP') || kind.includes('EEEA'))) {
                $(item).replaceWith(fileZoneEditExpTemplate(temp, item, index));
            } else {
                $(item).replaceWith(fileZoneEditTemplate(temp, item, index));
            }
        }
    });
    //可接受的檔案類型
    $('.fileUploadBtn').attr('accept', '.doc, .docx, .jpg, .png, .txt, .pdf, .xls, .ppt');
    //拖曳上傳功能
    $('.dndregion').on({
        'dragenter':
            function (e) {
                e.stopPropagation();
                e.preventDefault();
                $(this).css('border', '2px solid #0B85A1');
            },
        'dragover':
            function (e) {
                $(this).css('border', '2px solid #0B85A1');
                e.stopPropagation();
                e.preventDefault();
            },
        'drop':
            function (e) {
                e.preventDefault();
                $(this).css('border', '');
                var files = e.originalEvent.dataTransfer.files;
                if (files.length > 0) {
                    uploadFileHandler(files, $(this));
                }
            }
    });
    //監聽上傳按鈕是否有選擇檔案
    $('.fileUploadBtn').on('change', function () {
        inputFileChange(this);
        //將檔案放入FormData後初始化input file,需判斷是否為IE11,IE11重製會造成trigger
        if (rv != undefined && parseFloat(rv[1]) == 11.0) {
            $(this).unbind();
            this.value = "";
            $(this).bind('change', inputFileChange)
        } else {
            this.value = "";
        }
    });
    //全選/全不選按鈕
    $('.selectAllFile').on('click', function () {
        $(this).parents('.box').find('.selectFileDetail').prop('checked', $(this).prop('checked'));
    });
    //刪除按鈕
    $(document).on('click', '.deleteFile', deleteFileHandler);
});
function inputFileChange(t) {
    if (t.target != undefined) {
        t = t.target;
    }
    uploadFileHandler($(t)[0].files, $(t).parents('.box'));
}
//==============================================================================================
// 檔案上傳 / 檔案下載 / 刪除檔案 / 存檔 / 取得現有檔案
//==============================================================================================
function uploadFileHandler(files, appendRoot) {
    var fomdata = new FormData();
    var uploadCount = 0;

    $.each(files, function (index, item) {
        uploadCount++;
        fomdata.append(index, item);
    })
    var uploadResult;
    if (uploadCount > 0) {
        blockPageForJBPMSend()
        $.when(
            $.ajax({
                headers: {
                    FormType: urlParam[0], UserID: $('#LoginEno').val()
                },
                type: 'POST',
                data: fomdata,
                cache: false,
                processData: false,
                contentType: false,
                dataType: "json",
                url: '/CBP/Upload/'
            }).done(function (data, textStatus, jqXHR) {
                uploadResult = data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert("檔案上傳失敗")
            }).always(function () {
                blockPage('')
                if (uploadResult.length > 0) {
                    alert("成功上傳：" + uploadResult.length + "筆檔案\n")
                    setFileData(uploadResult, appendRoot)
                }
            })
        )
    }
}
function downloadFileHandler(specificFile) {
    var downLoadData = [];
    if (typeof (specificFile) == "undefined") {
        return;
    } else if (typeof (specificFile) == "object") {
        _existData.find(function (element) {
            if (element.fileStatus != 2 && element.fileStatus != 99) {
                downLoadData.push(element)
            }
        })
    } else {
        downLoadData.push(_existData.find(function (element) {
            return element.file.FileName == specificFile
        }))
    }
    //判斷是否為IE11,因IE11不支援使用FetchAPI
    if (rv != undefined && parseFloat(rv[1]) == 11.0) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/CBP/Download', true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            if (this.status === 200) {
                var filename = xhr.getResponseHeader('x-filename') == null ? "attechment.zip" : decodeURI(xhr.getResponseHeader('x-filename').replace(/\+/g, '%20'));
                var disposition = filename;
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }
                var type = xhr.getResponseHeader('Content-Type');
                var blob = typeof File === 'function'
                    ? new File([this.response], filename, { type: type })
                    : new Blob([this.response], { type: type });
                if (typeof window.navigator.msSaveOrOpenBlob !== 'undefined') {
                    window.navigator.msSaveOrOpenBlob(blob, filename);
                }
                else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(blob, filename);
                }
                else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);

                    if (filename) {
                        var a = document.createElement("a");
                        if (typeof a.download === 'undefined') {
                            window.location = downloadUrl;
                        } else {
                            a.href = downloadUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                        }
                    } else {
                        window.location = downloadUrl;
                    }

                    setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
                }
            }
        };
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(downLoadData));
    } else {
        var fileName = "default";
        fetch('/CBP/Download', {
            body: JSON.stringify(downLoadData),
            method: 'POST',
            mode: 'cors',
            headers: {
                'content-type': 'application/json'
            }
        }).then(function (response) {
            fileName = decodeURI(response.headers.get('x-fileName')) == "null" ? decodeURI(response.headers.get('content-disposition').split('=')[1].replace(/\+/g, '%20')) : decodeURI(response.headers.get('x-fileName').replace(/\+/g, '%20'))
            return response.blob();
        }).then(function (blob) {
            saveAs(blob, fileName);
        })
    }
}
function deleteFileHandler(e) {
    var alertMsg = "";
    var root = $(e.target).parents('.box');
    var deleteGroup = $(root).find('input[type="checkbox"][class="selectFileDetail"]:checked').parents('tr.fileDetail');
    if (deleteGroup.length < 1) {
        alert("請勾選要刪除的檔案");
    } else {
        $.each($(deleteGroup).find('.fileName'), function (index, item) {
            alertMsg = alertMsg + $(item).text() + '\n'
        })
        var noSernoDelete = [];
        alertMsg = alertMsg + "即將被刪除，請確認是否刪除"
        if (confirm(alertMsg)) {
            $(root).find('.selectAllFile').prop('checked', false);
            $.each(deleteGroup, function (index, item) {
                _existData.find(function myfunction(x, index) {
                    if ($(item).find('input[type="checkbox"]').attr('id').split('_')[1] == 0) {
                        if (x.file.FileName == $(item).find('a.fileName').text() && x.fileStatus == 1) {
                            x.fileStatus = 99;
                        }
                    }
                    if (x.Serno == $(item).find('input[type="checkbox"]').attr('id').split('_')[1] && x.Serno != 0) {
                        x.fileStatus = 2;
                    }
                })
            })
            deleteGroup.remove();
            if ($(root).find('.fileDetail').length < 1) {
                $(root).find('.deleteFile').remove();
                $(root).find('.downloadFile').remove();
                $(root).find('tbody').append('<tr class="unUpload"><td colspan="5" class="text-center"><div class="file-table-area text-center"><div class="icon-cloud_upload upload-icon-size"></div>\
                        <b>請將檔案拖曳至此或點【上傳檔案】按鈕</b></div></td></tr>');
            }
        }
    }
}
function saveFileInfo() {
    if (_formInfo.flag) {
        return $.ajax({
            type: 'POST',
            data: JSON.stringify(_existData),
            contentType: "application/json",
            url: '/CBP/SaveFile/' + _formInfo.formGuid,
            success: function (data) {
                var action = location.pathname.split('/');
                if (action[2] != undefined && (action[2].toLowerCase().includes("create") || action[2].toLocaleLowerCase().includes('edit')) && _formInfo.source != "send") {
                    location.href = '/' + action[1] + '/Edit/' + _formInfo.formNum;
                }
            },
            error: function (data) {
                alert(data.responseText)
            }
        });
    }
}
function getFileInfo() {
    if ($('#FormID').val() != undefined && $('#FormID').val() != "" && $('#FormID').val() != "00000000-0000-0000-0000-000000000000") {
        $.ajax({
            async: true,
            type: 'GET',
            cache: false,
            contentType: "application/json",
            url: '/CBP/GetFile/' + $('#FormID').val(),
            success: function (data) {
                if (data != undefined && data.length > 0) {
                    $.each(data, function (index, item) {
                        item.fileStatus = 0;
                    })
                    setFileData(data, $('#fileSection'))
                }
            },
            error: function (data) {
                alert(data.responseText)
            }
        })
    }
}
//==============================================================================================
// 處理檔案區的各式樣板功能
//==============================================================================================
function setFileData(fileData, appendRoot) {
    var appendTarget = $(appendRoot).find('tbody.fileList');
    if (typeof (fileData) != "object" || fileData == null || fileData.length < 1) {
        return;
    }
    //加入刪除及下載鈕
    if ($(appendRoot).find('.fileBtnArea').find('.deleteFile').length < 1) {
        $(appendRoot).find('.fileBtnArea').append('<a class="btn-02-gray btn-text4 deleteFile"> <div class="glyphicon glyphicon-trash bt-icon-size"></div>刪除檔案</a>');
    }
    if ($(appendRoot).find('.fileBtnArea').find('.downloadFile').length < 1) {
        $(appendRoot).find('.fileBtnArea').append('<a class="btn-02-yellow btn-text4 downloadFile" onclick=\'downloadFileHandler([])\'><div class="glyphicon glyphicon-save bt-icon-size"></div>全部下載</a>');
    }
    $.each(fileData, function (index, item) {
        item.fileSeq = _existData.length + 1;
        _existData.push(item);
        _peopleInfoTemplate = peopleInfoTemplate(item.uploaderID, item.uploaderName, item.uploaderDept)
        item.Serno == 0 ? $(appendTarget).append(fileDescriptionOpenTemplate(item)) :
        item.uploaderID == $('#LoginEno').val() ? $(appendTarget).append(fileDeleteOpenTemplate(item)) : (appendTarget).append(fileDefaultTemplate(item));
    });
    $(appendTarget).find('tr.unUpload').remove();
    if (urlParam[1].toLocaleLowerCase() == "readonly") {
        $('input.selectFileDetail').remove()
    }
}
function chageDescription(e) {
    var description = $(e).val();
    _existData.find(function myfunction(x, index) { if ($(e).parents('tr').find('a.fileName').text() == x.file.FileName) { x.fileDescription = description } })
}
//==============================================================================================
// 各式樣板
//==============================================================================================
function fileDescriptionOpenTemplate(file) {
    /// <summary>
    /// 上傳完畢時，檔案說明開放編輯樣板
    /// </summary>
    /// <param name="file">上傳檔案資訊</param>
    /// <returns>Template</returns>
    return (
    '<tr class="fileDetail">\
        <td><input type="checkbox" class="selectFileDetail" id="file_' + file.Serno + '"></td>\
        <td>\
            <div class="table-add-link-disable"><ul><li><div class="icon-link icon-link-size-s"></div><a onclick="downloadFileHandler(\'' + file.file.FileName + '\')" class="table-addlink-text-disable fileName">' + file.file.FileName + '</a></li></ul></div>\
        </td>\
        <td><textarea class="tt table-tt-h30 unfinishedFileText" onchange="chageDescription(this)" placeholder="填寫檔案說明"></textarea></td>\
        <td>' + _peopleInfoTemplate + '</td>\
        <td>' + file.date + '</td>\
    </tr>');
}
function fileDefaultTemplate(file) {
    /// <summary>
    /// 一般檔案樣板，不含刪除
    /// </summary>
    /// <param name="file">上傳檔案資訊</param>
    /// <returns>Template</returns>
    if (file.fileDescription == "" || file.fileDescription == null) {
        file.fileDescription = "無檔案說明";
    }
    return (
    '<tr class="fileDetail">\
        <td></td>\
        <td>\
            <div class="table-add-link-disable"><ul><li><div class="icon-link icon-link-size-s"></div><a onclick="downloadFileHandler(\'' + file.file.FileName + '\')" class="table-addlink-text-disable fileName">' + file.file.FileName + '</a></li></ul></div>\
        </td>\
        <td>' + file.fileDescription + '</td>\
        <td>' + _peopleInfoTemplate + '</td>\
        <td>' + file.date.split('T')[0] + ' ' + file.date.split('T')[1] + '</td>\
    </tr>');
}
function fileDeleteOpenTemplate(file) {
    /// <summary>
    /// 一般檔案樣板，含刪除
    /// </summary>
    /// <param name="file">上傳檔案資訊</param>
    /// <returns>Template</returns>
    if (file.fileDescription == "" || file.fileDescription == null) {
        file.fileDescription = "無檔案說明";
    }
    return (
    '<tr class="fileDetail">\
        <td><input type="checkbox" class="selectFileDetail" id="file_' + file.Serno + '"></td>\
        <td>\
            <div class="table-add-link-disable"><ul><li><div class="icon-link icon-link-size-s"></div><a onclick="downloadFileHandler(\'' + file.file.FileName + '\')" class="table-addlink-text-disable fileName">' + file.file.FileName + '</a></li></ul></div>\
        </td>\
        <td>' + file.fileDescription + '</td>\
        <td>' + _peopleInfoTemplate + '</td>\
        <td>' + file.date.split('T')[0] + ' ' + file.date.split('T')[1] + '</td>\
    </tr>');
}
function peopleInfoTemplate(id, name, deptcode) {
    /// <summary>
    /// 人員樣板
    /// </summary>
    /// <param name="id">員編</param>
    /// <param name="name">姓名</param>
    /// <param name="deptcode">以逗號分隔之部門代號</param>
    /// <returns>Template</returns>
    var deptInfo = "";
    if (deptcode != undefined) {
        if (deptcode.split(',')[0] != undefined) {
            deptInfo = deptInfo + '<li><span class="icon-account_balance"></span><span>' + deptcode.split(',')[0] + '</span></li>'
        }
        if (deptcode.split(',')[1] != undefined) {
            deptInfo = deptInfo + '<li><span class="icon-account_balance"></span><span>' + deptcode.split(',')[1] + '</span></li>'
        }
        if (deptcode.split(',')[2] != undefined) {
            deptInfo = deptInfo + '<li><span class="icon-account_balance"></span><span>' + deptcode.split(',')[2] + '</span></li>'
        }
    }

    return (
        '<span class="fL">' + name + '(' + id + ')' + '</span>\
        <div class="info-note-box">\
            <a class="info-bt icon-info text-blue-link"></a>\
            <span class="info-note">\<i></i>\<ul class="info-list-text">'+ deptInfo + '</ul>\</span>\
        </div>'
        )
}
function fileZoneReadOnlyTemplate(id, replaceItem, index) {
    return (
        '<div class="box dndregion" id="fileRegion">\
            <div class="row">\
                <div class="col-sm-12 content-box">\
                    <div class="w100 title m-top10" id="' + id + '">' + $(replaceItem).text() + '\
                        <div class="area-btn-right fileBtnArea"></div>\
                    </div>\
                    <table class="table table-hover m-top10 table-bordered">\
                        <thead>\
                            <tr>\
                                <th class="th-title w5"></th>\
                                <th class="th-title w30">檔案名稱</th>\
                                <th class="th-title w30">檔案說明</th>\
                                <th class="th-title w15">上傳人員</th>\
                                <th class="th-title w15">上傳時間</th>\
                            </tr>\
                        </thead>\
                        <tbody class="fileList">\
                            <tr class="unUpload">\
                                <td colspan="5" class="text-center">\
                                    <div class="file-table-area text-center">\
                                        <b>無檔案</b>\
                                    </div>\
                                </td>\
                            </tr>\
                        </tbody>\
                    </table>\
                </div>\
            </div>\
        </div>'
    )
}
function fileZoneEditTemplate(id, replaceItem, index) {
    return (
        '<div class="box dndregion" id="fileRegion">\
            <div class="row">\
                <div class="col-sm-12 content-box">\
                    <div class="w100 title m-top10" id="' + id + '">' + $(replaceItem).text() + '\
                        <div class="area-btn-right fileBtnArea">\
                            <a class="btn-02-blue btn-text4"  onclick="document.getElementById(\'fileUploadBtn_' + index + '\').click(); return false"><div class="glyphicon glyphicon-open bt-icon-size"></div>檔案上傳</a>\
                            <input id="fileUploadBtn_' + index + '" class="fileUploadBtn" type="file" style="display:none" multiple />\
                        </div>\
                    </div>\
                    <table class="table table-hover m-top10 table-bordered">\
                        <thead>\
                            <tr>\
                                <th class="th-title w5"><input type="checkbox" class="selectAllFile"/></th>\
                                <th class="th-title w30">檔案名稱</th>\
                                <th class="th-title w30">檔案說明</th>\
                                <th class="th-title w15">上傳人員</th>\
                                <th class="th-title w15">上傳時間</th>\
                            </tr>\
                        </thead>\
                        <tbody class="fileList">\
                            <tr class="unUpload">\
                                <td colspan="5" class="text-center">\
                                    <div class="file-table-area text-center">\
                                        <div class="icon-cloud_upload upload-icon-size"></div><b>請將檔案拖曳至此或點【上傳檔案】按鈕</b>\
                                    </div>\
                                </td>\
                            </tr>\
                        </tbody>\
                    </table>\
                </div>\
            </div>\
        </div>'
    )
}
function fileZoneEditExpTemplate(id, replaceItem, index) {
    return (
        '<div>\
            <ul class="text m-top10" style="color:#2eaf92" >\
                <li>分行(含中心)報支時，應附加報支憑證掃瞄檔(可能包含：租約、合約、發票、收據…等足以佐證該筆支出之憑證)後再送出</li>\
            </ul>\
        </div>\
        <div class="box dndregion" id="fileRegion">\
            <div class="row">\
                <div class="col-sm-12 content-box">\
                    <div class="w100 title" id="' + id + '">' + $(replaceItem).text() + '\
                        <div class="area-btn-right fileBtnArea">\
                            <a class="btn-02-blue btn-text4"  onclick="document.getElementById(\'fileUploadBtn_' + index + '\').click(); return false"><div class="glyphicon glyphicon-open bt-icon-size"></div>檔案上傳</a>\
                            <input id="fileUploadBtn_' + index + '" class="fileUploadBtn" type="file" style="display:none" multiple />\
                        </div>\
                    </div>\
                    <table class="table table-hover m-top10 table-bordered">\
                        <thead>\
                            <tr>\
                                <th class="th-title w5"><input type="checkbox" class="selectAllFile"/></th>\
                                <th class="th-title w30">檔案名稱</th>\
                                <th class="th-title w30">檔案說明</th>\
                                <th class="th-title w15">上傳人員</th>\
                                <th class="th-title w15">上傳時間</th>\
                            </tr>\
                        </thead>\
                        <tbody class="fileList">\
                            <tr class="unUpload">\
                                <td colspan="5" class="text-center">\
                                    <div class="file-table-area text-center">\
                                        <div class="icon-cloud_upload upload-icon-size"></div><b>請將檔案拖曳至此或點【上傳檔案】按鈕</b>\
                                    </div>\
                                </td>\
                            </tr>\
                        </tbody>\
                    </table>\
                </div>\
            </div>\
        </div>'
    )
}