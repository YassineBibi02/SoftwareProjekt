package SWP.Cyberkraftwerk2.Module;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

/**
 * Class representing a tracker for the completion of a lesson quiz.
 * A single tracker contains an id, equal to the lesson id of the bound quiz and Lists of user ids of the users that have either attempted the corresponding quiz or have successfully passed it.
 * @version 19.12.2023
 * @author Tristan Slodowski
 */
@Getter
@Entity
@Table(name = "QuizCompletions")
public class QuizCompletion {
    // Integer Id to discern the tracker from others; corresponds to the lesson id of the bound quiz
    @Id
    private int id;

    // List<Integer> of the user ids that have attempted the quiz but have not cleared it
    private List<Integer> users_attempted;
    // List<Integer> of the user ids that have successfully cleared the quiz
    private List<Integer> users_accomplished;

    /**
     * Default constructer of a QuizCompletion tracker.
     * <p> Implements the lists of users as ArrayLists
     * @param id Integer id of the lesson this tracker will keep track of
     * @author Tristan Slodowski
     */
    public QuizCompletion(int id) {
        this.id = id;
        this.users_attempted = new ArrayList<Integer>();
        this.users_accomplished = new ArrayList<Integer>();
    }

    public QuizCompletion() {}

    /**
     * Method to add a user to the list of attempted users.
     * <p> Won't add the user if they're either already listed in the Attempted-List or if they've already cleared the quiz (aka are already listed in the Accomplished-List).
     * @param user User object of the user to be added to the list of attempted users
     * @author Tristan Slodowski
     */
    public void addAttemptedUser(User user) {
        int user_id = user.get_ID();

        if(!this.users_attempted.contains(user_id) && !this.users_accomplished.contains(user_id)) {     // User nur hinzufuegen wenn dieser nicht auf der Liste existiert und auch nicht das Quiz bereits bestanden hat
            this.users_attempted.add(user_id);
        }
    }

    /**
     * Method to remove a user from the list of attempted users.
     * <p> Returns a boolean whether the user was successfully found and removed from the list.
     * @param user User object of the user to be removed from the list of attempted users.
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    public boolean removeAttemptedUser(User user) {
        int user_id = user.get_ID();

        if(this.users_attempted.contains(user_id)) {
            int index = this.users_attempted.indexOf(user_id);
            this.users_attempted.remove(index);
            return true;
        }
        
        return false;
    }

    /**
     * Method to get the list of user ids that have attempted the quiz.
     * @return List<Integer> of the user ids that have attempted the quiz.
     * @author Tristan Slodowski
     */
    public List<Integer> getAttemptedList() {
        return this.users_attempted;
    }

    /**
     * Method to get the list of user ids that have attempted the quiz as a Integer array.
     * @return Integer array of the user ids that have attempted the quiz.
     * @author Tristan Slodowski
     */
    public int[] getAttemptedIds() {
        int[] out = new int[this.users_attempted.size()];
        for(int i = 0; i < this.users_attempted.size(); i++) {
            out[i] = this.users_attempted.get(i);
        }

        return out;
    }


    /**
     * Method to add a user to the list of accomplished users.
     * <p> Won't add the user if they're already listed in the Accomplished-List. Will also remove the user from the Attempted-List if they've been listed there.
     * @param user User object of the user to be added to the list of accomplished users
     * @author Tristan Slodowski
     */
    public void addAccomplishedUser(User user) {
        int user_id = user.get_ID();

        if(!this.users_accomplished.contains(user_id)) {
            this.users_accomplished.add(user_id);

            if(this.users_attempted.contains(user_id)) {
                int index = this.users_attempted.indexOf(user_id);
                this.users_attempted.remove(index);
            }
        }
    }

    /**
     * Method to remove a user from the list of accomplished users.
     * <p> Returns a boolean whether the user was successfully found and removed from the list.
     * @param user User object of the user to be removed from the list of accomplished users.
     * @return boolean whether the operation was successful
     * @author Tristan Slodowski
     */
    public boolean removeAccomplishedUser(User user) {
        int user_id = user.get_ID();

        if(this.users_accomplished.contains(user_id)) {
            int index = this.users_accomplished.indexOf(user_id);
            this.users_accomplished.remove(index);
            return true;
        }

        return false;
    }

    /**
     * Method to get the list of user ids that have accomplished the quiz as a generic list.
     * @return List<Integer> of the user ids that have accomplished the quiz.
     * @author Tristan Slodowski
     */
    public List<Integer> getAccomplishedList() {
        return this.users_accomplished;
    }

    /**
     * Method to get the list of user ids that have accomplished the quiz as a Integer array.
     * @return Integer array of the user ids that have accomplished the quiz.
     * @author Tristan Slodowski
     */
    public int[] getAccomplishedIds() {
        int[] out = new int[this.users_accomplished.size()];
        for(int i = 0; i < this.users_accomplished.size(); i++) {
            out[i] = this.users_accomplished.get(i);
        }

        return out;
    }

    /**
     * Method to get the ID of a QuizCompletion tracker.
     * @return Integer id of the QuizCompletion tracker
     * @author Tristan Slodowski
     */
    public int getID() {
        return this.id;
    }
}
