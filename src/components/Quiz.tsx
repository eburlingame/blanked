import { QuizType } from "@/util/models";

export type QuizProps = {
  quiz: QuizType;
};

const Quiz = ({ quiz }: QuizProps) => {
  return <>{quiz.name && <h1>{quiz.name}</h1>}</>;
};

export default Quiz;
