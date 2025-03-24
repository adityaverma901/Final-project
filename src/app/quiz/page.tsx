'use client'; // Ensure the component is treated as a client-side component

import { useState } from 'react';
import styles from './quiz.module.css';
import Navdash from '@/components/nav-dash';
import Image from 'next/image';

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);

  // Questions for personality and stress management
  const questions = [
    "How often do you feel stressed in your daily life?",
    "When you are stressed, do you find it difficult to calm down?",
    "Do you have strategies to cope with stress (e.g., meditation, exercise)?",
    "Do you tend to bottle up your emotions when stressed, or do you express them?",
    "How often do you feel overwhelmed by your responsibilities?",
    "When facing a stressful situation, do you seek help from others?",
    "Do you often feel physically affected by stress (e.g., headaches, tension)?",
    "Do you find it difficult to relax or switch off after a stressful day?",
    "Do you believe that your stress levels impact your overall well-being?",
    "How often do you feel that stress is a significant part of your life?"
  ];

  // Handle user's answer
  const handleAnswer = (value: number) => {
    const updatedResponses = [...responses];
    updatedResponses[step] = value;
    setResponses(updatedResponses);
  };

  // Calculate the result based on responses
  const calculateResults = () => {
    const positiveAnswers = responses.filter(response => response >= 4).length;
    const negativeAnswers = responses.filter(response => response <= 2).length;

    if (positiveAnswers > negativeAnswers) {
      setResult("You have a good understanding of your stress and have effective strategies to manage it.");
    } else if (negativeAnswers > positiveAnswers) {
      setResult("You may struggle with stress and could benefit from exploring new stress management techniques.");
    } else {
      setResult("You have a balanced approach to stress, but may want to further refine your coping strategies.");
    }
  };

  // Reset the quiz state to retake the quiz
  const retakeQuiz = () => {
    setStep(0);
    setResponses([]);
    setResult(null);
  };

  // Display the result after the quiz
  const displayResult = () => {
    return (
      <div className={styles.resultContainer}>
        <h3 className={styles.resultHeading}>Your Stress Management Result</h3>
        <p className={styles.resultText}>{result}</p>
        <button onClick={retakeQuiz} className={styles.retakeButton}>Retake Quiz</button>
      </div>
    );
  };

  return (
    <>
      <Navdash />
      <div className={styles.pageBackground}>
      <div className={styles.imageContainer}>
          <Image
            src="/quiz.jpg" // Ensure the image is in the public folder
            alt="Stress management illustration"
            width={400} // Reduced size
            height={300} // Adjusted height to maintain aspect ratio
            className={styles.quizImage}
          />
        </div>
        <div className={styles.quizContainer}>
          <h2 className={styles.quizHeading}>Personality Analysis Quiz</h2>
          <p className={styles.quizPurpose}>
            This quiz is designed to help you understand your personality traits better. Answer the following questions honestly to get your results!
          </p>

          {result ? (
            displayResult()
          ) : (
            <>
              <h3 className={styles.question}>{questions[step]}</h3>
              <div className={styles.buttonsContainer}>
                {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map((label, index) => (
                  <label key={index} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name={`question-${step}`} // Correct template literal
                      value={index + 1}
                      onChange={() => handleAnswer(index + 1)}
                      className={styles.radioButton}
                    />
                    <span className={styles.radioText}>{label}</span>
                  </label>
                ))}
              </div>
              <div className={styles.navigation}>
                {step > 0 && (
                  <button onClick={() => setStep(step - 1)} className={styles.navButton}>Previous</button>
                )}
                {step < questions.length - 1 ? (
                  <button onClick={() => setStep(step + 1)} className={styles.navButton}>Next</button>
                ) : (
                  <button onClick={calculateResults} className={styles.submitButton}>Submit</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
