/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Schema } from 'mongoose';
declare const Model: import("mongoose").Model<{
    created_at: number;
    questions: import("mongoose").Types.DocumentArray<{
        type: "option" | "german";
        options: string[];
        question: string;
        question_id: string;
    }>;
    exam_session_id?: string | undefined;
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    created_at: number;
    questions: import("mongoose").Types.DocumentArray<{
        type: "option" | "german";
        options: string[];
        question: string;
        question_id: string;
    }>;
    exam_session_id?: string | undefined;
}> & {
    created_at: number;
    questions: import("mongoose").Types.DocumentArray<{
        type: "option" | "german";
        options: string[];
        question: string;
        question_id: string;
    }>;
    exam_session_id?: string | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    created_at: number;
    questions: import("mongoose").Types.DocumentArray<{
        type: "option" | "german";
        options: string[];
        question: string;
        question_id: string;
    }>;
    exam_session_id?: string | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    created_at: number;
    questions: import("mongoose").Types.DocumentArray<{
        type: "option" | "german";
        options: string[];
        question: string;
        question_id: string;
    }>;
    exam_session_id?: string | undefined;
}>> & import("mongoose").FlatRecord<{
    created_at: number;
    questions: import("mongoose").Types.DocumentArray<{
        type: "option" | "german";
        options: string[];
        question: string;
        question_id: string;
    }>;
    exam_session_id?: string | undefined;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>>;
export default Model;
