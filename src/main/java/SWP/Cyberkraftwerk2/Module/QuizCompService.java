package SWP.Cyberkraftwerk2.Module;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import SWP.Cyberkraftwerk2.Databank.QuizCompRepository;

/**
 * Service class providing multiple methods to interacts with the QuizCompletion repository.
 * @version 19.12.2013
 * @author Tristan Slodowski
 */
@Service
public class QuizCompService {
    // QuizCompletion reposiory reference that will be used to interact with the databank
    private QuizCompRepository qc_repo;

    /**
     * Default constructor of the QuizCompletionService.
     * <p> A reference to the QuizCompletion repository is required.
     * @param quiz_completion_repo QuizCompRepository reference of the valid QuizCompletion databank
     * @author Tristan Slodowski
     */
    @Autowired
    public QuizCompService(QuizCompRepository quiz_completion_repo) {
        this.qc_repo = quiz_completion_repo;
    }

    /**
     * Method to add a new QuizCompletion tracker to the databank.
     * The id that needs to be provided must be the same as the lesson id of the quiz this tracker will be keeping track of.
     * <p> If a tracker with this id already exists, nothing will happen.
     * @param id Integer id of the quiz/lesson the new tracker is supposed to track
     * @author Tristan Slodowski
     */
    public void addQuizCompTracker(int id) {
        QuizCompletion qc = new QuizCompletion(id);
        if(this.qc_repo.findByID(id) == null) {
            this.qc_repo.save(qc);
        }
    }

    /**
     * Method to remove a QuizCompletion tracker from the databank.
     * <p> If the targeted QuizCompletion tracker does not exist in the databank, nothing will happen.
     * @param id Integer id of the tracker that is supposed to be removed
     * @author Tristan Slodowski
     */
    public void removeQuizCompTracker(int id) {
        QuizCompletion targeted_qc = qc_repo.findByID(id);
        if(this.qc_repo.findByID(id) != null) {
            this.qc_repo.delete(targeted_qc);
        }
    }

    /**
     * Method to add a user to the list of attempted users of a specific QuizCompletion tracker.
     * <p> If the targeted QuizCompletion tracker doesn't exist, no change to the database will occur, but an error message will be sent.
     * @param id Integer id of the targeted QuizCompletion tracker
     * @param user User object that will be added to the trackers list
     * @author Tristan Slodowski
     */
    public void addAttemptedUser(int id, User user) {
        QuizCompletion targeted_qc = this.qc_repo.findByID(id);
        if(targeted_qc == null) {
            System.err.println("[QuizCompService - addAttemptedUser] Can't add User to tracker because tracker couldn't be found!");
            return;
        }
        targeted_qc.addAttemptedUser(user);
        this.qc_repo.save(targeted_qc);
    }

    /**
     * Method to remove a user from the list of attempted users of a specific QuizCompletion tracker.
     * <p> If the targeted QuizCompletion tracker doesn't exist, no change to the database will occur, but an error message will be sent.
     * <p> Returns a boolean whether the deletion was successful.
     * @param id Integer id of the targeted QuizCompleton tracker
     * @param user User object to be removed from the attempted users list
     * @return boolean whether the deletion was successful
     * @author Tristan Slodowski
     */
    public boolean removeAttemptedUser(int id, User user) {
        QuizCompletion targeted_qc = this.qc_repo.findByID(id);
        if(targeted_qc == null) {
            System.err.println("[QuizCompService - removeAttemptedUser] Can't find QuizCompletion tracker to be deleted!");
            return false;
        }
        if(targeted_qc.removeAttemptedUser(user)) {
            this.qc_repo.save(targeted_qc);
            return true;
        }

        return false;
    }

    /**
     * Method to get the list of user ids that have attempted the quiz of a specific QuizCompletion tracker as a Generics List.
     * Will return null if the targeted QuizCompletion tracker doesn't exist in the databank.
     * @param id Integer id of the targeted QuizCompletion tracker
     * @return generic List<Integer> list of the user ids
     * @author Tristan Slodowski
     */
    public List<Integer> getAttemptedList(int id) {
        QuizCompletion targeted_qc = this.qc_repo.findByID(id);
        if(targeted_qc == null) {
            System.err.println("[QuizCompService - getAttemptedList] Can't find QuizCompletion tracker to read from!");
            return null;
        }    

        return targeted_qc.getAttemptedList();
    }

