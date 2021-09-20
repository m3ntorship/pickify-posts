export interface Feedback {
  feedback_body: string;
  feedback_rating: number;
  user: User;
}

export interface User {
  id: string;
  name: string;
  profile_pic: string;
}

export interface Feedbacks {
  feedbacksCount: number;
  feedbacks: Feedback[];
}
