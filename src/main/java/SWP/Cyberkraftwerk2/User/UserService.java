package SWP.Cyberkraftwerk2.User;

import org.springframework.stereotype.Repository;

import SWP.Cyberkraftwerk2.Databank.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;


@Repository
public class UserService {

    private  UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public User getUserByID(int ID){
        return this.userRepository.findByID(ID);
    }
    

    public void mail_received(int ID, int mailID){
        /*sets receivedmails[mailID] to 1*/
        //UNFINISHED
    }


    public void mail_clicked(int ID, int mailID){
        /*sets receivedmails[mailID] to 0*/
        //UNFINISHED
    }


    public void raise_userlevel(int ID){
        /*raise Userlevel by one*/
        //UNFINISHED
    }
    

    public void change_user(int ID, String firstname, String lastname, String email){
        /*change User "ID" in database*/
        //UNFINISHED
    }
}
