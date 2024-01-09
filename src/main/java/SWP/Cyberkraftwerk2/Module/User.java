package SWP.Cyberkraftwerk2.Module;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;

import java.io.IOException;
import SWP.Cyberkraftwerk2.Mail.Mail;

@Entity
@Table(
        name = "UserList"
)
public class User {

    /*First Name*/
    @Column(
        nullable = false
        )
    private String firstname;

    /*Last Name*/
    @Column(
        nullable = false
        )
    private String lastname;

    /*E-Mail Adress*/
    @Column(
        nullable = false
        )
    private String email;
    
    /*ID*/
    @Id
    @GeneratedValue(
        strategy = GenerationType.IDENTITY
        )
    private int id;

    /*Bitmap of received Mails*/
    private int[] mailsreceived;

    /*Mail Level*/
    private int maillevel;


    protected User(){}
        

    public User(String firstname, String lastname, String email, int[] mailsreceived, int maillevel){
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.mailsreceived = mailsreceived;
        this.maillevel = maillevel;
    }


    public User(String firstname, String lastname, String email){
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.maillevel = 1;
        int mailcount = Mail.count_mails();
        this.mailsreceived = new int[mailcount + 1];
        for (int i = 0; i < mailcount + 1; i++) {
            this.mailsreceived[i] = 0;
        }
    }

    //getter functions
    public String get_firstname(){
        return this.firstname;
    }


    public String get_lastname(){
        return this.lastname;
    }


    public String get_email(){
        return this.email;
    }


    public int get_ID(){
        return this.id;
    }


    public int[] get_mailsreceived(){
        return this.mailsreceived;
    }


    public int get_maillevel(){
        return this.maillevel;
    }

    //setter functions
    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }


    public void setLastname(String lastname) {
        this.lastname = lastname;
    }


    public void setEmail(String email) {
        this.email = email;
    }


    public void setId(int id) {
        this.id = id;
    }


    public void setMailsreceived(int[] mailsreceived) {
        this.mailsreceived = mailsreceived;
    }


    public void setMaillevel(int maillevel) {
        this.maillevel = maillevel;
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
