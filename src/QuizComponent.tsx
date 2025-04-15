import { atom, useAtom } from "jotai";
import {
  Box,
  Text,
  Button,
  Progress,
  Heading,
  Container,
} from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa6";
import { useState } from "react";

interface SubQuestion {
  id: string;
  question: string;
  description?: string;
  options: string[];
}

interface Question {
  id: number;
  question: string;
  description?: string;
  options?: string[];
  prefer?: string;
  lastStep?: boolean;
  subQuestions?: SubQuestion[];
}

const currentQuestionIndexAtom = atom<number>(0);
const answersAtom = atom<Record<string, string>>({});

const questions: Question[] = [
  {
    id: 1,
    question: "What's your gender?",
    options: ["MALE", "FEMALE", "NON-BINARY"],
    prefer: "Prefer not to say",
  },
  {
    id: 2,
    question: "How old are you?",
    options: ["Under 18", "18-25", "26-35", "36-45", "46+"],
    prefer: "Prefer not to say",
  },
  {
    id: 3,
    question: "Have you taken any online courses during the last year?",
    description: "We’ll use this to tailor courses just for you",
    options: ["Yes", "No"],
  },
  {
    id: 4,
    question: "Tell us more about your background",
    subQuestions: [
      {
        id: "education",
        question: "No worries if you're new to this!",
        description:
          "Our programs are designed to be easy to follow, engaging, and effective—no prior experience needed.",
        options: ["Let’s make it!"],
      },
      {
        id: "experience",
        question:
          "That’s awesome! It sounds like you’re familiar with online learning.",
        description:
          "Let’s make this experience even better and more tailored to your needs!",
        options: ["Let’s make it!"],
      },
    ],
  },
  {
    id: 5,
    question: "Congratulation!",
    lastStep: true,
  },
];

const QuizComponent = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useAtom(
    currentQuestionIndexAtom
  );
  const [answers, setAnswers] = useAtom(answersAtom);
  const [subQuestionIndex, setSubQuestionIndex] = useState<number>(0);

  const currentQuestion = questions[currentQuestionIndex];
  const hasSubQuestions = !!currentQuestion.subQuestions;
  const currentSubQuestion = hasSubQuestions
    ? currentQuestion.subQuestions?.[subQuestionIndex]
    : null;
  const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (option: string) => {
    if (hasSubQuestions && currentSubQuestion) {
      const key = `${currentQuestion.id}_${currentSubQuestion.id}`;
      setAnswers((prev) => ({ ...prev, [key]: option }));

      setTimeout(() => {
        if (
          subQuestionIndex <
          (currentQuestion.subQuestions?.length ?? 0) - 1
        ) {
          setSubQuestionIndex((prev) => prev + 1);
        } else {
          setSubQuestionIndex(0);
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
          }
        }
      }, 300);
    } else {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (hasSubQuestions && subQuestionIndex > 0) {
      setSubQuestionIndex((prev) => prev - 1);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSubQuestionIndex(0);
    }
  };

  const renderQuestionText = (
    question: string,
    description?: string,
    lastStep?: boolean
  ) => (
    <>
      <Text
        mb={description ? "16px" : "24px"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={lastStep ? "70vh" : "auto"}
        color="#191919"
        fontSize={26}
        fontWeight={700}
        textAlign="center"
      >
        {question}
      </Text>

      {description && (
        <Text
          fontWeight={400}
          fontSize={14}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="#5A5A5A"
          mb="24px"
          textAlign="center"
        >
          {description}
        </Text>
      )}
    </>
  );

  return (
    <Container maxW="container.md" py={8}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        {!(currentQuestionIndex === 0 && subQuestionIndex === 0) && (
          <Box
            cursor="pointer"
            position="absolute"
            left={0}
            top={1}
            onClick={handlePrevious}
          >
            <FaArrowLeft />
          </Box>
        )}
        <Heading fontSize={16} color="#191919" fontWeight={500} as="h3" mb={4}>
          Personal information
        </Heading>
      </Box>

      <Progress
        value={progressValue}
        size="sm"
        mb={8}
        backgroundColor="#E0E0E0"
        borderRadius={10}
        sx={{ "& > div": { backgroundColor: "#73C371" } }}
      />

      {hasSubQuestions && currentSubQuestion ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="70vh"
          textAlign="center"
        >
          {renderQuestionText(
            currentSubQuestion.question,
            currentSubQuestion.description
          )}
          <Box
            display="flex"
            justifyContent="center"
            gap={2}
            flexWrap="wrap"
            mb={6}
            width="100%"
          >
            {currentSubQuestion.options.map((option) => (
              <Button
                key={option}
                onClick={() => handleOptionSelect(option)}
                borderRadius={55}
                fontWeight={600}
                fontSize={16}
                backgroundColor="#73C371"
                color="#F5F5F7"
                width="100%"
                textTransform="uppercase"
              >
                {option}
              </Button>
            ))}
          </Box>
        </Box>
      ) : (
        <>
          {renderQuestionText(
            currentQuestion.question,
            currentQuestion.description,
            currentQuestion.lastStep
          )}
          <Box
            display="flex"
            justifyContent="center"
            gap={2}
            flexWrap="wrap"
            mb={6}
          >
            {currentQuestion.options?.map((option) => (
              <Button
                key={option}
                variant="outline"
                width="156px"
                onClick={() => handleOptionSelect(option)}
                colorScheme={
                  answers[currentQuestion.id] === option ? "blue" : "gray"
                }
                borderRadius={55}
                fontWeight={600}
                fontSize={16}
              >
                {option}
              </Button>
            ))}
          </Box>

          {currentQuestion.prefer && (
            <Text
              onClick={() => handleOptionSelect(currentQuestion.prefer!)}
              fontWeight={600}
              fontSize={16}
              display="flex"
              alignItems="center"
              justifyContent="center"
              textTransform="uppercase"
              color="#5A5A5A"
              cursor="pointer"
            >
              {currentQuestion.prefer}
            </Text>
          )}
        </>
      )}
    </Container>
  );
};

export default QuizComponent;