    /**
     * Method to get the list of user ids that have attempted the quiz of a specific QuizCompletion tracker as an Integer array.
     * Will return null if the targeted QuizCompletion tracker doesn't exist in the databank.
     * @param id Integer id of the targeted QuizCompletion tracker
     * @return Integer array of the user ids
     * @author Tristan Slodowski
     */
    public int[] getAttemptedUsers(int id) {
        QuizCompletion targeted_qc = this.qc_repo.findByID(id);
        if(targeted_qc == null) {
            System.err.println("[QuizCompService - getAttemptedUsers] Can't find QuizCompletion tracker to read from!");
            return null;
        }

        return targeted_qc.getAttemptedIds();
    }

    /**
     * Method to add a user to the list of accomplished users of a specific QuizCompletion tracker.
     * <p> If the targeted QuizCompletion tracker doesn't exist, no change to the database will occur, but an error message will be sent.
     * @param id Integer id of the targeted QuizCompletion tracker
     * @param user User object that will be added to the trackers list
     * @author Tristan Slodowski
     */
    public void addAccomplishedUser(int id, User user) {
        QuizCompletion targeted_qc = this.qc_repo.findByID(id);
        if(targeted_qc == null) {
            System.err.println("[QuizCompService - addAccomplishedUser] Can't add User to tracker because tracker couldn't be found!");
            return;
        }
        targeted_qc.addAccomplishedUser(user);
        this.qc_repo.save(targeted_qc);
    }

    /**
     * Method to remove a user from the list of accomplished users of a specific QuizCompletion tracker.
     * <p> If the targeted QuizCompletion tracker doesn't exist, no change to the database will occur, but an error message will be sent.
     * <p> Returns a boolean whether the deletion was successful.
     * @param id Integer id of the targeted QuizCompleton tracker
     * @param user User object to be removed from the accomplished users list
     * @return boolean whether the deletion was successful
     * @author Tristan Slodowski
     */
    public boolean removeAccomplishedUser(int id, User user) {
        QuizCompletion targeted_qc = this.qc_repo.findByID(id);
        if(targeted_qc == null) {
            System.err.println("[QuizCompService - removeAccomplishedUser] Can't find QuizCompletion tracker to be deleted!");
            return false;
        }
        if(targeted_qc.removeAccomplishedUser(user)) {
            this.qc_repo.save(targeted_qc);
            return true;
        }

        return false;
    }

    /**
     * Method to get the list of user ids that have accomplished the quiz of a specific QuizCompletion tracker as a Generics List.
     * Will return null if the targeted QuizCompletion tracker doesn't exist in the databank.
     * @param id Integer id of the targeted QuizCompletion tracker
     * @return generic List<Integer> list of the user ids
     * @author Tristan Slodowski
     */
    public List<Integer> getAccomplishedList(int id) {
        QuizCompletion targeted_qc = this.qc_repo.findByID(id);
        if(targeted_qc == null) {
            System.err.println("[QuizCompService - getAccomplishedList] Can't find QuizCompletion tracker to read from!");
            return null;
        }
        
        return targeted_qc.getAttemptedList();
    }

    /**
     * Method to get the list of user ids that have accomplished the quiz of a specific QuizCompletion tracker as an Integer array.
     * Will return null if the targeted QuizCompletion tracker doesn't exist in the databank.
     * @param id Integer id of the targeted QuizCompletion tracker
     * @return Integer array of the user ids
     * @author Tristan Slodowski
     */
    public int[] getAccomplishedUsers(int id) {
        QuizCompletion targeted_qc = this.qc_repo.findByID(id);
        if(targeted_qc == null) {
            System.err.println("[QuizCompService - getAccomplishedUsers] Can't find QuizCompletion tracker to read from!");
            return null;
        }

        return targeted_qc.getAccomplishedIds();
    }
    
}
