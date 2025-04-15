import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import QuizComponent from "./QuizComponent";

createRoot(document.getElementById("root")!).render(
  <ChakraProvider>
    <QuizComponent />
  </ChakraProvider>
);
