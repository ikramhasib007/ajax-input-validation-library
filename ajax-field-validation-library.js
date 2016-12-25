/* 
 * Ajax input field validation library v1.0
 * Creator Ikram - Ud - Daula. Software Engineer at Comit Solutions Limited.
 * Github : https://github.com/ikramhasib007 
 * skype : ikramhasib007
 * email : ikramhasib007@gmail.com
 * ------------------------------------------------------------------------------
 * 
 * Documentation:
 * ---------------------------------------------
 * This is advanced programming code.
 * For styling here i use Bootstrap 3
 * Here i use Javascript, Ajax and Promise API.
 * No jQuery uses here.
 * you can use any framework by customize the code.
 * I create and test to the codeigniter 3 framework.
 * 
 * Step 1:
 * You know that advanced level programming, so don't worry. it develop the most 
 * esier concept.
 * You install a codeigniter project and display the data form database to the controller.
 * You display the data from your controller by using json_encode() function.
 * Here is a sample of controller and model function by demonstration purpose.
 * Controller function:
 * public function get_sms($id = NULL) {
	 if (!is_null($id)) {
		 //$id not null
		 $result = $this->notice_model->get_sms_info($id);
		 echo json_encode($result);
		 exit();
	 } else {
		 //$id null
		 $result = $this->notice_model->get_sms_info();
		 echo json_encode($result);
		 exit();
	}
	return false;
 }
 * 
 * Model function:
 * public function get_sms_info($id = NULL) {
	 if (!is_null($id)) {
		 //$id not null
		 return $this->db->where("id", $id)->get("notice_sms")->row();
	 } else {
		 //$id null
		 return $this->db->select("*")->from("notice_sms")->get()->result();
	 }
	 return false;
 }
 * 
 * View: 
 * this is a as usual form. i only show a input field html which we make validate 
 * from our existing data from the database.
 * if the data is already exists in the database. it popup a label with bootstrap
 * text-danger class. 
 * It also verify the input text is string or else.
 * That's time we make for the string. 
 * 
 * Here is a view page code:
 * <div class="form-group">
	<label class="control-label">Title <span class="text-danger">*</span></label>
		<input type="text" name="sms_title" id="sms_title" class="form-control" required="required" placeholder="SMS Title" oninput="_field_validate(<?php echo "'" . site_url("notice/get_sms") . "'"; ?>, 'sms_title')" >
	</div>
 * 
 * when you submit the form. you check your entire form for id #alert-field.
 * If you found any id named alert-field then you could not submit the form.
 * and focus the the field. then you successfully validate the that field with associate 
 * your database data.
 * there is all.
 * 
 */

var xmlHttp = createXMLHttpRequestObject();

/*
 * Catch ActiveXObject|XMLHttpRequest
 * @returns {ActiveXObject|XMLHttpRequest|Boolean}
 */

function createXMLHttpRequestObject() {
    var xmlHttp;
    if (window.ActiveXObject) {
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP"); //IE and If the Javascript version is greater than 5.
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); // IE
            } catch (E) {
                xmlHttp = false;
            }
        }
    } else {
        try {
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            xmlHttp = false;
        }
    }
    if (!xmlHttp) {
        alert("Sorry, Http Object doesn't created.");
    } else {
        return xmlHttp;
    }
}

/*
 * for return ajax called data using promise API
 */
function get_data(url, id, id2) {
    id = typeof id !== 'undefined' ? id : false;
    id2 = typeof id2 !== 'undefined' ? id2 : false;
    return new Promise(function (resolve, reject) {
        if (id && id2) {
            xmlHttp.open("GET", url + "/" + id + "/" + id2, true);
        } else {
            if (id) {
                xmlHttp.open("GET", url + "/" + id, true);
            } else {
                xmlHttp.open("GET", url, true);
            }
        }
        xmlHttp.onerror = reject;
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                resolve(JSON.parse(this.responseText));
            }
        };
        xmlHttp.send(null);
    });
}

