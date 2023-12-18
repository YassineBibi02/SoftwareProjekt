package SWP.Cyberkraftwerk2.Lessons;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Class representing a singular question of a {@link SWP.Cyberkraftwerk2.Lessons.Quiz quiz} for a lesson entry.
 * Normally consists of String for the question, right answer and a String array of wrong answers.
 * @version 14.12.2023
 * @author Tristan Slodowski
 */
public class Question {
    // String of the question to be asked by this Question object
    private String question;
    // String of the right answer to the question
    private String right_answer;
    // ArrayList of the wrong answers to the question
    private List<String> wrong_answers = new ArrayList<String>();

    /**
     * Constructor of the Question class, creating an empty Question.
     * The actual content of the Question must be set by using {@link Question#setQuestion(String) setQuestion}, {@link Question#setRightAnswer(String) setRightAnswer} and
     * {@link Question#addWrongAnswer(String) addWrongAnswer} before the Question can be properly used.
     * @author Tristan Slodowski
     */
    public Question() {

    }

    /**
     * Constructor of the Question class, being able to build a Question straight away.
     * @param question String of the question to be asked
     * @param right String of the right answer for the question
     * @param wrong String array of the wrong answers to the question
     * @author Tristan Slodowski
     */
    public Question(String question, String right, String... wrong) {
        this.question = question;
        this.right_answer = right;
        for(String answer : wrong) {
            this.wrong_answers.add(answer);
        }
    }

    /**
     * Setter function for the question to be asked
     * @param q String of the question to be asked
     * @author Tristan Slodowski
     */
    public void setQuestion(String q) {
        this.question = q;
    }

    /**
     * Setter function for the right answer to the question
     * @param answer String of the right answer
     * @author Tristan Slodowski
     */
    public void setRightAnswer(String answer) {
        this.right_answer = answer;
    }

    /**
     * Function to add a wrong answer to the list of saved wrong answers.
     * <p> All saved wrong answers will be sorted by their names.
     * @param answer String of a wrong answer to be displayed for this question
     * @author Tristan Slodowski
     */
    public void addWrongAnswer(String answer) {
        this.wrong_answers.add(answer);
        Collections.sort(this.wrong_answers);
    }

    /**
     * Getter for the question to be asked
     * @return String of the question to be asked by this Question object
     * @author Tristan Slodowski
     */
    public String getQuestion() {
        return this.question;
    }

    /**
     * Getter for the right answer to this question
     * @return String of the right answer
     * @author Tristan Slodowski
     */
    public String getRightAnswer() {
        return this.right_answer;
    }

    /**
     * Getter for the saved list of wrong answers to this questions.
     * <p> Notice that the wrong answers will be returned as a String array and not a List<String>
     * @return String array of all the wrong answers
     * @author Tristan Slodowski
     */
    public String[] getWrongAnswers() {
        String[] result = new String[this.wrong_answers.size()];
        for(int i = 0; i < this.wrong_answers.size(); i++) {
            result[i] = this.wrong_answers.get(i);
        }

        return result;
    }

    /**
     * Method to compare one Question with another.
     * <p> Returns true if both Question object have the same values.
     * @param other Question object to compare with
     * @return boolean whether both Question objects are the same or not
     * @author Tristan Slodowski
     */
    public boolean compareQuestions(Question other) {
        boolean questions = this.getQuestion().equals(other.getQuestion());
        boolean corr_answer = this.getRightAnswer().equals(other.getRightAnswer());

        boolean wrng_answers = true;
        if(this.getWrongAnswers().length == other.getWrongAnswers().length) {
            for(int i = 0; i < this.getWrongAnswers().length; i++) {
                if(!this.getWrongAnswers()[i].equals(other.getWrongAnswers()[i])) {
                    wrng_answers = false;
                    break;
                }
            }
        } else {
            wrng_answers = false;
        }

        return questions && corr_answer && wrng_answers;
    }
}
