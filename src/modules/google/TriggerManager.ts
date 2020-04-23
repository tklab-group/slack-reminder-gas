export const BEFORE_EVENT_REGEX : string = "BEFORE_REMIND"
const beforeRemindFuncName = "beforeEventRemind"

export const setBeforeEventTrigger = (events : GoogleAppsScript.Calendar.CalendarEvent[]) => {
    removeAllTrigger(beforeRemindFuncName)
    const beforeEventRegex : RegExp = new RegExp(BEFORE_EVENT_REGEX)
    const beforeRemindEventArr : GoogleAppsScript.Calendar.CalendarEvent[] = []

    for(let event of events){
        const match = beforeEventRegex.exec(event.getDescription())
        if(match){
            beforeRemindEventArr.push(event)
        }
    }

    for(let event of beforeRemindEventArr){
        const tenMinuteBefore : Date = new Date(event.getStartTime().getTime() - 10 * 60 * 1000)
        setTrigger(tenMinuteBefore, beforeRemindFuncName)
    }
}

const removeAllTrigger = (functionName : string) : void => {
    const triggers : GoogleAppsScript.Script.Trigger[] = ScriptApp.getProjectTriggers()

    for(let trigger of triggers){
        if(functionName == trigger.getHandlerFunction()){
            ScriptApp.deleteTrigger(trigger)
        }
    }
}

const setTrigger = (date : Date, functionName : string) : void => {
    ScriptApp.newTrigger(functionName)
        .timeBased()
        .at(date)
        .create();
}

