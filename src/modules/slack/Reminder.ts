export interface Reminder{
    /**
     * slackのincoming webhook
     */
    slackUrl : string

    /**
     * slackに明日の予定のリマインドを送る
     * @param events 明日のeventの配列
     */
    sendTomorrowRemind(events : GoogleAppsScript.Calendar.CalendarEvent[]) : void

    /**
     * event直前にリマインドを送る
     * @param events 10分いないのeventの配列
     */
    sendBeforeEventRemind(events : GoogleAppsScript.Calendar.CalendarEvent[]) : void
}