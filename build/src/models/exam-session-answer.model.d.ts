import mongoose from 'mongoose';
declare const Model: mongoose.Model<{
    created_at: number;
    updated_at: number;
    school_id: string;
    exam_id: string;
    exam_session_id: string;
    graded: boolean;
    answers: mongoose.Types.DocumentArray<{
        exam_question?: mongoose.Types.ObjectId | undefined;
        selected_answer?: string | undefined;
    }>;
    student?: mongoose.Types.ObjectId | undefined;
    score?: number | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    created_at: number;
    updated_at: number;
    school_id: string;
    exam_id: string;
    exam_session_id: string;
    graded: boolean;
    answers: mongoose.Types.DocumentArray<{
        exam_question?: mongoose.Types.ObjectId | undefined;
        selected_answer?: string | undefined;
    }>;
    student?: mongoose.Types.ObjectId | undefined;
    score?: number | undefined;
}> & {
    created_at: number;
    updated_at: number;
    school_id: string;
    exam_id: string;
    exam_session_id: string;
    graded: boolean;
    answers: mongoose.Types.DocumentArray<{
        exam_question?: mongoose.Types.ObjectId | undefined;
        selected_answer?: string | undefined;
    }>;
    student?: mongoose.Types.ObjectId | undefined;
    score?: number | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    created_at: number;
    updated_at: number;
    school_id: string;
    exam_id: string;
    exam_session_id: string;
    graded: boolean;
    answers: mongoose.Types.DocumentArray<{
        exam_question?: mongoose.Types.ObjectId | undefined;
        selected_answer?: string | undefined;
    }>;
    student?: mongoose.Types.ObjectId | undefined;
    score?: number | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    created_at: number;
    updated_at: number;
    school_id: string;
    exam_id: string;
    exam_session_id: string;
    graded: boolean;
    answers: mongoose.Types.DocumentArray<{
        exam_question?: mongoose.Types.ObjectId | undefined;
        selected_answer?: string | undefined;
    }>;
    student?: mongoose.Types.ObjectId | undefined;
    score?: number | undefined;
}>> & mongoose.FlatRecord<{
    created_at: number;
    updated_at: number;
    school_id: string;
    exam_id: string;
    exam_session_id: string;
    graded: boolean;
    answers: mongoose.Types.DocumentArray<{
        exam_question?: mongoose.Types.ObjectId | undefined;
        selected_answer?: string | undefined;
    }>;
    student?: mongoose.Types.ObjectId | undefined;
    score?: number | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default Model;
