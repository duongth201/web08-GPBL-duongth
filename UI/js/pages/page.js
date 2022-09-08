$(document).ready(function () {
    //Gán sự kiện cho các element
    initEvent();
    loadData();
})

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
        //Ẩn dialog khi nhấn button X, Hủy
        $('html').on('click', '.dialog .dialog__button--close', function () {
            $(this).parents(".dialog").hide();
        })
        //Double click
        $(document).on('dblclick', '#employeeList tbody tr', function (event) {
            // Lấy id của bản ghi: 
            if (!$(event.target).hasClass("cbox") && !$(event.target).hasClass("func")) {
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

        //Cất dữ liệu khi nhấn button Cất
        $("#btnSave").click(saveData);

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
        fetch("https://cukcuk.manhnv.net/api/v1/Employees", { method: "GET" })
            .then(res => res.json())
            .then(res => {
                //Xử lý dữ liệu
                var count = 1;
                //Clear dữ liệu
                $("#employeeList tbody").empty();
                if (res != undefined) {
                    //Lấy thông tin các cột dữ liệu của bảng
                    var ths = $("#employeeList thead th");
                    for (const emp of res) {
                        var trHTML = $(`<tr></tr>`);
                        var checkDisplay = $(`<td class="text--aligncenter ">
                                                    <div class="checkbox__group">
                                                        <input type="checkbox" class="checkbox__input" id="check__${count}" hidden>
                                                        <label class="cbox" for="check__${count}"></label>
                                                    </div>
                                                </td>`);
                        trHTML.append(checkDisplay);
                        for (let i = 1; i < ths.length; i++) {
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
                        //Lưu trữ data của 1 tr bằng ID
                        trHTML.data("id", emp.EmployeeId)
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
 * Thực hiện cất dữ liệu
 * Author: DuongTH
 */
function saveData() {
    //*Validate dữ liệu

    //1. Các thông tin bắt buộc nhập
    const employeeCode = $("#txtEmployeeCode").val();
    const fullName = $("#txtFullName").val();

    let msgError = [];
    if (!employeeCode) {

    }
    if (!fullName) {

    }
    //2. Các thông tin cần định dạng

    //3. Khác

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
            //Hiển thị dialog message
        },
        error: function(){

        }
    });
}

/**
 * Build dialog hiển thị cảnh báo lỗi
 * Author: DuongTH
 *  */