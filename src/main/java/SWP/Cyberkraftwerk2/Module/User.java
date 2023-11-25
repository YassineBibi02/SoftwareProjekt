package SWP.Cyberkraftwerk2.Module;

import jakarta.persistence.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;

@Entity
@Table(
        name = "UserList"
)
public class User {

        @Column(
            nullable = false
        )
        public String firstname;

        @Column(
            nullable = false
        )
        public String lastname;

        @Column(
            nullable = false
        )
        public String EMail;

        // Add a default constructor for the entity
        public User() {
        }

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    public int ID;

    public int[] MailsReceived;

    public int MailLevel;


    public User(String firstname, String lastname, String email, int[] mailsreceived, int maillevel) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.EMail = email;

        this.MailsReceived = mailsreceived;
        this.MailLevel = maillevel;
    }

    public int count_users(){
        return 0;
    }

    /*loads the User with "ID" from Database */
    public User load_user(int ID){
        /*load from database*/
        String firstname = "test";
        String lastname = "test";
        String email = "test";
        String mailsreceived_as_string = "test";
        int maillevel = 0;
        /*format received mails*/
        int[] mailsreceived = new int[mailsreceived_as_string.length()];
        for(int i = 0; i < mailsreceived_as_string.length(); i++){
            mailsreceived[i] = Character.getNumericValue(mailsreceived_as_string.charAt(i));
        }
        User loaduser = new User(firstname, lastname, email, mailsreceived, maillevel);
        return loaduser;
    }
    
    /*loads all Users from Database*/
    public User[] load_all(){
        User[] Users = new User[this.count_users()];
        for(int i = 1; i <= this.count_users(); i++){
            Users[i - 1] = this.load_user(i);
        }
        return Users;
    }

    /*add new User to database, id set automatically, raise UserCount for all Users*/
    public void add_user(String firstname, String lastname, String email){
        int newID = this.count_users() + 1;
        String mailsreceived = "0";
        int newmaillevel = 1;

        /*save user to database*/

    }

    public static void mail_received(int ID, int receivedmail, int newmaillevel){
        /*change User in database*/

    }

    public static void change_user(int ID, String firstname, String lastname, String email){
        /*change User "ID" in database*/

    }

    public String toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(this);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
