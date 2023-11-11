export interface ICreateExamReq {
  name: string;
  to_answer: number;
  duration: number;
  class_id: string;
  description: string;
}
export interface ICreateExamQuestReq {
  exam_id: string;
  question: string;
  type: 'german' | 'option';
  answer: string;
  options: string[];
  image?: string;
}