/*
 * any field check function
 * must be same as input field name, id and database field name
 */

function _field_validate(url, fieldId) {
    //you can customize that chars if you want. this demo data.
    var chars = /[^a-zA-Z 0-9_@(),.?!:%]/g;
    var elem = document.getElementById(fieldId);
    if (typeof elem !== 'undefined' && elem !== null) {
        var input = document.getElementById(fieldId).value;
        var flag = 0;
        if (!input) {
            //for remove old alert
            remove_field_error_msg(fieldId);
            return false;
        } else if (chars.test(input)) {
            field_error_msg(flag, fieldId);
            return false;
        } else {
            get_data(url).then(function (result) {
                if (!result) {
                    return false;
                } else {
                    var i = 0;
                    result.forEach(function () {
                        if (result[i][fieldId].toLowerCase() === input.toLowerCase()) {
                            flag = 1;
                            //show error msg.
                            field_error_msg(flag, fieldId);
                        }
                        i++;
                    });
                    if (!flag) {
                        //for remove old alert.
                        remove_field_error_msg(fieldId);
                        flag = 0;
                    }
                }
            });
        }
    }
}
/*
 * field_error_msg() show the error msg
 */

function field_error_msg(flag, fieldId) {
    var elem = document.getElementById(fieldId);
    if (typeof elem !== 'undefined' && elem !== null) {
        var parent = document.getElementById(fieldId).parentNode;
        //for remove old alert
        remove_field_error_msg(fieldId);
        // Remove old alert end
        flag = typeof flag !== 'undefined' ? flag : false;
        var alertNode = document.createElement('p');
        //you can customize that className of your field label class. it would be same.
        var className = "control-label";
        var el = document.getElementById(fieldId);
        while (el.previousSibling && el.previousSibling.className != className) {
            el = el.previousSibling;
        }
        var fieldLabel = el.previousSibling.textContent.replace(" *", '');
        if (flag === 1) {
            //you can customize the display msg for already exists.
            alertNode.innerHTML = 'This ' + fieldLabel.toLowerCase() + ' already exists!';
        } else if (flag === 0) {
            //you can customize the display msg for incorrect string.
            alertNode.innerHTML = 'This ' + fieldLabel.toLowerCase() + ' is not correct. please enter the string.';
        }
        alertNode.id = 'alert-field';
        //you can customize the display setting or class
        alertNode.className = 'text-danger';
        alertNode.style.margin = 0 + "px";
        alertNode.style.paddingLeft = 6 + "px";
        
        parent.appendChild(alertNode);
    }
}

/*
 * remove_field_error_msg() remove the error msg
 */

function remove_field_error_msg(fieldId) {
    var elem = document.getElementById(fieldId);
    if (typeof elem !== 'undefined' && elem !== null) {
        var parent = document.getElementById(fieldId).parentNode;
        var removeAlertNode = document.getElementById("alert-field");
        if (typeof removeAlertNode !== 'undefined' && removeAlertNode !== null) {
            parent.removeChild(removeAlertNode);
        }
    }
}

/*
 * Now you can call this _field_validate() from your input field with two argument
 * argument one : url with enclosed qoute
 * argument two : input field id
 * 
 * must be same as input field name, id and database field name
 * 
 * i call this oninput event. 
 * you call this what you need.
 * 
 * oninput="_field_validate(<?php echo "'" . site_url("notice/get_sms") . "'"; ?>, 'sms_title')"
 * 
 * Then you submit your form by jQuery
 * $("form#test-form").on("submit", function (e) {
        e.preventDefault();
        var alertfield = $("#sms_title").parent().find("#alert-field")[0];
        if (alertfield) {
            $("#sms_title").focus();
            console.log(alertfield);
        } else {
            alert(" you can go now");
        }
    });
 * 
 * 
 * That's all. thank you. 
 */


