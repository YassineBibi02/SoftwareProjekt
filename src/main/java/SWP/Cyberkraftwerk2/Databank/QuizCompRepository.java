package SWP.Cyberkraftwerk2.Databank;

import SWP.Cyberkraftwerk2.Module.QuizCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface to interact with the QuizCompletion databank.
 * @param id Integer identification number equal to the lesson id the QuizCompletion object will be keeping track of
 * @return QuizCompletion object of the tracker responsible for the lesson quiz
 * @version 19.12.2023
 * @author Tristan Slodowski
 */
@Repository
public interface QuizCompRepository extends JpaRepository<QuizCompletion, Integer> {

    QuizCompletion findByID(int id);
    
}
