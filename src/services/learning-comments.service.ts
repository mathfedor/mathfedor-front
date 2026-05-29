import api from './api.config';

export interface LearningCommentAuthor {
  name: string;
  userId: string;
  role: string;
  avatar?: string;
}

export interface LearningReply {
  id?: string;
  _id?: string;
  author: LearningCommentAuthor;
  content: string;
  likes?: number;
  createdAt?: string;
}

export interface LearningComment {
  id?: string;
  _id?: string;
  learningId: string;
  topicId: string;
  author: LearningCommentAuthor;
  content: string;
  likes?: number;
  replies?: LearningReply[];
  createdAt?: string;
}

export interface CreateLearningCommentPayload {
  learningId: string;
  topicId: string;
  content: string;
  author: LearningCommentAuthor;
}

export interface CreateLearningReplyPayload {
  content: string;
  author: LearningCommentAuthor;
}

class LearningCommentsService {
  async getComments(learningId: string, topicId: string): Promise<LearningComment[]> {
    const response = await api.get<LearningComment[]>(`/learning/comments/${learningId}/${topicId}`);
    return response.data;
  }

  async createComment(payload: CreateLearningCommentPayload): Promise<LearningComment> {
    const response = await api.post<LearningComment>('/learning/comments', payload);
    return response.data;
  }

  async createReply(commentId: string, payload: CreateLearningReplyPayload): Promise<LearningReply> {
    const response = await api.post<LearningReply>(`/learning/comments/${commentId}/replies`, payload);
    return response.data;
  }
}

export const learningCommentsService = new LearningCommentsService();
