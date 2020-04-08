import {SlackPayload,Field} from './SlackPayload'

/**
 * slackのincoming webhookにpostするpayloadを作成
 * @param events regExpにマッチするdescriptionを持つeventの配列
 * @param regExp 通知が必要なパターン.　通知を送る内容を取得するために'()'を一つ含んでいる必要がある
 */
export const makeSlackPayload = (events : GoogleAppsScript.Calendar.CalendarEvent[], regExp : RegExp) : SlackPayload => {
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

        const matches : string[] = regExp.exec(event.getDescription())

        const detailField = {
            title : "Detail",
            value : matches[1],
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