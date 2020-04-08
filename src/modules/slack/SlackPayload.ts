export interface SlackPayload {
    "attachments" : Attachment[]
}

export interface Attachment {
    "fallback" : string
    "pretext" : string
    "color" : string
    "fields" : Field[]
}

export interface Field {
    "title" : string
    "value" : string
    "short" : boolean
}
