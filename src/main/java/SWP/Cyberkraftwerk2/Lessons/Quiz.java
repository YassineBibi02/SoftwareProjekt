package SWP.Cyberkraftwerk2.Lessons;

import java.util.ArrayList;
import java.util.List;

/**
 * Class representing a Quiz for a saved lesson.
 * Normally consists of an ArrayList of {@link Lessons.Question Questions}, a counter of how many questions already got saved and an id for the quiz, that is 
 * equivalent to the id of the lesson that the quiz is assigned to.
 * @version 14.12.2023
 * @author Tristan Slodowski
 */
public class Quiz {
    // Integer id of this quiz; equivalent to the lesson id this quiz is assigned to
    private int quiz_id;
    // Integer counter of how many question are already assigned to this Quiz
    private int question_count = 0;
    // ArrayList of Questions to be asked during this quiz
    private List<Question> questions = new ArrayList<Question>();

    /**
     * Constructor of the Quiz class, that generates an empty quiz containing only an id.
     * <p> Questions must be added using {@link Quiz#addQuestion(Question) addQuestion} to be able to use this Quiz object.
     * @param id Integer of the lesson id this quiz will be assigned to
     * @author Tristan Slodowski
     */
    public Quiz(int id) {
        this.quiz_id = id;
    }

    /**
     * Constructor of the Quiz class, being able to construct the whole quiz straight away.
     * @param id Integer of the lesson id this quiz will be assigned to
     * @param questions variable number of Question objects to be assigned to this Quiz
     * @author Tristan Slodowski
     */
    public Quiz(int id, Question... questions) {
        this.quiz_id = id;
        for(Question q : questions) {
            this.questions.add(q);
            this.question_count++;
        }
    }

    /**
     * Method to add a Question object to this quiz.
     * This will also increment the question_count counter.
     * @param q Question object to be added to this quiz
     * @author Tristan Slodowski
     */
    public void addQuestion(Question q) {
        this.questions.add(q);
        this.question_count++;
    }

    /**
     * Method to remove a Question object from this quiz by directly specifying the questio to be deleted.
     * @param q Question object supposed to be deleted from this quiz.
     * @return boolean whether the removing was successful
     * @author Tristan Slodowski
     */
    public boolean removeQuestion(Question q) {
        for(int i = 0; i < this.question_count; i++) {
            if(this.questions.get(i).compareQuestions(q)) {
                this.questions.remove(i);
                this.question_count--;
                return true;
            }
        }

        return false;
    }

    /**
     * Method to remove a Question object from this quiz by specifying the question String of the Question object to be deleted.
     * @param question String of the question supposed to be deleted from this quiz
     * @return boolean whether the removing was successful
     * @author Tristan Slodowski
     */
    public boolean removeQuestion(String question) {
        for(int i = 0; i < this.getQuestionCount(); i++) {
            if(this.getQuestions().get(i).getQuestion().equals(question)) {
                this.questions.remove(i);
                this.question_count--;
                return true;
            }
        }

        return false;
    }

    /**
     * Getter of the Question List of this Quiz
     * @return List<Question> of the assigned Questions
     * @author Tristan Slodowski
     */
    public List<Question> getQuestions() {
        return this.questions;
    }

    /**
     * Getter of the id of this quiz.
     * @return Integer id of this quiz; equivalent to the lesson id this quiz is assigned to 
     * @author Tristan Slodowski
     */
    public int getId() {
        return this.quiz_id;
    }

    /**
     * Getter of the question counter of this quiz
     * @return Integer representing how many questions this quiz have been assigned to
     * @author Tristan Slodowski
     */
    public int getQuestionCount() {
        return this.question_count;
    }
}
