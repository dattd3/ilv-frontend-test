import moment from 'moment'
import Constants from '../../commons/Constants'

export default function processingDataReq (dataRawFromApi, tab)  {
    let taskList = [];
        dataRawFromApi.forEach(element => {
            if(element.requestTypeId == Constants.ONBOARDING) {
                taskList.push(element);
            }else{
                if(element.requestInfo) {
                    element.requestInfo.forEach(e => {
                        e.user = element.user
                        e.appraiser = element.appraiser
                        e.requestType = element.requestType
                        e.requestTypeId = element.requestTypeId
                        e.startDate = e.startDate ? moment(e.startDate).format("DD/MM/YYYY") : '';
                        if(element.requestTypeId == Constants.IN_OUT_TIME_UPDATE || element.requestTypeId == Constants.SUBSTITUTION)
                        {
                          e.processStatusId = element.processStatusId
                          e.id = element.id.toString()
                          e.startDate = moment(e.date).format("DD/MM/YYYY")
                        }
                        if( element.requestTypeId == Constants.RESIGN_SELF) {
                            e.appraiser = element.appraiserInfo ? element.appraiserInfo : {}
                        }
                        if(e.processStatusId == 8 || (e.processStatusId == 5 &&  tab == "approval")) {
                            e.canChecked = true
                        }
                        taskList.push(e);
                    })
                }
            }
          });

            taskList =  taskList.filter(function(e, index ,b) {
                if(e.requestTypeId == Constants.ONBOARDING) {
                    return e;
                }
                var k = b.map(z => z.id)
                if(k.includes(e.id, index+1)){
                    var indexPosition = k.indexOf(e.id, index+1);
                    b[indexPosition].startDate = (e.startDate+",\r"+b[indexPosition].startDate);
                }else{
                    e.startDate =  e.startDate;
                    return e;
                }
            });
    return taskList
} 