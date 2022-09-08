var common = {

    /**
     * Hiển thị dialog cảnh báo
     * @param {Array} msgErrors Mảng các thông báo muốn hiển thị
     * Athor: NVMANH (26/08/2022)
     */
    showErrorDialog(msgErrors) {
        try {
            // Khai báo html của dialog:
            let dialogHTML = $(`<div class="dialog dialog--warning">
                                    <div class="dialog__content">
                                        <div id="btnClose3" class="dialog__button--close"></div>
                                        <div class="dialog__header title">Thông báo</div>
                                        <div class="dialog__body">
                                           
                                        </div>
                                        <div class="dialog__footer">
                                            <button id="btnOk" class="button">Đồng ý</button>
                                        </div>
                                    </div>
                                </div>`);

            // Build nội dung dialog:
            var dialogBody = $(dialogHTML).find(".dialog__body");
            // 2 - append các nội dung cảnh báo mới:
            if (msgErrors) {
                for (const msg of msgErrors) {
                    let textHTML = `<div>- ${msg}</div>`;
                    dialogBody.append(textHTML);
                }
            }

            // Hiển thị dialog:
            $('body').append(dialogHTML);

        } catch (error) {
            console.log(error);
        }
    },
    /**
     * Hiển thị dialog hỏi xóa
     * @param {}  
     * Athor: 
     */
     showEmptyDialog(msgErrors) {
        try {
            //1. Khai báo html của dialog:
            let dialogHTML = $(`<div id="dlgNotify" class="dialog">
                                    <div class="notify__content">
                                        <div class="notify__detail">
                                            <div class="content--circle"></div>
                                            <div class="content--text"></div>
                                        </div>
                                        <div class="notify__footer">
                                            <button class="btn--green">Đóng</button>
                                        </div>
                                    </div>
                                </div>`);

            // Build nội dung dialog:
            var dialogBody = $(dialogHTML).find("#dlgNotify .content--text");
            // 2 - append các nội dung cảnh báo mới:
            if (msgErrors) {
                for (const msg of msgErrors) {
                    let textHTML = `<div>- ${msg}</div>`;
                    dialogBody.append(textHTML);
                }
            }

            // Hiển thị dialog:
            $('body').append(dialogHTML);

        } catch (error) {
            console.log(error);
        }
    },

    /**
     * Hiển thị dialog cảnh báo
     * @param {any} date Ngày tháng
     * Athor: NVMANH (26/08/2022)
     */
    formatDate(date) {
        try {
            if (date) {
                date = new Date(date)
                // Lấy ra ngày:
                let day = date.getDate();
                day = day < 10 ? `0${day}` : day;
                let month = date.getMonth() + 1;
                month = month < 10 ? `0${month}` : month;
                let year = date.getFullYear();
                return `${day}/${month}/${year}`;
            } else {
                return "";
            }
        } catch (error) {
            console.log(error);
            return "";
        }
    },

    /**
     * Định dạng tiền VND
     * @param {Number} money Tiền
     * Athor: NVMANH (26/08/2022)
     */
    formatMoneyVND(money) {
        try {
            money = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(money);
            return money;
        } catch (error) {
            console.log(error);
            return "";
        }
    }
}

/**
 * Gán sự kiện validate tự động cho các input bắt buộc nhập
 * author: DuongTH
 */
$("input[inputempty]").blur(function () {
    try {
        // lấy value:
        var value = $(this).val();
        if (!value) {
            $(this).addClass("input__error");
        } else {
            $(this).removeClass("input__error");
        }
    } catch (error) {
        console.log(error);
    }

})