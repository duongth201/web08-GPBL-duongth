$(document).ready(function () {
    //Gán sự kiện cho các element
    initEvent();
    loadData();
    deleteData();
})

var laguageCode = "VI";

/**
 * Tạo event cho các elements
 * Author: DuongTH (04/09/2022)
 */
function initEvent() {
    try {
        //Hiển thị dialog nhân viên khi nhấn button Thêm mới
        $("#btnAdd").click(function () {
            $("#dlgEmployeeDetail").show();
        })

        //Ẩn dialog khi nhấn button Hủy
        $('html').on('click', '.dialog .button--cancel', function () {
            $(this).parents(".dialog").hide();
        })
        //Ẩn dialog khi nhấn button X
        $('html').on('click', '.dialog .dialog__button--close', function () {
            $(this).parents(".dialog").hide();
        })
        //Ẩn dialog cảnh báo
        $('html').on('click', '#btnOk ', function () {
            $(this).parents(".dialog").hide();
        })

        //Cất dữ liệu khi nhấn button Cất
        $(document).on('click', '#btnSave', saveData);

        //Double click cells
        $(document).on('dblclick', '#employeeList tbody tr', function (event) {
            // Lấy id của bản ghi: 
            if (!$(event.target).hasClass("cbox") && !$(event.target).hasClass("undblclick") ) {
                const id = $(this).data('id');
                fetch(`https://cukcuk.manhnv.net/api/v1/Employees/${id}`)
                    .then(res => res.json())
                    .then(res => {
                        // binding data:
                        let inputs = $("#dlgEmployeeDetail input");
                        for (const input of inputs) {
                            const propName = $(input).attr("prop-name");
                            let value = res[propName];
                            $(input).val(value);
                        }
                    })
                $("#dlgEmployeeDetail").show();
            }
        })
        
        //Nhấn cells giữ td
        $(document).on('click', 'table#employeeList tbody tr', function () {
            $(this).siblings('.click__td').removeClass('click__td');
            this.classList.add('click__td');
        });

        //Nhấn checkbox giữ td
        $(document).on('click', 'table#employeeList .checkbox__group input[type="checkbox"]:checked + label', function () {
            // $(this).siblings('.click__td').removeClass('click__td');
            //this.classList.add('click__td');
            $(this).addClass('click__td');
        });

        //Nhấn icon dropdown trong chức năng
        $(document).on('click', '.contextmenu .contextmenu__dropdown', function () {
            if ($(this).hasClass('choose')) {
                $(this).removeClass('choose');
            } else {
                $(this).addClass('choose');
            }
        })
        
        //Lấy lại dữ liệu khi nhấn Button reload
        $(document).on('click', '.icon--reload', loadData);

        //Lập trình phím tắt
        // $("#dlgEmployeeDetail").keydown(function (e) { 
        //     //bắt hành động người dùng
        //     const keyCode = e.keyCode; 
        //     if(keyCode == PAGEEnum.KeyCode.ENTER){
        //         alert(1)
        //         $(document).on('click', '#btnSave', saveData);
        //     }
        //     if(keyCode == PAGEEnum.keyCode.ESC){
        //         $('html').on('click', '.dialog .dialog__button--close', function () {
        //             $(this).parents(".dialog").hide();
        //         })
        //     }
        // });
        $("#dlgEmployeeDetail").keydown(function (e) {
            // Bắt hành động khi người dùng nhấn Enter
            console.log(e.keyCode);
            const keyCode = e.keyCode;
            if (keyCode == PAGEEnum.KeyCode.ENTER) {
                $("#btnSave").trigger("click");
            } 
            else if (keyCode == PAGEEnum.KeyCode.ESC) {
                $('html').on('click', '.dialog .dialog__button--close', function () {
                    $(this).parents(".dialog").hide();
                })
            }
        });

    } catch (error) {
        console.log(error)
    }
}

/**
 * Load data
 * Author: DuongTH
 */
