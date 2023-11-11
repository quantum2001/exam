import mongoose from 'mongoose';
declare const Model: mongoose.Model<{
    class: mongoose.Types.ObjectId;
    created_at: number;
    password: string;
    updated_at: number;
    firstname: string;
    lastname: string;
    access_id: number;
    school_id: string;
    middlename?: string | undefined;
    image?: string | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    class: mongoose.Types.ObjectId;
    created_at: number;
    password: string;
    updated_at: number;
    firstname: string;
    lastname: string;
    access_id: number;
    school_id: string;
    middlename?: string | undefined;
    image?: string | undefined;
}> & {
    class: mongoose.Types.ObjectId;
    created_at: number;
    password: string;
    updated_at: number;
    firstname: string;
    lastname: string;
    access_id: number;
    school_id: string;
    middlename?: string | undefined;
    image?: string | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    class: mongoose.Types.ObjectId;
    created_at: number;
    password: string;
    updated_at: number;
    firstname: string;
    lastname: string;
    access_id: number;
    school_id: string;
    middlename?: string | undefined;
    image?: string | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    class: mongoose.Types.ObjectId;
    created_at: number;
    password: string;
    updated_at: number;
    firstname: string;
    lastname: string;
    access_id: number;
    school_id: string;
    middlename?: string | undefined;
    image?: string | undefined;
}>> & mongoose.FlatRecord<{
    class: mongoose.Types.ObjectId;
    created_at: number;
    password: string;
    updated_at: number;
    firstname: string;
    lastname: string;
    access_id: number;
    school_id: string;
    middlename?: string | undefined;
    image?: string | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default Model;
