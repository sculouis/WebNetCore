function OverrideOrgPickerSetting(step) {
    /// <summary>提供cbp-SendSetting.js針對「傳送其他主管同仁」按鈕做最後OrgPicker更改機會</summary>
    /// <param name="step" type="number">目前關卡數</param>
    //
    var customFlowKey = $('#P_CustomFlowKey').val();
    if (customFlowKey.indexOf("EMP") > -1) {
        if (customFlowKey.indexOf("Credit") > -1) {
            switch (step) {
                case 3:
                    return {
                        allowRole: ["MGR"]
                    };
                    break;
                case 4:
                    return {
                        allowRole: ["JA18000220"]
                    };
                    break;
                case 5:
                    return {
                        allowRole: ["JA18000221"]
                    };
                    break;
            }
        } else {
            switch (step) {
                case 3:
                    return {
                        allowRole: ["MGR"]
                    };
                    break;
                case 4:
                    return {
                        allowRole: ["JA08000638"]
                    };
                    break;
                case 5:
                    return {
                        allowRole: ["JA08000636"]
                    };
                    break;
            }
        }
    } else {
        if (customFlowKey.indexOf("Credit") > -1) {
            switch (step) {
                case 2:
                    return {
                        allowRole: ["MGR"]
                    };
                    break;
                case 3:
                    return {
                        allowRole: ["JA18000220"]
                    };
                    break;
                case 4:
                    return {
                        allowRole: ["JA18000221"]
                    };
                    break;
            }
        } else {
            switch (step) {
                case 2:
                    return {
                        allowRole: ["MGR"]
                    };
                    break;
                case 3:
                    return {
                        allowRole: ["JA08000638"]
                    };
                    break;
                case 4:
                    return {
                        allowRole: ["JA08000636"]
                    };
                    break;
            }
        }
    }
}