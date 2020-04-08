import {SlackPayload,Field} from './SlackPayload'

export const makeSlackPayload = (events : GoogleAppsScript.Calendar.CalendarEvent[]) : SlackPayload => {
    const fields : Field[] = []
    for(let event of events){
        const eventField : Field = {
            title : "Event",
            value : event.getTitle(),
            short : false
        }
        let timeStr : string
        if(event.isAllDayEvent()){
            timeStr = "All day"
        }else{
            const startTime : GoogleAppsScript.Base.Date = event.getStartTime()
            const endTime : GoogleAppsScript.Base.Date = event.getEndTime()
            timeStr = startTime.getHours()+':'+startTime.getMinutes()+'-'+endTime.getHours()+':'+endTime.getMinutes()
        }
        const timeFiled : Field = {
            title : "Time",
            value : timeStr,
            short : true
        }
        const detailField = {
            title : "Detail",
            value : event.getDescription(),
            short : false
        }

        fields.push(eventField)
        fields.push(timeFiled)
        fields.push(detailField)
    }

    return {
        attachments : [
            {
                fallback : '明日の予定だよ〜〜〜',
                pretext : '明日の予定だよ〜〜〜',
                color : '#D00000',
                fields : fields
            }
        ]
    }
}