function loadData() {
    try {

        //Loading show
        $(".loading").show();
        //Gọi api thực hiện lấy dữ liệu
        fetch("https://cukcuk.manhnv.net/api/v1/Employees/filter?pageSize=20&pageNumber=1", { method: "GET" })
            .then(res => res.json())
            .then(res => {
                //Xử lý dữ liệu
                var count = 1;
                //Clear dữ liệu
                $("#employeeList tbody").empty();
                if (res != undefined) {
                    //Lấy thông tin các cột dữ liệu của bảng
                    var ths = $("#employeeList thead th");
                    for (const emp of res["Data"]) {
                        var trHTML = $(`<tr></tr>`);
                        //td checkbox
                        var checkDisplay = $(`<td class="text--aligncenter ">
                                                    <div class="checkbox__group">
                                                        <input type="checkbox" class="checkbox__input" id="check__${count}" hidden>
                                                        <label class="cbox" for="check__${count}"></label>
                                                    </div>
                                                </td>`);
                        trHTML.append(checkDisplay);
                        //td chức năng
                        var contextHTML = $(`<td class"text--aligncenter">
                                                <div class="contextmenu">
                                                    <div class="contextmenu__main">
                                                        <div id="btnEdit" class="contextmenu__button undblclick">
                                                            Sửa
                                                        </div>
                                                        <div class="contextmenu__dropdown undblclick ">
                                                            <div class="contextmenu__menu">
                                                                <div class="contextmenu__option">Nhân bản</div>
                                                                <div id="btnDelete" value="${emp.EmployeeId}" val="${emp.EmployeeCode}" class="contextmenu__option">Xóa</div>
                                                                <div class="contextmenu__option">Ngưng sử dụng</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>`);
                        for (let i = 1; i < ths.length - 1; i++) {
                            //Lấy ra prop-name
                            const propName = $(ths[i]).attr("prop-name");
                            //Lấy ra value tương ứng
                            let value = emp[propName];
                            //format date
                            const formatDate = ths[i].hasAttribute("format-date");
                            if (formatDate) {
                                value = common.formatDate(value);
                            }
                            var td = `<td>${value || ""}</td>`
                            trHTML.append(td);
                        }
                        trHTML.append(contextHTML);
                        //Lưu trữ data của 1 tr bằng ID
                        trHTML.data("id", emp.EmployeeId);
                        //Lưu trữ data của 1 tr bằng object
                        trHTML.data("entity", emp);
                        //append hàng vào bảng
                        $("#employeeList tbody").append(trHTML);
                        count++;
                    }
                }
                //1. Định dạng ngày sinh
                //2. Định dạng tiền
                $(".loading").hide();

            })
            .catch(res => {

            })

    } catch (error) {
        console.log(error);
    }
}

/**
 * Thực hiện xóa dữ liệu
 * Author: DuongTH
 */
function deleteData(){
    $(document).on('click', '#employeeList tbody tr #btnDelete', function (e) {
        //1. Lấy id và mã nhân viên
        let id = $(e.target).attr("value");
        let eCode = $(e.target).attr("val");
        //Dialog hỏi xóa?

        //2. gọi API xóa
        if (id) {
            var confirmm = confirm("Bạn có thực sự muốn xóa nhân viên" + ' ' + '<' + eCode + '>' + " không? ");
            if (confirmm == true) {
                $.ajax({
                    url: `https://cukcuk.manhnv.net/api/v1/Employees/${id}`,
                    method: "DELETE",
                }).done(function (res) {
                }).fail(function (res) {
                    window.alert("Vui lòng kiểm tra lại!")
                })
                alert("Xóa thanh công nhân viên" + ' ' + '<' + eCode + '>');
            } else {
                alert("Hủy thanh cong");
            }
    
        } else {
            alert(111)
        }
    });
}

/**
 * Sửa thông tin chi tiết
 * Author: DuongTH
 */
function editData(){
    //1. Lấy entity như id
    //2. Hiển thị dialog có thông tin
    //3. Cất thông tin
    
}


/**
 * Thực hiện cất dữ liệu
 * Author: DuongTH
 */
function saveData() {
    //*Validate dữ liệu

    //1. Các thông tin bắt buộc nhập
    const employeeCode = $("#txtEmployeeCode").val();
    const fullName = $("#txtFullName").val();
    const unit = $("#txtUnit").val();

    let msgErrors = [];
    if (!employeeCode) {
        msgErrors.push(MISAResource.ErrorValidate.EmployeeCodeNotEmpty[laguageCode]);
    }
    if (!fullName) {
        msgErrors.push(MISAResource.ErrorValidate.FullNameNotEmpty[laguageCode]);
    }
    if (!unit) {
        msgErrors.push(MISAResource.ErrorValidate.UnitNotEmpty[laguageCode])
    }
    //2. Các thông tin cần định dạng

    //3. Khác

    //Nếu có lỗi hiện cảnh báo
    if (msgErrors.length > 0) {
        common.showEmptyDialog(msgErrors);
        // showErrorDialog(msgErrors);
    }
    //*Gọi api cất dữ liệu
    let inputs = $("#dlgEmployeeDetail input");
    var employee = {};
    for (const input of inputs) {
        const propName = $(input).attr("prop-name");
        let value = $(input).val();
        $(input).val(value);
        if (value)
            employee[propName] = value;
    }
    $.ajax({
        type: "POST",
        url: "https://cukcuk.manhnv.net/api/v1/Employees",
        data: JSON.stringify(employee),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
            $("#dlgEmployeeDetail").hide();
        },
        error: function () {

        }
    });
}

/**
 * Build dialog hiển thị cảnh báo lỗi
 * Author: DuongTH
 *  */
 function showEmptyDialog(msgErrors) {
    try {
        // Cập nhật nội dung câu cảnh báo lỗi:
        var dialogBody = $("#dlgNotify .content--text");
        // 1 - xóa nội dung thông báo cũ:
        dialogBody.empty();

        // 2 - append các nội dung cảnh báo mới:
        for (const msg of msgErrors) {
            let textHTML = `<div>- ${msg}</div>`;
            dialogBody.append(textHTML);
        }

        $("#dlgNotify").show();
    } catch (error) {
        console.log(error);
    }

}
